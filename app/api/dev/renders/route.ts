import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getProduct } from "@/lib/catalog";

/** Development-only: stores a studio render as public/products/<slug>.webp. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new Response("Not found", { status: 404 });
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  const product = getProduct(slug);
  if (!product || !product.model) return new Response("Unknown product", { status: 400 });
  const buf = Buffer.from(await request.arrayBuffer());
  if (buf.length > 20 * 1024 * 1024) return new Response("Too large", { status: 413 });
  const dir = path.join(process.cwd(), "public", "products");
  await mkdir(dir, { recursive: true });
  await sharp(buf).webp({ quality: 88, effort: 5 }).toFile(path.join(dir, `${slug}.webp`));
  return Response.json({ ok: true });
}
