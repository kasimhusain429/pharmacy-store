"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Package, 
  Heart, 
  UserCheck, 
  Check, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface PreloaderProps {
  onComplete: () => void;
}

const MILESTONES = [
  { id: 0, label: "PREPARING YOUR STORE", threshold: 25, icon: Sparkles },
  { id: 1, label: "LOADING PRODUCTS", threshold: 55, icon: Package },
  { id: 2, label: "SETTING UP HEALTH CARE", threshold: 85, icon: Heart },
  { id: 3, label: "ALMOST THERE", threshold: 100, icon: UserCheck },
];

const CRITICAL_IMAGES_PHASE1 = [
  "/preloader_clean_bg.jpg",
  "/blister_pack_macro.jpg", // Critical centerpiece of Section 2
];

const CRITICAL_IMAGES_PHASE2 = [
  "/dr_sarah_chen.jpg",
  "/consultation_apothecary_bg.jpg",
  "/closing_hero_pedestal.jpg",
  "/pill_organizer_poster.jpg",
  "/doctor_portrait.jpg",
  "/prod_thermometer.jpg",
  "/prod_dropper.jpg",
  "/prod_balm.jpg",
  "/prod_cream.jpg",
  "/prod_bp_monitor.jpg"
];

const preloadAndDecodeImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const img = new window.Image();
    img.src = src;
    if (typeof img.decode === "function") {
      img.decode()
        .then(() => resolve())
        .catch(() => resolve());
    } else {
      (img as HTMLImageElement).onload = () => resolve();
      (img as HTMLImageElement).onerror = () => resolve();
    }
  });
};

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prevent scrolling during preloader
    document.body.style.overflow = "hidden";

    let targetProgress = 15;
    let currentProgress = 0;
    let animId: number;
    let isCancelled = false;

    // Smooth visual interpolation loop
    const updateProgress = () => {
      if (isCancelled) return;

      const delta = targetProgress - currentProgress;
      // Smooth natural lerp towards target
      if (delta > 0.1) {
        currentProgress += Math.min(Math.max(delta * 0.12, 0.4), 2.5);
      } else {
        currentProgress = targetProgress;
      }

      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        setIsReady(true);
        setTimeout(() => {
          if (isCancelled) return;
          setIsExiting(true);
          setTimeout(() => {
            document.body.style.overflow = "";
            onComplete();
          }, 650);
        }, 300);
        return;
      }

      animId = requestAnimationFrame(updateProgress);
    };

    animId = requestAnimationFrame(updateProgress);

    // Orchestrated parallel asset pre-decoding and system initialization
    const initializeAssets = async () => {
      try {
        // Milestone 0 -> 1: Fonts & DOM readiness
        if (typeof document !== "undefined" && "fonts" in document) {
          await document.fonts.ready;
        }
        targetProgress = Math.max(targetProgress, 35);

        // Milestone 1 -> 2: Section 2 Blister Pack Macro + Hero Background
        await Promise.all(CRITICAL_IMAGES_PHASE1.map(preloadAndDecodeImage));
        targetProgress = Math.max(targetProgress, 65);

        // Milestone 2 -> 3: Secondary clinic & catalog assets
        await Promise.all(CRITICAL_IMAGES_PHASE2.map(preloadAndDecodeImage));
        targetProgress = Math.max(targetProgress, 88);

        // Milestone 3 -> 4: Three.js WebGL Pre-warming verification
        let threeReady = false;
        const onHeroReady = () => {
          threeReady = true;
          targetProgress = 100;
        };

        window.addEventListener("pharmacy-hero-ready", onHeroReady, { once: true });

        // Safety fallback timer so slow connections never hang
        setTimeout(() => {
          if (!threeReady) {
            targetProgress = 100;
          }
        }, 1200);

      } catch (err) {
        console.warn("Preloader asset initialization fallback:", err);
        targetProgress = 100;
      }
    };

    initializeAssets();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  // Skip button handler
  const handleSkip = () => {
    setProgress(100);
    setIsReady(true);
    setIsExiting(true);
    setTimeout(() => {
      document.body.style.overflow = "";
      onComplete();
    }, 350);
  };

  // Determine current active milestone index
  const activeMilestoneIndex = 
    progress < 25 ? 0 :
    progress < 55 ? 1 :
    progress < 85 ? 2 : 3;

  // Dynamic status text
  const getStatusText = () => {
    if (progress >= 100) return "DISPENSARY SYSTEM READY. WELCOME.";
    if (progress >= 85) return "FINALIZING SECURE TELEHEALTH CLINIC...";
    if (progress >= 55) return "CALIBRATING 7-DAY DOSAGE SCHEDULES...";
    if (progress >= 25) return "LOADING ACCREDITED PHARMACEUTICALS...";
    return "LOADING YOUR HEALTHIER EXPERIENCE";
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-[#06110f] select-none transition-all duration-700 ease-out ${
        isExiting 
          ? "opacity-0 scale-[1.04] filter blur-sm pointer-events-none" 
          : "opacity-100 scale-100"
      }`}
    >
      {/* 1. PHOTOREALISTIC CENTERPIECE BACKDROP (Floating Capsule & Pedestal) */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/preloader_clean_bg.jpg"
          alt="HealthPlus Pharmacy Store Preloader"
          fill
          priority
          className="object-cover object-center scale-100"
        />

        {/* Ambient mint & golden light vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-emerald-950/20 pointer-events-none" />
      </div>

      {/* 2. FLOATING BOTANICAL LIGHT PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-emerald-400/60 blur-[1px] animate-mote-1" />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-teal-300/50 blur-[1px] animate-mote-2" />
        <div className="absolute bottom-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-300/70 blur-[0.5px] animate-mote-3" />
        <div className="absolute bottom-2/5 left-1/3 w-2.5 h-2.5 rounded-full bg-emerald-300/50 blur-[1px] animate-mote-1" />
      </div>

      {/* 3. TOP BRANDING & QUICK SKIP CONTROLS */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        
        {/* Brand Emblem Matching Reference Image */}
        <div className="flex items-center gap-3">
          {/* Medical Cross with Leaf Symbol */}
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-700/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 2a4 4 0 0 0-4 4v2H6a4 4 0 0 0-4 4 4 4 0 0 0 4 4h2v2a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-2h2a4 4 0 0 0 4-4 4 4 0 0 0-4-4h-2V6a4 4 0 0 0-4-4z" />
            </svg>
          </div>
          <div>
            <span className="block text-base sm:text-lg font-serif font-black tracking-tight text-slate-900 leading-tight">
              HealthPlus <span className="font-normal font-sans text-xs sm:text-sm text-emerald-800 tracking-wide uppercase">Dispensary</span>
            </span>
            <span className="block text-[10px] text-slate-600 font-medium tracking-wider">
              Care Today • Healthier Tomorrow
            </span>
          </div>
        </div>

        {/* Skip to Store Pill Button */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 hover:bg-white text-slate-800 text-xs font-semibold backdrop-blur-md border border-slate-200/90 shadow-sm transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Skip Introduction and Enter Store Immediately"
        >
          <span>Skip to Store</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 4. CENTERPIECE PEDESTAL: PROGRESS COUNTER & CAPSULE PROGRESS TUBE */}
      <div className="relative z-20 my-auto flex flex-col items-center justify-center px-4 text-center">
        
        {/* Large Crisp Glowing Percentage Counter */}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-slate-900 tracking-tight drop-shadow-[0_4px_12px_rgba(255,255,255,0.8)]">
            {Math.round(progress)}
          </span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-700">
            %
          </span>
        </div>

        {/* Sleek Illuminated Capsule Progress Track (Matching Reference Image) */}
        <div className="w-64 sm:w-80 md:w-96 h-3.5 sm:h-4 rounded-full bg-white/70 backdrop-blur-md border border-slate-300/80 p-0.5 shadow-[0_4px_25px_rgba(16,185,129,0.35)] relative overflow-hidden mt-2 sm:mt-3">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-400 to-[#86efac] relative transition-[width] duration-150 ease-out flex items-center justify-end"
            style={{ width: `${Math.max(progress, 4)}%` }}
          >
            {/* Shimmer light reflection */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-progress-shimmer" />
            
            {/* Leading neon point */}
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] shrink-0 mr-0.5" />
          </div>
        </div>

        {/* Uppercase Dynamic Subtext */}
        <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-slate-700 uppercase mt-3 text-center drop-shadow-xs max-w-md">
          {getStatusText()}
        </p>

      </div>

      {/* 5. BOTTOM 4 CLINICAL MILESTONES (Exact Match to Reference Image) */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 items-start">
          {MILESTONES.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = progress >= step.threshold;
            const isActive = activeMilestoneIndex === idx;

            return (
              <div 
                key={step.id} 
                className={`flex flex-col items-center text-center transition-all duration-300 ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              >
                {/* Circular Milestone Icon Badge */}
                <div className={`relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-300 mb-2 ${
                  isCompleted
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300"
                    : isActive
                    ? "bg-white text-emerald-700 shadow-md ring-3 ring-emerald-500/40"
                    : "bg-white/70 text-slate-400 border border-slate-200/80"
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}

                  {/* Pulsing indicator halo when active */}
                  {isActive && !isCompleted && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>

                {/* Milestone Label */}
                <span className={`text-[9px] sm:text-[11px] font-bold tracking-tight uppercase leading-tight ${
                  isActive || isCompleted
                    ? "text-slate-900"
                    : "text-slate-500"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Reassurance Micro-Footer */}
        <div className="mt-4 pt-3 border-t border-slate-300/40 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>ISO-9001 Certified Dispensary • Encrypted Health Protocol</span>
        </div>
      </div>

    </div>
  );
}
