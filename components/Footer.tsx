"use client";

import React from "react";
import { 
  ShieldCheck, 
  FileCheck, 
  Lock, 
  Truck, 
  Award, 
  Film, 
  ExternalLink,
  HeartHandshake,
  CheckCircle2
} from "lucide-react";

interface FooterProps {
  onOpenPrescriptionModal?: () => void;
  onReplayPreloader?: () => void;
}

export default function Footer({ onOpenPrescriptionModal, onReplayPreloader }: FooterProps) {
  const handleOpenStudioPrompts = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-video-prompts", { detail: { scene: "hero" } }));
    }
  };

  return (
    <footer className="w-full bg-[#040908] text-slate-400 border-t border-white/[0.08] relative z-20 select-none">
      
      {/* 1. CLINICAL REGULATORY ACCREDITATION BANNER */}
      <div className="w-full border-b border-white/[0.06] bg-[#06110f]/60 py-6 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-white tracking-wide uppercase">
              Board-Certified Telehealth Pharmacy
            </span>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GPhC &amp; NABP Licensed</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant 256-Bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Cold-Chain 2°C–8°C Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>ISO 9001:2015 Quality</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Col 1 & 2: Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <svg className="w-5 h-5 fill-emerald-400" viewBox="0 0 24 24">
                <path d="M12 2a4 4 0 0 0-4 4v2H6a4 4 0 0 0-4 4 4 4 0 0 0 4 4h2v2a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-2h2a4 4 0 0 0 4-4 4 4 0 0 0-4-4h-2V6a4 4 0 0 0-4-4z" />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">
              Pharmacy <span className="font-normal text-emerald-300/80">Store</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
            A contemporary digital pharmacy dispensary combining rigorous clinical oversight, pharmaceutical cold-chain packaging, and licensed telehealth consultations.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onOpenPrescriptionModal}
              className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              Upload Prescription (Rx)
            </button>
            <a
              href="#pharmacist-consult"
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all"
            >
              Consult Clinical Team
            </a>
          </div>
        </div>

        {/* Col 3: Clinical Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Clinical Services
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <a href="#prescription-flip" className="hover:text-emerald-300 transition-colors">
                Prescription Verification
              </a>
            </li>
            <li>
              <a href="#pharmacist-consult" className="hover:text-emerald-300 transition-colors">
                Live Pharmacist Consult
              </a>
            </li>
            <li>
              <a href="#editorial-routine" className="hover:text-emerald-300 transition-colors">
                Chronobiological Dosing
              </a>
            </li>
            <li>
              <a href="#explore-dispensary" className="hover:text-emerald-300 transition-colors">
                Essential Formulations
              </a>
            </li>
            <li>
              <a href="#explore-dispensary" className="hover:text-emerald-300 transition-colors">
                Diagnostic Hardware
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Quality & Compliance */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Quality &amp; Standards
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Board-Certified Pharmacists</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine Batch Audit</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cold-Chain Monitored</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contraindication Screening</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tamper-Evident Packaging</span>
            </li>
          </ul>
        </div>

        {/* Col 5: Telehealth & Support */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Patient Support
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Clinical team on duty 24/7. Average response time under 45 seconds for active registered regimens.
          </p>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs">
            <span className="text-[10px] text-zinc-500 uppercase block font-mono">Dispensary Hotline</span>
            <span className="font-semibold text-white mt-0.5 block">1-800-PHARMACY (24/7)</span>
          </div>

          {/* Discreet Studio Prompts Trigger for Creator Workflow & Preloader Replay */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenStudioPrompts}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-emerald-300 transition-colors cursor-pointer group"
              title="Access solid green screen video generation prompts"
            >
              <Film className="w-3.5 h-3.5 text-emerald-500/70 group-hover:text-emerald-400" />
              <span>Studio Chroma Hub</span>
            </button>

            {onReplayPreloader && (
              <button
                onClick={onReplayPreloader}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-emerald-300 transition-colors cursor-pointer group"
                title="Replay the HealthPlus luxury preloader"
              >
                <Award className="w-3.5 h-3.5 text-emerald-500/70 group-hover:text-emerald-400" />
                <span>Replay Preloader</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3. EMERGENCY MEDICAL NOTICE DISCLAIMER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-8">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-zinc-400 leading-relaxed">
          <strong className="text-zinc-300">Clinical Emergency Notice:</strong> If you are experiencing a life-threatening medical emergency or severe adverse reaction, call 911 (US) or 999 (UK) immediately. Pharmacy Store provides verified prescription fulfillment, drug regimen scheduling, and non-emergent telehealth consultations under licensed pharmacist oversight.
        </div>
      </div>

      {/* 4. COPYRIGHT & REGULATORY FOOTER */}
      <div className="border-t border-white/[0.06] py-6 px-4 sm:px-8 lg:px-16 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Pharmacy Store Dispensary Systems Inc. All clinical rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">HIPAA Notice</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Care</a>
            <a href="#" className="hover:text-white transition-colors">Dispensary Licenses</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
