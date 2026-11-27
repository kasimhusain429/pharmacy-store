"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { store } from "@/lib/store";
import { btn } from "@/components/ui/buttons";
import { Checkbox, Choice, Field, FileDrop, Honeypot, TextArea, deviceHistory } from "@/components/forms/fields";

const methods = (["pickup", "delivery"] as const).filter((m) => (m === "pickup" ? store.fulfilment.pickup : store.fulfilment.delivery));

export function PrescriptionForm() {
  const [method, setMethod] = useState<"pickup" | "delivery">(methods[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reference) doneRef.current?.focus();
  }, [reference]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    fd.set("fulfilment", method);
    const file = fd.get("file");
    setErrors({});
    setFormError("");
    if (!(file instanceof File) || file.size === 0) {
      setErrors({ file: "Choose a photo or PDF of your prescription." });
      setFormError("Attach your prescription to send it.");
      requestAnimationFrame(() => alertRef.current?.focus());
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/prescriptions", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as Record<string, string>;
    setSubmitting(false);
    if (!res.ok) {
      setFormError(data.error ?? "Your prescription could not be sent.");
      if (data.field) setErrors({ [data.field]: data.error });
      requestAnimationFrame(() => alertRef.current?.focus());
      return;
    }
    deviceHistory.add("ps-prescriptions", data.reference);
    setReference(data.reference);
  }

  if (reference) {
    return (
      <div className="rounded-md bg-studio p-8">
        <h2 ref={doneRef} tabIndex={-1} className="stretch-semi text-2xl font-medium outline-none">
          Prescription sent
        </h2>
        <p className="mt-3 text-base text-ink-2">
          Your reference is <strong className="tabular font-medium text-ink">{reference}</strong>. A pharmacist will check it and the pharmacy will contact you about
          what can be supplied and how you’d like to receive it.
        </p>
        <p className="mt-3 text-sm text-ink-2">
          If you’re also ordering from the shop, choose “I’ve already sent it” at checkout. This reference is filled in for you on this device.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop?category=prescriptions" className={btn.primary}>
            See prescription medicines
          </Link>
          <Link href="/" className={btn.secondary}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6 rounded-md bg-paper-2/60 p-6 sm:p-8">
      <Honeypot />
      {formError ? (
        <div ref={alertRef} role="alert" tabIndex={-1} className="rounded-md border border-rx/40 bg-rx-soft/70 p-4 text-sm text-rx outline-none">
          {formError}
        </div>
      ) : null}
      <FileDrop error={errors.file} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Patient’s full name" name="name" autoComplete="name" required error={errors.name} hint="As written on the prescription." />
        <Field label="Patient’s date of birth" name="dateOfBirth" type="date" required error={errors.dateOfBirth} />
        <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required error={errors.phone} hint="The pharmacist may need to reach you." />
      </div>
      <fieldset>
        <legend className="text-sm font-medium">How you’d like to receive it</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {methods.map((m) => (
            <Choice
              key={m}
              name="method"
              value={m}
              checked={method === m}
              onChange={() => setMethod(m)}
              title={m === "pickup" ? "Collect in store" : "Delivery"}
              description={m === "pickup" ? "We let you know when it’s ready." : "We confirm the details with you."}
            />
          ))}
        </div>
      </fieldset>
      <TextArea label="Anything the pharmacist should know" name="notes" rows={3} maxLength={1000} error={errors.notes} />
      <Checkbox name="consent" required error={errors.consent}>
        I confirm this prescription is for the person named above, and I agree to the pharmacy storing it to check and supply the medicine and contacting me
        about it.
      </Checkbox>
      <button type="submit" disabled={submitting} className={`${btn.rx} w-full sm:w-auto`}>
        {submitting ? "Sending securely…" : "Send prescription"}
      </button>
    </form>
  );
}
