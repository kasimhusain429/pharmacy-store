import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { displayName, getCategory, getProduct, products } from "@/lib/catalog";
import { formatPrice, store } from "@/lib/store";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { RxBadge } from "@/components/product/RxBadge";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: displayName(p),
    description: `${p.summary} ${p.requiresPrescription ? "Prescription only." : ""}`.trim(),
    openGraph: { images: [p.image] },
  };
}

/** App shell shown only for slugs that were not prerendered. */
function ProductSkeleton() {
  return (
    <div className="gutter mx-auto max-w-[96rem] pt-24 pb-24 sm:pt-28" aria-busy="true">
      <div className="h-5 w-48 rounded bg-paper-2" />
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="aspect-[4/5] rounded-[3px] bg-studio lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <div className="h-12 w-3/4 rounded bg-paper-2" />
          <div className="h-8 w-32 rounded bg-paper-2" />
          <div className="h-24 rounded bg-paper-2" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const details: [string, string | undefined][] = [
    ["Form", product.form],
    ["Strength", product.strength],
    ["Pack size", product.size],
    [product.category === "skincare" ? "Key ingredients" : "Active ingredients", product.ingredients],
    ["Brand", product.brand],
  ];

  return (
    <div className="gutter mx-auto max-w-[96rem] pt-24 pb-24 sm:pt-28">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop?category=${category.id}`} className="hover:text-ink">
              {category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-2">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <ProductMedia product={product} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <span aria-hidden="true" className="block h-1 w-10 rounded-full" style={{ background: category.band }} />
          {product.brand ? <p className="stretch-narrow mt-5 text-sm text-ink-3">{product.brand}</p> : null}
          <h1 className={`stretch-semi ${product.brand ? "mt-1" : "mt-5"} text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.02em]`}>
            {product.name}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="tabular text-2xl">{formatPrice(product.price)}</p>
            {product.requiresPrescription ? <RxBadge size="md" /> : <span className="text-sm text-ink-2">No prescription needed</span>}
          </div>
          <p className="mt-5 max-w-prose text-base text-ink-2">{product.summary}</p>

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>

          <dl className="mt-10 divide-y divide-paper-3 border-y border-paper-3 text-sm">
            {details
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3">
                  <dt className="text-ink-3">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            <div className="grid grid-cols-[9rem_1fr] gap-4 py-3">
              <dt className="text-ink-3">Availability</dt>
              <dd>Confirmed by the pharmacy when you order.</dd>
            </div>
            <div className="grid grid-cols-[9rem_1fr] gap-4 py-3">
              <dt className="text-ink-3">Getting it</dt>
              <dd>
                {[store.fulfilment.pickup && "Collect in store", store.fulfilment.delivery && "delivery"].filter(Boolean).join(" or ")}. You don’t pay
                online.
              </dd>
            </div>
          </dl>

          <section aria-labelledby="directions-title" className="mt-10">
            <h2 id="directions-title" className="text-base font-medium">
              {product.requiresPrescription ? "How to take it" : "Directions"}
            </h2>
            <p className="mt-2 max-w-prose text-sm text-ink-2">
              {product.requiresPrescription
                ? "Take this medicine exactly as your prescriber has directed. Their directions are printed on the pharmacy label."
                : product.directions ?? "Follow the directions on the pack."}
            </p>
            <p className="mt-4 max-w-prose text-sm text-ink-2">
              Read the label before use. If you are unsure whether a product is right for you, or you take other medicines, ask a pharmacist.
            </p>
          </section>
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="mt-24 border-t border-paper-3 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-title" className="stretch-semi text-2xl font-medium tracking-[-0.01em]">
              More in {category.name.toLowerCase()}
            </h2>
            <Link href={`/shop?category=${category.id}`} className="text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              See all
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
