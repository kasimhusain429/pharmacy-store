"use client";

import React, { useState } from "react";
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileCheck,
  Clock,
  Lock
} from "lucide-react";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrescriptionModal({ isOpen, onClose }: PrescriptionModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadStatus("uploading");
    setTimeout(() => {
      setUploadStatus("success");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl glass-panel bg-[#090e12]/95 border border-emerald-500/20 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Prescription Verification (Rx)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mandatory for Rx Meds
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              In strict accordance with pharmacy regulations, prescription-only medications require a valid, licensed physician prescription prior to dispensing.
            </p>
          </div>
        </div>

        {uploadStatus === "success" ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Prescription Submitted for Review</h4>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Our clinical pharmacist is currently verifying your document (License ID: <strong className="text-emerald-400">#RX-88219</strong>). You will receive an SMS confirmation within 10 minutes.
            </p>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 inline-block font-mono">
              Rx Reference: RX-{Math.floor(100000 + Math.random() * 900000)}
            </div>
            <div>
              <button
                onClick={() => {
                  setUploadStatus("idle");
                  setSelectedFile(null);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors"
              >
                Continue to Store
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-5">
            {/* Regulatory Checklist Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 text-xs text-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Prescription Requirements Checklist:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-6 list-disc text-zinc-300 text-[11px]">
                <li>Patient full name matching account</li>
                <li>Registered Doctor&apos;s signature & license number</li>
                <li>Date of issue (within last 6 months)</li>
                <li>Legible drug name, dosage, and duration</li>
              </ul>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-emerald-400 bg-emerald-500/10"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/10 hover:border-emerald-500/30 bg-black/30"
              }`}
            >
              <input
                type="file"
                id="prescription-file"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5 justify-center">
                      <FileCheck className="w-4 h-4" />
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to verify
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-zinc-200">
                      Drag & drop your prescription, or <span className="text-emerald-400 underline underline-offset-2">browse file</span>
                    </p>
                    <p className="text-[11px] text-zinc-500">Supports PDF, JPG, PNG up to 15MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Patient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Patient Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Verification Phone / SMS <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Privacy & Pharmacist Guarantee */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/5 pt-3">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                256-bit HIPAA Encrypted Medical Vault
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Reviewed in &lt;15 mins
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || uploadStatus === "uploading"}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedFile
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20"
                    : "bg-white/10 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {uploadStatus === "uploading" ? "Verifying with Pharmacist..." : "Submit Prescription"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
