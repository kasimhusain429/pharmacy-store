"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Thermometer, 
  Truck, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  X, 
  Activity, 
  FileCheck, 
  Lock,
  ChevronRight,
  ExternalLink,
  Navigation
} from "lucide-react";

interface WhyChooseUsSectionProps {
  onOpenPrescriptionModal: () => void;
}

interface TrustStage {
  id: number;
  tag: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  badge: string;
  telemetry: {
    label: string;
    value: string;
    status: string;
  };
  details: {
    headline: string;
    points: string[];
    certificate: string;
    verificationQuote: string;
  };
}

const TRUST_STAGES: TrustStage[] = [
  {
    id: 1,
    tag: "Stage 01 • Clinical Review",
    title: "Licensed Pharmacist Double-Check",
    shortDesc: "Every prescription is reviewed by an accredited PharmD for contraindications and precise dosage before approval.",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    badge: "100% Doctor Verified",
    telemetry: {
      label: "Review Window",
      value: "<12 Mins",
      status: "Active Duty"
    },
    details: {
      headline: "Multi-Point Clinical Prescription Safeguard",
      points: [
        "Patient medical history cross-referenced against 12,000+ known drug interactions.",
        "Direct digital verification with issuing physician's medical registry license.",
        "Strict regulatory compliance: no restricted medicine dispensed without valid doctor Rx.",
        "Personalized dosage schedule card included in every dispatch pouch."
      ],
      certificate: "GPhC / NABP Accredited Dispensary ID: #RX-88219-UK/US",
      verificationQuote: "We treat every prescription as if it were for our own family. Every dose is reviewed, double-checked, and signed off before sterile packaging."
    }
  },
  {
    id: 2,
    tag: "Stage 02 • Climate Control",
    title: "Cold-Chain Vault (2°C - 8°C)",
    shortDesc: "Biologics, serums, and heat-sensitive medications stored in certified temperature-locked vaults with 24/7 digital telemetry.",
    icon: <Thermometer className="w-5 h-5 text-teal-300" />,
    badge: "2°C - 8°C Certified",
    telemetry: {
      label: "Vault Temperature",
      value: "4.2°C",
      status: "Telemetry Locked"
    },
    details: {
      headline: "Unbroken Medical Cold-Chain Storage",
      points: [
        "Continuous digital sensor logging recorded every 60 seconds with cloud redundancy.",
        "Dual-phase cryogenic gel packs maintain temperature for up to 36 hours during transit.",
        "Vacuum-insulated pharmaceutical pouches prevent temperature spikes in any climate.",
        "QR code temperature tracking sticker on package allows instant delivery verification."
      ],
      certificate: "ISO-9001:2026 Certified Medical Cold-Chain Logistics Protocol",
      verificationQuote: "Active peptides and biological medicines lose efficacy if heated. Our unbroken cold chain guarantees full molecular potency upon arrival."
    }
  },
  {
    id: 3,
    tag: "Stage 03 • Rapid Logistics",
    title: "30-Min Rapid GPS Dispatch",
    shortDesc: "Sterile sealed pouches dispatched via our dedicated electric courier fleet with real-time live map tracking.",
    icon: <Truck className="w-5 h-5 text-emerald-300" />,
    badge: "Average 24 Mins",
    telemetry: {
      label: "Courier Speed",
      value: "24 Mins",
      status: "In Transit"
    },
    details: {
      headline: "Rapid Express Citywide Delivery Network",
      points: [
        "Dynamic routing algorithm dispatches from the nearest decentralized dispensary hub.",
        "Tamper-evident, opaque security seals protect patient privacy and medication integrity.",
        "Real-time SMS updates with live GPS courier tracking beacon and ETA countdown.",
        "Emergency medication dispatch prioritized with under-20-minute rapid response."
      ],
      certificate: "Certified Good Distribution Practice (GDP) Fleet Operator",
      verificationQuote: "When you or your loved ones are sick, waiting 3 days for medication is unacceptable. We deliver authentic clinical care within 30 minutes."
    }
  },
  {
    id: 4,
    tag: "Stage 04 • Hand-off & Care",
    title: "Patient Assurance & 4.9★ Proof",
    shortDesc: "Contactless secure hand-off, digital proof of delivery, and on-call pharmacist consultation for continuous support.",
    icon: <Star className="w-5 h-5 text-amber-400" />,
    badge: "4.9 / 5 on Trustpilot",
    telemetry: {
      label: "Patient Trust",
      value: "99.8%",
      status: "25k+ Patients"
    },
    details: {
      headline: "Continuous Healthcare & Follow-up Protocol",
      points: [
        "Contactless OTP/signature hand-off ensures medicines are delivered to the authorized patient.",
        "Automated dosage reminder schedule synced to your calendar or phone via SMS.",
        "Direct 24/7 hotline to licensed pharmacists for any questions on food or dosage timing.",
        "Over 25,000 verified 5-star patient reviews across chronic and acute treatment programs."
      ],
      certificate: "HIPAA & GDPR Compliant Medical Data Vault (256-Bit SSL)",
      verificationQuote: "They explained everything about my prescription and it arrived cold-packed before dinner. Outstanding care and true peace of mind."
    }
  }
];

