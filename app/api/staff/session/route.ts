import { STAFF_COOKIE, checkKey, sessionCookieValue } from "@/lib/server/staff";
import { rateLimit, sameOrigin } from "@/lib/server/validate";

/** Staff sign in / sign out (form posts from /staff). */
export async function POST(request: Request) {
  const blocked = sameOrigin(request) ?? rateLimit(request, "staff-login", 10);
  if (blocked) return blocked;
  const form = await request.formData();
  const back = new URL("/staff", request.url);
  const headers = new Headers({ Location: back.toString() });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  if (form.get("action") === "logout") {
    headers.append("Set-Cookie", `${STAFF_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`);
    return new Response(null, { status: 303, headers });
  }
  if (!checkKey(form.get("key"))) {
    back.searchParams.set("error", "1");
    return new Response(null, { status: 303, headers: { Location: back.toString() } });
  }
  headers.append("Set-Cookie", `${STAFF_COOKIE}=${sessionCookieValue()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 12}${secure}`);
  return new Response(null, { status: 303, headers });
}
