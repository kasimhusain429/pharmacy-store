import Image from "next/image";
import Link from "next/link";
import { getCategory, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/store";
import { RxBadge } from "./RxBadge";

export function ProductImage({
  product,
  sizes,
  priority = false,
  className = "",
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[3px] bg-studio ${className}`}>
      <Image
        src={product.image}
        alt={product.imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain p-[6%] transition-transform duration-700 ease-(--ease-out-quart) group-hover:scale-[1.04]"
      />
    </div>
  );
}

/**
 * Product card: no box, no shadow. The studio image well carries the product,
 * the category band and type do the rest.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const category = getCategory(product.category);
  return (
    <article className="group relative flex flex-col">
      <ProductImage
        product={product}
        priority={priority}
        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
        className="aspect-[4/5]"
      />
      <span
        aria-hidden="true"
        className="mt-3 block h-[3px] w-6 rounded-full transition-[width] duration-500 ease-(--ease-out-quart) group-hover:w-12"
        style={{ background: category?.band }}
      />
      <div className="mt-3 flex flex-1 flex-col gap-1">
        {product.brand ? <p className="stretch-narrow text-xs text-ink-3">{product.brand}</p> : null}
        <h3 className="text-sm leading-snug font-medium text-ink sm:text-base">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="stretch-narrow text-xs text-ink-3">
          {[product.form, product.size].filter(Boolean).join(", ")}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <p className="tabular text-sm font-medium">{formatPrice(product.price)}</p>
          {product.requiresPrescription ? <RxBadge /> : null}
        </div>
      </div>
    </article>
  );
}
