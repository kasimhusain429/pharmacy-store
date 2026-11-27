import { getProduct } from "@/lib/catalog";
import { store } from "@/lib/store";
import type { FulfilmentMethod, OrderRecord, PrescriptionRecord } from "@/lib/orders";
import { isReference, newReference, readRecord, saveRecord } from "@/lib/server/storage";
import { ValidationError, consent, email, errorResponse, oneOf, phone, rateLimit, sameOrigin, text } from "@/lib/server/validate";

const METHODS = (["pickup", "delivery"] as const).filter((m) => (m === "pickup" ? store.fulfilment.pickup : store.fulfilment.delivery));

type Body = {
  items?: { slug?: unknown; qty?: unknown }[];
  contact?: { name?: unknown; email?: unknown; phone?: unknown };
  fulfilment?: { method?: unknown; address?: { line1?: unknown; line2?: unknown; city?: unknown; postcode?: unknown } };
  prescriptionReference?: unknown;
  notes?: unknown;
  consent?: unknown;
  company?: unknown;
};

/**
 * Places an order request. Prices come from the catalogue on the server, never
 * from the browser. Prescription items need a prescription sent with the same
 * email address, and the order waits for a pharmacist check.
 */
export async function POST(request: Request) {
  const blocked = sameOrigin(request) ?? rateLimit(request, "orders", 8);
  if (blocked) return blocked;
  try {
    const body = (await request.json().catch(() => null)) as Body | null;
    if (!body || typeof body !== "object") throw new ValidationError("body", "The order could not be read. Refresh the page and try again.");
    if (body.company) return Response.json({ reference: newReference("ORD") }); // honeypot

    if (!Array.isArray(body.items) || body.items.length === 0) throw new ValidationError("items", "Your cart is empty.");
    if (body.items.length > 30) throw new ValidationError("items", "That's more items than we can take in one order.");

    const seen = new Set<string>();
    const items: OrderRecord["items"] = [];
    for (const raw of body.items) {
      const product = typeof raw?.slug === "string" ? getProduct(raw.slug) : undefined;
      if (!product) throw new ValidationError("items", "One of the products in your cart is no longer available. Remove it and try again.");
      if (seen.has(product.slug)) continue;
      seen.add(product.slug);
      const qty = product.requiresPrescription ? 1 : Number(raw.qty);
      if (!Number.isInteger(qty) || qty < 1 || qty > 10) throw new ValidationError("items", `Choose a quantity from 1 to 10 for ${product.name}.`);
      items.push({
        slug: product.slug,
        name: product.brand ? `${product.brand} ${product.name}` : product.name,
        qty,
        unitPrice: product.price,
        requiresPrescription: product.requiresPrescription,
      });
    }

    const contact = {
      name: text(body.contact?.name, "name", { min: 2, max: 120 }),
      email: email(body.contact?.email),
      phone: phone(body.contact?.phone),
    };

    const method = oneOf<FulfilmentMethod>(body.fulfilment?.method, METHODS, "fulfilment");
    const fulfilment: OrderRecord["fulfilment"] = { method };
    if (method === "delivery") {
      const a = body.fulfilment?.address;
      fulfilment.address = {
        line1: text(a?.line1, "line1", { max: 120 }),
        line2: text(a?.line2, "line2", { max: 120, optional: true }) || undefined,
        city: text(a?.city, "city", { max: 80 }),
        postcode: text(a?.postcode, "postcode", { max: 16 }),
      };
    }

    const needsRx = items.some((i) => i.requiresPrescription);
    let prescriptionReference: string | undefined;
    if (needsRx) {
      const ref = typeof body.prescriptionReference === "string" ? body.prescriptionReference.trim().toUpperCase() : "";
      if (!isReference("RX", ref)) throw new ValidationError("prescriptionReference", "Attach your prescription to order prescription medicine.");
      const rx = await readRecord<PrescriptionRecord>("prescriptions", ref);
      if (!rx) throw new ValidationError("prescriptionReference", "We couldn't find that prescription reference. Check it, or upload your prescription again.");
      if (rx.patient.email !== contact.email) throw new ValidationError("prescriptionReference", "Use the same email address you gave when you sent the prescription.");
      if (rx.status === "rejected") throw new ValidationError("prescriptionReference", "That prescription couldn't be accepted. Please contact the pharmacy.");
      prescriptionReference = rx.reference;
    }

    consent(body.consent);
    const now = new Date().toISOString();
    const status = needsRx ? "checking-prescription" : "received";
    const order: OrderRecord = {
      reference: newReference("ORD"),
      createdAt: now,
      status,
      statusHistory: [{ status, at: now }],
      contact,
      fulfilment,
      items,
      subtotal: Math.round(items.reduce((n, i) => n + i.unitPrice * i.qty, 0) * 100) / 100,
      prescriptionReference,
      notes: text(body.notes, "notes", { max: 1000, optional: true }) || undefined,
    };
    await saveRecord("orders", order);
    return Response.json({ reference: order.reference, subtotal: order.subtotal, status: order.status }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
