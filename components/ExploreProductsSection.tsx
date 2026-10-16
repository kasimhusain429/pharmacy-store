"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { 
  FileText, 
  ShieldCheck, 
  Plus, 
  Check, 
  X, 
  ChevronRight, 
  Sparkles, 
  Lock, 
  HeartHandshake, 
  Pill, 
  Droplet, 
  Sparkle, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Layers,
  Info
} from "lucide-react";

interface ExploreProductsProps {
  onOpenPrescriptionModal: () => void;
  onAddToCart: (productTitle: string, price: number) => void;
}

export interface VaultProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  isRx: boolean;
  activeIngredient: string;
  dosageInfo: string;
  description: string;
  doctorName: string;
  rxRequirement: string;
  badge: string;
  // Position percentage on the isometric drawer graphic (0-100)
  posX: number;
  posY: number;
}

export interface VaultDrawer {
  id: string;
  number: string;
  label: string;
  category: "rx" | "otc" | "vitamins" | "skincare" | "wellness";
  iconName: string;
  products: VaultProduct[];
}

const VAULT_DRAWERS: VaultDrawer[] = [
  {
    id: "drawer-02",
    number: "02",
    label: "Rx ONLY",
    category: "rx",
    iconName: "rx",
    products: [
      {
        id: "prod-oxy",
        name: "OXYCONTIN 10mg",
        subtitle: "Controlled Substance",
        price: 185.00,
        isRx: true,
        activeIngredient: "Oxycodone Hydrochloride (Extended Release)",
        dosageInfo: "Dosage: 10-20 mg every 12 hours as directed by your licensed physician. Swallow whole; do not break, chew, or crush. Precautions of somnolence, respiratory depression, and severe drug interactions apply.",
        description: "OxyContin 10mg is a curated high-end medication engineered for controlled, tamper-resistant continuous analgesia in clinical postoperative protocols.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "Required: Valid Prescription",
        badge: "Schedule II • Monitored",
        posX: 56,
        posY: 30
      },
      {
        id: "prod-met",
        name: "METFORMIN HCl 500mg",
        subtitle: "Metabolic Regulation",
        price: 45.00,
        isRx: true,
        activeIngredient: "Metformin Hydrochloride Extended-Release",
        dosageInfo: "Dosage: 500 mg once daily with the evening meal. Do not exceed 2000 mg in 24 hours. Renal panel eGFR monitoring required prior to dispensing.",
        description: "First-line hydrophilic matrix tablet engineered for smooth, gastro-sparing 24-hour bio-absorption and glycemic balance.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "Required: Valid Prescription",
        badge: "GMP Certified Rx",
        posX: 32,
        posY: 56
      },
      {
        id: "prod-ros",
        name: "ROSUVASTATIN 10mg",
        subtitle: "Cardiovascular Lipid Support",
        price: 68.00,
        isRx: true,
        activeIngredient: "Rosuvastatin Calcium Trihydrate",
        dosageInfo: "Dosage: 10 mg once daily at any hour with or without food. Monitor hepatic transaminases and avoid excessive grapefruit consumption.",
        description: "Selective, competitive HMG-CoA reductase inhibitor designed for targeted LDL stabilization and clinical vascular endothelial protection.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "Required: Valid Prescription",
        badge: "Cardiovascular Tier 1",
        posX: 38,
        posY: 48
      },
      {
        id: "prod-blister",
        name: "CLINICAL DUO BLISTER",
        subtitle: "Micro-Coated Analgesic Strip",
        price: 34.00,
        isRx: true,
        activeIngredient: "Ibuprofen 400mg + Paracetamol 325mg",
        dosageInfo: "Dosage: 1 tablet every 6 to 8 hours following meals. Maximum 3 tablets daily. Cold-formed aluminum blister preserves active molecular potency.",
        description: "Laser-sealed clinical blister strip with light-resistant foil backing providing synergistic inflammatory and pyretic relief.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "Required: Valid Prescription",
        badge: "10-Tablet Sealed Strip",
        posX: 44,
        posY: 44
      },
      {
        id: "prod-tincture",
        name: "SUBLINGUAL AMBER DROPPER",
        subtitle: "Cellular Peptide Suspension",
        price: 78.00,
        isRx: true,
        activeIngredient: "Bio-Active Peptide Complex 25mg/ml",
        dosageInfo: "Dosage: Dispense 0.5 ml under tongue once daily in the morning; hold for 60 seconds before swallowing to ensure mucosal absorption.",
        description: "Concentrated sublingual formulation preserved in pharmaceutical amber glass with calibrated volumetric oral dropper.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "Required: Valid Prescription",
        badge: "Cold-Chain Stored",
        posX: 52,
        posY: 49
      },
      {
        id: "prod-cream",
        name: "HYDRA-CELL DERMA JARS",
        subtitle: "Epithelial Barrier Matrix",
        price: 95.00,
        isRx: false,
        activeIngredient: "Biomimetic Ceramides 3% + Hyaluronic",
        dosageInfo: "Dosage: Massage a pea-sized amount onto clean facial and cervical skin morning and evening. Safe for post-laser or retinoid therapy.",
        description: "Medical-grade lipid replenishment cream sealed in UV-treated frosted glass containers with hermetic clinical closure.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • Clinical Grade",
        badge: "Dermatologist Tested",
        posX: 56,
        posY: 64
      }
    ]
  },
  {
    id: "drawer-01",
    number: "01",
    label: "OTC",
    category: "otc",
    iconName: "otc",
    products: [
      {
        id: "prod-cetirizine",
        name: "ALLER-CLEAR CETIRIZINE 10mg",
        subtitle: "24-Hour Antihistamine",
        price: 24.50,
        isRx: false,
        activeIngredient: "Cetirizine Hydrochloride 10mg",
        dosageInfo: "Dosage: Take 1 tablet once daily. Non-drowsy formulation suitable for seasonal rhinitis and allergic ocular symptoms.",
        description: "Rapid second-generation H1-receptor antagonist providing complete 24-hour symptom relief without sedation.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • No Rx Required",
        badge: "Rapid Bio-Release",
        posX: 44,
        posY: 48
      },
      {
        id: "prod-antiseptic",
        name: "CLINICAL DERMA-SPRAY",
        subtitle: "Hospital Grade Antiseptic",
        price: 18.00,
        isRx: false,
        activeIngredient: "Chlorhexidine Gluconate 0.5%",
        dosageInfo: "Dosage: Spray evenly onto minor cuts, scrapes, or post-procedural areas from 10cm distance. Allow to air dry.",
        description: "Broad-spectrum antimicrobial topical spray formulated with soothing pro-vitamin B5 in a micro-mist applicator.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • No Rx Required",
        badge: "First Aid Standard",
        posX: 56,
        posY: 52
      }
    ]
  },
  {
    id: "drawer-03",
    number: "03",
    label: "VITAMINS & SUPPLEMENTS",
    category: "vitamins",
    iconName: "vitamins",
    products: [
      {
        id: "prod-magnesium",
        name: "MAGNESIUM L-THREONATE",
        subtitle: "Cognitive Neuro-Nutrient",
        price: 42.00,
        isRx: false,
        activeIngredient: "Magtein® Magnesium L-Threonate 144mg",
        dosageInfo: "Dosage: Take 2 capsules in the afternoon and 1 capsule two hours before bedtime with water.",
        description: "Patent-protected chelated magnesium compound scientifically shown to penetrate blood-brain barrier for synaptic support.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • Dietary Supplement",
        badge: "Lab Verified Pure",
        posX: 46,
        posY: 46
      },
      {
        id: "prod-vitd",
        name: "VITAMIN D3 + K2 LIPOSOMAL",
        subtitle: "Bone & Vascular Synergy",
        price: 36.00,
        isRx: false,
        activeIngredient: "Cholecalciferol 5000 IU + Menaquinone-7 100mcg",
        dosageInfo: "Dosage: Take 1 softgel daily with meals containing healthy dietary fats for optimal absorption.",
        description: "Bio-identical vitamin D3 paired with fermented K2 to ensure calcium is directed into bone tissue rather than vascular walls.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • Dietary Supplement",
        badge: "Liposomal Matrix",
        posX: 58,
        posY: 50
      }
    ]
  },
  {
    id: "drawer-04",
    number: "04",
    label: "SKINCARE",
    category: "skincare",
    iconName: "skincare",
    products: [
      {
        id: "prod-vitc",
        name: "VITALITY C+ 20% SERUM",
        subtitle: "Triple-Antioxidant Defense",
        price: 89.00,
        isRx: false,
        activeIngredient: "Pure L-Ascorbic Acid 20% + Ferulic Acid 0.5%",
        dosageInfo: "Dosage: Smooth 4-5 drops onto clean, dry skin every morning before moisturizing. Layer with broad-spectrum SPF 50.",
        description: "Acidic pH 3.2 formula delivering maximum free-radical photoprotection, collagen stimulation, and tone correction.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • Cosmeceutical",
        badge: "Dermatologist Gold",
        posX: 48,
        posY: 46
      },
      {
        id: "prod-retinoid",
        name: "RETIN-OVAL LIPID BALM",
        subtitle: "Cellular Turnover Complex",
        price: 76.00,
        isRx: false,
        activeIngredient: "Hydroxypinacolone Retinoate 2% + Squalane",
        dosageInfo: "Dosage: Apply a thin layer to face and neck at night. Gradually increase frequency from twice weekly to nightly.",
        description: "Next-generation direct-binding retinoid offering rapid cellular renewal with zero irritation or barrier flaking.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • Dermatological",
        badge: "Zero Irritation",
        posX: 60,
        posY: 52
      }
    ]
  },
  {
    id: "drawer-05",
    number: "05",
    label: "WELLNESS",
    category: "wellness",
    iconName: "wellness",
    products: [
      {
        id: "prod-circadian",
        name: "CIRCADIAN REM SLEEP COMPLEX",
        subtitle: "Physiological Rest Restorer",
        price: 38.00,
        isRx: false,
        activeIngredient: "Micro-Melatonin 1mg + L-Theanine 200mg + Passionflower",
        dosageInfo: "Dosage: Ingest 2 vegetable capsules 45 minutes prior to sleep in a dark room environment.",
        description: "Clinically formulated non-habit-forming complex aligning natural circadian rhythms and promoting deep delta wave sleep.",
        doctorName: "Dr. L. Müller",
        rxRequirement: "OTC • Non-Habit Forming",
        badge: "Restorative Sleep",
        posX: 50,
        posY: 48
      }
    ]
  }
];

