"use client";
/* eslint-disable react-hooks/immutability -- R3F frame loops mutate three.js objects (camera, textures, instance matrices) by design. */

import { PerformanceMonitor, useProgress } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { StudioLighting } from "@/components/three/Lighting";
import { ensureLabelFonts } from "@/components/three/labels";
import { PALETTE, type Quality } from "@/components/three/kit";
import { Carousel, RADIUS } from "./Carousel";
import { COUNTER, Counter } from "./Counter";
import { easeInOut, range, stage } from "../stage";

type Pose = { pos: THREE.Vector3; target: THREE.Vector3; fov: number };

function pose(px: number, py: number, pz: number, tx: number, ty: number, tz: number, fov: number): Pose {
  return { pos: new THREE.Vector3(px, py, pz), target: new THREE.Vector3(tx, ty, tz), fov };
}

/** Camera poses for wide (text beside the object) and compact (text below) layouts. */
function poses(compact: boolean) {
  const R = RADIUS;
  const C = COUNTER;
  return compact
    ? {
        hero: pose(0.05, 1.25, R + 5.5, 0.05, 0.12, R, 30),
        pour: pose(-0.2, 1.85, R + 6.3, -0.2, 0.5, R + 0.1, 30),
        carousel: pose(0, 2.3, R + 6.2, 0, -0.1, R, 30),
        counter: pose(0.4, 2.05, C.z + 7.0, 0.4, 0.1, C.z, 30),
      }
    : {
        hero: pose(-0.8, 0.86, R + 3.05, -0.72, 0.56, R, 30),
        pour: pose(-0.42, 1.3, R + 3.4, -0.32, 0.6, R + 0.1, 30),
        carousel: pose(-0.95, 1.7, R + 4.2, -0.88, 0.4, R - 0.15, 30),
        counter: pose(-0.55, 1.35, C.z + 4.1, -0.45, 0.55, C.z, 30),
      };
}

const tmpPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

function blend(a: Pose, b: Pose, t: number, outPos: THREE.Vector3, outTarget: THREE.Vector3) {
  outPos.lerpVectors(a.pos, b.pos, t);
  outTarget.lerpVectors(a.target, b.target, t);
  return THREE.MathUtils.lerp(a.fov, b.fov, t);
}

function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  // Must match the lg breakpoint where chapter text moves beside the 3D.
  const compact = size.width < 1024 || size.width / size.height < 0.9;
  const P = useMemo(() => poses(compact), [compact]);
  const look = useRef(new THREE.Vector3());
  const last = useRef<string>("");

  useEffect(() => {
    stage.compact = compact;
  }, [compact]);

  useFrame((_, dt) => {
    let fov: number;
    if (stage.chapter === "rx") {
      fov = blend(P.counter, P.counter, 0, tmpPos, tmpTarget);
    } else if (stage.chapter === "categories") {
      fov = blend(P.carousel, P.carousel, 0, tmpPos, tmpTarget);
    } else {
      const o = stage.opening;
      const a = easeInOut(range(o, 0.28, 0.56));
      const b = easeInOut(range(o, 0.74, 1));
      if (b > 0) fov = blend(P.pour, P.carousel, b, tmpPos, tmpTarget);
      else fov = blend(P.hero, P.pour, a, tmpPos, tmpTarget);
    }
    // gentle pointer parallax on wide screens
    if (!compact && !stage.reducedMotion) {
      tmpPos.x += stage.pointer.x * 0.08;
      tmpPos.y += stage.pointer.y * 0.05;
    }
    const key = stage.chapter === "rx" ? "rx" : "carousel";
    const snap = key !== last.current || stage.reducedMotion;
    last.current = key;
    const k = snap ? 1 : 1 - Math.exp(-6 * dt);
    camera.position.lerp(tmpPos, k);
    look.current.lerp(tmpTarget, k);
    camera.lookAt(look.current);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, fov, k);
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** Renders only while a 3D chapter is on screen and the tab is visible. */
function Driver() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const tick = () => {
      if (stage.active && !document.hidden) invalidate();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [invalidate]);
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    // compile shaders up front so the first scroll does not hitch
    gl.compile(scene, camera);
    onReady();
  }, [gl, scene, camera, onReady]);
  return null;
}

function LoadProgress({ onProgress }: { onProgress: (p: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => onProgress(progress), [progress, onProgress]);
  return null;
}

export default function HomeScene({ onReady, onProgress }: { onReady: () => void; onProgress: (p: number) => void }) {
  // This component only renders in the browser (loaded with ssr: false).
  const lowMemory = () => ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 2;
  const [quality, setQuality] = useState<Quality>(() => (lowMemory() ? "low" : "high"));
  const [dpr, setDpr] = useState(() => (lowMemory() ? 1 : 1.5));
  const [fonts, setFonts] = useState(false);

  useEffect(() => {
    ensureLabelFonts().then(() => setFonts(true));
  }, []);

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop="demand"
      gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.AgXToneMapping, toneMappingExposure: 1.05 }}
      camera={{ fov: 30, near: 0.05, far: 40, position: [0, 1, 5] }}
      onCreated={({ gl }) => {
        (gl as THREE.WebGLRenderer & { transmissionResolutionScale?: number }).transmissionResolutionScale = 0.75;
      }}
      aria-hidden="true"
    >
      <color attach="background" args={[PALETTE.paper]} />
      <LoadProgress onProgress={onProgress} />
      <PerformanceMonitor
        bounds={() => [38, 58]}
        flipflops={2}
        onDecline={() => {
          setDpr(1);
          setQuality("low");
        }}
        onIncline={() => setDpr((d) => Math.min(2, d + 0.25))}
      />
      <Driver />
      <CameraRig />
      {fonts ? (
        <Suspense fallback={null}>
          <StudioLighting />
          <Carousel quality={quality} />
          <Counter quality={quality} />
          <Ready onReady={onReady} />
        </Suspense>
      ) : null}
    </Canvas>
  );
}
