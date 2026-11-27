import Link from "next/link";
import { store } from "@/lib/store";

/** Capsule mark: the same two-piece capsule that spills out of the bottle on the home page. */
export function CapsuleMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g transform="rotate(-38 12 12)">
        <path d="M8 12V6.2a4 4 0 0 1 8 0V12Z" fill="var(--color-ink)" />
        <path d="M8 12v5.8a4 4 0 0 0 8 0V12Z" fill="var(--color-amber)" />
      </g>
    </svg>
  );
}

export function Wordmark({ tone = "ink", onNavigate }: { tone?: "ink" | "paper"; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={`group inline-flex items-center gap-2.5 ${tone === "paper" ? "text-paper" : "text-ink"}`}
      aria-label={`${store.name}, home`}
    >
      <CapsuleMark className="size-5 shrink-0 transition-transform sm:size-6 duration-500 ease-(--ease-out-quart) group-hover:rotate-[24deg]" />
      <span className="stretch-wide text-[0.85rem] font-semibold tracking-[-0.01em] whitespace-nowrap sm:text-[0.95rem]">{store.name}</span>
    </Link>
  );
}
