"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Check, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Pill,
  Lock
} from "lucide-react";

interface PrescriptionFlipProps {
  onOpenPrescriptionModal: () => void;
}

export default function PrescriptionFlipSection({ onOpenPrescriptionModal }: PrescriptionFlipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visualProgress, setVisualProgress] = useState(0); // 0.0 to 1.0 driving 3D flip & blister
  const [activeTab, setActiveTab] = useState<"slip" | "blister">("slip");
  
  const animFrameRef = useRef<number | null>(null);
  const isInteractingRef = useRef<boolean>(false);
  const visualProgressRef = useRef(0);
  visualProgressRef.current = visualProgress;

  // Touch gesture tracking for mobile swipe transition
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Pre-decode blister texture in memory on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const img = new window.Image();
      img.src = "/blister_pack_macro.jpg";
      if ("decode" in img) {
        img.decode().catch(() => {});
      }
    }
  }, []);

  // High-performance RAF lerp for instantaneous, silky-smooth tab and button switches
  const animateVisualProgressTo = (target: number) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startVal = visualProgressRef.current;
    const startTime = performance.now();
    const duration = 320; // 320ms smooth fluid transition

    isInteractingRef.current = true;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      const val = startVal + (target - startVal) * ease;
      setVisualProgress(val);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
        setTimeout(() => {
          isInteractingRef.current = false;
        }, 100);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    let ticking = false;
    let lastProgress = -1;
    let lastTab: "slip" | "blister" = "slip";

    const updateScroll = () => {
      // Don't fight direct tap/button transitions with intermediate scroll events
      if (isInteractingRef.current) {
        ticking = false;
        return;
      }

      if (!containerRef.current) {
        ticking = false;
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;
      
      if (totalScrollableDistance <= 0) {
        ticking = false;
        return;
      }

      // Calculate progress from 0 (top enters viewport) to 1 (bottom exits)
      const currentProgress = Math.min(Math.max(-rect.top / totalScrollableDistance, 0), 1);
      
      // Update visual presentation smoothly
      if (Math.abs(currentProgress - lastProgress) > 0.001) {
        lastProgress = currentProgress;
        setVisualProgress(currentProgress);
      }

      const newTab = currentProgress < 0.45 ? "slip" : "blister";
      if (newTab !== lastTab) {
        lastTab = newTab;
        setActiveTab(newTab);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    window.addEventListener("pharmacy-app-ready", handleScroll, { passive: true });
    updateScroll();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("pharmacy-app-ready", handleScroll);
    };
  }, []);

  // Jump to phase when tab or button clicked - instantaneous visual response + synced scroll
  const jumpToPhase = (phase: "slip" | "blister") => {
    setActiveTab(phase);
    // Instantaneous 60fps RAF transition on tap without waiting for scroll events
    animateVisualProgressTo(phase === "slip" ? 0 : 0.85);

    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollDist = phase === "slip" ? 0 : window.innerHeight * 1.1;
    window.scrollTo({
      top: containerTop + scrollDist,
      behavior: "smooth"
    });
  };

  // Touch gestures for mobile card swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect distinct horizontal swipe
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0 && activeTab === "slip") {
        jumpToPhase("blister");
      } else if (deltaX > 0 && activeTab === "blister") {
        jumpToPhase("slip");
      }
    }
  };

  // Derived animation values based on visualProgress (0 to 1)
  // Phase 1 (0 to 0.45): Prescription Paper Flip
  // Phase 2 (0.45 to 1.0): Blister Pack Aperture Expand
  const slipProgress = Math.min(visualProgress / 0.45, 1);
  const blisterProgress = Math.max(Math.min((visualProgress - 0.45) / 0.55, 1), 0);

  // Checkpoints light up based on slipProgress
  const step1Received = slipProgress >= 0.05;
  const step2Checked = slipProgress >= 0.20;
  const step3Ready = slipProgress >= 0.35;

  // Paper curl angle: curls up as slipProgress approaches 1
  const paperCurlAngle = slipProgress * 45; // 0 to 45 deg
  const paperCurlTranslateY = slipProgress * -30; // 0 to -30px

  // Blister portal expansion: clip-path radius from 18% to 100%
  const apertureRadius = 18 + blisterProgress * 82; // 18% to 100%
  const blisterScale = 1.0 + blisterProgress * 0.12; // 1.0 to 1.12 subtle cinematic zoom
  const slipOpacity = Math.max(1 - blisterProgress * 2.5, 0); // Fades out as blister expands
  const blisterOpacity = Math.min(blisterProgress * 2, 1);

  return (
    <div 
      ref={containerRef} 
      id="prescription-flip"
      className="relative w-full h-[280vh] bg-[#f4f8f5] text-slate-900 select-none selection:bg-emerald-500 selection:text-white"
    >
      {/* Sticky Fullscreen Presentation Window */}
      <div className="sticky top-0 w-full min-h-screen lg:h-screen overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-16 py-3 sm:py-6 lg:py-8 z-20">
        
        {/* Background Ambient Lighting (Soft Mint & Pure White Vignette) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f4f8f5] to-[#ecf4ef] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[350px] bg-emerald-400/[0.08] blur-[150px] rounded-full pointer-events-none -z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-teal-400/[0.06] blur-[140px] rounded-full pointer-events-none -z-0" />

        {/* Top Minimalist Header & Phase Switcher */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-30 pt-2 sm:pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-800">
              Prescription Verification
            </span>
          </div>

          {/* Interactive Phase Toggle Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <button
              onClick={() => jumpToPhase("slip")}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "slip"
                  ? "bg-emerald-700 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Rx Prescription
            </button>
            <button
              onClick={() => jumpToPhase("blister")}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "blister"
                  ? "bg-emerald-700 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sealed Blister
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CENTERPIECE TRANSITION STAGE                                         */}
        {/* ===================================================================== */}
        <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center relative my-auto py-2 sm:py-4">
          
          {/* ------------------------------------------------------------------- */}
          {/* LEFT COLUMN: SCENE TEXT & CLINICAL TIMELINE (5 COLS)                */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-3 sm:space-y-5 z-20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-semibold tracking-wide mb-2 sm:mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{activeTab === "slip" ? "Clinical Intake" : "Precision Packaging"}</span>
              </div>

              {/* Dynamic Headline (Exact match to reference: The Flip, Prescription Ready.) */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-[1.08]">
                {activeTab === "slip" ? (
                  <>
                    The Flip, <br />
                    <span className="font-serif italic font-normal text-[#0c4a34]">
                      Prescription Ready.
                    </span>
                  </>
                ) : (
                  <>
                    Tactile Foil, <br />
                    <span className="font-serif italic font-normal text-[#0c4a34]">
                      Purity Inspected.
                    </span>
                  </>
                )}
              </h2>

              {/* Refined Professional Copy */}
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mt-2 sm:mt-3 leading-relaxed">
                {activeTab === "slip" 
                  ? "From prescription upload to pharmacist review and peace of mind. Every capsule is audited against contraindications before cold-chain courier dispatch."
                  : "Cold-formed aluminum barrier cavities engineered to preserve compound stability and shield active ingredients against atmospheric degradation under ISO Class 7 cleanroom standards."}
              </p>
            </div>

            {/* Sleek Minimalist Transition Status */}
            <div className="flex items-center gap-3 py-1 sm:py-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${Math.max(visualProgress * 100, 15)}%` }}
                />
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-semibold text-emerald-800 shrink-0">
                {activeTab === "slip" ? "Step 01 / Rx Verification" : "Step 02 / Blister Packaging"}
              </span>
            </div>

            {/* Clean Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={onOpenPrescriptionModal}
                className="py-2.5 px-5 sm:py-3 sm:px-6 rounded-full bg-[#86efac] hover:bg-[#6ee7b7] text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-950/15 transition-transform cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>Upload Prescription</span>
              </button>

              <button
                onClick={() => jumpToPhase(activeTab === "slip" ? "blister" : "slip")}
                className="py-2.5 px-4 sm:py-3 sm:px-5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-colors cursor-pointer active:scale-95"
              >
                <span>{activeTab === "slip" ? "Inspect Blister Pack" : "View Prescription Slip"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: 3D PRESCRIPTION SLIP & BLISTER PORTAL (7 COLS)        */}
          {/* ------------------------------------------------------------------- */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-7 h-[280px] sm:h-[380px] lg:h-[520px] relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            title="Swipe horizontally or tap tabs to switch steps"
          >
            
            {/* ================================================================= */}
            {/* STAGE A: THE 3D CURVED PRESCRIPTION PAPER SLIP (Matching Video)  */}
            {/* ================================================================= */}
            <div 
              className="absolute w-[260px] sm:w-[320px] md:w-[360px] bg-white text-slate-900 rounded-3xl p-4 sm:p-6 shadow-[0_20px_45px_-10px_rgba(6,30,22,0.15),0_8px_20px_rgba(0,0,0,0.06)] border border-slate-200/90"
              style={{
                opacity: slipOpacity,
                transform: `perspective(1000px) rotateY(${slipProgress * -15}deg) rotateX(${paperCurlAngle * 0.4}deg) translate3d(0, ${paperCurlTranslateY}px, 0) scale(${1 - blisterProgress * 0.2})`,
                willChange: "transform, opacity",
                pointerEvents: slipOpacity > 0.3 ? "auto" : "none"
              }}
            >
              {/* Slip Top Header with Rx Symbol and Doctor License Box */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-4xl font-serif font-black text-emerald-700 leading-none">
                    ℞
                  </span>
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
                      Digital Prescription Slip
                    </h4>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono block">
                      Dispensary ID: #SWISS-88219
                    </span>
                  </div>
                </div>

                {/* Micro Doctor Signature Outline Box */}
                <div className="w-14 sm:w-16 h-7 sm:h-8 rounded border border-dashed border-slate-300 p-1 flex items-center justify-center bg-slate-50">
                  <span className="font-serif italic text-[9px] sm:text-[10px] text-slate-400">
                    Dr. Müller
                  </span>
                </div>
              </div>

              {/* Vertical Verification Step Timeline (Matching Video Checkpoints) */}
              <div className="space-y-2.5 sm:space-y-3.5 py-1 relative">
                {/* Connecting Vertical Track Line */}
                <div className="absolute left-3.5 sm:left-4 top-3 bottom-3 w-0.5 bg-slate-200" />
                <div 
                  className="absolute left-3.5 sm:left-4 top-3 w-0.5 bg-emerald-500" 
                  style={{
                    height: step3Ready ? "100%" : step2Checked ? "50%" : step1Received ? "15%" : "0%"
                  }}
                />

                {/* Step 1: Received */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    step1Received ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-400"
                  }`}>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Received</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Prescription PDF Verified</span>
                    </div>
                    {step1Received && (
                      <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        12:40 PM
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 2: Checked */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    step2Checked ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-400"
                  }`}>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Checked</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Clinical Interaction Audit</span>
                    </div>
                    {step2Checked && (
                      <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        12:48 PM
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 3: Ready */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    step3Ready ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-400"
                  }`}>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Ready</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Dispatched to Cold-Chain</span>
                    </div>
                    {step3Ready && (
                      <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        12:55 PM
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Pill Toggle Button Matching Reference */}
              <div className="mt-3 sm:mt-4 pt-2.5 border-t border-slate-200">
                <div className="w-full py-2 rounded-full bg-slate-100 p-1 flex items-center justify-between">
                  <div className={`w-1/2 py-1 rounded-full text-center text-[11px] sm:text-xs font-bold transition-colors ${
                    step3Ready 
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
                      : "bg-slate-300 text-slate-600"
                  }`}>
                    {step3Ready ? "Ready ✓" : "Processing"}
                  </div>
                  <div className="w-1/2 text-center text-[9px] sm:text-[10px] text-slate-400 font-mono font-medium">
                    Auto-Courier
                  </div>
                </div>
              </div>

              {/* 3D Curled Bottom Edge Lip (Page Turning Effect) */}
              <div 
                className="mt-3 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 h-8 sm:h-9 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-350 rounded-b-3xl shadow-inner flex items-center justify-between px-4 sm:px-6 border-t border-slate-300 origin-bottom"
                style={{
                  transform: `rotateX(${paperCurlAngle}deg) translate3d(0, ${paperCurlAngle * 0.1}px, 0)`,
                  willChange: "transform"
                }}
              >
                <span className="text-[8px] font-mono text-slate-500 tracking-wider uppercase font-semibold">
                  Official Clinical Document
                </span>
                <span className="text-[8px] font-mono text-emerald-700 tracking-widest uppercase font-bold">
                  ● Security Watermark Verified
                </span>
              </div>
            </div>

            {/* ================================================================= */}
            {/* STAGE B: EXPANDING APERTURE BLISTER PACK REVEAL (Matching Video)  */}
            {/* ================================================================= */}
            <div 
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(6,30,22,0.18),0_8px_25px_rgba(0,0,0,0.08)] border border-slate-200/90"
              style={{
                opacity: Math.max(blisterOpacity, 0.001),
                clipPath: `circle(${apertureRadius}% at 50% 50%)`,
                transform: "translate3d(0, 0, 0)",
                willChange: "clip-path, opacity",
                pointerEvents: blisterOpacity > 0.3 ? "auto" : "none"
              }}
            >
              {/* Macro Blister Pack Photograph */}
              <div 
                className="relative w-full h-full"
                style={{ 
                  transform: `scale(${blisterScale})`,
                  willChange: "transform"
                }}
              >
                <Image
                  src="/blister_pack_macro.jpg"
                  alt="High Definition Macro View of Silver Foil Blister Pack with Capsules"
                  fill
                  priority
                  className="object-cover object-center"
                />

                {/* Subtle emerald ambient vignette */}
                <div className="absolute inset-0 bg-radial from-transparent via-emerald-950/10 to-black/40 pointer-events-none" />

                {/* Animated Circular Lens Rim Glow */}
                <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-3xl pointer-events-none shadow-[inset_0_0_40px_rgba(16,185,129,0.2)]" />
              </div>

              {/* Floating Macro Inspection Quality Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-col gap-1.5 sm:gap-2">
                <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-slate-900 font-mono text-[10px] sm:text-xs flex items-center gap-2 backdrop-blur-md shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-[10px] sm:text-[11px]">COLD-FORMED ALUMINUM FOIL</span>
                </div>
                <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-slate-800 font-mono text-[10px] sm:text-xs flex items-center gap-2 backdrop-blur-md shadow-md">
                  <Pill className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="font-semibold text-[10px] sm:text-[11px]">DUAL-TONE 500mg CAPSULES</span>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20">
                <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-slate-900 font-mono text-[10px] sm:text-xs flex items-center gap-2 backdrop-blur-md shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-[10px] sm:text-[11px] text-emerald-800">PURITY: 99.8% VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Ticker Matching Reference Video (`— —`) */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-3 z-30 pb-2">
          <button
            onClick={() => jumpToPhase("slip")}
            className={`h-1.5 rounded-full transition-all cursor-pointer p-2 -my-2 flex items-center`}
            aria-label="View Prescription Slip"
          >
            <span className={`block h-1.5 rounded-full transition-all ${
              activeTab === "slip" ? "w-10 bg-emerald-700 shadow-xs" : "w-5 bg-slate-300 hover:bg-slate-400"
            }`} />
          </button>
          <button
            onClick={() => jumpToPhase("blister")}
            className={`h-1.5 rounded-full transition-all cursor-pointer p-2 -my-2 flex items-center`}
            aria-label="View Blister Pack"
          >
            <span className={`block h-1.5 rounded-full transition-all ${
              activeTab === "blister" ? "w-10 bg-emerald-700 shadow-xs" : "w-5 bg-slate-300 hover:bg-slate-400"
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
