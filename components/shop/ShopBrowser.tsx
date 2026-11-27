"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { categories, getCategory, searchProducts, type CategoryId } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Sheet } from "@/components/site/Sheet";
import { btn } from "@/components/ui/buttons";

type Access = "all" | "otc" | "rx";
type Sort = "featured" | "price-asc" | "price-desc" | "name";
type PriceBand = "all" | "under-25" | "25-50" | "over-50";

const PRICE_BANDS: { id: PriceBand; label: string; test: (n: number) => boolean }[] = [
  { id: "all", label: "Any price", test: () => true },
  { id: "under-25", label: "Under $25", test: (n) => n < 25 },
  { id: "25-50", label: "$25 to $50", test: (n) => n >= 25 && n <= 50 },
  { id: "over-50", label: "Over $50", test: (n) => n > 50 },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name, A to Z" },
];

function useFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const category = (getCategory(params.get("category") ?? "")?.id ?? "all") as CategoryId | "all";
  const access = (["otc", "rx"].includes(params.get("access") ?? "") ? params.get("access") : "all") as Access;
  const sort = (SORTS.some((s) => s.id === params.get("sort")) ? params.get("sort") : "featured") as Sort;
  const price = (PRICE_BANDS.some((b) => b.id === params.get("price")) ? params.get("price") : "all") as PriceBand;
  const q = params.get("q") ?? "";

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === "all" || (k === "sort" && v === "featured")) next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  return { category, access, sort, price, q, set };
}

function Radio({
  name,
  checked,
  onChange,
  children,
  swatch,
  count,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  swatch?: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-sm py-1.5 text-sm text-ink-2 hover:text-ink has-[:checked]:text-ink">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="grid size-4 shrink-0 place-items-center rounded-full border border-ink/30 peer-checked:border-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-deep"
      >
        <span className={`size-2 rounded-full bg-ink transition-transform ${checked ? "scale-100" : "scale-0"}`} />
      </span>
      {swatch ? <span aria-hidden="true" className="h-1 w-3 rounded-full" style={{ background: swatch }} /> : null}
      <span className="flex-1 leading-snug">{children}</span>
      {count !== undefined ? <span className="tabular text-ink-3">{count}</span> : null}
    </label>
  );
}

function Filters({ f, counts }: { f: ReturnType<typeof useFilters>; counts: Record<string, number> }) {
  return (
    <div className="space-y-9">
      <fieldset>
        <legend className="stretch-narrow mb-2 text-xs text-ink-3">Category</legend>
        <Radio name="category" checked={f.category === "all"} onChange={() => f.set({ category: null })} count={counts.all}>
          All products
        </Radio>
        {categories.map((c) => (
          <Radio key={c.id} name="category" checked={f.category === c.id} onChange={() => f.set({ category: c.id })} swatch={c.band} count={counts[c.id]}>
            {c.name}
          </Radio>
        ))}
      </fieldset>
      <fieldset>
        <legend className="stretch-narrow mb-2 text-xs text-ink-3">Prescription</legend>
        <Radio name="access" checked={f.access === "all"} onChange={() => f.set({ access: null })}>
          Show everything
        </Radio>
        <Radio name="access" checked={f.access === "otc"} onChange={() => f.set({ access: "otc" })}>
          No prescription needed
        </Radio>
        <Radio name="access" checked={f.access === "rx"} onChange={() => f.set({ access: "rx" })}>
          Prescription only
        </Radio>
      </fieldset>
      <fieldset>
        <legend className="stretch-narrow mb-2 text-xs text-ink-3">Price</legend>
        {PRICE_BANDS.map((b) => (
          <Radio key={b.id} name="price" checked={f.price === b.id} onChange={() => f.set({ price: b.id })}>
            {b.label}
          </Radio>
        ))}
      </fieldset>
    </div>
  );
}

