"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import type { Product } from "@/lib/catalog";
import { BlobShadow, StudioLighting } from "@/components/three/Lighting";
import { ensureLabelFonts } from "@/components/three/labels";
import { PALETTE } from "@/components/three/kit";
import { MODEL_POSE, MODEL_SIZE, ProductModel } from "@/components/three/ProductModel";

/** Interactive turntable for one product: drag to rotate, scroll or pinch to zoom within limits. */
export default function ProductViewer({ product, onReady }: { product: Product; onReady?: () => void }) {
  const [fonts, setFonts] = useState(false);
  const [interacted, setInteracted] = useState(false);
  // client-only component (loaded with ssr: false)
  const [reduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    ensureLabelFonts().then(() => setFonts(true));
  }, []);

  const model = product.model!;
  const size = MODEL_SIZE[model];
  const pose = MODEL_POSE[model];
  const centerY = model === "blister" ? 0.36 : size.h / 2;
  const frame = Math.max(size.h, size.w * 0.8) * 1.5;
  const dist = frame / 2 / Math.tan(THREE.MathUtils.degToRad(12));

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, toneMapping: THREE.AgXToneMapping }}
      camera={{ fov: 24, near: 0.05, far: 50, position: [0, centerY + dist * 0.18, dist] }}
      onCreated={() => onReady?.()}
      frameloop="always"
    >
      <color attach="background" args={[PALETTE.studio]} />
      {fonts ? (
        <Suspense fallback={null}>
          <StudioLighting />
          <group rotation={pose.rotation} position-y={pose.lift ?? 0}>
            <ProductModel product={product} />
          </group>
          <BlobShadow width={size.w * 2.2} depth={size.w * 1.5} opacity={0.5} />
        </Suspense>
      ) : null}
      <OrbitControls
        target={[0, centerY, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={dist * 0.55}
        maxDistance={dist * 1.25}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.52}
        autoRotate={!interacted && !reduce}
        autoRotateSpeed={0.8}
        onStart={() => setInteracted(true)}
      />
    </Canvas>
  );
}
