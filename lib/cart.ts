"use client";

import { useSyncExternalStore } from "react";
import { getProduct, type Product } from "./catalog";

/**
 * Cart state lives in a tiny external store so the header, drawer, product
 * pages and checkout share it without a provider. Lines persist to
 * localStorage (slugs and quantities only, nothing personal).
 */

export type CartLine = { slug: string; qty: number };
type CartState = { lines: CartLine[]; open: boolean; ready: boolean; lastAdded: string | null };

const KEY = "ps-cart-v1";
const MAX_QTY = 10;

let state: CartState = { lines: [], open: false, ready: false, lastAdded: null };
const listeners = new Set<() => void>();
const serverState: CartState = { lines: [], open: false, ready: false, lastAdded: null };

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state.lines));
  } catch {
    /* storage unavailable (private mode) – cart still works for this visit */
  }
}

function load() {
  if (state.ready || typeof window === "undefined") return;
  let lines: CartLine[] = [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        lines = parsed
          .filter((l): l is CartLine => typeof l?.slug === "string" && Number.isFinite(l?.qty))
          .filter((l) => getProduct(l.slug))
          .map((l) => ({ slug: l.slug, qty: Math.min(MAX_QTY, Math.max(1, Math.round(l.qty))) }));
      }
    }
  } catch {
    lines = [];
  }
  state = { ...state, lines, ready: true };
}

function set(next: Partial<CartState>, save = false) {
  state = { ...state, ...next };
  if (save) persist();
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!state.ready) {
    load();
    queueMicrotask(emit);
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = { ...state, ready: false };
      load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(slug: string, qty = 1, { open = true }: { open?: boolean } = {}) {
    const product = getProduct(slug);
    if (!product) return;
    const existing = state.lines.find((l) => l.slug === slug);
    // Prescription items are a request for whatever the prescription states, so quantity stays at one line.
    const nextQty = product.requiresPrescription ? 1 : Math.min(MAX_QTY, (existing?.qty ?? 0) + qty);
    const lines = existing
      ? state.lines.map((l) => (l.slug === slug ? { ...l, qty: nextQty } : l))
      : [...state.lines, { slug, qty: nextQty }];
    set({ lines, open, lastAdded: slug }, true);
  },
  setQty(slug: string, qty: number) {
    const q = Math.min(MAX_QTY, Math.max(0, Math.round(qty)));
    const lines = q === 0 ? state.lines.filter((l) => l.slug !== slug) : state.lines.map((l) => (l.slug === slug ? { ...l, qty: q } : l));
    set({ lines }, true);
  },
  remove(slug: string) {
    set({ lines: state.lines.filter((l) => l.slug !== slug) }, true);
  },
  clear() {
    set({ lines: [], lastAdded: null }, true);
  },
  open() {
    set({ open: true });
  },
  close() {
    set({ open: false });
  },
  maxQty: MAX_QTY,
};

export type CartItem = CartLine & { product: Product; lineTotal: number };

export function useCart() {
  const s = useSyncExternalStore(subscribe, () => state, () => serverState);
  const items: CartItem[] = s.lines
    .map((l) => {
      const product = getProduct(l.slug);
      return product ? { ...l, product, lineTotal: product.price * l.qty } : null;
    })
    .filter((x): x is CartItem => x !== null);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0);
  const hasRx = items.some((i) => i.product.requiresPrescription);
  return { ...s, items, count, subtotal, hasRx };
}
