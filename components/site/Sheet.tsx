"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Modal sheet built on the native <dialog> element, which gives focus
 * trapping, Escape to close and an inert page behind it for free.
 * Entry/exit motion is CSS (@starting-style), so it shows what changed
 * without blocking interaction.
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  labelledBy,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "top" | "full";
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Activity keeps hidden routes mounted: make sure a sheet never stays open off-screen.
  useEffect(() => () => ref.current?.close(), []);

  const placement =
    side === "right"
      ? "ml-auto h-dvh max-h-dvh w-full max-w-[28rem] translate-x-0 starting:translate-x-full [&:not([open])]:translate-x-full"
      : side === "top"
        ? "mt-0 w-full max-w-none max-h-[90dvh] translate-y-0 starting:-translate-y-6 [&:not([open])]:-translate-y-6"
        : "h-dvh max-h-dvh w-full max-w-none";

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`m-0 bg-transparent p-0 text-ink opacity-100 transition-[opacity,translate,overlay,display] duration-300 ease-(--ease-out-quart) transition-discrete backdrop:bg-ink/40 backdrop:transition-opacity backdrop:duration-300 starting:opacity-0 starting:backdrop:opacity-0 [&:not([open])]:opacity-0 ${placement} ${className}`}
    >
      {children}
    </dialog>
  );
}
