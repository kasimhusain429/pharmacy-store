"use client";

import dynamic from "next/dynamic";

const StudioRenderer = dynamic(() => import("./StudioRenderer"), { ssr: false });

export function StudioClient() {
  return (
    <div className="gutter pt-24 pb-20">
      <h1 className="stretch-wide text-2xl font-semibold">Render studio</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-2">
        Renders each modelled product on the studio set and saves it to public/products. Development only.
      </p>
      <StudioRenderer />
    </div>
  );
}
