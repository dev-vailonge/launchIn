import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader =
    `default-src "self"; script-src "self" "nonce-${nonce}" "strict-dynamic" https: ${process.env.NODE_ENV === "development" ? `"unsafe-eval"` : ""}; style-src "self" "unsafe-inline"; img-src "self" blob: data: https:; font-src "self" data: https://fonts.gstatic.com; object-src "none"; base-uri "self"; form-action "self"; frame-ancestors "none"; block-all-mixed-content; upgrade-insecure-requests; connect-src "self" https://api.stripe.com https://checkout.stripe.com;`
      .replace(/\s{2,}/g, " ")
      .trim();
  const requestHeaders = new Headers();
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);
  requestHeaders.set("X-Frame-Options", "DENY");
  requestHeaders.set("X-Content-Type-Options", "nosniff");
  requestHeaders.set("X-XSS-Protection", "1; mode=block");
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  requestHeaders.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  return response;
}
