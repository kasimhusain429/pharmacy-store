"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { categories, getProduct } from "@/lib/catalog";
import { useBuiltModel, type Quality } from "@/components/three/kit";
import { ProductModel } from "@/components/three/ProductModel";
import { BlobShadow } from "@/components/three/Lighting";
import { DoseInstances, PLINTH_H, Plinth, Thermometer, type DoseInstance, type DoseWriter } from "./parts";
import { easeInOut, easeOut, range, stage } from "../stage";

export const RADIUS = 2.3;
const STEP = (Math.PI * 2) / categories.length;

/** Deterministic random so the pour is identical every time (and reversible on scroll). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BOTTLE_POS = new THREE.Vector3(0.06, PLINTH_H, -0.14);
const PIVOT_Y = 0.45;
const CAPSULE_COUNT = 34;
const RESTING_AT_START = 4;

type Flight = {
  emit: number;
  dur: number;
  rest: THREE.Vector3;
  restQ: THREE.Quaternion;
  spinAxis: THREE.Vector3;
  spin: number;
  spread: THREE.Vector3;
};

/** Bottle pose as a pure function of the opening progress. */
function bottlePose(o: number) {
  const lift = easeInOut(range(o, 0.3, 0.46));
  const tilt = easeInOut(range(o, 0.38, 0.58));
  const back = easeInOut(range(o, 0.74, 0.9));
  const up = lift * (1 - back);
  const phi = 1.95 * tilt * (1 - back);
  return {
    x: BOTTLE_POS.x - 0.12 * up,
    y: BOTTLE_POS.y + PIVOT_Y + 0.26 * up,
    z: BOTTLE_POS.z + 0.08 * up,
    phi,
  };
}

const NECK = 0.86 - PIVOT_Y;
const CAP_REST = new THREE.Vector3(BOTTLE_POS.x + 0.44, PLINTH_H + 0.108, BOTTLE_POS.z + 0.27);

function capPose(o: number) {
  const unscrew = easeOut(range(o, 0.14, 0.3));
  const away = easeInOut(range(o, 0.3, 0.44)) * (1 - easeInOut(range(o, 0.84, 0.92)));
  const screwBack = easeOut(range(o, 0.92, 0.99));
  return {
    turns: -Math.PI * 4 * unscrew * (1 - screwBack),
    lift: 0.2 * unscrew * (1 - screwBack),
    away,
  };
}

