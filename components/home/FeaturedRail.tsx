"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Horizontal product rail: native scroll + snap, with buttons for mouse users. */
export function FeaturedRail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 hidden justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => by(-1)}
          disabled={edges.start}
          aria-label="Scroll products left"
          className="grid size-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink/50 disabled:opacity-30"
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => by(1)}
          disabled={edges.end}
          aria-label="Scroll products right"
          className="grid size-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink/50 disabled:opacity-30"
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <ul
        ref={ref}
        aria-label={label}
        className="gutter -mx-[clamp(1rem,4vw,3.5rem)] grid snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,3.5rem)] auto-cols-[min(68vw,19rem)] grid-flow-col gap-5 overflow-x-auto pb-4 [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  );
}
