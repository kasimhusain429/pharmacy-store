"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { PackagingModel, Product } from "@/lib/catalog";
import { labelTexture, type LabelKind, type LabelSpec } from "./labels";

/**
 * The packaging kit is modelled in Blender (scripts/blender/build_kit.py) and
 * exported as one GLB. Here each model is cloned and given WebGL materials,
 * matched by the Blender material name.
 */
export const KIT_URL = "/models/pharmacy-kit.glb";

export type KitModel = PackagingModel | "capsule" | "softgel" | "tablet";
export type Tint = NonNullable<Product["tint"]>;
export type Quality = "high" | "low";

const ROOT: Record<KitModel, string> = {
  bottle: "rx_bottle",
  dropper: "dropper",
  jar: "jar",
  spray: "spray",
  blister: "blister",
  carton: "carton",
  capsule: "capsule",
  softgel: "softgel",
  tablet: "tablet",
};

export const PALETTE = {
  paper: "#e6ebe3",
  studio: "#f6f6f3",
  ink: "#16241e",
  amber: "#b8661a",
};

const cache = new Map<string, THREE.Material>();

function glass(key: string, quality: Quality, opts: { attenuation: string; distance: number; roughness?: number; thickness?: number; tint?: string }) {
  const id = `${key}:${quality}`;
  const hit = cache.get(id);
  if (hit) return hit;
  let m: THREE.Material;
  if (quality === "high") {
    m = new THREE.MeshPhysicalMaterial({
      color: opts.tint ?? "#ffffff",
      transmission: 1,
      thickness: opts.thickness ?? 0.35,
      roughness: opts.roughness ?? 0.06,
      ior: 1.52,
      attenuationColor: new THREE.Color(opts.attenuation),
      attenuationDistance: opts.distance,
      specularIntensity: 1,
      envMapIntensity: 1.15,
    });
  } else {
    m = new THREE.MeshStandardMaterial({
      color: opts.attenuation,
      roughness: Math.max(0.1, opts.roughness ?? 0.1),
      metalness: 0,
      transparent: true,
      opacity: 0.82,
      envMapIntensity: 1.3,
    });
  }
  m.name = key;
  cache.set(id, m);
  return m;
}

function solid(key: string, params: THREE.MeshPhysicalMaterialParameters) {
  const hit = cache.get(key);
  if (hit) return hit;
  const m = new THREE.MeshPhysicalMaterial(params);
  m.name = key;
  cache.set(key, m);
  return m;
}

export function sharedMaterial(name: string, tint: Tint | undefined, quality: Quality): THREE.Material {
  switch (name) {
    case "AmberGlass":
      if (tint === "mint") return glass("mintGlass", quality, { attenuation: "#7fc2a6", distance: 0.6, tint: "#f2fbf6" });
      if (tint === "clear" || tint === "white") return glass("clearGlass", quality, { attenuation: "#e8efe9", distance: 2.5 });
      return glass("amberGlass", quality, { attenuation: "#a9500c", distance: 0.34 });
    case "FrostedGlass":
      if (tint === "amber") return glass("amberJar", quality, { attenuation: "#8f3f08", distance: 0.3, roughness: 0.18 });
      return glass("frostedGlass", quality, { attenuation: "#eef2ee", distance: 1.4, roughness: 0.42, thickness: 0.5, tint: "#fbfcfb" });
    case "ClearGlass":
      return solid("pipette", { color: "#e9eeea", roughness: 0.08, metalness: 0, clearcoat: 1, transparent: false });
    case "Liquid":
      return solid(`liquid-${tint ?? "amber"}`, {
        color: tint === "mint" ? "#bfe6d2" : "#d89540",
        roughness: 0.15,
        sheen: 0,
        emissive: tint === "mint" ? "#335c48" : "#4a2205",
        emissiveIntensity: 0.25,
      });
    case "CapWhite":
      return solid("capWhite", { color: "#f1f1ee", roughness: 0.42, clearcoat: 0.2 });
    case "CapsuleA":
      return solid("capsuleA", { color: PALETTE.amber, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15 });
    case "CapsuleB":
      return solid("capsuleB", { color: "#f3f1ea", roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.15 });
    case "Softgel":
      return quality === "high"
        ? solid("softgelHigh", {
            color: "#f0b54a",
            transmission: 0.65,
            thickness: 0.08,
            roughness: 0.12,
            ior: 1.45,
            attenuationColor: new THREE.Color("#c27a0c"),
            attenuationDistance: 0.08,
            clearcoat: 1,
          })
        : solid("softgelLow", { color: "#d99a2b", roughness: 0.15, clearcoat: 1, emissive: "#5c3300", emissiveIntensity: 0.3 });
    case "Tablet":
      return solid("tablet", { color: "#f4f3ee", roughness: 0.72 });
    case "Rubber":
      return solid("rubber", { color: "#1d1f1e", roughness: 0.62 });
    case "Collar":
      return solid("collar", { color: "#202523", roughness: 0.32, clearcoat: 0.5 });
    case "JarCap":
      return tint === "frosted"
        ? solid("jarCapWhite", { color: "#f3f3f0", roughness: 0.35, clearcoat: 0.3 })
        : solid("jarCapBrass", { color: "#c9a25e", roughness: 0.28, metalness: 1 });
    case "PlasticWhite":
      return solid("plasticWhite", { color: "#f2f2ef", roughness: 0.38, clearcoat: 0.2 });
    case "PlasticGrey":
      return solid("plasticGrey", { color: "#a3aaa7", roughness: 0.4 });
    case "Foil":
      return solid("foil", { color: "#d4d7d5", roughness: 0.32, metalness: 1 });
    case "PVC":
      return quality === "high"
        ? solid("pvcHigh", { color: "#ffffff", transmission: 1, thickness: 0.01, roughness: 0.05, ior: 1.45 })
        : solid("pvcLow", { color: "#f8fbfa", roughness: 0.05, transparent: true, opacity: 0.35 });
    case "Carton":
      return solid("carton", { color: "#f7f7f4", roughness: 0.62 });
    default:
      return solid("fallback", { color: "#cccccc", roughness: 0.5 });
  }
}

