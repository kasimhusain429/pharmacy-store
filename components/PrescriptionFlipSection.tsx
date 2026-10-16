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
  const [scrollProgress, setScrollProgress] = useState(0); // 0.0 to 1.0
  const [activeTab, setActiveTab] = useState<"slip" | "blister">("slip");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;
      
      if (totalScrollableDistance <= 0) return;

      // Calculate progress from 0 (top enters viewport) to 1 (bottom exits)
      const currentProgress = Math.min(Math.max(-rect.top / totalScrollableDistance, 0), 1);
      setScrollProgress(currentProgress);

      if (currentProgress < 0.45) {
        setActiveTab("slip");
      } else {
        setActiveTab("blister");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Jump to phase when tab clicked
  const jumpToPhase = (phase: "slip" | "blister") => {
    setActiveTab(phase);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollDist = phase === "slip" ? 0 : window.innerHeight * 1.1;
    window.scrollTo({
      top: containerTop + scrollDist,
      behavior: "smooth"
    });
  };

  // Derived animation values based on scrollProgress (0 to 1)
  // Phase 1 (0 to 0.45): Prescription Paper Flip
  // Phase 2 (0.45 to 1.0): Blister Pack Aperture Expand
  const slipProgress = Math.min(scrollProgress / 0.45, 1);
  const blisterProgress = Math.max(Math.min((scrollProgress - 0.45) / 0.55, 1), 0);

  // Checkpoints light up based on slipProgress
  const step1Received = slipProgress >= 0.05;
  const step2Checked = slipProgress >= 0.20;
  const step3Ready = slipProgress >= 0.35;

  // Paper curl angle: curls up as slipProgress approaches 1
  const paperCurlAngle = slipProgress * 45; // 0 to 45 deg
  const paperCurlTranslateY = slipProgress * -30; // 0 to -30px

  // Blister portal expansion: clip-path radius from 18% to 100%
  const apertureRadius = 18 + blisterProgress * 82; // 18% to 100%
  const blisterScale = 1.0 + blisterProgress * 0.15; // 1.0 to 1.15 subtle cinematic zoom
  const slipOpacity = Math.max(1 - blisterProgress * 2.5, 0); // Fades out as blister expands
  const blisterOpacity = Math.min(blisterProgress * 2, 1);

  return (
    <div 
      ref={containerRef} 
      id="prescription-flip"
      className="relative w-full h-[280vh] bg-[#f4f8f5] text-slate-900 select-none selection:bg-emerald-500 selection:text-white transition-colors duration-500"
    >
      {/* Sticky Fullscreen Presentation Window */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-16 py-8 sm:py-12 z-20">
        
        {/* Background Ambient Lighting (Soft Mint & Pure White Vignette) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f4f8f5] to-[#ecf4ef] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[350px] bg-emerald-400/[0.08] blur-[150px] rounded-full pointer-events-none -z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-teal-400/[0.06] blur-[140px] rounded-full pointer-events-none -z-0" />

        {/* Top Minimalist Header & Phase Switcher */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-30 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-800">
              Prescription Verification
            </span>
          </div>

          {/* Interactive Phase Toggle Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <button
              onClick={() => jumpToPhase("slip")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "slip"
                  ? "bg-emerald-700 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Rx Prescription
            </button>
            <button
              onClick={() => jumpToPhase("blister")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
        <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative my-auto">
          
          {/* ------------------------------------------------------------------- */}
          {/* LEFT COLUMN: SCENE TEXT & CLINICAL TIMELINE (5 COLS)                */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 z-20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{activeTab === "slip" ? "Clinical Intake" : "Precision Packaging"}</span>
              </div>

              {/* Dynamic Headline (Exact match to reference: The Flip, Prescription Ready.) */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.06]">
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
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mt-4 leading-relaxed">
                {activeTab === "slip" 
                  ? "From prescription upload to pharmacist review and peace of mind. Every capsule is audited against contraindications before cold-chain courier dispatch."
                  : "Cold-formed aluminum barrier cavities engineered to preserve compound stability and shield active ingredients against atmospheric degradation under ISO Class 7 cleanroom standards."}
              </p>
            </div>

            {/* Sleek Minimalist Transition Status */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(scrollProgress * 100, 15)}%` }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 shrink-0">
                {activeTab === "slip" ? "Step 01 / Rx Verification" : "Step 02 / Blister Packaging"}
              </span>
            </div>

            {/* Clean Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenPrescriptionModal}
                className="py-3 px-6 rounded-full bg-[#86efac] hover:bg-[#6ee7b7] text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-950/15 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>Upload Prescription</span>
              </button>

              <button
                onClick={() => jumpToPhase(activeTab === "slip" ? "blister" : "slip")}
                className="py-3 px-5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <span>{activeTab === "slip" ? "Inspect Blister Pack" : "View Prescription Slip"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: 3D PRESCRIPTION SLIP & BLISTER PORTAL (7 COLS)        */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-7 h-[420px] sm:h-[500px] lg:h-[560px] relative flex items-center justify-center">
            
            {/* ================================================================= */}
            {/* STAGE A: THE 3D CURVED PRESCRIPTION PAPER SLIP (Matching Video)  */}
            {/* ================================================================= */}
            <div 
              className="absolute w-[290px] sm:w-[340px] md:w-[370px] bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_25px_50px_-12px_rgba(6,30,22,0.16),0_10px_25px_rgba(0,0,0,0.06)] border border-slate-200/90 transition-all duration-300"
              style={{
                opacity: slipOpacity,
                transform: `perspective(1000px) rotateY(${slipProgress * -15}deg) rotateX(${paperCurlAngle * 0.4}deg) translateY(${paperCurlTranslateY}px) scale(${1 - blisterProgress * 0.2})`,
                pointerEvents: slipOpacity > 0.3 ? "auto" : "none"
              }}
            >
              {/* Slip Top Header with Rx Symbol and Doctor License Box */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-serif font-black text-emerald-700 leading-none">
                    ℞
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Digital Prescription Slip
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Dispensary ID: #SWISS-88219
                    </span>
                  </div>
                </div>

                {/* Micro Doctor Signature Outline Box */}
                <div className="w-16 h-8 rounded border border-dashed border-slate-300 p-1 flex items-center justify-center bg-slate-50">
                  <span className="font-serif italic text-[10px] text-slate-400">
                    Dr. Müller
                  </span>
                </div>
              </div>

              {/* Vertical Verification Step Timeline (Matching Video Checkpoints) */}
              <div className="space-y-4 py-2 relative">
                {/* Connecting Vertical Track Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
                <div 
                  className="absolute left-4 top-4 w-0.5 bg-emerald-500 transition-all duration-300" 
                  style={{
                    height: step3Ready ? "100%" : step2Checked ? "50%" : step1Received ? "15%" : "0%"
                  }}
                />

                {/* Step 1: Received */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step1Received ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-400"
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Received</span>
                      <span className="text-[10px] text-slate-400 font-mono">Prescription PDF Verified</span>
                    </div>
                    {step1Received && (
                      <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        12:40 PM
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 2: Checked */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step2Checked ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-400"
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Checked</span>
                      <span className="text-[10px] text-slate-400 font-mono">Clinical Interaction Audit</span>
                    </div>
                    {step2Checked && (
                      <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        12:48 PM
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 3: Ready */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step3Ready ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-400"
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Ready</span>
                      <span className="text-[10px] text-slate-400 font-mono">Dispatched to Cold-Chain</span>
                    </div>
                    {step3Ready && (
                      <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        12:55 PM
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Pill Toggle Button Matching Reference */}
              <div className="mt-5 pt-3 border-t border-slate-200">
                <div className="w-full py-2.5 rounded-full bg-slate-100 p-1 flex items-center justify-between">
                  <div className={`w-1/2 py-1 rounded-full text-center text-xs font-bold transition-all ${
                    step3Ready 
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
                      : "bg-slate-300 text-slate-600"
                  }`}>
                    {step3Ready ? "Ready ✓" : "Processing"}
                  </div>
                  <div className="w-1/2 text-center text-[10px] text-slate-400 font-mono font-medium">
                    Auto-Courier
                  </div>
                </div>
              </div>

              {/* 3D Curled Bottom Edge Lip (Page Turning Effect) */}
              <div 
                className="mt-4 -mx-6 -mb-6 h-9 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-350 rounded-b-3xl shadow-inner flex items-center justify-between px-6 border-t border-slate-300 transition-transform duration-300 origin-bottom"
                style={{
                  transform: `rotateX(${paperCurlAngle}deg) translateY(${paperCurlAngle * 0.1}px)`
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
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(6,30,22,0.18),0_10px_30px_rgba(0,0,0,0.08)] border border-slate-200/90 transition-all duration-300"
              style={{
                opacity: blisterOpacity,
                clipPath: `circle(${apertureRadius}% at 50% 50%)`,
                pointerEvents: blisterOpacity > 0.3 ? "auto" : "none"
              }}
            >
              {/* Macro Blister Pack Photograph */}
              <div 
                className="relative w-full h-full transition-transform duration-300"
                style={{ transform: `scale(${blisterScale})` }}
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
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-slate-900 font-mono text-xs flex items-center gap-2 backdrop-blur-md shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-[11px]">COLD-FORMED ALUMINUM FOIL</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-slate-800 font-mono text-xs flex items-center gap-2 backdrop-blur-md shadow-md">
                  <Pill className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="font-semibold text-[11px]">DUAL-TONE 500mg CAPSULES</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 z-20">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-slate-900 font-mono text-xs flex items-center gap-2 backdrop-blur-md shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-[11px] text-emerald-800">PURITY: 99.8% VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Ticker Matching Reference Video (`— —`) */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-3 z-30 pb-2">
          <button
            onClick={() => jumpToPhase("slip")}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "slip" ? "w-10 bg-emerald-700 shadow-xs" : "w-5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label="View Prescription Slip"
          />
          <button
            onClick={() => jumpToPhase("blister")}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "blister" ? "w-10 bg-emerald-700 shadow-xs" : "w-5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label="View Blister Pack"
          />
        </div>
      </div>
    </div>
  );
}
