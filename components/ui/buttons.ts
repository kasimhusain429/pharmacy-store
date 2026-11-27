/** Capsule-shaped buttons. Kept as class strings so links and buttons share them. */
export const btn = {
  primary:
    "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition-[background-color,transform] duration-200 hover:bg-night-2 active:scale-[0.98] disabled:opacity-60",
  secondary:
    "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/25 px-6 text-sm font-medium text-ink transition-[border-color,background-color] duration-200 hover:border-ink/60 hover:bg-ink/[0.03]",
  rx: "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rx px-6 text-sm font-medium text-paper transition-colors duration-200 hover:bg-[#62190f] disabled:opacity-60",
  link: "underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink",
};
