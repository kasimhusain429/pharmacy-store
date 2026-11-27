"use client";

import dynamic from "next/dynamic";
import { useCallback, useLayoutEffect, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { categories } from "@/lib/catalog";
import { range, smooth, stage } from "./stage";

const HomeScene = dynamic(() => import("./scene/HomeScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/** Holds at each category before turning the carousel to the next one. */
export function categoryFromProgress(p: number) {
  const n = categories.length;
  const hold = 0.35;
  const raw = Math.min(n - 1, Math.max(0, p * (n - 1 + hold * 2) - hold));
  const i = Math.floor(raw);
  const f = raw - i;
  return Math.min(n - 1, i + smooth(range(f, 0.2, 0.8)));
}

export function HomeStage({ children }: { children: ReactNode }) {
  const [mountId, setMountId] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const [idle, setIdle] = useState(false);

  // Runs on first mount and every time Activity reveals the route again:
  // a fresh canvas element avoids reusing a disposed WebGL context.
  useLayoutEffect(() => {
    // Intentional: a new key per reveal gives the canvas a fresh WebGL context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMountId((n) => n + 1);
    setReady(false);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.reducedMotion = reduced;

    const testCanvas = document.createElement("canvas");
    if (!testCanvas.getContext("webgl2") && !testCanvas.getContext("webgl")) setFailed(true);

    let lenis: Lenis | null = null;
    const raf = (time: number) => lenis?.raf(time * 1000);
    if (!reduced) {
      lenis = new Lenis({ autoRaf: false, lerp: 0.11, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      const l = lenis;
      stage.scrollTo = (y) => l.scrollTo(y, { duration: 1.4 });
    } else {
      stage.scrollTo = (y) => window.scrollTo({ top: y });
    }

    const ctx = gsap.context(() => {
      const chapter = (name: "opening" | "categories" | "rx", onProgress: (p: number) => void) => {
        const el = document.querySelector<HTMLElement>(`[data-chapter="${name}"]`);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => onProgress(self.progress),
          onToggle: (self) => {
            if (self.isActive) stage.chapter = name;
          },
          onRefresh: (self) => onProgress(self.progress),
        });
      };
      chapter("opening", (p) => (stage.opening = p));
      chapter("categories", (p) => (stage.category = categoryFromProgress(p)));
      chapter("rx", (p) => (stage.rx = p));
    });

    // Pause WebGL while opaque sections cover the whole screen.
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el);
        else visible.delete(el);
      }
      stage.active = visible.size > 0;
      const current = [...visible].find((el) => el.dataset.chapter === stage.chapter);
      const first = [...visible][0];
      if (!current && first?.dataset.chapter) stage.chapter = first.dataset.chapter as typeof stage.chapter;
    });
    document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));

    const onPointer = (e: PointerEvent) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stage.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    // Start the 3D scene once the page has painted, so text and buttons are never held up by WebGL setup.
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const idleId = ric(() => setIdle(true), { timeout: 1500 });

    return () => {
      window.clearTimeout(t);
      cic(idleId);
      window.removeEventListener("pointermove", onPointer);
      io.disconnect();
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className="relative">
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-(--ease-out-quart) ${ready ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        {mountId > 0 && idle && !failed ? <HomeScene key={mountId} onReady={onReady} onProgress={setProgress} /> : null}
      </div>
      {!ready && !failed ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-0.5" aria-hidden="true">
          <div className="h-full bg-amber transition-[width] duration-300" style={{ width: `${Math.max(6, progress)}%` }} />
        </div>
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
