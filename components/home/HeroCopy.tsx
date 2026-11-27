"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { btn } from "@/components/ui/buttons";

gsap.registerPlugin(ScrollTrigger);

const LINES = ["Prescriptions and", "everyday health,", "from one counter."];

/**
 * The page's one orchestrated load moment: each headline line is "dispensed",
 * widening along Archivo's width axis as it settles. Pure CSS, so the text
 * appears even before JavaScript runs.
 */
export function HeroCopy() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const section = el?.closest("[data-chapter]");
    if (!el || !section) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 0,
        y: -48,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "16% top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="max-w-[40rem] lg:w-[50%]">
      <h1 className="text-[clamp(2.2rem,4.3vw,4.6rem)] leading-[0.98] font-medium tracking-[-0.025em] text-ink">
        {LINES.map((line, i) => (
          <span key={line} className="dispense-line block" style={{ animationDelay: `${150 + i * 120}ms` }}>
            {line}
          </span>
        ))}
      </h1>
      <div className="dispense-fade" style={{ animationDelay: "650ms" }}>
        <p className="mt-6 max-w-[32rem] text-base text-ink-2 lg:text-lg lg:leading-relaxed">
          Shop medicines, vitamins, skincare and health devices. Send your prescription and we’ll prepare it once a pharmacist
          has checked it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className={btn.primary}>
            Shop the pharmacy
          </Link>
          <Link href="/prescriptions" className={btn.secondary}>
            Send a prescription
          </Link>
        </div>
      </div>
    </div>
  );
}
