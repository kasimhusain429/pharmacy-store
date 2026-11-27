"use client";

import { CanvasTexture, SRGBColorSpace } from "three";
import { getCategory, type Product } from "@/lib/catalog";
import { store } from "@/lib/store";

/**
 * Prints packaging artwork onto canvases used as textures on the Blender
 * label meshes. All artwork is generic store packaging: no real brand's
 * trade dress is imitated.
 *
 * Label meshes are UV-wrapped 0..1 around the circumference. FRONT_U is the
 * u coordinate that faces the camera when the model has no rotation.
 */
export const FRONT_U = 0.75;

const PAPER = "#f7f6f1";
const INK = "#16241e";
const INK_2 = "#4a5852";

export type LabelKind = "bottle" | "dropper" | "jar" | "spray" | "carton-front" | "carton-side";

let family = "";
export function labelFont() {
  if (family) return family;
  if (typeof document === "undefined") return "sans-serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim();
  family = v || "system-ui, sans-serif";
  return family;
}

export async function ensureLabelFonts() {
  if (typeof document === "undefined") return;
  const f = labelFont();
  try {
    await Promise.all([document.fonts.load(`600 48px ${f}`), document.fonts.load(`400 32px ${f}`), document.fonts.load(`500 32px ${f}`)]);
  } catch {
    /* fall back to system font */
  }
}

type Ctx = CanvasRenderingContext2D & { fontStretch?: string; letterSpacing?: string };

function font(ctx: Ctx, weight: number, px: number, stretch: "normal" | "expanded" | "semi-expanded" | "condensed" = "normal") {
  ctx.font = `${weight} ${px}px ${labelFont()}`;
  if ("fontStretch" in ctx) ctx.fontStretch = stretch;
}

/** Draw text shrinking it until it fits maxWidth. Returns the size used. */
function fitText(ctx: Ctx, text: string, x: number, y: number, maxWidth: number, weight: number, px: number, stretch: Parameters<typeof font>[3] = "normal", min = 18) {
  let size = px;
  font(ctx, weight, size, stretch);
  while (ctx.measureText(text).width > maxWidth && size > min) {
    size -= 2;
    font(ctx, weight, size, stretch);
  }
  ctx.fillText(text, x, y);
  return size;
}

function wrapText(ctx: Ctx, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 3) {
  const words = text.split(/\s+/);
  let line = "";
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      lines++;
      line = words[i];
      if (lines >= maxLines) return lines;
    } else line = test;
  }
  if (line) {
    ctx.fillText(line, x, y + lines * lineHeight);
    lines++;
  }
  return lines;
}

function hairline(ctx: Ctx, x0: number, x1: number, y: number, color = INK, alpha = 0.35, w = 2) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.restore();
}

