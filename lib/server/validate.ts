/** Small, explicit validators. Every API route validates on the server; client checks are only for convenience. */

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
  }
}

export function text(value: unknown, field: string, { min = 1, max = 200, optional = false } = {}): string {
  if (value == null || value === "") {
    if (optional) return "";
    throw new ValidationError(field, "This field is required.");
  }
  if (typeof value !== "string") throw new ValidationError(field, "Enter text.");
  const v = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (!optional && v.length < min) throw new ValidationError(field, "This field is required.");
  if (v.length > max) throw new ValidationError(field, `Use ${max} characters or fewer.`);
  return v;
}

export function email(value: unknown, field = "email") {
  const v = text(value, field, { max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) throw new ValidationError(field, "Enter an email address like name@example.com.");
  return v;
}

export function phone(value: unknown, field = "phone", optional = false) {
  const v = text(value, field, { max: 32, optional });
  if (!v) return v;
  const digits = v.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15 || !/^[+\d\s().-]+$/.test(v)) throw new ValidationError(field, "Enter a phone number with 7 to 15 digits.");
  return v;
}

export function dateOfBirth(value: unknown, field = "dateOfBirth") {
  const v = text(value, field, { max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(field, "Enter a date of birth.");
  const d = new Date(`${v}T00:00:00Z`);
  const now = new Date();
  if (Number.isNaN(d.getTime()) || d > now || d.getUTCFullYear() < now.getUTCFullYear() - 120) throw new ValidationError(field, "Enter a real date of birth.");
  return v;
}

export function oneOf<T extends string>(value: unknown, options: readonly T[], field: string): T {
  if (typeof value === "string" && (options as readonly string[]).includes(value)) return value as T;
  throw new ValidationError(field, "Choose one of the options.");
}

export function consent(value: unknown, field = "consent") {
  if (value === true || value === "on" || value === "true") return true;
  throw new ValidationError(field, "Please confirm to continue.");
}

/** Detects the real file type from its first bytes rather than trusting the browser. */
export function sniffUpload(buf: Buffer): { ext: string; type: string } | null {
  if (buf.length < 12) return null;
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return { ext: "pdf", type: "application/pdf" };
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", type: "image/png" };
  if (buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP") return { ext: "webp", type: "image/webp" };
  const brand = buf.subarray(4, 12).toString("latin1");
  if (/^ftyp(heic|heix|hevc|mif1|msf1)/.test(brand)) return { ext: "heic", type: "image/heic" };
  return null;
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function errorResponse(e: unknown) {
  if (e instanceof ValidationError) return Response.json({ error: e.message, field: e.field }, { status: 400 });
  console.error(e);
  return Response.json({ error: "Something went wrong on our side. Please try again in a moment." }, { status: 500 });
}

/** In-memory rate limit per client address. Good enough for one server; use a shared store when scaling out. */
const hits = new Map<string, number[]>();
export function rateLimit(request: Request, bucket: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) return Response.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  recent.push(now);
  hits.set(key, recent);
  return null;
}

/** Rejects requests posted from other sites. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    if (new URL(origin).host === host) return null;
  } catch {
    /* fall through */
  }
  return Response.json({ error: "Request not allowed." }, { status: 403 });
}
