import type { Metadata } from "next";
import Link from "next/link";
import { PrescriptionForm } from "./PrescriptionForm";

export const metadata: Metadata = {
  title: "Send a prescription",
  description: "Upload a photo or PDF of your prescription. A pharmacist checks it before anything is prepared.",
};

const STEPS = [
  ["Send it", "Upload a clear photo or PDF of your prescription with the patient’s details."],
  ["We check it", "A pharmacist reviews it. If anything is unclear, we contact you before going further."],
  ["We confirm", "We confirm what can be supplied, the total and how you’d like to receive it."],
  ["You receive it", "Collect it in store or have it delivered, as you choose."],
];

export default function PrescriptionsPage() {
  return (
    <div className="gutter mx-auto max-w-[96rem] pt-28 pb-24 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-band-prescriptions" />
          <h1 className="stretch-wide mt-5 text-[clamp(2.2rem,4.6vw,4rem)] leading-[0.98] font-medium tracking-[-0.03em]">Send a prescription</h1>
          <p className="mt-5 max-w-md text-base text-ink-2">
            Prescription medicines are only supplied against a valid prescription. Send yours here, or add prescription medicines to your cart and attach it at
            checkout.
          </p>
          <ol className="mt-10 space-y-6">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[2.25rem_1fr] gap-x-3">
                <span className="tabular stretch-narrow pt-0.5 text-sm text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-base font-medium">{title}</h2>
                  <p className="mt-1 text-sm text-ink-2">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-md border border-ink/15 p-5 text-sm text-ink-2">
            <p className="font-medium text-ink">How your prescription is handled</p>
            <p className="mt-2">
              It is stored privately on the pharmacy’s system and only the pharmacy team can open it. It is used to check and supply your medicine. Read the{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                privacy notice
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <PrescriptionForm />
        </div>
      </div>
    </div>
  );
}
