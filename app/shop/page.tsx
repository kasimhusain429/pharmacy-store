import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Shop",
  description: "Prescription medicines, everyday medicines, vitamins, skincare and health devices.",
};

/** Static shell renders the full catalogue; the browser enhances it with search, filters and sorting. */
function Fallback() {
  return (
    <div className="gutter mx-auto max-w-[96rem] pt-32 pb-24">
      <h1 className="stretch-wide text-[clamp(2.2rem,5vw,4.2rem)] leading-none font-medium tracking-[-0.03em]">Shop</h1>
      <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <ShopBrowser />
    </Suspense>
  );
}
