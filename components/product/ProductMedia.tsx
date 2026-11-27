"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ProductImage } from "./ProductCard";

const ProductViewer = dynamic(() => import("./ProductViewer"), { ssr: false });

/**
 * Shows the studio image immediately. Products with a 3D model can be turned
 * in the viewer: it loads on its own for mouse users once the image is on
 * screen, and on tap for touch devices so mobile data isn't spent unasked.
 */
export function ProductMedia({ product }: { product: Product }) {
  const has3d = Boolean(product.model);
  const [mode, setMode] = useState<"image" | "3d">("image");
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!has3d) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!finePointer || saveData) return;
    const id = window.setTimeout(() => setMode("3d"), 900);
    return () => window.clearTimeout(id);
  }, [has3d]);

  return (
    <div ref={ref} className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-studio">
        <ProductImage product={product} sizes="(min-width: 1024px) 50vw, 100vw" priority className="h-full w-full" />
        {mode === "3d" ? (
          <div
            className={`absolute inset-0 cursor-grab transition-opacity duration-700 active:cursor-grabbing ${ready ? "opacity-100" : "opacity-0"}`}
            aria-label={`3D view of ${product.name}. Drag to rotate, scroll or pinch to zoom.`}
            role="img"
          >
            <ProductViewer product={product} onReady={() => window.setTimeout(() => setReady(true), 400)} />
          </div>
        ) : null}
      </div>
      {has3d ? (
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-ink-3">
          <p>{mode === "3d" ? "Drag to turn the pack. Scroll or pinch to zoom." : "Packaging shown is the pharmacy’s 3D model of this product."}</p>
          <button
            type="button"
            onClick={() => {
              setReady(false);
              setMode((m) => (m === "3d" ? "image" : "3d"));
            }}
            className="shrink-0 rounded-full border border-ink/20 px-3.5 py-1.5 text-xs text-ink hover:border-ink/50"
            aria-pressed={mode === "3d"}
          >
            {mode === "3d" ? "Show photo" : "Turn in 3D"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
