import type { Metadata } from "next";
import { Suspense } from "react";
import { StaffArea } from "./StaffArea";

export const metadata: Metadata = { title: "Staff", robots: { index: false, follow: false } };

export default function StaffPage({ searchParams }: { searchParams: Promise<{ tab?: string; error?: string }> }) {
  return (
    <div className="gutter mx-auto max-w-[96rem] pt-28 pb-24 sm:pt-32">
      <Suspense fallback={<p className="text-sm text-ink-3">Loading…</p>}>
        <StaffArea searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
