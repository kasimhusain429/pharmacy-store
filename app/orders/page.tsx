import type { Metadata } from "next";
import { OrderLookup } from "./OrderLookup";

export const metadata: Metadata = { title: "Check an order", robots: { index: false } };

export default function OrdersPage() {
  return (
    <div className="gutter mx-auto max-w-[96rem] pt-28 pb-24 sm:pt-32">
      <div className="max-w-2xl">
        <h1 className="stretch-wide text-[clamp(2.2rem,4.6vw,4rem)] leading-[0.98] font-medium tracking-[-0.03em]">Check an order</h1>
        <p className="mt-4 text-base text-ink-2">Enter your order reference and the email address you used. We’ll show where your order is up to.</p>
      </div>
      <OrderLookup />
    </div>
  );
}