function PourBottle({ quality }: { quality: Quality }) {
  const built = useBuiltModel("bottle", { quality, label: { generic: true }, key: "hero" });
  const pivot = useRef<THREE.Group>(null);
  const capHolder = useRef<THREE.Group>(null);
  const capsApi = useRef<DoseWriter | null>(null);

  const cap = useMemo(() => built.group.getObjectByName("Cap") as THREE.Mesh, [built]);
  // Move the cap into its own holder so it can leave the bottle.
  useMemo(() => {
    cap.removeFromParent();
  }, [cap]);

  const flights = useMemo<Flight[]>(() => {
    const r = rng(11);
    const out: Flight[] = [];
    for (let i = 0; i < CAPSULE_COUNT; i++) {
      const onPlinth = i < RESTING_AT_START || i % 5 < 2;
      let rest: THREE.Vector3;
      if (onPlinth) {
        // front-left of the plinth top, clear of the bottle
        const a = Math.PI * (0.55 + r() * 0.5);
        const d = 0.32 + r() * 0.22;
        rest = new THREE.Vector3(Math.cos(a) * d + 0.05, PLINTH_H + 0.04, Math.abs(Math.sin(a)) * d * 0.9 + 0.05);
      } else {
        const a = Math.PI * (0.58 + r() * 0.4);
        const d = 0.72 + r() * 0.32;
        rest = new THREE.Vector3(Math.cos(a) * d, 0.04, Math.sin(a) * d * 0.6 + 0.1);
      }
      const yaw = r() * Math.PI * 2;
      const restQ = new THREE.Quaternion()
        .setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2));
      out.push({
        emit: i < RESTING_AT_START ? -1 : 0.5 + ((i - RESTING_AT_START) / (CAPSULE_COUNT - RESTING_AT_START)) * 0.2 + r() * 0.02,
        dur: 0.06 + r() * 0.035,
        rest,
        restQ,
        spinAxis: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
        spin: 4 + r() * 6,
        spread: new THREE.Vector3((r() - 0.5) * 0.12, r() * 0.08, (r() - 0.5) * 0.2),
      });
    }
    return out;
  }, []);

  const tmp = useMemo(
    () => ({
      start: new THREE.Vector3(),
      ctrl: new THREE.Vector3(),
      p: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      spinQ: new THREE.Quaternion(),
      d: { position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), scale: 1 } as DoseInstance,
    }),
    [],
  );

  const lastO = useRef(-1);
  const clock = useRef(0);

  useFrame((_, dt) => {
    const o = stage.opening;
    clock.current += dt;
    const idle = stage.reducedMotion ? 0 : (1 - range(o, 0.05, 0.2)) * Math.sin(clock.current * 0.45) * 0.35;

    const b = bottlePose(o);
    if (pivot.current) {
      pivot.current.position.set(b.x, b.y, b.z);
      pivot.current.rotation.set(0, idle, b.phi);
    }
    const c = capPose(o);
    if (capHolder.current) {
      const ax = -Math.sin(b.phi);
      const ay = Math.cos(b.phi);
      const attachedX = b.x + ax * (NECK + c.lift);
      const attachedY = b.y + ay * (NECK + c.lift);
      const arc = Math.sin(Math.PI * c.away) * 0.16;
      capHolder.current.position.set(
        THREE.MathUtils.lerp(attachedX, CAP_REST.x, c.away),
        THREE.MathUtils.lerp(attachedY, CAP_REST.y, c.away) + arc,
        THREE.MathUtils.lerp(b.z, CAP_REST.z, c.away),
      );
      capHolder.current.rotation.set(0, c.turns + idle * (1 - c.away), b.phi * (1 - c.away));
    }

    if (o === lastO.current || !capsApi.current) return;
    lastO.current = o;
    capsApi.current((write) => {
      for (let i = 0; i < flights.length; i++) {
        const f = flights[i];
        const d = tmp.d;
        if (f.emit < 0) {
          d.position.copy(f.rest);
          d.quaternion.copy(f.restQ);
          d.scale = 1.15;
          write(i, d);
          continue;
        }
        const t = range(o, f.emit, f.emit + f.dur);
        if (t <= 0) {
          d.scale = 0;
          d.position.set(b.x, b.y, b.z);
          write(i, d);
          continue;
        }
        // neck position at the moment of emission
        const be = bottlePose(f.emit);
        const nx = be.x - Math.sin(be.phi) * NECK;
        const ny = be.y + Math.cos(be.phi) * NECK;
        tmp.start.set(nx, ny, be.z).add(f.spread);
        tmp.ctrl.set(nx - 0.28, ny + 0.12, be.z + f.spread.z * 2);
        const u = t * t;
        const a = (1 - u) * (1 - u);
        const bb = 2 * (1 - u) * u;
        const cc = u * u;
        d.position.set(
          a * tmp.start.x + bb * tmp.ctrl.x + cc * f.rest.x,
          a * tmp.start.y + bb * tmp.ctrl.y + cc * f.rest.y,
          a * tmp.start.z + bb * tmp.ctrl.z + cc * f.rest.z,
        );
        tmp.spinQ.setFromAxisAngle(f.spinAxis, (1 - t) * f.spin);
        d.quaternion.copy(f.restQ).premultiply(tmp.spinQ);
        d.scale = 1.15 * Math.min(1, t * 6);
        write(i, d);
      }
    });
  });

  return (
    <group>
      <group ref={pivot} rotation-order="ZYX">
        <primitive object={built.group} position-y={-PIVOT_Y} />
      </group>
      <group ref={capHolder} rotation-order="ZYX">
        <primitive object={cap} position-y={-0.86} />
      </group>
      <DoseInstances kind="capsule" count={CAPSULE_COUNT} quality={quality} api={capsApi} />
      <BlobShadow width={0.78} depth={0.6} opacity={0.5} position={[BOTTLE_POS.x, PLINTH_H, BOTTLE_POS.z]} />
    </group>
  );
}

function useStaticDoses(seed: number, count: number, center: [number, number], spread: number, y: number, lying: boolean) {
  return useMemo(() => {
    const r = rng(seed);
    const out: DoseInstance[] = [];
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * spread;
      const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * Math.PI * 2);
      if (lying) q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2));
      out.push({
        position: new THREE.Vector3(center[0] + Math.cos(a) * d, y + (i % 4 === 3 ? 0.06 : 0), center[1] + Math.sin(a) * d),
        quaternion: q,
        scale: 1.2,
      });
    }
    return out;
  }, [seed, count, center, spread, y, lying]);
}

