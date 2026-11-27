"use client";

import { cart, useCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";

/**
 * One button, two honest behaviours:
 *  - OTC products are added to the cart.
 *  - Prescription medicines are added as a *request* that cannot be completed
 *    until a prescription is attached at checkout.
 */
export function AddToCartButton({
  product,
  qty = 1,
  variant = "solid",
  className = "",
}: {
  product: Product;
  qty?: number;
  variant?: "solid" | "compact";
  className?: string;
}) {
  const { items, ready } = useCart();
  const inCart = items.find((i) => i.slug === product.slug);
  const rx = product.requiresPrescription;

  const label = rx ? (inCart ? "Requested, view cart" : "Request with prescription") : inCart ? "Add another" : "Add to cart";

  const base =
    variant === "compact"
      ? "h-10 px-4 text-xs"
      : "h-12 px-6 text-sm";

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => {
        if (rx && inCart) return cart.open();
        cart.add(product.slug, qty);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] disabled:opacity-60 ${base} ${
        rx ? "bg-rx text-paper hover:bg-[#62190f]" : "bg-ink text-paper hover:bg-night-2"
      } ${className}`}
    >
      {label}
      {inCart && !rx ? <span className="tabular rounded-full bg-paper/15 px-2 py-0.5 text-2xs">{inCart.qty} in cart</span> : null}
    </button>
  );
}
