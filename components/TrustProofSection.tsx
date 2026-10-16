"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Star, 
  Clock, 
  MapPin, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Sparkles,
  Truck,
  Bike
} from "lucide-react";

interface TrustProofSectionProps {
  onOpenPrescriptionModal?: () => void;
}

export default function TrustProofSection({ onOpenPrescriptionModal }: TrustProofSectionProps) {
  const [routeProgress, setRouteProgress] = useState(65); // 0 to 100 percentage
  const [activeStage, setActiveStage] = useState<number>(1); // 0: Dispatched, 1: En Route, 2: Delivered

  // Continuous subtle delivery scooter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRouteProgress((prev) => {
        const next = prev + 0.35;
        if (next > 96) return 15;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="trust-and-proof" 
      className="relative w-full py-20 px-4 sm:px-8 lg:px-16 bg-[#f4f8f6] text-slate-800 overflow-hidden flex flex-col justify-between selection:bg-emerald-500 selection:text-white"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* 1. TOP CARD: TRUST AND PROOF & 30-MIN DELIVERY (Exact match to Reference Video Scene 6) */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/80 shadow-[0_20px_45px_rgba(0,0,0,0.06)] mb-12">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Column: Customer Testimonial & Rating */}
            <div className="flex-1 text-left">
              <span className="text-xs font-semibold tracking-wider text-emerald-700/80 uppercase">
                Trust and Proof
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                &ldquo;They explained everything and it arrived before dinner.&rdquo;
              </h3>
              
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700">5.0 Star Verified Review</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">Hannah M. (Zurich)</span>
              </div>
            </div>

            {/* Right Column: 30 Min Express Delivery Pill & Home Icon (Exact match to Video) */}
            <div className="flex items-center gap-4 shrink-0">
              {/* 30 Min Green Badge */}
              <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
                <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                  30
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase mt-1">
                  min
                </span>
              </div>

              {/* Delivery Destination Home Tile */}
              <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-emerald-100/70 border border-emerald-200 text-emerald-800">
                <Home className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-700" />
                <span className="text-[10px] font-bold tracking-wide uppercase mt-1">
                  To Door
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Animated Route Tracker */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="relative w-full py-4">
              
              {/* Route Track Base */}
              <div className="absolute top-1/2 left-6 right-6 h-1.5 bg-slate-200 rounded-full -translate-y-1/2 z-0" />
              
              {/* Glowing Active Route Line */}
              <div 
                className="absolute top-1/2 left-6 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full -translate-y-1/2 z-0 transition-all duration-300 shadow-sm"
                style={{ width: `${routeProgress}%` }}
              />

              {/* Courier Scooter Moving Avatar */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-100 ease-linear pointer-events-none"
                style={{ left: `calc(1.5rem + ${routeProgress}% * 0.92)` }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-emerald-500 shadow-lg text-emerald-600">
                  <Bike className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              {/* Milestone Stop Nodes */}
              <div className="relative z-10 flex items-center justify-between">
                
                {/* Node 1: Dispatched */}
                <div className="flex flex-col items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 border-4 border-white shadow-md flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-2">Dispatched 5:12pm</span>
                  <span className="text-[10px] text-slate-400">Sterile Cold-Pack</span>
                </div>

                {/* Node 2: Scooter En Route */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 border-4 border-white shadow-md flex items-center justify-center text-white">
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-2">Scooter En Route</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Live GPS Telemetry</span>
                </div>

                {/* Node 3: Delivered to Door */}
                <div className="flex flex-col items-end">
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-4 border-white shadow-md flex items-center justify-center text-slate-500">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 mt-2">Delivered to Door</span>
                  <span className="text-[10px] text-slate-400">Estimated 5:42pm</span>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* 2. BOTTOM DARK FOREST GREEN BANNER & CLOSING PEDESTAL (Exact match to Reference Video Scene 6) */}
        <div className="rounded-3xl bg-[#06120f] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-emerald-900/40">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Banner Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MapPin className="w-3.5 h-3.5 animate-bounce" />
                  <span>Scene 6: Trust and Proof</span>
                </span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
                Care That Comes To You.
              </h2>
            </div>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-video-prompts", { detail: { scene: "closing" } }));
                }
              }}
              className="self-start sm:self-auto px-4 py-2 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-2"
              title="Green screen prompt for closing animation"
            >
              <span>🎥 Closing Shot Prompt</span>
            </button>
          </div>

          {/* Dynamic Animated Pulse Waveform (ECG Heartbeat line traversing horizontally!) */}
          <div className="relative w-full h-24 my-4 flex items-center justify-center overflow-hidden z-10">
            {/* SVG Glowing ECG Waveform Line */}
            <svg className="w-full h-full stroke-emerald-400 fill-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path 
                d="M0,50 L200,50 L220,50 L230,20 L240,85 L255,10 L270,75 L280,50 L450,50 L470,50 L480,20 L490,85 L505,10 L520,75 L530,50 L700,50 L720,50 L730,20 L740,85 L755,10 L770,75 L780,50 L1000,50" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-80"
              />
              {/* Highlight neon glow path */}
              <path 
                d="M0,50 L200,50 L220,50 L230,20 L240,85 L255,10 L270,75 L280,50 L450,50 L470,50 L480,20 L490,85 L505,10 L520,75 L530,50 L700,50 L720,50 L730,20 L740,85 L755,10 L770,75 L780,50 L1000,50" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-30 blur-xs"
              />
            </svg>
          </div>

          {/* Closing Hero Pedestal Display (Exact match to final shot in reference video) */}
          <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden aspect-[16/9] shadow-2xl border border-emerald-900/60 z-10 group">
            <Image
              src="/closing_hero_pedestal.jpg"
              alt="Pharmacy Store Amber Bottle on Marble Pedestal with Green ECG Lifeline"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay & Tagline */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06120f] via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                Pharmacy Store
              </span>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                Care that comes to you.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="#hero"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#86efac] hover:bg-[#6ee7b7] text-slate-950 transition-all shadow-md shadow-emerald-950/40"
                >
                  Order Now
                </a>
                <button
                  onClick={onOpenPrescriptionModal}
                  className="px-4 py-2 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/10 hover:bg-white/15 transition-all"
                >
                  Upload Prescription
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
