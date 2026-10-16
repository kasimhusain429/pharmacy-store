"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Film, 
  Sliders, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Video,
  Play,
  RotateCcw,
  Eye
} from "lucide-react";

export interface VideoPromptSpec {
  id: string;
  sceneNumber: string;
  title: string;
  productTarget: string;
  duration: string;
  aspectRatio: string;
  fps: string;
  cameraMovement: string;
  prompt: string;
  negativePrompt: string;
  keyingTips: string[];
}

export const VIDEO_PROMPT_LIBRARY: VideoPromptSpec[] = [
  {
    id: "hero-opening",
    sceneNumber: "Scene 1 (0.0s – 2.0s)",
    title: "Opening Hero: Kinetic Apothecary Amber Bottle & Bursting Capsules",
    productTarget: "Pharmaceutical amber glass medicine bottle (with white minimalist label and white screw cap) & bi-colored capsules (emerald green/white and coral/white).",
    duration: "2.5 – 3.0 seconds",
    aspectRatio: "16:9 widescreen (or 9:16 vertical for mobile)",
    fps: "24 or 30 fps",
    cameraMovement: "Front-facing three-quarter commercial macro lens (85mm), static eye-level camera with gentle cinematic slow-motion.",
    prompt: "Commercial 3D product animation against a flat, solid, unlit pure chroma green background (hex #00FF00, RGB 0, 255, 0). In center-frame, a photorealistic translucent amber glass apothecary pill bottle with a clean white rectangular label and white cap is tilted 15 degrees to the left in mid-air. From the open neck of the bottle, twelve glossy medical capsules smoothly erupt upwards and float gracefully outward with realistic zero-gravity and gentle air-resistance drift. Half of the capsules are bi-colored emerald-green and opaque white; several are coral-rose and white. The capsules tumble and rotate slowly in 3D space with natural momentum and subtle physics. Pristine studio product key lighting from top-right, soft white highlights tracing the rim and bevels of the glass, crisp sharp edges with zero shadows and zero green spill cast onto the green background. Photorealistic 8k, hyper-detailed commercial render.",
    negativePrompt: "gradient background, textured background, shadows on the green screen, color bleed, green bounce on glass, motion blur on silhouettes, cartoon, CGI flaws, floating dust particles, floor reflections.",
    keyingTips: [
      "Ensure the green background is completely flat and evenly lit in your prompt so Premiere/After Effects Ultra Key achieves 100% clean alpha in one click.",
      "The amber glass has slight transmission; set spill suppressor to 'Desaturate' or 'Neutralize' in your video editing software to preserve amber tone.",
      "Capsules have white tips; keep the keying color strictly to pure chroma green #00FF00 so white caps remain pristine."
    ]
  },
  {
    id: "hero-pedestal-halo",
    sceneNumber: "Scene 1 Transition (1.8s – 2.2s)",
    title: "Opening Transition: Marble Pedestal & Glowing Circular Neon Ring Halo",
    productTarget: "Amber medicine bottle resting on a white marble cylindrical pedestal with an upright glowing neon circular ring behind it.",
    duration: "2.0 – 2.5 seconds",
    aspectRatio: "16:9 widescreen",
    fps: "24 fps",
    cameraMovement: "Subtle slow push-in (dolly forward 5%), centered focal framing.",
    prompt: "Commercial 3D product animation on a solid, pure chroma green background (#00FF00). Centered in frame is a low cylindrical white Carrara marble pedestal with faint grey veining. An amber glass medicine bottle with clean white label sits elegantly on the pedestal. Directly behind the bottle is a thin, upright circular neon halo ring glowing with vibrant mint-green and clean white light. As the ring illuminates with a soft electrical pulse, five emerald-and-white capsules fall with realistic gravitational acceleration and gently bounce and settle on the marble surface. Studio lighting from above, perfectly sharp silhouette against the flat green background, zero background shadows, crisp edges suitable for chroma-key extraction. 8k, hyperrealistic commercial.",
    negativePrompt: "shadows on green, green light spill on white marble, noisy background, ambient occlusion on green, low resolution, warped geometry.",
    keyingTips: [
      "The neon ring emits green/white light; keep the background #00FF00 pure so keying software separates the glowing ring element cleanly.",
      "Use an additive or screen blend mode on the neon glow layer in editing if you wish to let background elements show through the ring's interior."
    ]
  },
  {
    id: "prescription-flip",
    sceneNumber: "Scene 2 / Scene 3 (2.5s – 4.2s)",
    title: "Lead Animation: 'The Flip' (Rx Paper Folding into Macro Blister Pack)",
    productTarget: "Official paper medical prescription sheet folding/rolling and morphing into an embossed metallic foil & transparent blister pack with sealed capsule.",
    duration: "3.0 – 3.5 seconds",
    aspectRatio: "16:9 widescreen",
    fps: "24 fps",
    cameraMovement: "Camera tracks the kinetic flip of the paper, then executes a smooth cinematic macro push-in focusing closely on the blister bubble.",
    prompt: "Commercial 3D kinetic transition against a solid, untextured pure chroma green background (#00FF00). An official medical prescription paper document with Rx symbol, stamped text lines, and clinical watermarks floats upright in 3D space. The bottom edge of the paper curls upward and gracefully folds and flips forward 180 degrees with realistic tactile paper bending physics. As the paper rolls and flips over in mid-air, the paper seamlessly transforms into a sleek pharmaceutical blister pack made of embossed reflective silver aluminum foil backing and a clear molded plastic blister bubble. Sealed inside the blister pocket is a glossy emerald-green and white capsule with micro water droplets on the clear plastic dome. The camera smoothly zooms into a macro close-up view of the metallic blister grid pattern and the pristine capsule. Razor-sharp silhouette edges, flat green background, zero green light bounce on the paper. 8k photorealistic.",
    negativePrompt: "green tint on white paper, shadows cast onto green screen, tearing paper, jagged edges, low resolution, distorted text.",
    keyingTips: [
      "Paper is crisp white: ensure prompt specifies 'zero green light bounce on white paper' so edges key cleanly without fringe.",
      "The metallic foil reflection looks best when composited with a subtle drop shadow onto the light mint-white webpage background."
    ]
  },
  {
    id: "daily-routine-box",
    sceneNumber: "Scene 4: Editorial 6 (5.8s – 7.2s)",
    title: "Editorial 6: 7-Day Translucent Pill Organizer Sequential Lid Wave",
    productTarget: "Modern translucent frosted mint-green 7-compartment weekly pill organizer tray (Monday–Sunday) with bi-color green/white capsules.",
    duration: "2.5 – 3.0 seconds",
    aspectRatio: "16:9 widescreen",
    fps: "24 fps",
    cameraMovement: "Static 35-degree isometric angle, gentle slow rotation of 4 degrees clockwise.",
    prompt: "Commercial 3D product showcase on a pure solid chroma green background (#00FF00). An ultra-modern 7-compartment weekly pill organizer made of translucent frosted mint-green polymer is positioned at a 35-degree isometric perspective. Inside each of the seven compartments rests two glossy emerald-green and white capsules. Starting from the Monday compartment on the left to the Sunday compartment on the right, all seven clear transparent snap lids flip open in a rapid, fluid sequential wave from left to right, clicking into their upright resting positions. Frosted plastic translucency, glossy capsule gelatin reflections, clean medical aesthetic. Lit by soft studio softbox lighting from above and front, perfectly even unlit green background with zero shadows cast on the green, razor-sharp outlines for chroma-key extraction. 8k commercial quality.",
    negativePrompt: "shadows on green screen, green spill on transparent lids, cloudy plastic, jitter, uneven background color.",
    keyingTips: [
      "The pill organizer has translucent mint-green walls; in After Effects/Premiere, use Keylight or Ultra Key with 'Aggressive' cleanup on edges.",
      "This matches the exact screenshot provided in the project!"
    ]
  },
  {
    id: "pharmacist-avatar",
    sceneNumber: "Scene 5 (4.2s – 5.8s)",
    title: "Scene 5: Pharmacist Consultation Video Avatar (Dr. Sarah Chen, PharmD)",
    productTarget: "Friendly female clinical pharmacist in white doctor coat with stethoscope, speaking reassuringly.",
    duration: "3.0 – 4.0 seconds (loopable)",
    aspectRatio: "1:1 square (or 16:9)",
    fps: "24 fps",
    cameraMovement: "Static portrait shot, chest-up framing, eye-level lens.",
    prompt: "Professional video portrait against a solid, flat chroma green studio background (#00FF00). A friendly, confident 35-year-old female clinical pharmacist with brown hair, stylish modern glasses, and a warm welcoming smile. She wears a crisp white doctor lab coat over a dark emerald-green clinical scrub shirt, with a modern black stethoscope draped around her neck. She looks directly into the camera, speaks reassuringly with natural lip synchronization, nods gently, and performs a subtle welcoming hand gesture. Clean studio lighting, bright clear catchlights in her eyes, sharp hair edges against the flat green background, zero green spill on her white coat. 8k broadcast quality.",
    negativePrompt: "green fringing on hair, shadows on green background, artificial movement, exaggerated expressions, blurry.",
    keyingTips: [
      "Use 'Refine Soft Matte' or 'Spill Suppressor' on hair strands to retain natural hair definition against the white website card.",
      "Matches the exact portrait and layout of the consultation card."
    ]
  },
  {
    id: "closing-hero-ecg",
    sceneNumber: "Scene 6 (8.5s – 10.0s)",
    title: "Closing Hero: Amber Bottle on Pedestal with Glowing ECG Heartbeat Lifeline",
    productTarget: "Amber glass medicine bottle on white circular marble podium with animated pulsing neon electric-green heartbeat ECG waveform.",
    duration: "2.5 – 3.0 seconds",
    aspectRatio: "16:9 widescreen",
    fps: "24 fps",
    cameraMovement: "Slow cinematic pull-back (dolly back 10%), centered symmetric framing.",
    prompt: "Cinematic commercial product animation against a flat, solid chroma green background (#00FF00). An amber glass pharmaceutical medicine bottle with a minimalist white rectangular label and white cap stands steadily on a circular white marble pedestal. In the space directly behind the bottle, an electric neon emerald-green ECG heartbeat pulse waveform line sweeps continuously from left to right with glowing electrical pulse peaks. The bottle slowly rotates 10 degrees clockwise while the camera gently draws back. Crisp studio rim lighting defining the bottle's amber contours, sharp separation between the objects and the green background, zero shadows on the green. 8k photorealistic pharmaceutical commercial.",
    negativePrompt: "green light bleed onto background, shadows cast on green screen, flickering, low fidelity, cartoon.",
    keyingTips: [
      "The electric-green ECG line matches the green glow; when keying, ensure you key only the background hue (#00FF00), preserving the bright neon pulse glow.",
      "Perfect for the outro section 'Care That Comes to You'."
    ]
  }
];

