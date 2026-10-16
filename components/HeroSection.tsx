"use client";

import React, { useState } from "react";
import HeroScene from "./HeroScene";
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Leaf, 
  FileCheck
} from "lucide-react";

interface HeroSectionProps {
  onOpenPrescriptionModal: () => void;
}

export default function HeroSection({ onOpenPrescriptionModal }: HeroSectionProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const handleCapsuleClick = () => {
    setNotification("Formula No. 042 (Bio-Active Regimen) • Selected");
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <section 
      id="hero" 
      className="relative h-screen max-h-screen w-full flex flex-col justify-between pt-16 pb-4 px-4 sm:px-8 lg:px-12 overflow-hidden bg-[#06110f] select-none"
    >
      {/* 1. Cinematic Botanical Hero Background Image (Matching Reference) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      {/* 2. Soft Ambient Gradient Overlays for High-Contrast Readability */}
      {/* Left Column Text Contrast Shade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06110f]/95 via-[#06110f]/65 to-transparent pointer-events-none" />
      {/* Top & Bottom Subtle Vignette Blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06110f]/75 via-transparent to-[#06110f]/85 pointer-events-none" />

      {/* 3. Main Grid: Left Column Copy & CTAs | Right Column Interactive 3D */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center min-h-0 z-10 my-auto">
        
        {/* Left Column: Editorial & Conversion Driver (5.5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center gap-4 text-left py-2">
          
          {/* Top Subtitle Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="uppercase tracking-widest text-[11px]">Accredited Digital Dispensary</span>
          </div>

          {/* Master Headline */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-black tracking-tight text-white leading-[0.96]">
              HEALTH, <br />
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                SORTED.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-normal pt-1 max-w-md leading-relaxed">
              Everyday healthcare essentials, verified by licensed pharmacists and delivered with clinical precision.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Primary Order Now Pill Button */}
            <a
              href="#explore-dispensary"
              className="flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#86efac] hover:bg-[#6ee7b7] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
            >
              <span>Order Now</span>
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 text-white group-hover:scale-105 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* Quick Upload Rx Link */}
            <button
              onClick={onOpenPrescriptionModal}
              className="px-4 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Upload Rx Slip →
            </button>
          </div>

          {/* Clinical Assurance Pills (Replaces dummy carousel dashes with meaningful assurance) */}
          <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-emerald-300/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Prescription Verified</span>
            <span className="text-zinc-600">•</span>
            <span>Temperature-Controlled</span>
            <span className="text-zinc-600">•</span>
            <span>Direct Courier</span>
          </div>

          {/* Notification Toast if Capsule Clicked */}
          {notification && (
            <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{notification}</span>
            </div>
          )}

          {/* Trust Highlights Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 border-t border-white/[0.08] text-xs text-zinc-300 max-w-lg">
            
            {/* Item 1: Fast & Reliable Delivery */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 bg-white/5 text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-left text-[11px] leading-tight">
                <p className="font-semibold text-white">Fast &amp; Reliable</p>
                <p className="text-zinc-400">Direct Delivery</p>
              </div>
            </div>

            <div className="hidden sm:block h-7 w-[1px] bg-white/10" />

            {/* Item 2: 100% Genuine Products */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 bg-white/5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left text-[11px] leading-tight">
                <p className="font-semibold text-white">100% Genuine</p>
                <p className="text-zinc-400">Certified Formulas</p>
              </div>
            </div>

            <div className="hidden sm:block h-7 w-[1px] bg-white/10" />

            {/* Item 3: Clinical Precision */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 bg-white/5 text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="text-left text-[11px] leading-tight">
                <p className="font-semibold text-white">Doctor Verified</p>
                <p className="text-zinc-400">Licensed Care</p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: 3D Amber Bottle & Natural Emerging Capsules over Botanical Background (7 Cols) */}
        <div className="lg:col-span-7 h-full w-full min-h-[380px] flex items-center justify-center relative overflow-hidden">
          <HeroScene onCapsuleClick={handleCapsuleClick} />
        </div>

      </div>

      {/* Subtle bottom indicator */}
      <div className="max-w-7xl mx-auto w-full pt-1 pb-1 flex items-center justify-between text-xs text-zinc-500 border-t border-white/[0.04] z-10">
        <span className="text-[11px] text-zinc-400">
          ● Licensed Online Dispensary • GPhC / NABP Partner
        </span>
        <a 
          href="#explore-dispensary" 
          className="text-[11px] text-zinc-400 hover:text-emerald-300 transition-colors"
        >
          Scroll to explore store ↓
        </a>
      </div>
    </section>
  );
}
