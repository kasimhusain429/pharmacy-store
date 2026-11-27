"use client";
/* eslint-disable react-hooks/immutability -- R3F frame loops mutate three.js objects (camera, textures, instance matrices) by design. */

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";
import { sharedMaterial, useDoseGeometry, type Quality } from "@/components/three/kit";
import { labelFont } from "@/components/three/labels";

export const PLINTH_H = 0.14;

/** Display plinth. Its rim carries the category colour band. */
export function Plinth({ band, radius = 0.62, ...props }: { band: string; radius?: number } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh position-y={PLINTH_H / 2 - 0.004}>
        <cylinderGeometry args={[radius, radius + 0.01, PLINTH_H - 0.008, 96, 1]} />
        <meshStandardMaterial color="#d3dbcf" roughness={0.85} />
      </mesh>
      <mesh position-y={PLINTH_H - 0.006}>
        <cylinderGeometry args={[radius + 0.004, radius + 0.004, 0.012, 96, 1, true]} />
        <meshStandardMaterial color={band} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={PLINTH_H - 0.0005} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[radius, 96]} />
        <meshStandardMaterial color="#dde3d9" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Simple digital thermometer, built from primitives (devices station). */
export function Thermometer(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh rotation-z={Math.PI / 2} position={[0, 0.045, 0]}>
        <capsuleGeometry args={[0.045, 0.62, 8, 24]} />
        <meshPhysicalMaterial color="#f3f3f0" roughness={0.35} clearcoat={0.4} />
      </mesh>
      <mesh rotation-z={Math.PI / 2} position={[-0.44, 0.045, 0]}>
        <capsuleGeometry args={[0.018, 0.16, 6, 16]} />
        <meshStandardMaterial color="#b9bdbb" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0.08, 0.09, 0]}>
        <boxGeometry args={[0.2, 0.012, 0.06]} />
        <meshStandardMaterial color="#2e3a35" roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 0.0965, 0]}>
        <boxGeometry args={[0.17, 0.002, 0.045]} />
        <meshStandardMaterial color="#cfe0c9" emissive="#9fbf95" emissiveIntensity={0.35} roughness={0.3} />
      </mesh>
      <mesh position={[0.26, 0.09, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.012, 24]} />
        <meshStandardMaterial color="#4f5d66" roughness={0.4} />
      </mesh>
    </group>
  );
}

export type DoseInstance = { position: THREE.Vector3; quaternion: THREE.Quaternion; scale: number };
export type DoseWriter = (fn: (write: (i: number, d: DoseInstance) => void) => void) => void;

/** Instanced solid doses (capsules, softgels, tablets). Parent drives them through `api`. */
export function DoseInstances({
  kind,
  count,
  quality,
  api,
  initial,
}: {
  kind: "capsule" | "softgel" | "tablet";
  count: number;
  quality: Quality;
  api?: React.RefObject<DoseWriter | null>;
  initial?: DoseInstance[];
}) {
  const parts = useDoseGeometry(kind);
  const refs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const s = useMemo(() => new THREE.Vector3(), []);

  const write = useMemo(
    () => (i: number, d: DoseInstance) => {
      s.setScalar(d.scale);
      m.compose(d.position, d.quaternion, s);
      for (const r of refs.current) r?.setMatrixAt(i, m);
    },
    [m, s],
  );

  useLayoutEffect(() => {
    if (!initial) return;
    initial.forEach((d, i) => write(i, d));
    for (const r of refs.current) {
      if (!r) continue;
      r.instanceMatrix.needsUpdate = true;
      r.computeBoundingSphere();
    }
  }, [initial, write]);

  useEffect(() => {
    if (!api) return;
    api.current = (fn) => {
      fn(write);
      for (const r of refs.current) if (r) r.instanceMatrix.needsUpdate = true;
    };
    return () => {
      api.current = null;
    };
  }, [api, write]);

  return (
    <>
      {parts.map((p, idx) => (
        <instancedMesh
          key={idx}
          ref={(r) => {
            refs.current[idx] = r;
          }}
          args={[p.geometry, sharedMaterial(p.material, undefined, quality), count]}
          frustumCulled={false}
        />
      ))}
    </>
  );
}

/** Prescription form texture: a blank generic form, no personal data. */
export function drawPrescription(c: HTMLCanvasElement, checked: number) {
  const ctx = c.getContext("2d")!;
  const W = c.width;
  const H = c.height;
  const f = labelFont();
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.fillStyle = "#eef2ea";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#2f6b58";
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1.2;
  for (let k = -4; k < H / 10 + 4; k++) {
    ctx.beginPath();
    for (let i = 0; i <= W; i += 8) {
      const y = k * 10 + 9 * Math.sin((i / 150) * Math.PI * 2 + k * 0.35);
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#16241e";
  ctx.font = `600 54px ${f}`;
  ctx.fillText("Prescription", 56, 110);
  ctx.font = `400 26px ${f}`;
  ctx.fillStyle = "#3b4a43";
  const rows = ["Patient", "Date of birth", "Medicine", "Strength and form", "Directions", "Prescriber", "Signature"];
  rows.forEach((r, i) => {
    const y = 210 + i * 98;
    ctx.fillText(r, 56, y);
    ctx.globalAlpha = 0.35;
    ctx.fillRect(56, y + 34, W - 112, 2);
    ctx.globalAlpha = 1;
  });
  ctx.font = `700 120px ${f}`;
  ctx.fillStyle = "#7a2418";
  ctx.globalAlpha = 0.85;
  ctx.fillText("Rx", W - 190, 120);
  ctx.globalAlpha = 1;

  if (checked > 0) {
    const cx = W - 200;
    const cy = H - 210;
    const r = 120;
    const k = Math.min(1, checked);
    ctx.save();
    ctx.globalAlpha = k * 0.9;
    ctx.translate(cx, cy);
    ctx.rotate(-0.18);
    ctx.scale(1.25 - 0.25 * k, 1.25 - 0.25 * k);
    ctx.strokeStyle = "#2f6b58";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r - 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(-12, 40);
    ctx.lineTo(56, -42);
    ctx.stroke();
    ctx.font = `600 24px ${f}`;
    ctx.fillStyle = "#2f6b58";
    ctx.textAlign = "center";
    ctx.fillText("Pharmacist checked", 0, r + 46);
    ctx.restore();
  }
}

export function canvasTexture(w: number, h: number, draw: (c: HTMLCanvasElement) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Pharmacy paper bag artwork with the capsule mark. */
export function drawBag(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#f4f2ec";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.save();
  ctx.translate(c.width / 2, c.height * 0.45);
  ctx.rotate(-0.66);
  ctx.fillStyle = "#16241e";
  ctx.beginPath();
  ctx.roundRect(-34, -80, 68, 80, [34, 34, 0, 0]);
  ctx.fill();
  ctx.fillStyle = "#b8661a";
  ctx.beginPath();
  ctx.roundRect(-34, 0, 68, 80, [0, 0, 34, 34]);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#16241e";
  ctx.font = `600 44px ${labelFont()}`;
  ctx.textAlign = "center";
  ctx.fillText("Pharmacy Store", c.width / 2, c.height * 0.74);
}