/** Paper label material: printed front, plain adhesive back seen through the glass. */
export function labelMaterial(map: THREE.Texture) {
  const m = new THREE.MeshStandardMaterial({ map, roughness: 0.58, side: THREE.DoubleSide });
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      "#include <map_fragment>\n if (!gl_FrontFacing) { diffuseColor.rgb = vec3(0.86, 0.85, 0.80); }",
    );
  };
  m.name = "label";
  return m;
}

export type BuiltModel = {
  group: THREE.Group;
  labels: { mesh: THREE.Mesh; kind: LabelKind; texture: THREE.CanvasTexture }[];
  dispose: () => void;
};

function labelKindFor(model: KitModel, meshName: string): LabelKind | null {
  if (meshName.startsWith("CartonFront")) return "carton-front";
  if (meshName.startsWith("CartonSide")) return "carton-side";
  if (!meshName.startsWith("Label")) return null;
  if (model === "bottle") return "bottle";
  if (model === "dropper") return "dropper";
  if (model === "jar") return "jar";
  if (model === "spray") return "spray";
  return null;
}

export function buildModel(
  scene: THREE.Object3D,
  model: KitModel,
  opts: { tint?: Tint; quality?: Quality; label?: LabelSpec; anisotropy?: number } = {},
): BuiltModel {
  const quality = opts.quality ?? "high";
  const src = scene.getObjectByName(ROOT[model]);
  if (!src) throw new Error(`Model ${model} missing from kit`);
  const group = src.clone(true) as THREE.Group;
  group.position.set(0, 0, 0);
  group.rotation.set(0, 0, 0);
  group.name = model;
  const labels: BuiltModel["labels"] = [];
  const owned: (THREE.Material | THREE.Texture)[] = [];

  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const srcMat = mesh.material as THREE.Material;
    const kind = labelKindFor(model, mesh.name);
    if (kind && opts.label) {
      const texture = labelTexture(kind, opts.label, opts.anisotropy ?? 8);
      const mat = labelMaterial(texture);
      if (kind.startsWith("carton")) mat.side = THREE.FrontSide;
      mesh.material = mat;
      labels.push({ mesh, kind, texture });
      owned.push(mat, texture);
    } else if (kind && !opts.label) {
      mesh.material = sharedMaterial("Carton", opts.tint, quality);
    } else {
      mesh.material = sharedMaterial(srcMat.name, opts.tint, quality);
    }
    mesh.frustumCulled = true;
  });

  return {
    group,
    labels,
    dispose: () => owned.forEach((x) => x.dispose()),
  };
}

export function useKit() {
  return useGLTF(KIT_URL).scene;
}

/** React helper: build once per inputs, dispose label textures on unmount. */
export function useBuiltModel(model: KitModel, opts: { tint?: Tint; quality?: Quality; label?: LabelSpec; anisotropy?: number; key?: string }) {
  const scene = useKit();
  const built = useMemo(
    () => buildModel(scene, model, opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene, model, opts.tint, opts.quality, opts.key, opts.label?.product?.slug, opts.label?.generic],
  );
  useEffect(() => () => built.dispose(), [built]);
  return built;
}

/** Geometry of the small solid-dose models, for InstancedMesh. */
export function useDoseGeometry(model: "capsule" | "softgel" | "tablet") {
  const scene = useKit();
  return useMemo(() => {
    const root = scene.getObjectByName(ROOT[model])!;
    const parts: { geometry: THREE.BufferGeometry; material: string }[] = [];
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) parts.push({ geometry: m.geometry, material: (m.material as THREE.Material).name });
    });
    return parts;
  }, [scene, model]);
}

useGLTF.preload(KIT_URL);
