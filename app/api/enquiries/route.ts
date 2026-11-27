import { ENQUIRY_TOPICS, type EnquiryRecord } from "@/lib/orders";
import { newReference, saveRecord } from "@/lib/server/storage";
import { consent, email, errorResponse, oneOf, phone, rateLimit, sameOrigin, text } from "@/lib/server/validate";

/** Contact form messages for the pharmacy team. */
export async function POST(request: Request) {
  const blocked = sameOrigin(request) ?? rateLimit(request, "enquiries", 5);
  if (blocked) return blocked;
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (body?.company) return Response.json({ reference: newReference("MSG") }); // honeypot
    const record: EnquiryRecord = {
      reference: newReference("MSG"),
      createdAt: new Date().toISOString(),
      status: "new",
      name: text(body?.name, "name", { min: 2, max: 120 }),
      email: email(body?.email),
      phone: phone(body?.phone, "phone", true) || undefined,
      topic: oneOf(body?.topic, ENQUIRY_TOPICS, "topic"),
      message: text(body?.message, "message", { min: 10, max: 2000 }),
    };
    consent(body?.consent);
    await saveRecord("enquiries", record);
    return Response.json({ reference: record.reference }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
