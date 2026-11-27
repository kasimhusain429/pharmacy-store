import { store } from "@/lib/store";
import type { FulfilmentMethod, PrescriptionRecord } from "@/lib/orders";
import { newReference, saveRecord, saveUpload } from "@/lib/server/storage";
import {
  MAX_UPLOAD_BYTES,
  ValidationError,
  consent,
  dateOfBirth,
  email,
  errorResponse,
  oneOf,
  phone,
  rateLimit,
  sameOrigin,
  sniffUpload,
  text,
} from "@/lib/server/validate";

const METHODS = (["pickup", "delivery"] as const).filter((m) => (m === "pickup" ? store.fulfilment.pickup : store.fulfilment.delivery));

/** Receives a prescription upload. The file is stored privately for a pharmacist to review. */
export async function POST(request: Request) {
  const blocked = sameOrigin(request) ?? rateLimit(request, "prescriptions", 6);
  if (blocked) return blocked;
  try {
    const form = await request.formData();
    if (form.get("company")) return Response.json({ reference: newReference("RX") }); // honeypot

    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) throw new ValidationError("file", "Choose a photo or PDF of your prescription.");
    if (file.size > MAX_UPLOAD_BYTES) throw new ValidationError("file", "The file is larger than 10 MB. Take a new photo or save it as a smaller PDF.");
    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = sniffUpload(buffer);
    if (!kind) throw new ValidationError("file", "Upload a PDF, JPG, PNG, WEBP or HEIC file.");

    const record: PrescriptionRecord = {
      reference: newReference("RX"),
      createdAt: new Date().toISOString(),
      status: "received",
      patient: {
        name: text(form.get("name"), "name", { min: 2, max: 120 }),
        dateOfBirth: dateOfBirth(form.get("dateOfBirth")),
        email: email(form.get("email")),
        phone: phone(form.get("phone")),
      },
      file: { stored: "", type: kind.type, size: buffer.length },
      fulfilment: oneOf<FulfilmentMethod>(form.get("fulfilment"), METHODS, "fulfilment"),
      notes: text(form.get("notes"), "notes", { max: 1000, optional: true }) || undefined,
    };
    consent(form.get("consent"));

    record.file.stored = await saveUpload("prescriptions", buffer, kind.ext);
    await saveRecord("prescriptions", record);
    return Response.json({ reference: record.reference }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
