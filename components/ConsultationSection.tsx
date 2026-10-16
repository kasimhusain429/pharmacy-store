"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Clock, 
  Paperclip,
  Check,
  Stethoscope,
  Lock,
  MoreHorizontal,
  Zap,
  ArrowRight,
  Pill,
  Calendar,
  AlertTriangle,
  Sparkles,
  MessageSquare
} from "lucide-react";

interface ConsultationSectionProps {
  onOpenPrescriptionModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "pharmacist";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "user",
    text: "Can I take this with food?",
    timestamp: "2:14 PM"
  },
  {
    id: "msg-2",
    sender: "pharmacist",
    text: "Please follow the instructions on your prescription. I can review the medication details with you.",
    timestamp: "2:15 PM"
  }
];

const TOPIC_CHIPS = [
  { id: "interactions", label: "Drug interactions", icon: Pill, prompt: "Are there any known drug interactions with my medication?" },
  { id: "missed", label: "Missed dose", icon: Calendar, prompt: "What should I do if I missed my morning dose?" },
  { id: "side-effects", label: "Possible side effects", icon: ShieldCheck, prompt: "What are the common side effects and precautions?" }
];

export default function ConsultationSection({ onOpenPrescriptionModal }: ConsultationSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Context-aware intelligent clinical pharmacist replies
    setTimeout(() => {
      let reply = "Every dose is verified by our licensed clinical team. Please refer to your personalized dosage slip.";
      const lower = text.toLowerCase();
      
      if (lower.includes("food") || lower.includes("eat") || lower.includes("meal")) {
        reply = "Taking this with meals reduces GI sensitivity. Swallow whole with a full glass of water 15–30 minutes post-meal.";
      } else if (lower.includes("interaction") || lower.includes("contra") || lower.includes("drug")) {
        reply = "Our cross-referencing system shows no critical contraindications with daily supplements. Separate calcium or antacids by at least 2 hours.";
      } else if (lower.includes("miss") || lower.includes("skip") || lower.includes("forgot")) {
        reply = "If you remember within 4 hours, take the dose immediately. If your next scheduled window is near, skip it. Never double up doses.";
      } else if (lower.includes("side effect") || lower.includes("drowsy") || lower.includes("nausea")) {
        reply = "Mild drowsiness or dryness can occur in the initial 48 hours. If symptoms persist past 3 days, our clinical team will adjust the regimen.";
      }

      const pharmacistMsg: ChatMessage = {
        id: "msg-" + Date.now() + 1,
        sender: "pharmacist",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, pharmacistMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleChipClick = (chip: typeof TOPIC_CHIPS[0]) => {
    setActiveChip(chip.id);
    handleSend(chip.prompt);
  };

  return (
    <section 
      id="pharmacist-consult" 
      className="relative w-full min-h-screen py-16 sm:py-24 px-4 sm:px-8 lg:px-14 overflow-hidden flex flex-col justify-center select-none"
    >
      {/* 1. PHOTOREALISTIC APOTHECARY BACKGROUND WITH MARBLE COUNTER & BOKEH GLASSWARE */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('/consultation_apothecary_bg.jpg')" }}
      />

      {/* 2. AMBIENT LUXURY GLASS GRADIENT OVERLAYS (Enhances contrast while letting marble counter shine) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-[#eef4f0]/95 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-emerald-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-teal-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10">
          
          {/* Left Title & Subtitle with Horizontal Connector Line */}
          <div className="flex-1 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-emerald-800/80 uppercase block mb-1">
              Licensed Telehealth • Board-Certified Pharmacists
            </span>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 leading-[1.05]">
              Direct Clinical <br />
              <span className="font-serif italic font-normal text-[#0c4a34]">
                Consultation
              </span>
            </h2>

            {/* Horizontal Line Connector + Explanatory Text */}
            <div className="flex items-center gap-4 mt-4">
              <span className="w-12 h-[1.5px] bg-emerald-700/40 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Connect directly with clinical specialists for prescription reviews, dosage guidance, and medication therapy management.
              </p>
            </div>
          </div>

          {/* Right Status Badges: Pharmacist On Duty + 24/7 Clinical Support (Exact Match to Reference) */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
            
            {/* Badge 1: Pharmacist On Duty */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.04)] text-left">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <div className="leading-tight">
                <span className="block text-xs font-bold text-slate-900">
                  Pharmacist on duty
                </span>
                <span className="block text-[10px] text-emerald-700 font-medium">
                  Available now
                </span>
              </div>
            </div>

            {/* Badge 2: 24/7 Clinical Support with 3 Doctor Avatars */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white overflow-hidden relative">
                  <Image src="/dr_sarah_chen.jpg" alt="Pharmacist" fill className="object-cover" />
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white overflow-hidden relative">
                  <Image src="/doctor_portrait.jpg" alt="Pharmacist" fill className="object-cover" />
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white overflow-hidden relative bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-800">
                  <span>+4</span>
                </div>
              </div>
              <div className="leading-tight text-left">
                <span className="block text-xs font-bold text-slate-900">
                  24/7
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  Clinical Support
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* ===================================================================== */}
        {/* MAIN STAGE: LEFT DOCTOR PROFILE CARD & RIGHT LIVE TERMINAL            */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ------------------------------------------------------------------- */}
          {/* LEFT COLUMN: DR. SARAH CHEN, PHARMD CARD (Exact Match to Mockup)    */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-[32px] bg-white/75 backdrop-blur-2xl p-6 sm:p-7 border border-white/90 shadow-[0_25px_50px_-12px_rgba(6,30,22,0.08)] hover:shadow-[0_30px_60px_-15px_rgba(6,30,22,0.12)] transition-all duration-500 group relative overflow-hidden">
            
            {/* Soft Ambient Inner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Doctor Portrait Image Container with Floating Verification Badge */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/60 mb-5">
                <Image
                  src="/dr_sarah_chen.jpg"
                  alt="Dr. Sarah Chen, PharmD"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  priority
                />

                {/* Floating Exact Pill Badge: [✓ Pharmacist verified] */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200/80 shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                  <span className="text-[11px] font-bold text-slate-900 tracking-tight">
                    Pharmacist verified
                  </span>
                </div>
              </div>

              {/* Doctor Credentials & Name */}
              <div className="text-center px-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Dr. Sarah Chen, PharmD
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                  Head of Clinical Verification
                </p>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  License # RPh-58241 • Board Certified • 8+ Years Experience
                </p>
              </div>

              {/* Telemetry Metrics Row (Response Time & Precision Review) */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                
                {/* Metric 1: Response Time */}
                <div className="p-3.5 rounded-2xl bg-white/60 border border-slate-100 shadow-2xs text-left flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Response time
                    </span>
                    <span className="block text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      &lt; 45 seconds
                    </span>
                  </div>
                </div>

                {/* Metric 2: Precision Review */}
                <div className="p-3.5 rounded-2xl bg-white/60 border border-slate-100 shadow-2xs text-left flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Precision review
                    </span>
                    <span className="block text-sm sm:text-base font-bold text-emerald-700 mt-0.5">
                      99.98% Accuracy
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Primary Action Button (Exact Match: Request Prescription Review with Circular Arrow) */}
            <div className="mt-6 pt-2">
              <button
                onClick={onOpenPrescriptionModal}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#0a231c] via-[#0c3328] to-[#0a231c] hover:from-[#081a15] hover:to-[#081a15] text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-950/25 transform hover:-translate-y-0.5 transition-all cursor-pointer group/btn"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Request Prescription Review</span>
                </div>
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 group-hover/btn:bg-emerald-500 group-hover/btn:text-slate-950 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: DISPENSARY LIVE TERMINAL CHAT (Exact Match to Mockup)  */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col rounded-[32px] bg-white/80 backdrop-blur-2xl border border-white/95 shadow-[0_25px_50px_-12px_rgba(6,30,22,0.08)] overflow-hidden">
            
            {/* Terminal Header Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-200">
                    <Image
                      src="/dr_sarah_chen.jpg"
                      alt="Dr. Sarah Chen"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    Dispensary Live Terminal
                  </h4>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Secure clinical channel • Encrypted &amp; HIPAA-compliant
                  </p>
                </div>
              </div>

              {/* Right Lock Status & Menu Options */}
              <div className="flex items-center gap-3 text-xs">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>Encrypted connection</span>
                </div>
                <button 
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Session Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Messages Area */}
            <div 
              ref={chatScrollRef}
              className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[360px] min-h-[280px] bg-gradient-to-b from-transparent to-slate-50/40"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-in fade-in duration-200`}
                  >
                    <div className="flex items-end gap-2.5 max-w-[85%] sm:max-w-[78%]">
                      {/* Pharmacist Avatar Bubble */}
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-emerald-200 mb-1">
                          <Image
                            src="/dr_sarah_chen.jpg"
                            alt="Dr. Sarah Chen"
                            width={28}
                            height={28}
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Bubble Container */}
                      <div>
                        <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? "bg-[#0b1b24] text-white rounded-tr-none shadow-md shadow-slate-900/10 font-normal"
                            : "bg-[#eaf5ee] text-slate-900 rounded-tl-none border border-emerald-200/70 shadow-2xs font-normal"
                        }`}>
                          {msg.text}
                        </div>

                        {/* Timestamp & Status */}
                        <div className={`flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1 ${isUser ? "justify-end" : "justify-start"}`}>
                          <span>{msg.timestamp}</span>
                          {isUser && (
                            <span className="text-emerald-500 font-bold ml-0.5">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Bubble */}
              {isTyping && (
                <div className="flex items-end gap-2.5 animate-in fade-in duration-150">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-emerald-200 mb-1">
                    <Image
                      src="/dr_sarah_chen.jpg"
                      alt="Dr. Sarah Chen"
                      width={28}
                      height={28}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#eaf5ee] border border-emerald-200/70 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Topic Chips (Drug Interactions, Missed Dose, Possible Side Effects) */}
            <div className="px-6 py-2.5 border-t border-slate-100 bg-white/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {TOPIC_CHIPS.map((chip) => {
                const Icon = chip.icon;
                const isSelected = activeChip === chip.id;

                return (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip)}
                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border-slate-200/80"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Frosted Message Input Bar */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2.5 bg-slate-50/90 rounded-full p-2 pl-4 border border-slate-200/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white transition-all shadow-inner"
              >
                {/* Attachment / Paperclip Icon */}
                <button
                  type="button"
                  onClick={onOpenPrescriptionModal}
                  className="p-1 rounded-full text-slate-400 hover:text-emerald-700 transition-colors"
                  title="Attach Prescription or Lab Document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a clinical question..."
                  className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />

                {/* Dark Emerald Circular Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0a231c] hover:bg-[#0c3328] text-white transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
