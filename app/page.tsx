import Link from "next/link";
import { categories, featuredProducts, products } from "@/lib/catalog";
import { store } from "@/lib/store";
import { HomeStage } from "@/components/home/HomeStage";
import { HeroCopy } from "@/components/home/HeroCopy";
import { CategoriesChapter } from "@/components/home/CategoriesChapter";
import { RxChapter } from "@/components/home/RxChapter";
import { FeaturedRail } from "@/components/home/FeaturedRail";
import { ProductCard } from "@/components/product/ProductCard";
import { StoreDetails } from "@/components/site/SiteFooter";
import { btn } from "@/components/ui/buttons";

export default function HomePage() {
  const counts = Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.category === c.id).length]));
  const featured = featuredProducts();

  return (
    <HomeStage>
      {/* Opening: the bottle is introduced, then unscrewed and poured as you scroll. */}
      <section data-chapter="opening" aria-label="Introduction" className="relative h-[250svh]">
        <div className="sticky top-0 flex h-svh flex-col justify-end pb-[7svh] lg:justify-center lg:pb-0">
          <div className="gutter mx-auto w-full max-w-[96rem]">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-x-6 -top-28 -bottom-10 -z-10 bg-gradient-to-t from-paper via-paper/90 to-transparent lg:hidden" />
              <HeroCopy />
            </div>
          </div>
        </div>
      </section>

      <CategoriesChapter counts={counts} />

      {/* Opaque sections cover the canvas; WebGL pauses while they fill the screen. */}
      <section aria-labelledby="featured-title" className="relative bg-paper py-24 sm:py-32">
        <div className="gutter mx-auto max-w-[96rem]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 id="featured-title" className="stretch-semi text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.02] font-medium tracking-[-0.02em]">
                A few places to start
              </h2>
              <p className="mt-3 text-base text-ink-2">
                A selection from each shelf. Everything here can be ordered for collection or delivery.
              </p>
            </div>
            <Link href="/shop" className={btn.secondary}>
              Browse all {products.length} products
            </Link>
          </div>
          <div className="mt-10">
            <FeaturedRail label="Featured products">
              {featured.map((p) => (
                <li key={p.slug} className="snap-start">
                  <ProductCard product={p} />
                </li>
              ))}
            </FeaturedRail>
          </div>
        </div>
      </section>

      <RxChapter />

      <section aria-labelledby="visit-title" className="relative bg-paper-2">
        <div className="gutter mx-auto grid max-w-[96rem] gap-12 py-24 sm:py-32 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 id="visit-title" className="stretch-semi text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.02] font-medium tracking-[-0.02em]">
              Visit or get in touch
            </h2>
            <p className="mt-4 max-w-md text-base text-ink-2">
              Questions about a product, an order or your prescription? Send us a message and the pharmacy team will reply.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={btn.primary}>
                Send a message
              </Link>
              <Link href="/orders" className={btn.secondary}>
                Check an order
              </Link>
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 md:col-span-6">
            <StoreDetails tone="ink" />
            <div className="space-y-5 text-sm">
              <div>
                <p className="stretch-narrow text-xs text-ink-3">Getting your order</p>
                <ul className="mt-1 space-y-1">
                  {store.fulfilment.pickup ? <li>Collect in store</li> : null}
                  {store.fulfilment.delivery ? <li>Delivery</li> : null}
                </ul>
                {store.fulfilment.deliveryNote ? <p className="mt-2 text-ink-2">{store.fulfilment.deliveryNote}</p> : null}
              </div>
              <div>
                <p className="stretch-narrow text-xs text-ink-3">Paying</p>
                <p className="mt-1 text-ink-2">{store.payment.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="search-title" className="relative bg-paper">
        <div className="gutter mx-auto max-w-[96rem] py-24 sm:py-36">
          <h2 id="search-title" className="stretch-wide text-[clamp(2.2rem,6vw,5.2rem)] leading-[0.98] font-medium tracking-[-0.03em]">
            What are you looking for?
          </h2>
          <form action="/shop" method="get" role="search" className="mt-10 flex max-w-3xl items-center gap-3 border-b-2 border-ink pb-3">
            <label htmlFor="home-search" className="sr-only">
              Search products
            </label>
            <input
              id="home-search"
              name="q"
              placeholder="Try magnesium, serum or thermometer"
              className="stretch-semi min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-ink-3/70 sm:text-2xl"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="submit" className={btn.primary}>
              Search
            </button>
          </form>
          <ul className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop?category=${c.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3.5 py-2 text-sm transition-colors hover:border-ink/40"
                >
                  <span className="size-2 rounded-full" style={{ background: c.band }} aria-hidden="true" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </HomeStage>
  );
}
