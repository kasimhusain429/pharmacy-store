"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  ShoppingBag, 
  FileText, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  X, 
  AlertCircle, 
  Plus, 
  Minus, 
  Trash2, 
  Lock,
  Pill,
  HeartPulse,
  Droplet,
  Flame,
  Stethoscope,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface ShopConnectSectionProps {
  onOpenPrescriptionModal: () => void;
  cartCount: number;
  onAddToCart: (title: string, price: number) => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isRx: boolean;
}

export default function ShopConnectSection({
  onOpenPrescriptionModal,
  cartCount,
  onAddToCart
}: ShopConnectSectionProps) {
  // Live Chat simulation state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "pharmacist"; text: string; time: string }>>([
    {
      sender: "pharmacist",
      text: "Hello! I am Dr. Elena Vasquez, PharmD. How can I assist you with your prescriptions or dosage today?",
      time: "Just now"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Quick Cart Drawer state
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "cart-1", name: "DiagCheck A1c Glycated Monitor Kit", price: 59.99, quantity: 1, isRx: false },
    { id: "cart-2", name: "Vitality C+ 20% Bio-Serum", price: 89.00, quantity: 1, isRx: false }
  ]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = { sender: "user" as const, text: userText, time: "Just now" };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setIsTyping(true);

    // Simulate clinical pharmacist reply
    setTimeout(() => {
      let reply = "Thank you for reaching out. Regulated medications require an active doctor prescription before release. Feel free to use our secure Rx Upload portal above.";
      const lower = userText.toLowerCase();
      if (lower.includes("metformin") || lower.includes("rosuvastatin") || lower.includes("oxycontin") || lower.includes("rx")) {
        reply = "For regulated medications, please ensure your physician's prescription is signed within the past 6 months. You can upload it instantly for 15-minute pharmacist verification.";
      } else if (lower.includes("delivery") || lower.includes("shipping") || lower.includes("time")) {
        reply = "Our cold-chain couriers dispatch within 30 minutes for local medical zones, maintained precisely at 2°-8°C.";
      } else if (lower.includes("hello") || lower.includes("hi")) {
        reply = "Hello! I am ready to review your medical order or advise on drug interactions.";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "pharmacist", text: reply, time: "Just now" }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from checkout bag.");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) return;
    setNewsletterSubscribed(true);
    showToast("Thank you for subscribing to the Apothecary Clinical Journal.");
  };

  const CATEGORIES = [
    {
      id: "cat-rx",
      title: "Prescription Medications",
      badge: "Doctor Rx Required",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      description: "Regulated cardiovascular, metabolic, and neurological pharmaceuticals dispensed under strict GMP standards.",
      icon: Pill,
      itemCount: "140+ Formulations",
      items: ["Metformin HCl Extended", "Rosuvastatin Calcium", "Salbutamol Inhalers", "Adapalene Micro-Gel"],
      actionLabel: "Submit Prescription Rx",
      isRx: true
    },
    {
      id: "cat-vitamins",
      title: "Daily Vitamins & Longevity",
      badge: "OTC • Same-Day Dispatch",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      description: "Clinically bio-available chelated minerals, liposomal vitamins, and cellular mitochondrial complexes.",
      icon: HeartPulse,
      itemCount: "85+ Formulations",
      items: ["Magnesium L-Threonate", "Liposomal D3 + K2", "Nordic Omega-3 Ultra", "Bio-Active CoQ10"],
      actionLabel: "Explore Regimens",
      isRx: false
    },
    {
      id: "cat-derma",
      title: "Clinical Derma & Skincare",
      badge: "Dermatologist Tested",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      description: "Barrier-restorative biomimetic ceramides, pure L-ascorbic serums, and therapeutic hydration balms.",
      icon: Droplet,
      itemCount: "64+ Formulations",
      items: ["Vitality C+ 20% Serum", "Hydra-Cell Ceramide Jars", "Retinoid Lipid Balms", "SPF 50+ Mineral Shield"],
      actionLabel: "Explore Skincare",
      isRx: false
    },
    {
      id: "cat-emergency",
      title: "Diagnostic Kits & First Aid",
      badge: "Immediate Dispatch",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      description: "Hospital-grade electrochemical HbA1c monitors, oscillometric BP cuffs, and rapid antiseptic care.",
      icon: Flame,
      itemCount: "32+ Diagnostic Tools",
      items: ["DiagCheck A1c Monitor", "CardioStat BP Cuff", "Hospital Antiseptic Spray", "Sterile Mesh Nebulizer"],
      actionLabel: "Explore Diagnostics",
      isRx: false
    }
  ];

  return (
    <section 
      id="shop-connect" 
      className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-[#06110f] via-[#081512] to-[#040807] border-t border-emerald-950/40 relative selection:bg-emerald-500 selection:text-slate-950"
    >
      {/* Background Decorative Ambient Radial Lighting */}
      <div className="absolute top-1/3 left-10 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-20 right-10 w-[550px] h-[350px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ======================================================================= */}
        {/* SECTION 4 HEADER                                                        */}
        {/* ======================================================================= */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Section 4 • Shop &amp; Connect</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Curated Health Categories &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200">
              24/7 Clinical Care
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-4 leading-relaxed">
            Order certified pharmaceutical formulations, daily regimens, and clinical skincare — or connect directly with our licensed pharmacists for dosage guidance and emergency dispatch.
          </p>
        </div>

        {/* ======================================================================= */}
        {/* 2-COLUMN HUB: CATEGORIES (LEFT) & CONSULTATION TERMINAL (RIGHT)         */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: 4 CATEGORIZED SHOPPING TILES (7 COLS)                    */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group relative rounded-2xl p-6 bg-slate-950/60 border border-white/[0.08] hover:border-emerald-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_-10px_rgba(16,185,129,0.2)] flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                    </div>

                    {/* Category Title & Item Count */}
                    <span className="text-[11px] font-mono text-zinc-500 block mb-1">
                      {cat.itemCount}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Quick Items Preview List */}
                    <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3 text-[11px] text-zinc-300">
                      {cat.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-zinc-400">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-6 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        if (cat.isRx) {
                          onOpenPrescriptionModal();
                        } else {
                          const element = document.getElementById("explore-products");
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        cat.isRx
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950"
                          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 shadow-[0_0_15px_-4px_rgba(16,185,129,0.3)]"
                      }`}
                    >
                      {cat.isRx ? <FileText className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{cat.actionLabel}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: PHARMACIST DESK & EMERGENCY DISPATCH TERMINAL (5 COLS)  */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 1: Duty Pharmacist Consultation Console */}
            <div className="rounded-2xl p-6 bg-[#091713]/90 border border-emerald-500/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_-5px_rgba(16,185,129,0.2)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

              {/* Pharmacist Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-xl">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  {/* Live Pulsing Online Beacon */}
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">
                      Dr. Elena Vasquez, PharmD
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold block">
                    Chief Duty Clinical Pharmacist
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    License #GPhC-88219 • Board Certified
                  </span>
                </div>
              </div>

              {/* Consultation Quote */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.06] mb-5">
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  &ldquo;Need guidance verifying an active prescription, calculating drug dosages, or checking contraindications? Connect with our clinical team 24/7.&rdquo;
                </p>
              </div>

              {/* Direct Communication Buttons */}
              <div className="space-y-2.5">
                {/* Live Chat Drawer Trigger */}
                <button
                  onClick={() => setChatOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Live Pharmacist Consultation (Instant)</span>
                </button>

                {/* Submit Doctor Prescription Button */}
                <button
                  onClick={onOpenPrescriptionModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Upload Doctor Prescription (Rx Verification)</span>
                </button>
              </div>
            </div>

            {/* Card 2: 24/7 Emergency Dispatch & Pharmacy Contact Info */}
            <div className="rounded-2xl p-6 bg-slate-950/70 border border-white/[0.08] backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dispensary Dispatch Status:</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase font-mono">
                  ● 24/7 Operational
                </span>
              </div>

              {/* Contact Grid */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>Emergency Clinical Hotline:</span>
                  </div>
                  <a 
                    href="tel:18007363393" 
                    className="font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    1-800-REMEDY-3D
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Physical Dispensary Hub:</span>
                  </div>
                  <span className="font-mono text-zinc-300">
                    420 Bio-Health Blvd, Med-Zone
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cold-Chain Transit Radius:</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-semibold">
                    15.5 Mile Direct Metro Range
                  </span>
                </div>
              </div>

              {/* View Bag / Quick Checkout Button */}
              <div className="pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => setCartDrawerOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Review Shopping Bag ({cartItems.length} items)</span>
                  </div>
                  <span className="font-mono font-black text-white">
                    ${subtotal.toFixed(2)} →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* CLINICAL ACCREDITATION SEALS STRIP                                      */}
        {/* ======================================================================= */}
        <div className="mt-16 py-8 border-y border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">GPhC</span>
            <span className="text-[11px] text-zinc-400 mt-1">General Pharmaceutical Council</span>
            <span className="text-[10px] text-zinc-600 font-mono">License #88219</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">NABP</span>
            <span className="text-[11px] text-zinc-400 mt-1">National Verified Dispensary</span>
            <span className="text-[10px] text-zinc-600 font-mono">Accreditation #2026</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">HIPAA</span>
            <span className="text-[11px] text-zinc-400 mt-1">256-Bit Encrypted Records</span>
            <span className="text-[10px] text-zinc-600 font-mono">Full Patient Privacy</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">GMP-Clean</span>
            <span className="text-[11px] text-zinc-400 mt-1">Class 10,000 Cleanroom Vault</span>
            <span className="text-[10px] text-zinc-600 font-mono">Cold-Chain 2°-8°C</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* LUXURY APOTHECARY FOOTER & NEWSLETTER                                   */}
        {/* ======================================================================= */}
        <footer className="mt-16 pt-12 pb-6 border-t border-white/[0.04]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-6 h-6 fill-emerald-400" viewBox="0 0 24 24">
                    <path d="M12 2a4 4 0 0 0-4 4v2H6a4 4 0 0 0-4 4 4 4 0 0 0 4 4h2v2a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-2h2a4 4 0 0 0 4-4 4 4 0 0 0-4-4h-2V6a4 4 0 0 0-4-4z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg tracking-tight text-white">
                  Pharmacy <span className="font-normal text-zinc-400">Store</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                A state-of-the-art cinematic apothecary combining hospital-grade precision, certified cold-chain logistics, and licensed clinical consultations.
              </p>
              <div className="text-[11px] text-zinc-500 font-mono">
                Prescription verification required for all regulated schedules.
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Navigation</h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><a href="#hero" className="hover:text-emerald-400 transition-colors">Home</a></li>
                <li><a href="#explore-products" className="hover:text-emerald-400 transition-colors">Explore Products</a></li>
                <li><a href="#why-choose-us" className="hover:text-emerald-400 transition-colors">Why Choose Us</a></li>
                <li><a href="#shop-connect" className="hover:text-emerald-400 transition-colors">Shop &amp; Connect</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Regulatory</h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenPrescriptionModal(); }} className="hover:text-emerald-400 transition-colors">Upload Prescription</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-emerald-400 transition-colors">Clinical Guidelines</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-emerald-400 transition-colors">Cold-Chain Standard</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-emerald-400 transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Apothecary Clinical Journal
              </h4>
              <p className="text-xs text-zinc-400">
                Receive weekly peer-reviewed clinical research and wellness advisories directly from our licensed pharmacy team.
              </p>
              {newsletterSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Subscribed to clinical updates. Welcome!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter professional or patient email..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500/60"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Legal Emergency Disclaimer */}
          <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
            <p>
              &copy; 2026 Pharmacy Store Dispensary Inc. All rights reserved. Regulated by GPhC &amp; NABP.
            </p>
            <p className="text-zinc-600 max-w-xl text-center sm:text-right">
              Emergency Notice: If you are experiencing an acute life-threatening medical event, call 911 immediately. Regulated prescription medications require a verified doctor’s order.
            </p>
          </div>
        </footer>
      </div>

      {/* ======================================================================= */}
      {/* INTERACTIVE PHARMACIST LIVE CHAT MODAL DRAWER                           */}
      {/* ======================================================================= */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            onClick={() => setChatOpen(false)} 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" 
          />

          <div className="relative w-full max-w-md h-full bg-[#081512] border-l border-emerald-500/30 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Chat Header */}
            <div className="px-5 py-4 bg-[#0a1a16] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dr. Elena Vasquez, PharmD</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Online • Clinical Consultation Desk</span>
                </div>
              </div>

              <button
                onClick={() => setChatOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              <div className="text-center">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] text-zinc-500 text-[10px] font-mono">
                  Encrypted 256-bit HIPAA Consultation Session
                </span>
              </div>

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-slate-950 font-medium rounded-br-xs shadow-md"
                        : "bg-white/[0.05] border border-white/10 text-zinc-200 rounded-bl-xs leading-relaxed"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/5 w-24">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-4 bg-[#0a1a16] border-t border-white/[0.08] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your medical or prescription query..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500/60"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* QUICK CHECKOUT BAG SLIDE-OUT DRAWER                                     */}
      {/* ======================================================================= */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            onClick={() => setCartDrawerOpen(false)} 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" 
          />

          <div className="relative w-full max-w-md h-full bg-[#081512] border-l border-emerald-500/30 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-5 py-4 bg-[#0a1a16] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Dispensary Shopping Bag</h4>
                <span className="text-xs text-zinc-400 font-mono">({cartItems.length})</span>
              </div>

              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                    <span className="text-xs font-mono text-emerald-400 font-bold block mt-0.5">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono text-white font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="text-center py-16 text-zinc-500">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Your shopping bag is currently empty.</p>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-[#0a1a16] border-t border-white/[0.08] space-y-3">
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Dispensary Subtotal:</span>
                    <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Cold-Chain Packaging (2°-8°C):</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Express Dispatch:</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-bold text-white">
                    <span>Estimated Total:</span>
                    <span className="text-emerald-300 font-black">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    onOpenPrescriptionModal();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] hover:brightness-110 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Secure Rx Clinical Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
