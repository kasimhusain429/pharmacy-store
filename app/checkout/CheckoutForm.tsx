"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cart, useCart, type CartItem } from "@/lib/cart";
import { formatPrice, store } from "@/lib/store";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/orders";
import { btn } from "@/components/ui/buttons";
import { QtyStepper } from "@/components/site/CartDrawer";
import { Checkbox, Choice, Field, FileDrop, Honeypot, TextArea, deviceHistory, useDeviceHistory } from "@/components/forms/fields";

type Errors = Record<string, string>;
type Done = { reference: string; subtotal: number; status: OrderStatus; items: CartItem[]; method: "pickup" | "delivery"; rxReference?: string };

const methods = (["pickup", "delivery"] as const).filter((m) => (m === "pickup" ? store.fulfilment.pickup : store.fulfilment.delivery));

async function post(url: string, body: BodyInit, json = true) {
  const res = await fetch(url, { method: "POST", body, headers: json ? { "Content-Type": "application/json" } : undefined });
  const data = (await res.json().catch(() => ({}))) as Record<string, string>;
  return { ok: res.ok, data };
}

function StepHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 text-lg font-medium">
      <span className="tabular stretch-narrow text-sm text-ink-3">{String(n).padStart(2, "0")}</span>
      {children}
    </h2>
  );
}

