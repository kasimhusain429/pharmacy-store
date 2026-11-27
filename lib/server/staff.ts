import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Staff access for the order inbox. Enabled only when STAFF_ACCESS_KEY is set
 * (use a long random value, and serve the site over HTTPS). The session cookie
 * holds an HMAC of the key, so rotating the key signs everyone out.
 */
export const STAFF_COOKIE = "ps_staff";

export const staffEnabled = () => (process.env.STAFF_ACCESS_KEY ?? "").length >= 16;

function token() {
  return createHmac("sha256", process.env.STAFF_ACCESS_KEY ?? "").update("pharmacy-store-staff-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkKey(candidate: unknown) {
  return staffEnabled() && typeof candidate === "string" && safeEqual(candidate, process.env.STAFF_ACCESS_KEY!);
}

export function sessionCookieValue() {
  return token();
}

export async function isStaff() {
  if (!staffEnabled()) return false;
  const value = (await cookies()).get(STAFF_COOKIE)?.value ?? "";
  return safeEqual(value, token());
}

export function isStaffRequest(request: Request) {
  if (!staffEnabled()) return false;
  const raw = request.headers.get("cookie") ?? "";
  const value = raw
    .split(/;\s*/)
    .find((c) => c.startsWith(`${STAFF_COOKIE}=`))
    ?.slice(STAFF_COOKIE.length + 1);
  return safeEqual(value ?? "", token());
}
