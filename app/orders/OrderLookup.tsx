"use client";

import { useEffect, useRef, useState } from "react";
import { ORDER_STATUS_LABEL, PRESCRIPTION_STATUS_LABEL, type OrderSummary } from "@/lib/orders";
import { formatPrice } from "@/lib/store";
import { btn } from "@/components/ui/buttons";
import { Field, useDeviceHistory } from "@/components/forms/fields";

const fmtDate = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function OrderLookup() {
  const recent = useDeviceHistory("ps-orders");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (order) resultRef.current?.focus();
  }, [order]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    setOrder(null);
    const res = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: fd.get("reference"), email: fd.get("email") }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "We couldn't check that order. Try again.");
    setOrder(data as OrderSummary);
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <form onSubmit={onSubmit} className="space-y-5">
          <Field
            label="Order reference"
            name="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="ORD-XXXXXXXX"
            autoCapitalize="characters"
            autoComplete="off"
            required
          />
          <Field label="Email address" name="email" type="email" autoComplete="email" required />
          {error ? (
            <p role="alert" className="text-sm text-rx">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={loading} className={btn.primary}>
            {loading ? "Checking…" : "Check order"}
          </button>
        </form>

        {recent.length ? (
          <div className="mt-10">
            <p className="stretch-narrow text-xs text-ink-3">Placed on this device</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {recent.map((r) => (
                <li key={r.reference}>
                  <button
                    type="button"
                    onClick={() => setReference(r.reference)}
                    className="tabular rounded-full border border-ink/15 px-3 py-1.5 text-sm hover:border-ink/40"
                  >
                    {r.reference}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="lg:col-span-7" aria-live="polite">
        {order ? (
          <div className="rounded-md bg-studio p-6 sm:p-8">
            <h2 ref={resultRef} tabIndex={-1} className="tabular stretch-semi text-2xl font-medium outline-none">
              {order.reference}
            </h2>
            <p className="mt-1 text-sm text-ink-3">
              Placed {fmtDate(order.createdAt)}, for {order.fulfilment === "pickup" ? "collection in store" : "delivery"}
            </p>
            <p className="mt-6 text-sm text-ink-3">Current status</p>
            <p className="mt-1 text-xl">{ORDER_STATUS_LABEL[order.status]}</p>
            {order.prescriptionStatus ? <p className="mt-2 text-sm text-ink-2">Prescription: {PRESCRIPTION_STATUS_LABEL[order.prescriptionStatus]}</p> : null}

            <ol className="mt-6 space-y-3 border-l border-paper-3 pl-5">
              {order.statusHistory.map((h, i) => (
                <li key={`${h.status}-${h.at}`} className="relative text-sm">
                  <span
                    aria-hidden="true"
                    className={`absolute top-1.5 -left-[1.5rem] size-2.5 rounded-full ${i === order.statusHistory.length - 1 ? "bg-ink" : "bg-paper-3"}`}
                  />
                  <span className="font-medium">{ORDER_STATUS_LABEL[h.status]}</span>
                  <span className="block text-ink-3">{fmtDate(h.at)}</span>
                </li>
              ))}
            </ol>

            <ul className="mt-8 divide-y divide-paper-3 border-y border-paper-3 text-sm">
              {order.items.map((i) => (
                <li key={i.slug} className="flex justify-between gap-4 py-3">
                  <span>
                    {i.name}
                    {i.requiresPrescription ? <span className="text-rx"> (prescription)</span> : <span className="text-ink-3"> × {i.qty}</span>}
                  </span>
                  <span className="tabular">{formatPrice(i.unitPrice * i.qty)}</span>
                </li>
              ))}
              <li className="flex justify-between py-3 font-medium">
                <span>Subtotal</span>
                <span className="tabular">{formatPrice(order.subtotal)}</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="guilloche flex min-h-64 items-center justify-center rounded-md border border-dashed border-ink/20 p-8 text-center text-sm text-ink-3">
            Your order’s status will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
