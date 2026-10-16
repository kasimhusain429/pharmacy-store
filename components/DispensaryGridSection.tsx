"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Plus, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  ArrowRight,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  ExternalLink
} from "lucide-react";

interface DispensaryGridProps {
  onOpenPrescriptionModal?: () => void;
  onAddToCart?: (title: string, price: number) => void;
  activeTimeline?: string;
  onTimeChange?: (time: string) => void;
}

export interface DispensaryProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  schedule: ("dawn" | "noon" | "dusk" | "night")[];
  dosage: string;
  description: string;
  isRx?: boolean;
}

const DISPENSARY_PRODUCTS: DispensaryProduct[] = [
  {
    id: "prod-1",
    title: "Amoxicillin Formula 500mg",
    category: "Antibiotic • Controlled",
    price: 34.00,
    image: "/closing_hero_pedestal.jpg", // amber bottle on pedestal
    badge: "Rx Required",
    schedule: ["dawn", "noon", "night"],
    dosage: "1 capsule every 8 hours with meal",
    description: "Broad-spectrum bactericidal preparation for targeted clinical therapy.",
    isRx: true
  },
  {
    id: "prod-2",
    title: "MedTemp Precision Clinical Thermometer",
    category: "Diagnostic Device",
    price: 28.50,
    image: "/prod_thermometer.jpg",
    badge: "Clinical Standard",
    schedule: ["dawn", "noon", "dusk", "night"],
    dosage: "10-second rapid oral or axillary scan",
    description: "Medical-grade sensor calibrated to 0.05°C precision with backlit fever alert.",
    isRx: false
  },
  {
    id: "prod-3",
    title: "Dispensary Dosage Protocol Schedule",
    category: "Regimen Guide",
    price: 0.00,
    image: "/product_rx.jpg",
    badge: "Complimentary with Rx",
    schedule: ["dawn", "noon", "dusk", "night"],
    dosage: "Tailored by your personal pharmacist",
    description: "Laminated chronological medication map cross-indexed for contraindications.",
    isRx: false
  },
  {
    id: "prod-4",
    title: "Nura Skincare Bio-Active Serum",
    category: "Dermatological Serum",
    price: 46.00,
    image: "/prod_dropper.jpg",
    badge: "Mint & Aloe Infused",
    schedule: ["dawn", "night"],
    dosage: "3–4 drops onto freshly cleansed skin",
    description: "Translucent mint elixir with high-potency hyaluronic acid and soothing botanical extract.",
    isRx: false
  },
  {
    id: "prod-5",
    title: "Essential Bio-Mineral Dual-Capsule",
    category: "Daily Micronutrient",
    price: 22.00,
    image: "/pill_organizer_box.jpg",
    badge: "Daily Essential",
    schedule: ["dawn", "noon"],
    dosage: "1 green & white cap with morning smoothie",
    description: "Chelated magnesium, zinc, and methylated B-complex for daily vitality.",
    isRx: false
  },
  {
    id: "prod-6",
    title: "Nature's Alchemy Healing Balm 60ml",
    category: "Topical Ointment",
    price: 19.50,
    image: "/prod_balm.jpg",
    badge: "Golden Amber Jar",
    schedule: ["dusk", "night"],
    dosage: "Apply liberally to dry or irritated skin",
    description: "Handcrafted soothing botanical ointment with organic beeswax and calendula.",
    isRx: false
  },
  {
    id: "prod-7",
    title: "Derma-Fine Calming Repair Cream 50ml",
    category: "Barrier Recovery",
    price: 32.00,
    image: "/prod_cream.jpg",
    badge: "Hypoallergenic",
    schedule: ["dawn", "night"],
    dosage: "Gentle pea-sized application morning & night",
    description: "Ceramide NP and squalane restorative emulsion for sensitive skin recovery.",
    isRx: false
  },
  {
    id: "prod-8",
    title: "Omron Smart Wrist Pulse & BP Monitor",
    category: "Vascular Telemetry",
    price: 89.00,
    image: "/prod_bp_monitor.jpg",
    badge: "Bluetooth Sync",
    schedule: ["dawn", "dusk"],
    dosage: "Measure resting at morning & evening",
    description: "Cuff sensor measuring systolic/diastolic BP (120/80) and irregular heart rhythm detection.",
    isRx: false
  }
];

