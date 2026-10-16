"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Sun, 
  CloudSun, 
  Sunset, 
  Moon, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Check, 
  Info,
  Clock,
  Layers,
  ShieldCheck,
  Pill
} from "lucide-react";

interface DailyRoutineSectionProps {
  onOpenPrescriptionModal?: () => void;
  activeTime?: string;
  onTimeChange?: (time: string) => void;
}

export interface DaySchedule {
  day: string;
  dayShort: string;
  capsuleColor: string;
  meds: string[];
  dosage: string;
  active: boolean;
}

const WEEK_DAYS: DaySchedule[] = [
  { day: "Monday", dayShort: "Mon", capsuleColor: "bg-emerald-500", meds: ["Bio-Immune 500mg", "Omega-3 Pure"], dosage: "Morning • With Food", active: true },
  { day: "Tuesday", dayShort: "Tue", capsuleColor: "bg-emerald-500", meds: ["Bio-Immune 500mg", "Zinc + C Complex"], dosage: "Morning • With Water", active: false },
  { day: "Wednesday", dayShort: "Wed", capsuleColor: "bg-emerald-500", meds: ["Bio-Immune 500mg", "Vitamin D3 2000IU"], dosage: "Noon • Post-Meal", active: false },
  { day: "Thursday", dayShort: "Thu", capsuleColor: "bg-emerald-500", meds: ["Bio-Immune 500mg", "Magnesium Glycinate"], dosage: "Dusk • Relax Dose", active: false },
  { day: "Friday", dayShort: "Fri", capsuleColor: "bg-emerald-500", meds: ["Bio-Immune 500mg", "B-Complex Active"], dosage: "Morning • Fasting", active: false },
  { day: "Saturday", dayShort: "Sat", capsuleColor: "bg-emerald-500", meds: ["Bio-Immune 500mg", "Probiotic 50B"], dosage: "Night • Pre-Bed", active: false },
  { day: "Sunday", dayShort: "Sun", capsuleColor: "bg-emerald-500", meds: ["Bio-Immune 500mg", "Electrolyte Balance"], dosage: "Dawn • Hydration", active: false },
];

