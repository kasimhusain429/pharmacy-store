"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { categories, getCategory, searchProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/store";
import { Sheet } from "./Sheet";

/** Instant product search with keyboard navigation. Enter opens the highlighted product or the full results. */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = useMemo(() => (q.trim() ? searchProducts(q).slice(0, 6) : []), [q]);

  // the header remounts this dialog (new key) each time it opens, so state starts fresh
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <Sheet open={open} onClose={onClose} side="top" labelledBy="search-title">
      <div className="border-b border-paper-3 bg-paper shadow-[0_30px_60px_-30px_rgba(22,36,30,0.35)]">
        <div className="gutter mx-auto max-w-4xl py-6 sm:py-10">
          <h2 id="search-title" className="sr-only">
            Search products
          </h2>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const hit = results[active];
              if (hit && active >= 0) go(`/product/${hit.slug}`);
              else if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`);
            }}
            className="flex items-center gap-3 border-b-2 border-ink pb-3"
          >
            <svg viewBox="0 0 20 20" className="size-6 shrink-0 text-ink-3" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="m13 13 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(results.length - 1, a + 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(-1, a - 1));
                }
              }}
              placeholder="Search by product, ingredient or need"
              aria-label="Search products"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls={listId}
              aria-activedescendant={results[active] ? `${listId}-${results[active].slug}` : undefined}
              autoComplete="off"
              enterKeyHint="search"
              className="stretch-semi w-full bg-transparent text-xl font-medium outline-none placeholder:text-ink-3/70 sm:text-2xl"
            />
            <button type="button" onClick={onClose} className="shrink-0 rounded-full px-3 py-1.5 text-xs text-ink-2 hover:bg-ink/5">
              Close
            </button>
          </form>

          <div className="mt-5 min-h-24">
            {q.trim() && results.length === 0 ? (
              <p className="text-sm text-ink-2">
                Nothing matches “{q.trim()}”. Try an ingredient such as magnesium, or browse a category below.
              </p>
            ) : null}

            {results.length > 0 ? (
              <ul id={listId} role="listbox" aria-label="Matching products" className="divide-y divide-paper-3">
                {results.map((p, i) => (
                  <li key={p.slug} id={`${listId}-${p.slug}`} role="option" aria-selected={i === active}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-4 rounded-sm px-2 py-2.5 transition-colors ${i === active ? "bg-paper-2" : ""}`}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-[3px] bg-studio">
                        <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-1" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{p.brand ? `${p.brand} ${p.name}` : p.name}</span>
                        <span className="stretch-narrow block truncate text-xs text-ink-3">
                          {getCategory(p.category)?.name}
                          {p.requiresPrescription ? ", prescription only" : ""}
                        </span>
                      </span>
                      <span className="tabular text-sm">{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            {!q.trim() ? (
              <div>
                <p className="stretch-narrow text-xs text-ink-3">Browse by category</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => go(`/shop?category=${c.id}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3.5 py-2 text-sm hover:border-ink/40"
                      >
                        <span className="size-2 rounded-full" style={{ background: c.band }} aria-hidden="true" />
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
