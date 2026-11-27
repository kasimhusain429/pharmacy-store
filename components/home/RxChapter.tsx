"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { store } from "@/lib/store";
import { btn } from "@/components/ui/buttons";

gsap.registerPlugin(ScrollTrigger);

const fulfilment = [store.fulfilment.pickup && "collect it in store", store.fulfilment.delivery && "have it delivered"].filter(Boolean).join(" or ");

const STEPS = [
  {
    title: "Send your prescription",
    body: "Upload a clear photo or PDF of your prescription. You can also add prescription medicines to your cart and attach it at checkout.",
  },
  {
    title: "A pharmacist checks it",
    body: "Nothing is prepared until a pharmacist has reviewed your prescription. If anything is unclear, we contact you first.",
  },
  {
    title: "We prepare your medicine",
    body: "Your medicine is labelled with your prescriber’s directions and the pharmacy’s details.",
  },
  {
    title: "Collect or receive it",
    body: `Choose to ${fulfilment} when you order. We confirm the details and the total with you before anything is handed over.`,
  },
];

export function RxChapter() {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [p, setP] = useState(0);

  useLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setP(self.progress);
        setStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={section} data-chapter="rx" aria-labelledby="rx-title" className="relative" style={{ height: "340svh" }}>
      <div className="sticky top-0 flex h-svh flex-col justify-end lg:justify-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-paper from-30% via-paper/80 to-transparent lg:block" aria-hidden="true" />
        <div className="gutter relative mx-auto w-full max-w-[96rem]">
          <div className="relative max-w-[32rem] pb-8 lg:w-[40%] lg:pb-0">
            <div className="pointer-events-none absolute -inset-x-6 -top-24 -bottom-4 -z-10 bg-gradient-to-t from-paper via-paper/90 to-transparent lg:hidden" />
            <h2 id="rx-title" className="stretch-semi text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.02] font-medium tracking-[-0.02em]">
              How prescriptions work here
            </h2>

            <ol className="mt-8 space-y-1">
              {STEPS.map((s, i) => {
                const local = Math.min(1, Math.max(0, p * STEPS.length - i));
                const current = i === step;
                return (
                  <li key={s.title} className={`${current ? "" : "hidden lg:block"}`} aria-current={current ? "step" : undefined}>
                    <div className={`grid grid-cols-[2.25rem_1fr] gap-x-3 py-3 transition-opacity duration-300 ${current ? "opacity-100" : "opacity-45"}`}>
                      <span className="tabular stretch-narrow pt-0.5 text-sm text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="text-lg font-medium">{s.title}</h3>
                        <div
                          className={`grid transition-[grid-template-rows] duration-500 ease-(--ease-out-quart) ${current ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                        >
                          <p className="overflow-hidden text-sm text-ink-2">
                            <span className="block pt-1.5">{s.body}</span>
                          </p>
                        </div>
                        <span className="mt-3 block h-px w-full bg-paper-3" aria-hidden="true">
                          <span className="block h-px bg-ink" style={{ width: `${local * 100}%` }} />
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/prescriptions" className={btn.rx}>
                Send a prescription
              </Link>
              <Link href="/shop?category=prescriptions" className={btn.secondary}>
                See prescription medicines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