export default function WhyChooseUsSection({ onOpenPrescriptionModal }: WhyChooseUsSectionProps) {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [activeModalStage, setActiveModalStage] = useState<TrustStage | null>(null);
  const [courierPosition, setCourierPosition] = useState<number>(25);

  // Synchronize courier beacon position along the path based on active stage
  useEffect(() => {
    // 1 -> 12.5%, 2 -> 37.5%, 3 -> 62.5%, 4 -> 87.5%
    const pos = (activeStageId - 0.5) * 25;
    setCourierPosition(pos);
  }, [activeStageId]);

  const activeStage = TRUST_STAGES.find((s) => s.id === activeStageId) || TRUST_STAGES[0];

  return (
    <section 
      id="why-choose-us" 
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 lg:px-12 bg-[#06110f] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting matching dark emerald theme */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Section 3 • Clinical Trust & Rapid Care</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Why Choose <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">Pharmacy Store</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              Four non-negotiable pillars of pharmaceutical integrity: accredited doctor verification, unbroken 2°C–8°C cold-chain logistics, and 30-minute rapid citywide delivery.
            </p>
          </div>

          {/* Quick Doctor Consultation / Hotline badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl glass-panel border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-white">Pharmacist Hotline</p>
              <p className="text-zinc-400 text-[11px] font-mono">1-800-REMEDY-3D • 24/7</p>
            </div>
          </div>
        </div>

        {/* Live Trust Metrics Counter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">50,000+</div>
              <div className="text-[11px] text-zinc-400">Delivered Safely</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">24 Mins</div>
              <div className="text-[11px] text-zinc-400">Avg Courier Time</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">2°C – 8°C</div>
              <div className="text-[11px] text-zinc-400">Cold-Chain Stored</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">4.9 / 5★</div>
              <div className="text-[11px] text-zinc-400">25,000+ Patients</div>
            </div>
          </div>
        </div>

        {/* 4-Stage Horizontal Trust Journey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;

            return (
              <div
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`relative rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 border ${
                  isActive
                    ? "bg-gradient-to-b from-[#0e241f]/95 to-[#081512]/95 border-emerald-400 shadow-2xl shadow-emerald-950/60 scale-[1.02]"
                    : "glass-panel bg-[#081512]/75 border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#0c1e19]/80"
                }`}
              >
                {/* Active Indicator Top Light Bar */}
                {isActive && (
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399]" />
                )}

                <div>
                  {/* Stage Icon & Telemetry Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {stage.icon}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isActive 
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                        : "bg-white/5 text-zinc-400 border-white/10"
                    }`}>
                      {stage.badge}
                    </span>
                  </div>

                  {/* Tag & Title */}
                  <p className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-semibold mb-1">
                    {stage.tag}
                  </p>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    {stage.shortDesc}
                  </p>
                </div>

                {/* Bottom Telemetry Mini-Gauge */}
                <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-mono">{stage.telemetry.label}</span>
                    <span className="font-bold text-white text-xs">{stage.telemetry.value}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalStage(stage);
                    }}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs group"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated SVG GPS Courier Route Path Tracker (Homage to reference video Scene 8) */}
        <div className="relative rounded-3xl glass-panel bg-gradient-to-r from-[#091714] via-[#0d221e] to-[#091714] border border-emerald-500/25 p-6 sm:p-8 overflow-hidden shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Live Pharmaceutical Dispatch Route Simulation
              </h4>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Active Hub: Central 3D Apothecary
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                Stage {activeStage.id} of 4 Selected
              </span>
            </div>
          </div>

          {/* Interactive Route Track */}
          <div className="relative w-full h-16 flex items-center">
            
            {/* Background Track Line */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1.5 bg-white/10 rounded-full" />
            
            {/* Animated Active Emerald Progress Line */}
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-500 shadow-[0_0_12px_#34d399]"
              style={{ width: `calc(${courierPosition}% - 16px)` }}
            />

            {/* Stage Waypoint Anchors */}
            {[1, 2, 3, 4].map((sId) => {
              const sPos = (sId - 0.5) * 25;
              const isPastOrCurrent = sId <= activeStageId;

              return (
                <div
                  key={sId}
                  onClick={() => setActiveStageId(sId)}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group flex flex-col items-center"
                  style={{ left: `${sPos}%` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                    isPastOrCurrent
                      ? "bg-emerald-400 text-slate-950 border-white shadow-lg shadow-emerald-500/50 scale-110"
                      : "bg-[#091714] text-zinc-400 border-white/20 group-hover:border-emerald-400"
                  }`}>
                    {sId}
                  </div>
                  <span className={`text-[10px] font-mono mt-1 whitespace-nowrap transition-colors ${
                    isPastOrCurrent ? "text-emerald-300 font-bold" : "text-zinc-500"
                  }`}>
                    {sId === 1 && "Prescription Check"}
                    {sId === 2 && "Cold-Chain Vault"}
                    {sId === 3 && "30-Min Transit"}
                    {sId === 4 && "Safe Hand-off"}
                  </span>
                </div>
              );
            })}

            {/* Animated Moving Courier Radar Beacon */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out pointer-events-none z-20"
              style={{ left: `${courierPosition}%` }}
            >
              <div className="relative flex items-center justify-center">
                {/* Radar Ripple Pulses */}
                <div className="absolute w-12 h-12 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
                <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/40">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Dispatch Controls */}
          <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="font-semibold text-white">Current Active Stage:</span>
              <span className="text-emerald-400 font-mono">{activeStage.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenPrescriptionModal()}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              >
                Upload Prescription for Review
              </button>
              <button
                onClick={() => setActiveModalStage(activeStage)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all shadow-md"
              >
                <span>Inspect Stage {activeStage.id} Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* INTERACTIVE STAGE VERIFICATION MODAL */}
        {activeModalStage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setActiveModalStage(null)}
          >
            <div 
              className="relative w-full max-w-xl rounded-3xl glass-panel bg-[#071512]/95 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalStage(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  {activeModalStage.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold">
                    {activeModalStage.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    {activeModalStage.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Status: <strong className="text-emerald-400">{activeModalStage.telemetry.status}</strong> • Metric: {activeModalStage.telemetry.value}
                  </p>
                </div>
              </div>

              {/* Headline & Clinical Safeguards */}
              <div className="space-y-4 text-xs text-zinc-300">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h5 className="font-semibold text-white text-sm mb-2">
                    {activeModalStage.details.headline}
                  </h5>
                  <ul className="space-y-2">
                    {activeModalStage.details.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-zinc-300 text-[11px] leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Official Accreditation ID */}
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{activeModalStage.details.certificate}</span>
                </div>

                {/* Pharmacist / Clinical Lead Quote */}
                <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs italic text-zinc-300 leading-relaxed">
                  &ldquo;{activeModalStage.details.verificationQuote}&rdquo;
                  <div className="text-right text-[10px] text-emerald-400 font-semibold not-italic mt-2">
                    — Clinical Operations Team, Pharmacy Store
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-6 mt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => setActiveModalStage(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors"
                >
                  Close Inspection
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
