import type { Metadata } from "next";
import Link from "next/link";
import { store } from "@/lib/store";

export const metadata: Metadata = { title: "Privacy" };

/*
 * This notice describes what this website's code actually does with data.
 * The pharmacy should review it against its own legal and regulatory duties
 * (for example retention periods) and add its contact details in lib/store.ts.
 */
const SECTIONS: [string, string[]][] = [
  [
    "What we collect",
    [
      "When you place an order: your name, email address, phone number, delivery address if you choose delivery, the products you ordered and any note you add.",
      "When you send a prescription: the file you upload, the patient’s name and date of birth, your email address and phone number, and any note you add.",
      "When you send a message: your name, email address, phone number if you give it, and your message.",
    ],
  ],
  ["Why we use it", ["To check prescriptions, prepare and supply your order, and contact you about it. We don’t use these details for marketing."]],
  [
    "Where it is kept and who can see it",
    [
      "Details are stored on the pharmacy’s own system, not on this website’s public pages. Prescription files are stored privately and can only be opened by the pharmacy team through a password-protected staff area.",
      "Order status can be checked with the order reference together with the email address used, and the answer never shows your contact or address details.",
    ],
  ],
  [
    "Stored in your browser",
    [
      "Your cart, and the order and prescription references created on your device, are kept in your browser’s local storage so you can find them again. They contain no personal details, and you can remove them by clearing this site’s data in your browser.",
      "This website doesn’t use advertising or analytics cookies.",
    ],
  ],
  [
    "Your choices",
    [
      "You can ask the pharmacy for a copy of the details it holds about you, or to correct or delete them, where the law allows. Pharmacies may have to keep some prescription records for a set period.",
    ],
  ],
];

export default function PrivacyPage() {
  return (
    <div className="gutter mx-auto max-w-3xl pt-28 pb-24 sm:pt-32">
      <h1 className="stretch-wide text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.03em]">Privacy</h1>
      <p className="mt-5 text-base text-ink-2">How {store.name} handles the details you give us on this website.</p>
      <div className="mt-12 space-y-12">
        {SECTIONS.map(([title, paras]) => (
          <section key={title}>
            <h2 className="text-xl font-medium">{title}</h2>
            {paras.map((p) => (
              <p key={p} className="mt-3 text-base text-ink-2">
                {p}
              </p>
            ))}
          </section>
        ))}
        <section>
          <h2 className="text-xl font-medium">Contact</h2>
          <p className="mt-3 text-base text-ink-2">
            For questions about your data,{" "}
            <Link href="/contact" className="underline underline-offset-4">
              contact the pharmacy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