const TIMELINE_STEPS = [
  { id: "dawn", label: "Dawn", time: "07:00 AM", icon: Sun, color: "text-amber-500", bg: "bg-amber-500" },
  { id: "noon", label: "Noon", time: "12:30 PM", icon: CloudSun, color: "text-amber-500", bg: "bg-amber-500" },
  { id: "dusk", label: "Dusk", time: "06:45 PM", icon: Sunset, color: "text-blue-500", bg: "bg-blue-500" },
  { id: "night", label: "Night", time: "10:15 PM", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500" },
];

export default function DailyRoutineSection({ 
  onOpenPrescriptionModal,
  activeTime: externalTime,
  onTimeChange 
}: DailyRoutineSectionProps) {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [internalTime, setInternalTime] = useState<string>("dawn");
  const [scienceModalOpen, setScienceModalOpen] = useState(false);

  const activeTimeline = externalTime || internalTime;

  const handleTimelineClick = (id: string) => {
    setInternalTime(id);
    if (onTimeChange) onTimeChange(id);
  };

  const getSliderPosition = () => {
    switch (activeTimeline) {
      case "dawn": return "8%";
      case "noon": return "36%";
      case "dusk": return "68%";
      case "night": return "94%";
      default: return "8%";
    }
  };

  return (
    <section 
      id="editorial-routine" 
      className="relative w-full min-h-screen py-20 px-4 sm:px-8 lg:px-16 bg-[#eef4f0] text-slate-800 overflow-hidden flex flex-col justify-between selection:bg-emerald-500 selection:text-white"
    >
      {/* 1. FAINT WATERMARK NUMERALS: 7 on Left, 365 on Right (Exact match from Reference Video & Image) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-between z-0">
        <span className="text-[180px] sm:text-[260px] md:text-[340px] lg:text-[420px] font-black tracking-tighter text-emerald-950/[0.045] leading-none -translate-x-12 sm:-translate-x-16">
          7
        </span>
        <span className="text-[180px] sm:text-[260px] md:text-[340px] lg:text-[420px] font-black tracking-tighter text-emerald-950/[0.045] leading-none translate-x-12 sm:translate-x-16">
          365
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between flex-1">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-800 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Chronobiological Dispensing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 mt-1">
              The Daily Routine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
              Precision unit-dose scheduling. Select any day or circadian window to preview your personalized medication schedule.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 shadow-2xs">
              7-Day Calibrated Trays
            </span>
          </div>
        </div>

        {/* Center Stage: Translucent Mint-Green 7-Day Pill Organizer + Information Cards */}
        <div className="relative my-auto py-4 flex flex-col items-center justify-center">
          
          {/* Main 3D Pill Organizer Presentation Container */}
          <div className="relative w-full max-w-4xl flex flex-col items-center justify-center">
            
            {/* Video Presentation Layer */}
            <div className="relative w-full max-w-3xl aspect-[16/9] flex items-center justify-center group overflow-hidden rounded-3xl">
              
              {/* HTML5 Clean Transparent Video Player */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_35px_rgba(6,30,22,0.12)] transition-transform duration-700 group-hover:scale-[1.02]"
              >
                <source src="/pill_organizer_transparent.webm" type="video/webm" />
                <source src="/pill_organizer_clean.mp4" type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>

              {/* Clickable Interactive Hotspots for the 7 Compartments (Mon-Sun) */}
              <div className="absolute inset-x-8 sm:inset-x-14 bottom-10 sm:bottom-16 top-16 sm:top-24 grid grid-cols-7 gap-1 z-20 pointer-events-auto">
                {WEEK_DAYS.map((day, idx) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(idx)}
                    className={`h-full rounded-xl transition-all flex flex-col justify-end p-2 sm:p-3 relative group/slot cursor-pointer ${
                      selectedDay === idx 
                        ? "bg-emerald-500/15 border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10" 
                        : "hover:bg-emerald-500/10 border border-transparent"
                    }`}
                    title={`Day ${idx + 1}: ${day.day} (Click to inspect)`}
                  >
                    <span className={`text-[10px] sm:text-xs font-bold tracking-tight px-1.5 py-0.5 rounded-md ${
                      selectedDay === idx 
                        ? "bg-emerald-600 text-white shadow-xs" 
                        : "bg-white/80 text-slate-700 group-hover/slot:bg-emerald-100"
                    }`}>
                      {day.dayShort}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Balanced Clinical Cards Row Below Video */}
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 z-20">
              
              {/* Card 1: Selected Day Regimen Info */}
              <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_10px_25px_rgba(0,0,0,0.04)] text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Regimen • {WEEK_DAYS[selectedDay].day}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {WEEK_DAYS[selectedDay].dosage}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {WEEK_DAYS[selectedDay].meds.join(" • ")}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Calibrated for optimal pharmacokinetic absorption and bio-availability.
                  </p>
                </div>
                <button 
                  onClick={() => setScienceModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 mt-3 group cursor-pointer"
                >
                  <span>Explore Chronobiology Science</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Card 2: Packaging Standards Metric */}
              <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_10px_25px_rgba(0,0,0,0.04)] text-left flex items-start gap-3.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5 border border-emerald-100">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    Cold-Chain &amp; ISO-9001 Dispensary Standard
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Hermetically sealed compartments shield light-sensitive phytonutrients and preserve active compound potency for 365 days.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 3. BOTTOM TIMELINE / DOSAGE SLIDER BAR (Exact match from Reference Video & Image) */}
        <div className="w-full max-w-3xl mx-auto pt-4 pb-2 z-20">
          
          {/* Timeline Bar Track */}
          <div className="relative flex items-center justify-between py-6">
            
            {/* Gray Track Line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-300 -translate-y-1/2 z-0" />
            
            {/* Active Golden Progress Line */}
            <div 
              className="absolute top-1/2 left-4 h-0.5 bg-amber-400 -translate-y-1/2 transition-all duration-500 z-0" 
              style={{ width: getSliderPosition() }}
            />

            {/* Interactive Timeline Stop Nodes (Dawn, Noon, Dusk, Night) */}
            {TIMELINE_STEPS.map((step) => {
              const Icon = step.icon;
              const isCurrent = activeTimeline === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleTimelineClick(step.id)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                >
                  {/* Glowing Node Halo */}
                  <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-300 ${
                    isCurrent 
                      ? "bg-amber-100 text-amber-600 shadow-md ring-4 ring-amber-300/40 scale-110" 
                      : "bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm"
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Node Label (Dawn, Noon, Dusk, Night) */}
                  <div className="mt-2 text-center">
                    <span className={`block text-xs sm:text-sm font-semibold transition-colors ${
                      isCurrent ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                    }`}>
                      {step.label}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {step.time}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Dose Micro-Bar */}
          <div className="mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Showing regimen for: <strong className="text-emerald-800 capitalize">{activeTimeline}</strong>
            </span>
            <span>•</span>
            <span>{WEEK_DAYS[selectedDay].day}: {WEEK_DAYS[selectedDay].dosage}</span>
          </div>

        </div>

      </div>

      {/* Science & Formulation Modal */}
      {scienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-left shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setScienceModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Clinical Formulation Standard</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              7-Day Chronobiological Scheduling
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Every compartment is calibrated around circadian metabolic cycles: activating energizers at Dawn, metabolic co-factors at Noon, anti-inflammatory compounds at Dusk, and cellular restorative elements at Night.
            </p>
            <div className="space-y-2 mb-6">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs text-slate-700 font-medium">
                  Air-tight UV-deflecting polymer preserves active compound potency for 365 days.
                </span>
              </div>
            </div>
            <button
              onClick={() => setScienceModalOpen(false)}
              className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              Close Science Overview
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