function guilloche(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, alpha = 0.12) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1.2;
  for (let k = -4; k < h / 9 + 4; k++) {
    ctx.beginPath();
    for (let i = 0; i <= w; i += 8) {
      const yy = y + k * 9 + 10 * Math.sin((i / 160) * Math.PI * 2 + k * 0.4) + 3 * Math.sin((i / 40) * Math.PI * 2 + k);
      if (i === 0) ctx.moveTo(x + i, yy);
      else ctx.lineTo(x + i, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export type LabelSpec = {
  product?: Product;
  /** For the hero bottle: a generic dispensing label. */
  generic?: boolean;
  /** 0..1: how much of the dispensing label has been "printed" (prescription chapter). */
  printed?: number;
};

function bandFor(p?: Product) {
  return p ? (getCategory(p.category)?.band ?? INK) : "#7a2418";
}

/** Dispensing / supplement label for the amber bottle. Canvas maps to the full wrap. */
function drawBottle(ctx: Ctx, W: number, H: number, spec: LabelSpec) {
  const p = spec.product;
  const band = bandFor(p);
  const cx = W * FRONT_U;
  const half = 250;
  const x0 = cx - half;
  const x1 = cx + half;
  const printed = spec.printed ?? 1;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  guilloche(ctx, 0, 0, W, H, band, 0.06);

  // band across the top of the whole wrap
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, 70);
  ctx.fillStyle = PAPER;
  ctx.textBaseline = "middle";
  font(ctx, 600, 30, "expanded");
  ctx.fillText(store.name, x0, 36);
  font(ctx, 500, 24, "condensed");
  const tag = p?.requiresPrescription || spec.generic ? "Prescription medicine" : getCategory(p?.category ?? "vitamins")?.name ?? "";
  ctx.textAlign = "right";
  ctx.fillText(tag, x1, 36);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const rx = spec.generic || p?.requiresPrescription;
  if (rx) {
    // Pharmacy dispensing label. Personal fields stay blank lines: they are printed in-store.
    const rows = [
      () => {
        ctx.fillStyle = INK;
        fitText(ctx, spec.generic ? "Your prescription" : p!.name, x0, 150, half * 2, 600, 50, "expanded");
      },
      () => {
        ctx.fillStyle = INK_2;
        fitText(ctx, spec.generic ? "Prepared after a pharmacist check" : [p!.form, p!.strength].filter(Boolean).join(", "), x0, 200, half * 2, 400, 30);
      },
      () => {
        ctx.fillStyle = INK;
        font(ctx, 500, 26);
        wrapText(ctx, "Use exactly as directed by your prescriber.", x0, 252, half * 2, 32, 2);
      },
      () => {
        for (const [i, label] of ["Patient", "Prescriber", "Date dispensed"].entries()) {
          const y = 350 + i * 46;
          ctx.fillStyle = INK_2;
          font(ctx, 400, 24, "condensed");
          ctx.fillText(label, x0, y);
          hairline(ctx, x0 + 150, x1, y + 4, INK, 0.3);
        }
      },
      () => {
        ctx.fillStyle = INK_2;
        font(ctx, 400, 20, "condensed");
        ctx.fillText("Keep out of the reach and sight of children.", x0, H - 22);
      },
    ];
    const n = printed * rows.length;
    rows.forEach((draw, i) => {
      if (i + 1 <= n + 0.0001) draw();
      else if (i < n) {
        ctx.save();
        ctx.globalAlpha = n - i;
        draw();
        ctx.restore();
      }
    });
  } else if (p) {
    ctx.fillStyle = INK_2;
    font(ctx, 500, 28, "condensed");
    if (p.brand) ctx.fillText(p.brand, x0, 136);
    ctx.fillStyle = INK;
    fitText(ctx, p.name, x0, p.brand ? 200 : 180, half * 2, 600, 54, "expanded");
    ctx.fillStyle = INK_2;
    font(ctx, 400, 24);
    wrapText(ctx, p.ingredients ?? "", x0, 258, half * 2, 32, 3);
    hairline(ctx, x0, x1, 370, INK, 0.25);
    font(ctx, 500, 28);
    ctx.fillStyle = INK;
    ctx.fillText(p.form, x0, 418);
    ctx.fillStyle = INK_2;
    font(ctx, 400, 20, "condensed");
    ctx.fillText("Food supplement. Read the label before use.", x0, H - 22);
  }

  // generic barcode block on the side of the wrap
  const bx = cx + half + 160;
  ctx.fillStyle = INK;
  let x = bx;
  let seed = 7;
  for (let i = 0; i < 46; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 2 + (seed % 5);
    if (i % 2 === 0) ctx.fillRect(x, H - 190, w, 120);
    x += w + 2;
  }
}

function drawDropper(ctx: Ctx, W: number, H: number, spec: LabelSpec) {
  const p = spec.product!;
  const band = bandFor(p);
  const cx = W * FRONT_U;
  const half = 200;
  const x0 = cx - half;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = band;
  ctx.fillRect(0, H - 22, W, 22);
  ctx.fillStyle = INK_2;
  ctx.textBaseline = "alphabetic";
  fitText(ctx, p.brand ?? store.name, x0, 110, half * 2, 600, 28, "expanded");
  ctx.fillStyle = INK;
  font(ctx, 600, 46, "semi-expanded");
  const nameLines = wrapText(ctx, p.name, x0, 180, half * 2, 52, 2);
  const yRule = 180 + (nameLines - 1) * 52 + 36;
  hairline(ctx, x0, x0 + half * 2, yRule, INK, 0.3);
  ctx.fillStyle = INK_2;
  font(ctx, 400, 25);
  wrapText(ctx, p.ingredients ?? p.form, x0, yRule + 50, half * 2, 32, 3);
  if (p.requiresPrescription) {
    ctx.fillStyle = bandFor(p);
    font(ctx, 600, 26);
    ctx.fillText("Prescription only", x0, H - 56);
  } else {
    ctx.fillStyle = INK_2;
    font(ctx, 500, 24, "condensed");
    ctx.fillText(p.form, x0, H - 56);
  }
}

function drawJar(ctx: Ctx, W: number, H: number, spec: LabelSpec) {
  const p = spec.product!;
  const band = bandFor(p);
  const cx = W * FRONT_U;
  const half = 400;
  const x0 = cx - half;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, 10);
  ctx.fillRect(0, H - 10, W, 10);
  ctx.textBaseline = "middle";
  ctx.fillStyle = INK_2;
  font(ctx, 600, 30, "expanded");
  ctx.fillText(p.brand ?? store.name, x0, H * 0.28);
  ctx.fillStyle = INK;
  fitText(ctx, p.name, x0, H * 0.6, half * 2, 600, 62, "expanded");
  ctx.fillStyle = INK_2;
  fitText(ctx, p.ingredients ?? "", x0, H * 0.84, half * 2, 400, 24, "condensed");
}

function drawSpray(ctx: Ctx, W: number, H: number, spec: LabelSpec) {
  const p = spec.product!;
  const band = bandFor(p);
  const cx = W * FRONT_U;
  const half = 210;
  const x0 = cx - half;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, 130);
  ctx.fillStyle = PAPER;
  fitText(ctx, p.brand ?? store.name, x0, 82, half * 2, 600, 30, "expanded");
  ctx.fillStyle = INK;
  font(ctx, 600, 56, "expanded");
  const nl = wrapText(ctx, p.name, x0, 240, half * 2, 62, 2);
  ctx.fillStyle = INK_2;
  font(ctx, 400, 28);
  const sl = wrapText(ctx, p.summary, x0, 240 + nl * 62 + 20, half * 2, 36, 3);
  const yr = 240 + nl * 62 + 20 + sl * 36;
  hairline(ctx, x0, x0 + half * 2, yr, INK, 0.3);
  font(ctx, 400, 24, "condensed");
  wrapText(ctx, p.ingredients ?? "", x0, yr + 44, half * 2, 30, 3);
}

