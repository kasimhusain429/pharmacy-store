import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories, getProduct, products } from "@/lib/catalog";
import { store } from "@/lib/store";
import { btn } from "@/components/ui/buttons";

export const metadata: Metadata = { title: "About", description: store.description };

const SHELF = ["amoxicillin-500mg-capsules", "cetirizine-10mg-tablets", "magnesium-l-threonate", "vitamin-c-serum", "ceramide-cream", "diagcheck-a1c-kit"];

const PRINCIPLES = [
  {
    title: "Prescriptions are checked first",
    body: "Prescription medicines are only supplied against a valid prescription, and a pharmacist reviews every prescription before anything is prepared.",
  },
  {
    title: "Clear about what needs a prescription",
    body: "Every prescription-only medicine is marked wherever it appears, and can only be requested together with a prescription.",
  },
  {
    title: "You confirm before you pay",
    body: "Orders placed here are requests. The pharmacy confirms availability and your total before preparing anything, and nothing is charged online.",
  },
  {
    title: "Your details stay with the pharmacy",
    body: "Order details and prescriptions are stored privately for the pharmacy team, and are used only to look after your order.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-32">
      <section className="gutter mx-auto max-w-[96rem] pb-20">
        <h1 className="stretch-wide max-w-5xl text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.96] font-medium tracking-[-0.03em]">
          A local pharmacy, with its shelves online.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-2">
          {store.name} sells prescription medicines, everyday medicines, vitamins, skincare and health devices. You can browse all {products.length} products
          here, send a prescription, and choose to collect your order or have it delivered.
        </p>
      </section>

      <section aria-label="From the shelves" className="guilloche border-y border-paper-3 bg-paper-2/60 py-12">
        <ul className="gutter mx-auto grid max-w-[96rem] grid-cols-3 gap-4 sm:grid-cols-6">
          {SHELF.map((slug) => {
            const p = getProduct(slug)!;
            return (
              <li key={slug} className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-studio">
                <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 640px) 16vw, 33vw" className="object-contain p-[8%]" />
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="principles-title" className="gutter mx-auto max-w-[96rem] py-24">
        <h2 id="principles-title" className="stretch-semi text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.02] font-medium tracking-[-0.02em]">
          How we work
        </h2>
        <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="border-t border-ink/15 pt-6">
              <h3 className="text-lg font-medium">{p.title}</h3>
              <p className="mt-2 max-w-lg text-base text-ink-2">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="shelves-title" className="bg-paper-2">
        <div className="gutter mx-auto max-w-[96rem] py-24">
          <h2 id="shelves-title" className="stretch-semi text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.02] font-medium tracking-[-0.02em]">
            What’s on the shelves
          </h2>
          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/shop?category=${c.id}`} className="group grid items-center gap-4 py-6 sm:grid-cols-12">
                  <span className="flex items-center gap-4 sm:col-span-5">
                    <span aria-hidden="true" className="h-1 w-8 rounded-full transition-[width] duration-500 group-hover:w-14" style={{ background: c.band }} />
                    <span className="stretch-semi text-xl font-medium">{c.name}</span>
                  </span>
                  <span className="text-sm text-ink-2 sm:col-span-6">{c.description}</span>
                  <span className="tabular text-sm text-ink-3 sm:col-span-1 sm:text-right">{products.filter((p) => p.category === c.id).length}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/shop" className={btn.primary}>
              Shop the pharmacy
            </Link>
            <Link href="/contact" className={btn.secondary}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
