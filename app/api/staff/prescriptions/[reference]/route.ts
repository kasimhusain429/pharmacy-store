import type { PrescriptionRecord } from "@/lib/orders";
import { isStaffRequest } from "@/lib/server/staff";
import { isReference, readRecord, readUpload } from "@/lib/server/storage";

/** Streams a prescription file to signed-in staff only. Never cached. */
export async function GET(request: Request, ctx: { params: Promise<{ reference: string }> }) {
  if (!isStaffRequest(request)) return new Response("Not allowed", { status: 401 });
  const { reference } = await ctx.params;
  if (!isReference("RX", reference)) return new Response("Not found", { status: 404 });
  const rx = await readRecord<PrescriptionRecord>("prescriptions", reference);
  if (!rx) return new Response("Not found", { status: 404 });
  const file = await readUpload("prescriptions", rx.file.stored);
  const ext = rx.file.stored.split(".").pop();
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": rx.file.type,
      "Content-Disposition": `inline; filename="${rx.reference}.${ext}"`,
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
