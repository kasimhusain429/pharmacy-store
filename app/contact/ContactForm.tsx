"use client";

import { useEffect, useRef, useState } from "react";
import { ENQUIRY_TOPICS } from "@/lib/orders";
import { btn } from "@/components/ui/buttons";
import { Checkbox, Field, Honeypot, Select, TextArea } from "@/components/forms/fields";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reference) doneRef.current?.focus();
  }, [reference]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setErrors({});
    setFormError("");
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(fd), consent: Boolean(fd.get("consent")) }),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, string>;
    setSubmitting(false);
    if (!res.ok) {
      setFormError(data.error ?? "Your message could not be sent.");
      if (data.field) setErrors({ [data.field]: data.error });
      return;
    }
    setReference(data.reference);
  }

  if (reference) {
    return (
      <div className="rounded-md bg-studio p-8">
        <h2 ref={doneRef} tabIndex={-1} className="stretch-semi text-2xl font-medium outline-none">
          Message sent
        </h2>
        <p className="mt-3 text-base text-ink-2">
          Thanks. Your reference is <strong className="tabular font-medium text-ink">{reference}</strong>. The pharmacy team will reply using the details you gave.
        </p>
        <button type="button" onClick={() => setReference(null)} className={`${btn.secondary} mt-8`}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6 rounded-md bg-paper-2/60 p-6 sm:p-8">
      <Honeypot />
      {formError ? (
        <p role="alert" className="rounded-md border border-rx/40 bg-rx-soft/70 p-4 text-sm text-rx">
          {formError}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" error={errors.phone} />
        <Select label="What’s it about?" name="topic" defaultValue={ENQUIRY_TOPICS[0]} error={errors.topic}>
          {ENQUIRY_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>
      <TextArea
        label="Message"
        name="message"
        required
        minLength={10}
        maxLength={2000}
        rows={6}
        error={errors.message}
        hint="Include an order or prescription reference if you have one. Please don’t send urgent medical questions here."
      />
      <Checkbox name="consent" required error={errors.consent}>
        I agree to the pharmacy storing this message and contacting me about it.
      </Checkbox>
      <button type="submit" disabled={submitting} className={btn.primary}>
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