export function CheckoutForm() {
  const { items, subtotal, hasRx, ready } = useCart();
  const [method, setMethod] = useState<"pickup" | "delivery">(methods[0]);
  const [rxMode, setRxMode] = useState<"upload" | "reference">("upload");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const savedRx = useDeviceHistory("ps-prescriptions")[0]?.reference ?? "";
  const alertRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const fail = (message: string, fieldErrors: Errors = {}) => {
    setErrors(fieldErrors);
    setFormError(message);
    setSubmitting(false);
    requestAnimationFrame(() => alertRef.current?.focus());
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setErrors({});
    setFormError("");

    const contact = { name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone") };
    let rxReference = String(fd.get("prescriptionReference") ?? "").trim();

    if (hasRx && rxMode === "upload") {
      const file = fd.get("file");
      if (!(file instanceof File) || file.size === 0) return fail("Attach your prescription to continue.", { file: "Choose a photo or PDF of your prescription." });
      const rx = new FormData();
      rx.set("name", String(fd.get("patientName") || contact.name || ""));
      rx.set("dateOfBirth", String(fd.get("dateOfBirth") ?? ""));
      rx.set("email", String(contact.email ?? ""));
      rx.set("phone", String(contact.phone ?? ""));
      rx.set("fulfilment", method);
      rx.set("consent", fd.get("consent") ? "on" : "");
      rx.set("company", String(fd.get("company") ?? ""));
      rx.set("file", file);
      const r = await post("/api/prescriptions", rx, false);
      if (!r.ok) {
        const map: Record<string, string> = { name: "patientName", email: "email", phone: "phone", dateOfBirth: "dateOfBirth", file: "file", consent: "consent" };
        return fail(r.data.error ?? "Your prescription could not be sent.", r.data.field ? { [map[r.data.field] ?? r.data.field]: r.data.error } : {});
      }
      rxReference = r.data.reference;
      deviceHistory.add("ps-prescriptions", rxReference);
    }

    const body = {
      items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
      contact,
      fulfilment: {
        method,
        address: method === "delivery" ? { line1: fd.get("line1"), line2: fd.get("line2"), city: fd.get("city"), postcode: fd.get("postcode") } : undefined,
      },
      prescriptionReference: hasRx ? rxReference : undefined,
      notes: fd.get("notes"),
      consent: Boolean(fd.get("consent")),
      company: fd.get("company"),
    };
    const r = await post("/api/orders", JSON.stringify(body));
    if (!r.ok) return fail(r.data.error ?? "Your order could not be placed.", r.data.field ? { [r.data.field]: r.data.error } : {});

    deviceHistory.add("ps-orders", r.data.reference);
    setDone({
      reference: r.data.reference,
      subtotal: Number(r.data.subtotal),
      status: r.data.status as OrderStatus,
      items,
      method,
      rxReference: hasRx ? rxReference : undefined,
    });
    cart.clear();
    setSubmitting(false);
    window.scrollTo({ top: 0 });
  }

  if (done) {
    return (
      <div className="gutter mx-auto max-w-3xl pt-32 pb-24">
        <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-band-everyday" />
        <h1 ref={doneRef} tabIndex={-1} className="stretch-semi mt-5 text-[clamp(2rem,4vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.02em] outline-none">
          Order request sent
        </h1>
        <p className="mt-4 text-base text-ink-2">
          Your reference is <strong className="tabular font-medium text-ink">{done.reference}</strong>. Keep it to check your order.
        </p>
        <div className="mt-8 rounded-md border border-ink/15 bg-studio p-6">
          <p className="text-sm text-ink-3">Status</p>
          <p className="mt-1 text-lg">{ORDER_STATUS_LABEL[done.status]}</p>
          <ul className="mt-5 divide-y divide-paper-3 border-t border-paper-3 text-sm">
            {done.items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-4 py-3">
                <span>
                  {i.product.brand ? `${i.product.brand} ` : ""}
                  {i.product.name}
                  {i.product.requiresPrescription ? <span className="text-rx"> (prescription)</span> : <span className="text-ink-3"> × {i.qty}</span>}
                </span>
                <span className="tabular">{formatPrice(i.lineTotal)}</span>
              </li>
            ))}
            <li className="flex justify-between py-3 font-medium">
              <span>Subtotal</span>
              <span className="tabular">{formatPrice(done.subtotal)}</span>
            </li>
          </ul>
        </div>
        <h2 className="mt-10 text-lg font-medium">What happens next</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-2">
          {done.rxReference ? (
            <li>
              A pharmacist checks your prescription ({done.rxReference}). Nothing is prepared until it has been checked. If anything is unclear, the
              pharmacy contacts you.
            </li>
          ) : null}
          <li>The pharmacy confirms what’s available, your total and how to pay.</li>
          <li>{done.method === "pickup" ? "You collect your order in store." : "Your order is delivered to the address you gave."}</li>
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/orders" className={btn.primary}>
            Check this order
          </Link>
          <Link href="/shop" className={btn.secondary}>
            Back to the shop
          </Link>
        </div>
      </div>
    );
  }

  if (ready && items.length === 0) {
    return (
      <div className="gutter mx-auto max-w-3xl pt-32 pb-24">
        <h1 className="stretch-semi text-[clamp(2rem,4vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.02em]">Your cart is empty</h1>
        <p className="mt-4 text-base text-ink-2">Add products to your cart, or send a prescription on its own.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className={btn.primary}>
            Browse the shop
          </Link>
          <Link href="/prescriptions" className={btn.secondary}>
            Send a prescription
          </Link>
        </div>
      </div>
    );
  }

  let step = 0;
  return (
    <div className="gutter mx-auto max-w-[96rem] pt-28 pb-24 sm:pt-32">
      <h1 className="stretch-wide text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.98] font-medium tracking-[-0.03em]">Checkout</h1>
      <p className="mt-3 max-w-2xl text-base text-ink-2">{store.payment.note}</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <form onSubmit={onSubmit} className="relative space-y-12 lg:col-span-7" aria-describedby={formError ? "checkout-error" : undefined}>
          <Honeypot />
          {formError ? (
            <div ref={alertRef} id="checkout-error" role="alert" tabIndex={-1} className="rounded-md border border-rx/40 bg-rx-soft/70 p-4 text-sm text-rx outline-none">
              {formError}
            </div>
          ) : null}

          <section className="space-y-5" aria-labelledby="step-details">
            <div id="step-details">
              <StepHeading n={++step}>Your details</StepHeading>
            </div>
            <Field label="Full name" name="name" autoComplete="name" required error={errors.name} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} hint="For your order reference and updates." />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" required error={errors.phone} hint="The pharmacy may call to confirm your order." />
            </div>
          </section>

          <section className="space-y-5" aria-labelledby="step-fulfilment">
            <div id="step-fulfilment">
              <StepHeading n={++step}>How you’d like to get it</StepHeading>
            </div>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Collection or delivery">
              {methods.includes("pickup") ? (
                <Choice name="method" value="pickup" checked={method === "pickup"} onChange={() => setMethod("pickup")} title="Collect in store" description="We let you know when it’s ready." />
              ) : null}
              {methods.includes("delivery") ? (
                <Choice
                  name="method"
                  value="delivery"
                  checked={method === "delivery"}
                  onChange={() => setMethod("delivery")}
                  title="Delivery"
                  description={store.fulfilment.deliveryNote ?? "The pharmacy confirms delivery details and any charge with you."}
                />
              ) : null}
            </div>
            {errors.fulfilment ? <p className="text-sm text-rx">{errors.fulfilment}</p> : null}
            {method === "delivery" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field className="sm:col-span-2" label="Address" name="line1" autoComplete="address-line1" required error={errors.line1} />
                <Field className="sm:col-span-2" label="Apartment, suite or building" name="line2" autoComplete="address-line2" error={errors.line2} />
                <Field label="City" name="city" autoComplete="address-level2" required error={errors.city} />
                <Field label="ZIP code" name="postcode" autoComplete="postal-code" required error={errors.postcode} />
              </div>
            ) : null}
          </section>

          {hasRx ? (
            <section className="space-y-5" aria-labelledby="step-rx">
              <div id="step-rx">
                <StepHeading n={++step}>Your prescription</StepHeading>
                <p className="mt-2 text-sm text-ink-2">
                  Your cart includes prescription medicine. A pharmacist checks your prescription before anything is prepared.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="How to provide your prescription">
                <Choice name="rxMode" value="upload" checked={rxMode === "upload"} onChange={() => setRxMode("upload")} title="Upload it now" description="A photo or PDF." />
                <Choice
                  name="rxMode"
                  value="reference"
                  checked={rxMode === "reference"}
                  onChange={() => setRxMode("reference")}
                  title="I’ve already sent it"
                  description="Use the reference you were given."
                />
              </div>
              {rxMode === "upload" ? (
                <>
                  <FileDrop error={errors.file} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Patient’s full name" name="patientName" autoComplete="off" required error={errors.patientName} hint="As written on the prescription." />
                    <Field label="Patient’s date of birth" name="dateOfBirth" type="date" required error={errors.dateOfBirth} hint="Used to match the prescription." />
                  </div>
                </>
              ) : (
                <Field
                  key={savedRx}
                  label="Prescription reference"
                  name="prescriptionReference"
                  defaultValue={savedRx}
                  placeholder="RX-XXXXXXXX"
                  required
                  autoCapitalize="characters"
                  error={errors.prescriptionReference}
                  hint="Use the same email address you gave when you sent it."
                />
              )}
            </section>
          ) : null}

          <section className="space-y-5" aria-labelledby="step-confirm">
            <div id="step-confirm">
              <StepHeading n={++step}>Confirm</StepHeading>
            </div>
            <TextArea label="Anything the pharmacy should know" name="notes" maxLength={1000} error={errors.notes} rows={3} />
            <Checkbox name="consent" required error={errors.consent}>
              I confirm these details are correct, and I agree to the pharmacy storing them to process this order and contacting me about it. See the{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                privacy notice
              </Link>
              .
            </Checkbox>
            <button type="submit" disabled={submitting || !ready} className={`${hasRx ? btn.rx : btn.primary} w-full sm:w-auto`}>
              {submitting ? "Sending your order…" : "Place order request"}
            </button>
            <p className="text-xs text-ink-3">No payment is taken now. The pharmacy confirms availability and your total before preparing anything.</p>
          </section>
        </form>

        <aside className="lg:col-span-5" aria-labelledby="summary-title">
          <div className="rounded-md bg-studio p-6 lg:sticky lg:top-28">
            <h2 id="summary-title" className="text-lg font-medium">
              Order summary
            </h2>
            <ul className="mt-4 divide-y divide-paper-3">
              {items.map(({ slug, qty, product, lineTotal }) => (
                <li key={slug} className="flex gap-4 py-4">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-[3px] bg-paper">
                    <Image src={product.image} alt="" fill sizes="64px" className="object-contain p-1" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="font-medium">{product.brand ? `${product.brand} ${product.name}` : product.name}</span>
                      <span className="tabular">{formatPrice(lineTotal)}</span>
                    </div>
                    {product.requiresPrescription ? (
                      <p className="text-xs text-rx">Prescription needed. Quantity as prescribed.</p>
                    ) : (
                      <div className="mt-1 flex items-center justify-between">
                        <QtyStepper slug={slug} qty={qty} label={product.name} />
                        <button type="button" onClick={() => cart.remove(slug)} className="text-xs text-ink-3 hover:text-ink hover:underline">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-baseline justify-between border-t border-paper-3 pt-4">
              <span className="text-sm text-ink-2">Subtotal</span>
              <span className="tabular text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs text-ink-3">
              Prices are the listed prices. {method === "delivery" ? "Any delivery charge is confirmed by the pharmacy. " : ""}You pay once the pharmacy has
              confirmed your order.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
