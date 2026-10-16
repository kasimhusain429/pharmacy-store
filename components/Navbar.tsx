"use client";

import React, { useState } from "react";
import { 
  FileText, 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface NavbarProps {
  onOpenPrescriptionModal: () => void;
  cartCount?: number;
}

export default function Navbar({ onOpenPrescriptionModal, cartCount = 0 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

  const NAV_LINKS = [
    { label: "Home", href: "#hero" },
    { label: "Prescription", href: "#prescription-flip" },
    { label: "Consultation", href: "#pharmacist-consult" },
    { label: "Daily Routine", href: "#editorial-routine" },
    { label: "Dispensary", href: "#explore-dispensary" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 lg:px-12 pt-3 pb-2 transition-all duration-300">
      <nav className="mx-auto max-w-7xl flex items-center justify-between py-2 px-4 sm:px-6 rounded-full bg-[#06110f]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform border border-emerald-500/30">
            {/* 4-leaf medical cross / clover icon */}
            <svg className="w-5 h-5 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 2a4 4 0 0 0-4 4v2H6a4 4 0 0 0-4 4 4 4 0 0 0 4 4h2v2a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-2h2a4 4 0 0 0 4-4 4 4 0 0 0-4-4h-2V6a4 4 0 0 0-4-4z" />
            </svg>
          </div>
          <span className="font-semibold text-base sm:text-lg tracking-tight text-white">
            Pharmacy <span className="font-normal text-emerald-300/80">Store</span>
          </span>
        </a>

        {/* Center Minimalist Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-zinc-300">
          {NAV_LINKS.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setActiveNav(item.label)}
                className={`relative py-1 transition-colors ${isActive ? "text-emerald-300 font-semibold" : "hover:text-white"}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Prescription Upload */}
          <button
            onClick={onOpenPrescriptionModal}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            title="Upload Prescription (Rx)"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload Rx</span>
          </button>

          {/* Order Now Primary Pill Button */}
          <a
            href="#explore-dispensary"
            className="flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#86efac] hover:bg-[#6ee7b7] text-slate-950 transition-all shadow-md shadow-emerald-950/30 transform hover:-translate-y-0.5"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Circular Cart Button with Badge */}
          <a 
            href="#explore-dispensary"
            className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 border border-white/15 text-zinc-300 hover:text-white transition-all active:scale-95"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-400 text-[10px] font-bold text-slate-950">
                {cartCount}
              </span>
            )}
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-auto max-w-7xl rounded-2xl p-4 bg-[#081512]/95 border border-white/10 space-y-3 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              onClick={() => {
                setActiveNav(link.label);
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-medium text-zinc-200 hover:text-emerald-300 py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrescriptionModal();
              }}
              className="w-full flex items-center justify-between text-sm font-medium text-zinc-200 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Upload Prescription (Rx)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                Doctor Rx
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