export default function ExploreProductsSection({
  onOpenPrescriptionModal,
  onAddToCart
}: ExploreProductsProps) {
  // Current active drawer (defaults to Drawer 02: Rx ONLY from reference image)
  const [activeDrawerId, setActiveDrawerId] = useState<string>("drawer-02");
  
  // Selected product within the active drawer
  const currentDrawer = VAULT_DRAWERS.find((d) => d.id === activeDrawerId) || VAULT_DRAWERS[0];
  const [selectedProductId, setSelectedProductId] = useState<string>(currentDrawer.products[0]?.id || "prod-oxy");
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedProduct = currentDrawer.products.find((p) => p.id === selectedProductId) || currentDrawer.products[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectDrawer = (drawerId: string) => {
    setActiveDrawerId(drawerId);
    const target = VAULT_DRAWERS.find((d) => d.id === drawerId);
    if (target && target.products.length > 0) {
      setSelectedProductId(target.products[0].id);
    }
    setInspectorOpen(true);
  };

  const handleProductSelect = (product: VaultProduct) => {
    setSelectedProductId(product.id);
    setInspectorOpen(true);
  };

  return (
    <section 
      id="explore-products" 
      className="w-full min-h-screen py-20 px-4 sm:px-6 lg:px-12 bg-[#050c0a] border-t border-emerald-950/40 relative overflow-hidden select-none selection:bg-emerald-500 selection:text-slate-950"
    >
      {/* Ambient background light gradients */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-0" />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* ========================================================================= */}
        {/* SECTION 2 HEADER (Exact Match to User Reference Design)                   */}
        {/* ========================================================================= */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase font-sans">
            EXPLORE PRODUCTS
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-xl mx-auto font-normal">
            Our curated range of certified clinical products and medical solutions.
          </p>

          {/* Category Filter Pills (Exact Match to Reference Image) */}
          <div className="mt-8 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
            {VAULT_DRAWERS.map((drawer) => {
              const active = activeDrawerId === drawer.id;
              return (
                <button
                  key={drawer.id}
                  onClick={() => handleSelectDrawer(drawer.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    active
                      ? "bg-[#091f1a] text-white border-2 border-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] scale-105"
                      : "bg-[#0c1614]/80 text-zinc-400 border border-white/10 hover:border-emerald-500/40 hover:text-white"
                  }`}
                >
                  <span>{drawer.label}</span>
                  {drawer.category === "rx" && (
                    <span className="text-emerald-400 font-bold font-mono text-[11px]">℞</span>
                  )}
                  {drawer.category === "vitamins" && (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    </span>
                  )}
                  {drawer.category === "skincare" && (
                    <Droplet className="w-3 h-3 text-cyan-400" />
                  )}
                  {drawer.category === "wellness" && (
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3D APOTHECARY VAULT & PULL-OUT CLINICAL DRAWER VISUAL STAGE               */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-6xl aspect-[16/9] min-h-[480px] sm:min-h-[580px] rounded-3xl overflow-hidden border border-emerald-500/20 bg-[#081210] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(16,185,129,0.15)] flex items-center justify-center">
          
          {/* Base Visual: The Clean Isometric Dispensary Vault & Pulled Drawer (Zero Text / Pure 3D Render) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/clean_vault_drawer.jpg"
              alt="Dispensary Vault Clinical Storage Drawer"
              fill
              priority
              className="object-cover object-center scale-[1.01]"
            />

            {/* Glowing Mint Neon Laser Strips along drawer tracks */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/10" />
          </div>

          {/* Animated Cyber-Particle Glow Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-emerald-400/60 blur-[1px] animate-pulse" />
            <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/50 blur-[1px] animate-ping" />
            <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-emerald-300/40 blur-[1px] animate-bounce" />
          </div>

          {/* Active Drawer Badge Label on Bottom Left */}
          <div className="absolute bottom-6 left-8 z-20 flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-white font-mono text-xs flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE VAULT DRAWER: {currentDrawer.number}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-emerald-400 uppercase">{currentDrawer.label}</span>
            </div>

            {/* Quick Drawer Switchers (01, 02, 03, 04, 05) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/70 border border-white/10 rounded-xl p-1 backdrop-blur-md">
              {VAULT_DRAWERS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDrawer(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeDrawerId === d.id
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {d.number}
                </button>
              ))}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* INTERACTIVE HOTSPOT RADAR PINS INSIDE THE OPEN DRAWER                   */}
          {/* ======================================================================= */}
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {currentDrawer.products.map((product) => {
              const isSelected = selectedProductId === product.id;
              return (
                <div
                  key={product.id}
                  style={{
                    left: `${product.posX}%`,
                    top: `${product.posY}%`
                  }}
                  onClick={() => handleProductSelect(product)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  {/* Outer Pulsing Radar Ring */}
                  <div className={`relative flex items-center justify-center transition-transform duration-300 ${
                    isSelected ? "scale-125" : "hover:scale-110"
                  }`}>
                    {/* Ripple */}
                    <span className={`absolute w-8 h-8 rounded-full border border-emerald-400/80 animate-ping opacity-75 ${
                      isSelected ? "block" : "hidden group-hover:block"
                    }`} />
                    
                    {/* Glowing Core Pin */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border shadow-lg transition-all ${
                      isSelected 
                        ? "bg-emerald-400 border-white text-slate-950 shadow-[0_0_20px_#10b981]" 
                        : "bg-slate-900/90 border-emerald-400/70 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950"
                    }`}>
                      <span className="font-mono text-[9px] font-black">℞</span>
                    </div>

                    {/* Micro Tag Label on hover */}
                    <div className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-950/90 border border-emerald-500/40 text-[10px] text-white font-mono whitespace-nowrap shadow-md pointer-events-none transition-all ${
                      isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"
                    }`}>
                      {product.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================================= */}
          {/* FLOATING ACTION CALLOUT TAGS (Exact Match to Reference Card on Drawer)   */}
          {/* ======================================================================= */}
          <div className="absolute top-[48%] right-[32%] sm:right-[34%] z-20 flex flex-col gap-2 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
            {/* Top item action card */}
            <div className="bg-[#1a2b25]/90 border border-emerald-500/30 rounded-xl p-2 sm:p-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-1.5 min-w-[130px] sm:min-w-[150px]">
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-300 font-bold">
                  ℞
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  ${selectedProduct.price.toFixed(0)}
                </span>
              </div>

              {/* View Details Button (Mint Filled) */}
              <button
                onClick={() => setInspectorOpen(true)}
                className="w-full py-1 sm:py-1.5 px-3 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-[11px] sm:text-xs shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-all cursor-pointer text-center"
              >
                View Details
              </button>

              {/* Quick Add Button (Dark Glass) */}
              <button
                onClick={() => {
                  if (selectedProduct.isRx) {
                    onOpenPrescriptionModal();
                  } else {
                    onAddToCart(selectedProduct.name, selectedProduct.price);
                    showToast(`Added ${selectedProduct.name} to cart.`);
                  }
                }}
                className="w-full py-1 sm:py-1.5 px-3 rounded-lg bg-[#243831] border border-white/10 text-white font-bold text-[11px] sm:text-xs hover:bg-[#2e463d] transition-all cursor-pointer text-center"
              >
                Quick Add
              </button>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* PHARMACIST VERIFIED DETAIL INSPECTOR CARD (Exact Match to Reference)     */}
          {/* ======================================================================= */}
          {inspectorOpen && (
            <div className="absolute top-4 bottom-4 right-4 sm:right-6 w-[280px] sm:w-[320px] z-30 bg-[#0d1a16]/95 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_-5px_rgba(16,185,129,0.3)] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-5 duration-300 selection:bg-emerald-500 selection:text-slate-950">
              
              <div>
                {/* Header & Close Button */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                      {selectedProduct.name}
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-medium block mt-0.5">
                      {selectedProduct.subtitle}
                    </span>
                  </div>

                  <button
                    onClick={() => setInspectorOpen(false)}
                    className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Clinical Description */}
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed mt-3 border-t border-white/[0.08] pt-2.5">
                  {selectedProduct.description}
                </p>

                {/* Dosage Information */}
                <div className="mt-3.5 pt-2.5 border-t border-white/[0.08]">
                  <h4 className="text-[11px] font-bold text-white mb-1">
                    Dosage Information
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed font-sans">
                    {selectedProduct.dosageInfo}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between font-mono">
                  <span className="text-[11px] text-zinc-400 uppercase">Unit Price:</span>
                  <span className="text-lg font-black text-emerald-400">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Pharmacist Verified Seal & Rx Requirement */}
              <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-2.5">
                
                {/* Pharmacist Verified Badge (Exact Shield + Signature) */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#132822] border border-emerald-500/25">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block">
                      PHARMACIST VERIFIED
                    </span>
                    <span className="text-xs font-serif italic text-white block">
                      {selectedProduct.doctorName}
                    </span>
                  </div>
                </div>

                {/* Prescription Required Pill Bar */}
                <div className="w-full py-2 px-3 rounded-xl bg-slate-950/70 border border-white/10 text-center flex items-center justify-center gap-1.5 text-[11px] text-zinc-300">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{selectedProduct.rxRequirement}</span>
                </div>

                {/* Action CTA Button */}
                {selectedProduct.isRx ? (
                  <button
                    onClick={onOpenPrescriptionModal}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] hover:brightness-110 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Upload Doctor Rx</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct.name, selectedProduct.price);
                      showToast(`Added ${selectedProduct.name} to cart.`);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Order • ${selectedProduct.price.toFixed(2)}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DRAWER INVENTORY HIGHLIGHTS TICKER (Responsive below graphic)             */}
        {/* ========================================================================= */}
        <div className="w-full mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {currentDrawer.products.map((item) => {
            const isSelected = selectedProductId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleProductSelect(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#0b1f1a] border-emerald-400 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] scale-[1.02]"
                    : "bg-[#071310]/70 border-white/[0.06] text-zinc-400 hover:border-emerald-500/30 hover:text-white"
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 block mb-1">
                    {item.badge}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {item.name}
                  </h4>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-black text-white font-mono">
                    ${item.price.toFixed(0)}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    item.isRx ? "bg-amber-500/10 text-amber-300" : "bg-emerald-500/10 text-emerald-300"
                  }`}>
                    {item.isRx ? "Rx" : "OTC"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
