"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { products, type Product } from "@/lib/catalog";
import { BlobShadow, StudioLighting } from "@/components/three/Lighting";
import { ensureLabelFonts } from "@/components/three/labels";
import { PALETTE } from "@/components/three/kit";
import { MODEL_POSE, MODEL_SIZE, ProductModel } from "@/components/three/ProductModel";

/** Products that keep the pharmacy's own photograph instead of a render. */
const PHOTOGRAPHED = new Set(["nura-hydration-serum", "natures-alchemy-healing-balm"]);

const W = 1000;
const H = 1250;

function Rig({ product, onReady }: { product: Product; onReady: (blob: Blob) => void }) {
  const { gl, camera, scene } = useThree();
  const size = MODEL_SIZE[product.model!];
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const h = size.h + (product.model === "blister" ? 0.25 : 0);
    const target = new THREE.Vector3(0, product.model === "blister" ? 0.36 : h / 2, 0);
    const frameH = Math.max(h, (size.w * H) / W) * 1.42;
    const dist = frameH / 2 / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    cam.position.set(0, target.y + dist * 0.16, dist);
    cam.lookAt(target);
    cam.updateProjectionMatrix();
    let frames = 0;
    let raf = 0;
    const tick = () => {
      gl.render(scene, cam);
      if (++frames < 24) raf = requestAnimationFrame(tick);
      else gl.domElement.toBlob((b) => b && onReady(b), "image/png");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [product, gl, camera, scene, size, onReady]);
  return null;
}

export default function StudioRenderer() {
  const queue = useMemo(() => products.filter((p) => p.model && !PHOTOGRAPHED.has(p.slug)), []);
  const [index, setIndex] = useState(-1);
  const [log, setLog] = useState<string[]>([]);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    ensureLabelFonts().then(() => setFontsReady(true));
  }, []);

  const product = index >= 0 && index < queue.length ? queue[index] : null;

  const save = async (blob: Blob) => {
    if (!product) return;
    const res = await fetch(`/api/dev/renders?slug=${product.slug}`, { method: "POST", body: blob });
    setLog((l) => [...l, `${product.slug}: ${res.ok ? "saved" : `failed (${res.status})`}`]);
    setIndex((i) => i + 1);
  };

  return (
    <div className="mt-8 flex flex-col gap-6 lg:flex-row">
      <div className="w-[400px] shrink-0">
        <button
          type="button"
          disabled={!fontsReady || (index >= 0 && index < queue.length)}
          onClick={() => {
            setLog([]);
            setIndex(0);
          }}
          className="h-11 rounded-full bg-ink px-5 text-sm text-paper disabled:opacity-50"
          data-testid="render-all"
        >
          Render {queue.length} products
        </button>
        <ul className="mt-4 space-y-1 text-xs" data-testid="render-log">
          {log.map((l) => (
            <li key={l}>{l}</li>
          ))}
          {index >= queue.length ? <li data-testid="render-done">Done</li> : null}
        </ul>
      </div>
      <div style={{ width: W / 2, height: H / 2 }} className="overflow-hidden rounded bg-studio">
        <div style={{ width: W, height: H, transform: "scale(0.5)", transformOrigin: "0 0" }}>
          {product ? (
            <Canvas
              key={product.slug}
              dpr={1}
              gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: THREE.AgXToneMapping }}
              camera={{ fov: 20, near: 0.05, far: 50 }}
              style={{ width: W, height: H }}
              frameloop="never"
            >
              <color attach="background" args={[PALETTE.studio]} />
              <Suspense fallback={null}>
                <StudioLighting />
                <group rotation={MODEL_POSE[product.model!].rotation} position-y={MODEL_POSE[product.model!].lift ?? 0}>
                  <ProductModel product={product} />
                </group>
                <BlobShadow width={MODEL_SIZE[product.model!].w * 2.2} depth={MODEL_SIZE[product.model!].w * 1.4} opacity={0.5} />
                <Rig product={product} onReady={save} />
              </Suspense>
            </Canvas>
          ) : null}
        </div>
      </div>
    </div>
  );
}
