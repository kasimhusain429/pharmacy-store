import { ORDER_STATUSES, PRESCRIPTION_STATUSES, type EnquiryRecord, type OrderRecord, type PrescriptionRecord } from "@/lib/orders";
import { isStaffRequest } from "@/lib/server/staff";
import { readRecord, saveRecord } from "@/lib/server/storage";
import { sameOrigin } from "@/lib/server/validate";

/** Staff status updates for orders, prescriptions and messages. */
export async function POST(request: Request) {
  const blocked = sameOrigin(request);
  if (blocked) return blocked;
  if (!isStaffRequest(request)) return new Response("Not allowed", { status: 401 });
  const form = await request.formData();
  const kind = String(form.get("kind"));
  const reference = String(form.get("reference"));
  const status = String(form.get("status"));
  const back = new URL(`/staff?tab=${encodeURIComponent(kind)}`, request.url);

  if (kind === "orders" && (ORDER_STATUSES as readonly string[]).includes(status)) {
    const order = await readRecord<OrderRecord>("orders", reference);
    if (order && order.status !== status) {
      order.status = status as OrderRecord["status"];
      order.statusHistory.push({ status: order.status, at: new Date().toISOString() });
      await saveRecord("orders", order);
    }
  } else if (kind === "prescriptions" && (PRESCRIPTION_STATUSES as readonly string[]).includes(status)) {
    const rx = await readRecord<PrescriptionRecord>("prescriptions", reference);
    if (rx) {
      rx.status = status as PrescriptionRecord["status"];
      await saveRecord("prescriptions", rx);
    }
  } else if (kind === "enquiries" && (status === "new" || status === "answered")) {
    const msg = await readRecord<EnquiryRecord>("enquiries", reference);
    if (msg) {
      msg.status = status;
      await saveRecord("enquiries", msg);
    }
  } else {
    return new Response("Unknown update", { status: 400 });
  }
  return new Response(null, { status: 303, headers: { Location: back.toString() } });
}
