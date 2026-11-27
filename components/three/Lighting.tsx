"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useMemo } from "react";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Product-photography lighting built from light cards (no HDR download):
 * a large soft key, two strip lights for glass edges and a warm bounce.
 */
export function StudioLighting({ intensity = 1, warm = true }: { intensity?: number; warm?: boolean }) {
  return (
    <>
      <Environment resolution={256} frames={1} environmentIntensity={intensity}>
        <color attach="background" args={["#d9ded6"]} />
        <Lightformer form="rect" intensity={2.4} position={[-3, 4, 3]} scale={[5, 3.5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3.2} position={[3.2, 1.2, 1]} scale={[0.6, 6, 1]} target={[0, 0.5, 0]} />
        <Lightformer form="rect" intensity={2.2} position={[-3.4, 0.8, -1.5]} scale={[0.5, 6, 1]} target={[0, 0.5, 0]} />
        <Lightformer form="circle" intensity={1.4} position={[0, 6, 0]} scale={4} target={[0, 0, 0]} />
        {warm ? <Lightformer form="rect" color="#f3c891" intensity={0.9} position={[0, -2, 3]} scale={[6, 1.5, 1]} target={[0, 0.4, 0]} /> : null}
      </Environment>
      <directionalLight position={[-2.5, 4, 3]} intensity={1.1 * intensity} color="#fffaf2" />
      <ambientLight intensity={0.15} />
    </>
  );
}

let shadowTex: THREE.CanvasTexture | null = null;
function getShadowTexture() {
  if (shadowTex) return shadowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(22,36,30,0.55)");
  g.addColorStop(0.45, "rgba(22,36,30,0.22)");
  g.addColorStop(1, "rgba(22,36,30,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  shadowTex = new THREE.CanvasTexture(c);
  return shadowTex;
}

/** Cheap soft contact shadow: a gradient sprite on the floor instead of a shadow map. */
export function BlobShadow({ width = 0.7, depth = 0.7, opacity = 0.6, y = 0.001, ...props }: { width?: number; depth?: number; opacity?: number; y?: number } & ThreeElements["group"]) {
  const tex = useMemo(() => getShadowTexture(), []);
  return (
    <group {...props}>
      <mesh rotation-x={-Math.PI / 2} position-y={y} renderOrder={-1}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
