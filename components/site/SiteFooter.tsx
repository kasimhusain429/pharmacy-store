import Link from "next/link";
import { categories } from "@/lib/catalog";
import { store } from "@/lib/store";
import { DevHint } from "./DevHint";
import { Wordmark } from "./Wordmark";

export function StoreDetails({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  const muted = tone === "paper" ? "text-paper/65" : "text-ink-3";
  const { address, phone, email, openingHours } = store;
  return (
    <div className="space-y-5 text-sm">
      {address ? (
        <address className="not-italic">
          <p className={`stretch-narrow text-xs ${muted}`}>Address</p>
          <p className="mt-1">
            {address.line1}
            {address.line2 ? <>, {address.line2}</> : null}
            <br />
            {address.city}
            {address.region ? `, ${address.region}` : ""} {address.postcode}
          </p>
          {address.mapUrl ? (
            <a href={address.mapUrl} className="mt-1 inline-block underline underline-offset-4" target="_blank" rel="noreferrer">
              Open in maps
            </a>
          ) : null}
        </address>
      ) : (
        <DevHint>Add the store address in lib/store.ts</DevHint>
      )}

      {openingHours?.length ? (
        <div>
          <p className={`stretch-narrow text-xs ${muted}`}>Opening hours</p>
          <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
            {openingHours.map((h) => (
              <div key={h.days} className="contents">
                <dt>{h.days}</dt>
                <dd className="tabular">{h.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <DevHint>Add opening hours in lib/store.ts</DevHint>
      )}

      {phone || email ? (
        <div>
          <p className={`stretch-narrow text-xs ${muted}`}>Contact</p>
          {phone ? (
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="mt-1 block underline-offset-4 hover:underline">
              {phone}
            </a>
          ) : null}
          {email ? (
            <a href={`mailto:${email}`} className="block underline-offset-4 hover:underline">
              {email}
            </a>
          ) : null}
        </div>
      ) : (
        <DevHint>Add a phone number or email in lib/store.ts</DevHint>
      )}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 bg-night text-paper">
      <div className="gutter mx-auto max-w-[96rem] pt-16 pb-10 sm:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Wordmark tone="paper" />
            <p className="mt-5 max-w-sm text-sm text-paper/70">{store.description}</p>
          </div>

          <nav aria-label="Shop" className="md:col-span-3">
            <p className="stretch-narrow text-xs text-paper/55">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?category=${c.id}`} className="underline-offset-4 hover:underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pharmacy" className="md:col-span-2">
            <p className="stretch-narrow text-xs text-paper/55">Pharmacy</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/prescriptions" className="underline-offset-4 hover:underline">
                  Send a prescription
                </Link>
              </li>
              <li>
                <Link href="/orders" className="underline-offset-4 hover:underline">
                  Check an order
                </Link>
              </li>
              <li>
                <Link href="/about" className="underline-offset-4 hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="underline-offset-4 hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="underline-offset-4 hover:underline">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="stretch-narrow mb-3 text-xs text-paper/55">Visit</p>
            <StoreDetails />
          </div>
        </div>

        <p className="mt-16 max-w-3xl border-t border-paper/15 pt-6 text-xs text-paper/70">{store.emergencyNotice}</p>
        <p className="mt-6 text-xs text-paper/50">© {store.name}</p>
      </div>
    </footer>
  );
}