export default function GreenScreenPromptModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<VideoPromptSpec>(VIDEO_PROMPT_LIBRARY[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (e: any) => {
      setIsOpen(true);
      if (e.detail?.scene) {
        const found = VIDEO_PROMPT_LIBRARY.find((s) => s.id.includes(e.detail.scene));
        if (found) setSelectedSpec(found);
      }
    };

    window.addEventListener("open-video-prompts", handleOpen);
    return () => window.removeEventListener("open-video-prompts", handleOpen);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1714] text-slate-100 rounded-3xl max-w-5xl w-full h-[90vh] max-h-[850px] shadow-2xl border border-emerald-500/30 flex flex-col overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Green-Screen Video Generation Prompts</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00FF00] text-black">
                  #00FF00 CHROMA
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Tailored prompts for Runway Gen-3, Luma Dream Machine, Kling AI, and Sora
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Sidebar (Scene Selector) | Right Main Spec View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Scene Navigator (4 Cols) */}
          <div className="md:col-span-4 border-r border-emerald-500/15 p-4 overflow-y-auto space-y-2 bg-black/20">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 px-2 tracking-wider block mb-2">
              Select Reference Animation
            </span>

            {VIDEO_PROMPT_LIBRARY.map((spec) => {
              const isSelected = selectedSpec.id === spec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpec(spec)}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex flex-col gap-1 border ${
                    isSelected
                      ? "bg-emerald-500/20 border-emerald-400/50 text-white shadow-sm"
                      : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">{spec.sceneNumber}</span>
                    <span className="text-zinc-500">{spec.duration}</span>
                  </div>
                  <h4 className="text-xs font-semibold leading-tight line-clamp-2">
                    {spec.title}
                  </h4>
                </button>
              );
            })}

            {/* Quick Editing Guide Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-zinc-300 space-y-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Chroma-Key Extraction Workflow
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Import generated MP4 into Premiere Pro (Ultra Key), After Effects (Keylight), or CapCut (Chroma Key). Select color picker on <strong className="text-emerald-300">#00FF00</strong> to make background 100% transparent.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Prompt Display & 1-Click Copy (8 Cols) */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-[#0b1714] to-[#06100d]">
            
            {/* Title & Metadata Strip */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span>{selectedSpec.sceneNumber}</span>
                <span>•</span>
                <span>Target: {selectedSpec.duration}</span>
                <span>•</span>
                <span>Aspect: {selectedSpec.aspectRatio}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {selectedSpec.title}
              </h3>
              <p className="text-xs text-zinc-300 mt-1">
                <strong>Product Target:</strong> {selectedSpec.productTarget}
              </p>
            </div>

            {/* Primary Generation Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Positive Video Generation Prompt
                </span>
                <button
                  onClick={() => copyToClipboard(selectedSpec.prompt, "prompt-" + selectedSpec.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer"
                >
                  {copiedId === "prompt-" + selectedSpec.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Prompt!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 font-mono text-xs sm:text-sm text-emerald-100 leading-relaxed select-all">
                {selectedSpec.prompt}
              </div>
            </div>

            {/* Negative Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Negative Prompt (Avoid Artifacts)
                </span>
                <button
                  onClick={() => copyToClipboard(selectedSpec.negativePrompt, "neg-" + selectedSpec.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                >
                  {copiedId === "neg-" + selectedSpec.id ? (
                    <>
                      <Check className="w-3 h-3 text-rose-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Negative</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/20 font-mono text-xs text-rose-200/90 leading-relaxed">
                {selectedSpec.negativePrompt}
              </div>
            </div>

            {/* Camera & Production Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Camera &amp; Lens Setup</span>
                <span className="font-semibold text-white mt-1 block">{selectedSpec.cameraMovement}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Frame Rate &amp; Output</span>
                <span className="font-semibold text-white mt-1 block">{selectedSpec.fps} • Pro-Res / MP4 (H.264)</span>
              </div>
            </div>

            {/* Chroma-Keying Pro Tips */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Post-Production Keying Guidelines
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {selectedSpec.keyingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 bg-black/30 text-xs text-zinc-400">
          <span>Solid #00FF00 Green Screen specification conforms to broadcast chroma standards.</span>
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all ml-auto"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