export default function DispensaryGridSection({
  onOpenPrescriptionModal,
  onAddToCart,
  activeTimeline = "dawn",
  onTimeChange
}: DispensaryGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<DispensaryProduct | null>(null);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAdd = (prod: DispensaryProduct) => {
    if (prod.isRx) {
      if (onOpenPrescriptionModal) onOpenPrescriptionModal();
      return;
    }
    if (onAddToCart) {
      onAddToCart(prod.title, prod.price);
    }
    setAddedMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [prod.id]: false }));
    }, 2000);
  };

  const filteredProducts = (!activeTimeline || activeTimeline === "all")
    ? DISPENSARY_PRODUCTS
    : DISPENSARY_PRODUCTS.filter((p) => p.schedule.includes(activeTimeline as any));

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : DISPENSARY_PRODUCTS;

  return (
    <section 
      id="explore-dispensary" 
      className="relative w-full py-20 px-4 sm:px-8 lg:px-16 bg-[#f7faf8] text-slate-800 border-t border-slate-200/60 selection:bg-emerald-500 selection:text-white"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-800 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Accredited Digital Dispensary</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 mt-1">
              Pharmaceutical Care &amp; Essentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-xl leading-relaxed">
              Certified clinical therapies, precision diagnostic hardware, and dermatological essentials, all reviewed under licensed pharmacist supervision.
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
            {[
              { id: "all", label: "All Items" },
              { id: "dawn", label: "Dawn" },
              { id: "noon", label: "Noon" },
              { id: "dusk", label: "Dusk" },
              { id: "night", label: "Night" },
            ].map((tab) => {
              const isSelected = activeTimeline === tab.id || (tab.id === "all" && !["dawn", "noon", "dusk", "night"].includes(activeTimeline));

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (onTimeChange) onTimeChange(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8-Card Responsive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((prod) => {
            const isAdded = addedMap[prod.id];

            return (
              <div
                key={prod.id}
                className="group rounded-3xl bg-white p-5 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(6,30,22,0.08)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Showcase */}
                <div 
                  onClick={() => setSelectedProduct(prod)}
                  className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
                >
                  <Image
                    src={prod.image}
                    alt={prod.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-emerald-800 border border-slate-200/60 shadow-2xs">
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase block">
                      {prod.category}
                    </span>
                    <h4 
                      onClick={() => setSelectedProduct(prod)}
                      className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5 cursor-pointer leading-tight line-clamp-1"
                    >
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {prod.price > 0 ? (
                        <span className="text-sm font-black text-slate-900">
                          ${prod.price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700">
                          Included with Rx
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdd(prod)}
                      className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : prod.isRx
                          ? "bg-slate-900 hover:bg-slate-800 text-white"
                          : "bg-[#86efac] hover:bg-[#6ee7b7] text-slate-950 shadow-2xs"
                      }`}
                      title={prod.isRx ? "Prescription Verification Required" : "Add to Order"}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : prod.isRx ? (
                        <>
                          <span>Verify Rx</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-left shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              ✕
            </button>
            <div className="relative w-full h-48 rounded-2xl bg-slate-50 mb-4 overflow-hidden">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
                fill
                className="object-contain p-4"
              />
            </div>
            <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">
              {selectedProduct.category}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {selectedProduct.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {selectedProduct.description}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
              <p><strong>Dosage Cadence:</strong> {selectedProduct.dosage}</p>
              <p><strong>Circadian Timing:</strong> {selectedProduct.schedule.join(", ")}</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-xl font-black text-slate-900">
                ${selectedProduct.price.toFixed(2)}
              </span>
              <button
                onClick={() => {
                  handleAdd(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all"
              >
                {selectedProduct.isRx ? "Upload Prescription & Order" : "Add to Dispensary Bag"}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
