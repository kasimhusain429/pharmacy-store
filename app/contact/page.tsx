import type { Metadata } from "next";
import { StoreDetails } from "@/components/site/SiteFooter";
import { store } from "@/lib/store";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact", description: `Get in touch with ${store.name}.` };

export default function ContactPage() {
  return (
    <div className="gutter mx-auto max-w-[96rem] pt-28 pb-24 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h1 className="stretch-wide text-[clamp(2.2rem,4.6vw,4rem)] leading-[0.98] font-medium tracking-[-0.03em]">Contact the pharmacy</h1>
          <p className="mt-5 max-w-md text-base text-ink-2">
            Ask about a product, an order or a prescription. The pharmacy team replies by email or phone.
          </p>
          <div className="mt-10">
            <StoreDetails tone="ink" />
          </div>
          <p className="mt-10 max-w-md rounded-md border border-rx/30 bg-rx-soft/50 p-4 text-sm text-ink">{store.emergencyNotice}</p>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