function drawCartonFront(ctx: Ctx, W: number, H: number, spec: LabelSpec) {
  const p = spec.product!;
  const band = bandFor(p);
  ctx.fillStyle = "#fbfbf8";
  ctx.fillRect(0, 0, W, H);
  // strength band, as on pharmaceutical cartons
  ctx.fillStyle = band;
  ctx.fillRect(0, H * 0.62, W, H * 0.1);
  guilloche(ctx, 0, H * 0.72, W, H * 0.28, band, 0.08);
  const x0 = 56;
  const maxW = W - 112;
  ctx.fillStyle = INK_2;
  font(ctx, 600, 40, "expanded");
  ctx.fillText(p.brand ?? store.name, x0, 120);
  ctx.fillStyle = INK;
  font(ctx, 600, 82, "expanded");
  const lines = wrapText(ctx, p.name, x0, 270, maxW, 92, 3);
  ctx.fillStyle = INK_2;
  font(ctx, 400, 38);
  wrapText(ctx, p.ingredients ?? p.summary, x0, 270 + lines * 92 + 30, maxW, 48, 3);
  ctx.fillStyle = "#fbfbf8";
  font(ctx, 600, 48, "expanded");
  ctx.textBaseline = "middle";
  ctx.fillText(p.strength ?? p.form, x0, H * 0.67);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK_2;
  font(ctx, 500, 32, "condensed");
  ctx.fillText(p.form + (p.size ? `, ${p.size}` : ""), x0, H - 70);
}

function drawCartonSide(ctx: Ctx, W: number, H: number, spec: LabelSpec) {
  const p = spec.product!;
  ctx.fillStyle = "#fbfbf8";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = bandFor(p);
  ctx.fillRect(0, H * 0.62, W, H * 0.1);
  ctx.save();
  ctx.translate(W / 2 + 14, H * 0.55);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = INK;
  font(ctx, 600, 46, "expanded");
  ctx.textAlign = "center";
  ctx.fillText(p.brand ?? store.name, 0, 0);
  ctx.restore();
}

const SIZES: Record<LabelKind, [number, number]> = {
  bottle: [2048, 518],
  dropper: [2048, 568],
  jar: [3072, 316],
  spray: [2048, 822],
  "carton-front": [768, 1314],
  "carton-side": [256, 1054],
};

export function drawLabel(kind: LabelKind, spec: LabelSpec, target?: HTMLCanvasElement) {
  const [W, H] = SIZES[kind];
  const c = target ?? document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d") as Ctx;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.globalAlpha = 1;
  if (kind === "bottle") drawBottle(ctx, W, H, spec);
  else if (kind === "dropper") drawDropper(ctx, W, H, spec);
  else if (kind === "jar") drawJar(ctx, W, H, spec);
  else if (kind === "spray") drawSpray(ctx, W, H, spec);
  else if (kind === "carton-front") drawCartonFront(ctx, W, H, spec);
  else drawCartonSide(ctx, W, H, spec);
  return c;
}

export function labelTexture(kind: LabelKind, spec: LabelSpec, anisotropy = 8) {
  const tex = new CanvasTexture(drawLabel(kind, spec));
  // glTF UVs use a top-left origin.
  tex.flipY = false;
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}
