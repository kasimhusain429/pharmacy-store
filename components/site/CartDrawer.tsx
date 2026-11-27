"use client";

import Image from "next/image";
import Link from "next/link";
import { cart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/store";
import { Sheet } from "./Sheet";

export function QtyStepper({ slug, qty, label }: { slug: string; qty: number; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/20" role="group" aria-label={`Quantity of ${label}`}>
      <button
        type="button"
        onClick={() => cart.setQty(slug, qty - 1)}
        className="grid size-9 place-items-center rounded-full hover:bg-ink/5"
        aria-label={qty === 1 ? `Remove ${label}` : `Decrease quantity of ${label}`}
      >
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
          <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <span className="tabular w-6 text-center text-sm" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => cart.setQty(slug, qty + 1)}
        disabled={qty >= cart.maxQty}
        className="grid size-9 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-40"
        aria-label={`Increase quantity of ${label}`}
      >
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
          <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { open, items, subtotal, hasRx, lastAdded } = useCart();

  return (
    <Sheet open={open} onClose={() => cart.close()} side="right" labelledBy="cart-title">
      <div className="flex h-full flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-paper-3 px-6 py-5">
          <h2 id="cart-title" className="stretch-wide text-lg font-semibold">
            Your cart
          </h2>
          <button type="button" onClick={() => cart.close()} className="rounded-full px-3 py-1.5 text-xs text-ink-2 hover:bg-ink/5">
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
            <p className="text-base text-ink-2">Your cart is empty. Browse the shop or send a prescription to get started.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/shop" onClick={() => cart.close()} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper">
                Browse the shop
              </Link>
              <Link href="/prescriptions" onClick={() => cart.close()} className="inline-flex h-11 items-center rounded-full border border-ink/25 px-5 text-sm">
                Send a prescription
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-paper-3 overflow-y-auto px-6" data-lenis-prevent>
              {items.map(({ slug, qty, product, lineTotal }) => (
                <li
                  key={slug}
                  className={`flex gap-4 py-5 ${lastAdded === slug ? "motion-safe:animate-[pulse_1.2s_ease-out_1]" : ""}`}
                >
                  <Link
                    href={`/product/${slug}`}
                    onClick={() => cart.close()}
                    className="relative size-20 shrink-0 overflow-hidden rounded-[3px] bg-studio"
                  >
                    <Image src={product.image} alt={product.imageAlt} fill sizes="80px" className="object-contain p-1.5" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/product/${slug}`} onClick={() => cart.close()} className="text-sm leading-snug font-medium hover:underline">
                        {product.brand ? `${product.brand} ${product.name}` : product.name}
                      </Link>
                      <p className="tabular shrink-0 text-sm">{formatPrice(lineTotal)}</p>
                    </div>
                    {product.requiresPrescription ? (
                      <p className="text-xs text-rx">Prescription needed. Quantity as prescribed.</p>
                    ) : (
                      <p className="stretch-narrow text-xs text-ink-3">{formatPrice(product.price)} each</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {product.requiresPrescription ? <span /> : <QtyStepper slug={slug} qty={qty} label={product.name} />}
                      <button type="button" onClick={() => cart.remove(slug)} className="text-xs text-ink-3 underline-offset-4 hover:text-ink hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-paper-3 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-ink-2">Subtotal</p>
                <p className="tabular text-lg font-medium">{formatPrice(subtotal)}</p>
              </div>
              {hasRx ? (
                <p className="mt-2 text-xs text-ink-2">
                  Your cart includes prescription medicine. You’ll attach your prescription at checkout, and a pharmacist checks it before
                  anything is prepared.
                </p>
              ) : null}
              <p className="mt-2 text-xs text-ink-3">No payment is taken online. The pharmacy confirms your total first.</p>
              <Link
                href="/checkout"
                onClick={() => cart.close()}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-paper hover:bg-night-2"
              >
                Go to checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
