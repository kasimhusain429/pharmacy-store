"use client";

import type { ThreeElements } from "@react-three/fiber";
import type { PackagingModel, Product } from "@/lib/catalog";
import { useBuiltModel, type Quality } from "./kit";

/** Approximate size of each packaging model in kit units (1 = 10 cm). */
export const MODEL_SIZE: Record<PackagingModel, { h: number; w: number }> = {
  bottle: { h: 0.982, w: 0.5 },
  dropper: { h: 0.952, w: 0.33 },
  jar: { h: 0.446, w: 0.624 },
  spray: { h: 0.852, w: 0.33 },
  carton: { h: 0.95, w: 0.6 },
  blister: { h: 0.48, w: 0.95 },
};

/** Default pose so labels and tablets read well. */
export const MODEL_POSE: Record<PackagingModel, { rotation: [number, number, number]; lift?: number }> = {
  bottle: { rotation: [0, 0, 0] },
  dropper: { rotation: [0, 0, 0] },
  jar: { rotation: [0, 0, 0] },
  spray: { rotation: [0, 0, 0] },
  carton: { rotation: [0, -0.52, 0] },
  blister: { rotation: [1.15, 0, -0.22], lift: 0.32 },
};

export function ProductModel({
  product,
  quality = "high",
  ...props
}: { product: Product; quality?: Quality } & ThreeElements["group"]) {
  const model = product.model ?? "bottle";
  const built = useBuiltModel(model, { tint: product.tint, quality, label: { product }, key: product.slug });
  return (
    <group {...props}>
      <primitive object={built.group} />
    </group>
  );
}
