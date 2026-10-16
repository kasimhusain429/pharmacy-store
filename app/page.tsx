"use client";

import React, { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PrescriptionFlipSection from "@/components/PrescriptionFlipSection";
import ConsultationSection from "@/components/ConsultationSection";
import DailyRoutineSection from "@/components/DailyRoutineSection";
import DispensaryGridSection from "@/components/DispensaryGridSection";
import PrescriptionModal from "@/components/PrescriptionModal";
import GreenScreenPromptModal from "@/components/GreenScreenPromptModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeTimeline, setActiveTimeline] = useState<string>("dawn");
  const [isPreloading, setIsPreloading] = useState(true);

  const handleAddToCart = (productTitle: string, price: number) => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#06110f] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-slate-950">
      {/* Premium Reference Preloader with Smooth Transition */}
      {isPreloading && (
        <Preloader onComplete={() => setIsPreloading(false)} />
      )}

      {/* Top Pharmacy Navigation */}
      <Navbar 
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)}
        cartCount={cartCount}
      />

      {/* Hero Section: 3D Amber Glass Medicine Bottle & Dynamic Capsules */}
      <HeroSection 
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)} 
      />

      {/* Prescription Intake & Blister Purity Verification */}
      <PrescriptionFlipSection 
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)}
      />

      {/* Direct Clinical Telehealth Consultation */}
      <ConsultationSection 
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)}
      />

      {/* Chronobiological Regimen: 7-Day Pill Organizer */}
      <DailyRoutineSection 
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)}
        activeTime={activeTimeline}
        onTimeChange={setActiveTimeline}
      />

      {/* Dispensary Catalog & Products */}
      <DispensaryGridSection 
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)}
        onAddToCart={handleAddToCart}
        activeTimeline={activeTimeline}
        onTimeChange={setActiveTimeline}
      />

      {/* Clinical Accreditation & Pharmacy Footer */}
      <Footer 
        onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)} 
        onReplayPreloader={() => setIsPreloading(true)}
      />

      {/* Prescription Upload & Verification Modal */}
      <PrescriptionModal 
        isOpen={prescriptionModalOpen} 
        onClose={() => setPrescriptionModalOpen(false)} 
      />

      {/* Green-Screen Video Generation Prompts Hub */}
      <GreenScreenPromptModal />
    </main>
  );
}
