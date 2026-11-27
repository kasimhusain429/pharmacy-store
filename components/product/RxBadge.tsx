/** Clear, text-first marker for prescription-only products. Colour is never the only signal. */
export function RxBadge({ size = "sm", className = "" }: { size?: "sm" | "md"; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-rx font-medium text-paper ${
        size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-2xs"
      } ${className}`}
    >
      <svg viewBox="0 0 16 16" className={size === "md" ? "size-3.5" : "size-3"} aria-hidden="true">
        <path
          d="M3 2.5h4.2a2.8 2.8 0 0 1 0 5.6H3m0-5.6v11m3.6-5.4 6 5.4m0-4.8-4.5 4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Prescription only
    </span>
  );
}

export function CategoryBand({ color, className = "" }: { color: string; className?: string }) {
  return <span aria-hidden="true" className={`block h-1 w-8 rounded-full ${className}`} style={{ background: color }} />;
}
