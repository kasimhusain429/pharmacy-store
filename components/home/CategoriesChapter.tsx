"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories } from "@/lib/catalog";
import { btn } from "@/components/ui/buttons";
import { categoryFromProgress } from "./HomeStage";
import { stage } from "./stage";

gsap.registerPlugin(ScrollTrigger);

const HOLD = 0.35;

export function CategoriesChapter({ counts }: { counts: Record<string, number> }) {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const n = categories.length;

  useLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setActive(Math.round(categoryFromProgress(self.progress))),
    });
    return () => st.kill();
  }, []);

  const goTo = (k: number) => {
    const el = section.current;
    if (!el) return;
    const p = (k + HOLD) / (n - 1 + HOLD * 2);
    const top = el.getBoundingClientRect().top + window.scrollY;
    stage.scrollTo(top + (el.offsetHeight - window.innerHeight) * p + 2);
  };

  const cat = categories[active];

  return (
    <section ref={section} data-chapter="categories" aria-labelledby="categories-title" className="relative" style={{ height: `${n * 85 + 15}svh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-end lg:justify-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-paper from-30% via-paper/80 to-transparent lg:block" aria-hidden="true" />
        <div className="gutter relative mx-auto w-full max-w-[96rem]">
          <div className="relative max-w-[34rem] pb-8 lg:w-[42%] lg:pb-0">
            {/* paper wash keeps text readable over the 3D on small screens */}
            <div className="pointer-events-none absolute -inset-x-6 -top-24 -bottom-4 -z-10 bg-gradient-to-t from-paper via-paper/90 to-transparent lg:hidden" />
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="categories-title" className="stretch-narrow text-sm text-ink-2">
                Shop by category
              </h2>
              <p className="tabular stretch-narrow text-sm text-ink-3" aria-live="polite">
                {active + 1} of {n}
              </p>
            </div>

            <div className="relative mt-4 min-h-[clamp(9rem,24svh,14rem)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={cat.id}
                  initial={reduce ? { opacity: 0 } : ({ opacity: 0, y: 24, "--w": 66 } as never)}
                  animate={{ opacity: 1, y: 0, "--w": 118 } as never}
                  exit={reduce ? { opacity: 0 } : ({ opacity: 0, y: -18, "--w": 80 } as never)}
                  transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                >
                  <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ background: cat.band }} />
                  <p
                    className="text-[clamp(2.1rem,4.6vw,4rem)] leading-[0.98] font-medium tracking-[-0.025em]"
                    style={{ fontVariationSettings: '"wdth" var(--w, 118)' } as React.CSSProperties}
                  >
                    {cat.name}
                  </p>
                  <p className="mt-4 max-w-[30rem] text-base text-ink-2">{cat.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link href={`/shop?category=${cat.id}`} className={cat.id === "prescriptions" ? btn.rx : btn.primary}>
                      {cat.id === "prescriptions" ? "Browse prescription medicines" : `Browse ${cat.name.toLowerCase()}`}
                    </Link>
                    <span className="tabular text-sm text-ink-3">
                      {counts[cat.id]} {counts[cat.id] === 1 ? "product" : "products"}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <nav aria-label="Categories" className="mt-10 hidden lg:block">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {categories.map((c, k) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => goTo(k)}
                      aria-current={k === active ? "true" : undefined}
                      className="group flex items-center gap-2 py-1 text-sm text-ink-3 transition-colors hover:text-ink aria-[current=true]:text-ink"
                    >
                      <span
                        className="h-1 w-3 rounded-full transition-[width] duration-300 group-aria-[current=true]:w-6"
                        style={{ background: c.band }}
                        aria-hidden="true"
                      />
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