function Station({ index, quality }: { index: number; quality: Quality }) {
  const cat = categories[index];
  const lift = useRef<THREE.Group>(null);
  // Other stations stay below the floor during the opening and rise as the camera pulls back.
  useFrame(() => {
    if (!lift.current || index === 0) return;
    const reveal = stage.chapter === "opening" ? easeOut(range(stage.opening, 0.72, 0.98)) : 1;
    lift.current.position.y = -1.4 * (1 - reveal);
    lift.current.visible = reveal > 0.001;
  });
  const softgels = useStaticDoses(5, 16, [0.3, 0.2], 0.17, PLINTH_H + 0.05, true);
  const capsules = useStaticDoses(9, 6, [0.28, 0.32], 0.12, PLINTH_H + 0.04, true);
  const p = (slug: string) => getProduct(slug)!;

  return (
    <group rotation-y={index * STEP}>
      <group ref={lift} position-z={RADIUS}>
        <Plinth band={cat.band} />
        {cat.id === "prescriptions" ? (
          <>
            <PourBottle quality={quality} />
            <ProductModel
              product={p("ibuprofen-paracetamol-tablets")}
              quality={quality}
              position={[0.34, PLINTH_H + 0.006, 0.28]}
              rotation={[0, -0.7, 0]}
              scale={0.62}
            />
          </>
        ) : null}
        {cat.id === "everyday" ? (
          <>
            <ProductModel product={p("cetirizine-10mg-tablets")} quality={quality} position={[-0.2, PLINTH_H, -0.06]} rotation={[0, 0.32, 0]} />
            <ProductModel product={p("chlorhexidine-antiseptic-spray")} quality={quality} position={[0.27, PLINTH_H, 0.16]} />
            <BlobShadow width={1.1} depth={0.7} opacity={0.42} position={[0, PLINTH_H, 0.04]} />
          </>
        ) : null}
        {cat.id === "vitamins" ? (
          <>
            <ProductModel product={p("magnesium-l-threonate")} quality={quality} position={[-0.14, PLINTH_H, -0.1]} />
            <DoseInstances kind="softgel" count={softgels.length} quality={quality} initial={softgels} />
            <DoseInstances kind="capsule" count={capsules.length} quality={quality} initial={capsules} />
            <BlobShadow width={0.8} depth={0.6} opacity={0.45} position={[-0.14, PLINTH_H, -0.1]} />
          </>
        ) : null}
        {cat.id === "skincare" ? (
          <>
            <ProductModel product={p("vitamin-c-serum")} quality={quality} position={[-0.2, PLINTH_H, -0.08]} />
            <ProductModel product={p("ceramide-cream")} quality={quality} position={[0.24, PLINTH_H, 0.14]} rotation={[0, -0.2, 0]} />
            <BlobShadow width={1.2} depth={0.75} opacity={0.42} position={[0.02, PLINTH_H, 0.04]} />
          </>
        ) : null}
        {cat.id === "devices" ? (
          <>
            <ProductModel product={p("diagcheck-a1c-kit")} quality={quality} position={[-0.16, PLINTH_H, -0.1]} rotation={[0, 0.36, 0]} />
            <Thermometer position={[0.16, PLINTH_H, 0.3]} rotation={[0, -0.5, 0]} />
            <BlobShadow width={1.1} depth={0.7} opacity={0.4} position={[0, PLINTH_H, 0.08]} />
          </>
        ) : null}
        <BlobShadow width={1.7} depth={1.7} opacity={0.35} />
      </group>
    </group>
  );
}

export function Carousel({ quality }: { quality: Quality }) {
  const turntable = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!turntable.current) return;
    turntable.current.visible = stage.chapter !== "rx";
    const target = -stage.category * STEP;
    turntable.current.rotation.y = stage.reducedMotion ? target : THREE.MathUtils.damp(turntable.current.rotation.y, target, 7, dt);
  });
  return (
    <group ref={turntable}>
      {categories.map((c, i) => (
        <Station key={c.id} index={i} quality={quality} />
      ))}
    </group>
  );
}
