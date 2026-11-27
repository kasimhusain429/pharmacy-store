"use client";
/* eslint-disable react-hooks/immutability -- R3F frame loops mutate three.js objects (camera, textures, instance matrices) by design. */

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useBuiltModel, type Quality } from "@/components/three/kit";
import { drawLabel } from "@/components/three/labels";
import { BlobShadow } from "@/components/three/Lighting";
import { canvasTexture, drawBag, drawPrescription } from "./parts";
import { easeInOut, easeOut, range, stage } from "../stage";

/** World position of the prescription counter set (out of view of the carousel). */
export const COUNTER = new THREE.Vector3(0, 0, -9);
const TOP = 0.08;

/**
 * Prescription chapter, four steps scrubbed by scroll:
 * 1. the prescription arrives  2. a pharmacist checks it
 * 3. the label is printed and the cap goes on  4. it goes into the bag
 */
export function Counter({ quality }: { quality: Quality }) {
  const built = useBuiltModel("bottle", { quality, label: { generic: true, printed: 0 }, key: "counter" });
  const bottle = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Object3D | null>(null);
  const sheet = useRef<THREE.Mesh>(null);
  const bag = useRef<THREE.Group>(null);

  const label = built.labels[0];
  const sheetTex = useMemo(() => canvasTexture(768, 1024, (c) => drawPrescription(c, 0)), []);
  const bagTex = useMemo(() => canvasTexture(512, 640, drawBag), []);
  useEffect(
    () => () => {
      sheetTex.dispose();
      bagTex.dispose();
    },
    [sheetTex, bagTex],
  );

  useEffect(() => {
    capRef.current = built.group.getObjectByName("Cap") ?? null;
  }, [built]);

  const root = useRef<THREE.Group>(null);

  useFrame(() => {
    if (root.current) root.current.visible = stage.chapter === "rx";
    if (stage.chapter !== "rx") return;
    const r = stage.rx;

    // Step 1: prescription sheet slides in and leans against the counter.
    const inS = easeOut(range(r, 0.02, 0.22));
    const outS = easeInOut(range(r, 0.8, 0.95));
    if (sheet.current) {
      sheet.current.position.set(THREE.MathUtils.lerp(-2.0, -0.32, inS) - outS * 1.8, TOP + 0.415 + (1 - inS) * 0.3, -0.18);
      sheet.current.rotation.set(-0.08, THREE.MathUtils.lerp(0.9, 0.42, inS), THREE.MathUtils.lerp(0.25, 0.03, inS));
    }

    // Step 2: pharmacist check stamp.
    const checked = Math.round(easeOut(range(r, 0.3, 0.44)) * 30) / 30;
    // drawn state lives on the texture so a recreated texture is always redrawn
    if (checked !== sheetTex.userData.checked) {
      sheetTex.userData.checked = checked;
      drawPrescription(sheetTex.image as HTMLCanvasElement, checked);
      sheetTex.needsUpdate = true;
    }

    // Step 3: label prints line by line, then the cap is screwed on.
    const printed = Math.round(range(r, 0.5, 0.68) * 40) / 40;
    if (label && printed !== label.texture.userData.printed) {
      label.texture.userData.printed = printed;
      drawLabel("bottle", { generic: true, printed }, label.texture.image as HTMLCanvasElement);
      label.texture.needsUpdate = true;
    }
    const capOn = easeOut(range(r, 0.66, 0.76));
    if (capRef.current) {
      capRef.current.position.y = (1 - capOn) * 0.26;
      capRef.current.rotation.y = (1 - capOn) * Math.PI * 3;
    }

    // Step 4: the bag arrives and the bottle drops in.
    const bagIn = easeOut(range(r, 0.76, 0.86));
    const into = easeInOut(range(r, 0.84, 0.97));
    if (bag.current) {
      bag.current.position.set(THREE.MathUtils.lerp(2.6, 1.0, bagIn), TOP, -0.05);
      bag.current.rotation.y = THREE.MathUtils.lerp(-0.6, -0.18, bagIn);
    }
    if (bottle.current) {
      const hop = Math.sin(Math.PI * into) * 0.55;
      bottle.current.position.set(THREE.MathUtils.lerp(0.32, 1.0, into), TOP + hop - into * 0.05, THREE.MathUtils.lerp(0.1, -0.05, into));
      bottle.current.rotation.y = -0.2 + (stage.reducedMotion ? 0 : r * 0.8);
    }
  });

  return (
    <group ref={root} position={COUNTER.toArray()} visible={false}>
      {/* counter top */}
      <mesh position-y={TOP / 2} receiveShadow>
        <boxGeometry args={[5, TOP, 1.8]} />
        <meshStandardMaterial color="#d3dbcf" roughness={0.85} />
      </mesh>
      <mesh position={[0, TOP - 0.004, 0.9]}>
        <boxGeometry args={[5, 0.012, 0.004]} />
        <meshStandardMaterial color="#7a2418" roughness={0.5} />
      </mesh>

      <group ref={bottle}>
        <primitive object={built.group} />
        <BlobShadow width={0.8} depth={0.62} opacity={0.5} />
      </group>

      <mesh ref={sheet}>
        <planeGeometry args={[0.62, 0.83]} />
        <meshStandardMaterial map={sheetTex} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      <group ref={bag}>
        {/* paper bag: open-topped box with a printed front */}
        <mesh position-y={0.45}>
          <boxGeometry args={[0.72, 0.9, 0.42]} />
          <meshStandardMaterial attach="material-0" color="#efece4" roughness={0.9} />
          <meshStandardMaterial attach="material-1" color="#efece4" roughness={0.9} />
          <meshStandardMaterial attach="material-2" transparent opacity={0} depthWrite={false} />
          <meshStandardMaterial attach="material-3" color="#e6e2d8" roughness={0.9} />
          <meshStandardMaterial attach="material-4" map={bagTex} roughness={0.85} />
          <meshStandardMaterial attach="material-5" color="#efece4" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.7, 0.88, 0.4]} />
          <meshStandardMaterial color="#dcd7cb" roughness={0.95} side={THREE.BackSide} />
        </mesh>
        <BlobShadow width={1.1} depth={0.7} opacity={0.45} />
      </group>
    </group>
  );
}
