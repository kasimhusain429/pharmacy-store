"use client";

import Link from "next/link";
import { useState } from "react";
import { cart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/store";
import { AddToCartButton } from "./AddToCartButton";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const rx = product.requiresPrescription;

  return (
    <div className="space-y-4">
      {rx ? (
        <div className="rounded-sm border border-rx/25 bg-rx-soft/60 p-5 text-sm">
          <p className="font-medium text-rx">You need a valid prescription for this medicine.</p>
          <p className="mt-2 text-ink-2">
            Add it as a request and attach your prescription at checkout, or send your prescription on its own. A pharmacist checks it before
            anything is prepared, and the quantity will be what your prescription states.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {!rx ? (
          <div className="inline-flex h-12 items-center rounded-full border border-ink/20" role="group" aria-label="Quantity">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-12 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-40"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <output className="tabular w-8 text-center text-sm" aria-live="polite">
              {qty}
            </output>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(cart.maxQty, q + 1))}
              className="grid size-12 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-40"
              disabled={qty >= cart.maxQty}
              aria-label="Increase quantity"
            >
              <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : null}
        <AddToCartButton product={product} qty={qty} className="min-w-56 flex-1 sm:flex-none" />
      </div>

      {!rx && qty > 1 ? <p className="tabular text-sm text-ink-2">{formatPrice(product.price * qty)} for {qty}</p> : null}

      {rx ? (
        <Link href="/prescriptions" className="inline-block text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          Send a prescription without choosing a product
        </Link>
      ) : null}
    </div>
  );
}