export function ShopBrowser() {
  const f = useFilters();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState(f.q);
  const [urlQ, setUrlQ] = useState(f.q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // keep the input in sync when the URL changes (back/forward, header search)
  if (f.q !== urlQ) {
    setUrlQ(f.q);
    setQuery(f.q);
  }

  // debounce the search into the URL so results are shareable
  useEffect(() => {
    if (query === f.q) return;
    const t = setTimeout(() => f.set({ q: query.trim() || null }), 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const searched = useMemo(() => searchProducts(query), [query]);
  const priceTest = PRICE_BANDS.find((b) => b.id === f.price)!.test;
  const accessTest = (rx: boolean) => (f.access === "all" ? true : f.access === "rx" ? rx : !rx);

  const counts = useMemo(() => {
    const base = searched.filter((p) => accessTest(p.requiresPrescription) && priceTest(p.price));
    const c: Record<string, number> = { all: base.length };
    for (const cat of categories) c[cat.id] = base.filter((p) => p.category === cat.id).length;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searched, f.access, f.price]);

  const results = useMemo(() => {
    const list = searched.filter((p) => (f.category === "all" || p.category === f.category) && accessTest(p.requiresPrescription) && priceTest(p.price));
    if (f.sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (f.sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (!query.trim()) return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searched, f.category, f.access, f.price, f.sort, query]);

  const cat = f.category === "all" ? null : getCategory(f.category)!;
  const activeFilters = (f.access !== "all" ? 1 : 0) + (f.price !== "all" ? 1 : 0) + (f.category !== "all" ? 1 : 0);

  return (
    <div className="gutter mx-auto max-w-[96rem] pt-28 pb-24 sm:pt-32">
      <header className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          {cat ? <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ background: cat.band }} /> : null}
          <h1 className="stretch-wide text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.98] font-medium tracking-[-0.03em]">{cat ? cat.name : "Shop"}</h1>
          <p className="mt-4 max-w-xl text-base text-ink-2">
            {cat ? cat.description : "Everything the pharmacy sells online. Prescription medicines are clearly marked and need a valid prescription."}
          </p>
        </div>
        <div className="md:col-span-5">
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <div className="flex items-center gap-3 border-b-2 border-ink pb-2">
            <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-ink-3" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13 13 4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ingredient or need"
              className="w-full bg-transparent py-1 text-lg outline-none placeholder:text-ink-3/70"
              enterKeyHint="search"
              autoComplete="off"
            />
          </div>
        </div>
      </header>

      {cat?.id === "prescriptions" ? (
        <div className="mt-8 flex flex-col gap-3 rounded-sm border border-rx/25 bg-rx-soft/60 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-ink">
            These medicines are supplied only against a valid prescription. Add them as a request and attach your prescription at checkout, or
            send your prescription first.
          </p>
          <Link href="/prescriptions" className={`${btn.rx} h-10 shrink-0 text-xs`}>
            Send a prescription
          </Link>
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block" aria-label="Filters">
          <div className="sticky top-28 pr-4 xl:pr-10">
            <Filters f={f} counts={counts} />
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-3 pb-4">
            <p className="tabular text-sm text-ink-2" aria-live="polite">
              {results.length} {results.length === 1 ? "product" : "products"}
              {query.trim() ? ` for “${query.trim()}”` : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/20 px-4 text-sm lg:hidden"
              >
                Filters
                {activeFilters ? <span className="tabular grid size-5 place-items-center rounded-full bg-ink text-2xs text-paper">{activeFilters}</span> : null}
              </button>
              <label htmlFor="sort" className="sr-only">
                Sort products
              </label>
              <select
                id="sort"
                value={f.sort}
                onChange={(e) => f.set({ sort: e.target.value })}
                className="h-10 rounded-full border border-ink/20 bg-transparent px-4 text-sm"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    Sort: {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="py-20">
              <p className="text-lg">No products match these filters.</p>
              <p className="mt-2 text-sm text-ink-2">Try a different word, or clear the filters to see everything.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  f.set({ q: null, category: null, access: null, price: null });
                }}
                className={`${btn.primary} mt-6`}
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false} mode="popLayout">
                {results.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <ProductCard product={p} priority={i < 4} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} side="right" labelledBy="filters-title">
        <div className="flex h-full flex-col bg-paper">
          <div className="flex items-center justify-between border-b border-paper-3 px-6 py-5">
            <h2 id="filters-title" className="stretch-wide text-lg font-semibold">
              Filters
            </h2>
            <button type="button" onClick={() => setFiltersOpen(false)} className="rounded-full px-3 py-1.5 text-xs text-ink-2 hover:bg-ink/5">
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Filters f={f} counts={counts} />
          </div>
          <div className="border-t border-paper-3 px-6 py-4">
            <button type="button" onClick={() => setFiltersOpen(false)} className={`${btn.primary} w-full`}>
              Show {results.length} {results.length === 1 ? "product" : "products"}
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
