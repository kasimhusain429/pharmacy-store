import type { OrderRecord, OrderSummary, PrescriptionRecord } from "@/lib/orders";
import { isReference, readRecord } from "@/lib/server/storage";
import { email, errorResponse, rateLimit, sameOrigin } from "@/lib/server/validate";

/**
 * Order status lookup by reference + email. POST keeps both out of URLs and logs.
 * The answer never includes contact or address details.
 */
export async function POST(request: Request) {
  const blocked = sameOrigin(request) ?? rateLimit(request, "lookup", 20);
  if (blocked) return blocked;
  try {
    const body = (await request.json().catch(() => null)) as { reference?: unknown; email?: unknown } | null;
    const ref = typeof body?.reference === "string" ? body.reference.trim().toUpperCase() : "";
    const mail = email(body?.email);
    const notFound = Response.json({ error: "We couldn't find an order with that reference and email address." }, { status: 404 });
    if (!isReference("ORD", ref)) return notFound;
    const order = await readRecord<OrderRecord>("orders", ref);
    if (!order || order.contact.email !== mail) return notFound;
    let prescriptionStatus: OrderSummary["prescriptionStatus"];
    if (order.prescriptionReference) {
      prescriptionStatus = (await readRecord<PrescriptionRecord>("prescriptions", order.prescriptionReference))?.status;
    }
    const summary: OrderSummary = {
      reference: order.reference,
      createdAt: order.createdAt,
      status: order.status,
      statusHistory: order.statusHistory,
      items: order.items,
      subtotal: order.subtotal,
      fulfilment: order.fulfilment.method,
      prescriptionStatus,
    };
    return Response.json(summary);
  } catch (e) {
    return errorResponse(e);
  }
}
