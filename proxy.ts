import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fix SEC-010: Build nonce-based CSP — replaces static `unsafe-inline` for script-src
function buildCSP(nonce: string): string {
  // Next.js (especially with Turbopack) and React require 'unsafe-eval' in some environments even in prod-like setups.
  // Including it universally to resolve the "eval() is not supported" error on VPS.
  const scriptSrc = `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' blob: https://static.cloudflareinsights.com`;

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://api.qrserver.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' blob:",
    "worker-src 'self' blob:",
    "frame-src 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  // CVE-2025-29927: strip header that would bypass middleware execution
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Fix SEC-010: generate per-request nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isProtectedPath =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/missions') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/squad') ||
    request.nextUrl.pathname.startsWith('/dossier') ||
    request.nextUrl.pathname.startsWith('/reviewer') ||
    request.nextUrl.pathname.startsWith('/feedback') ||
    request.nextUrl.pathname.startsWith('/onboarding') ||
    request.nextUrl.pathname.startsWith('/quiz');
  const isBetaAccessPath = request.nextUrl.pathname.startsWith('/beta-access');
  const isOnboardingPath = request.nextUrl.pathname.startsWith('/onboarding');
  const isQuizPath = request.nextUrl.pathname.startsWith('/quiz');

  // Public routes: inject CSP nonce and return immediately — no session fetch
  if (!isProtectedPath && !isBetaAccessPath) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", buildCSP(nonce));
    return response;
  }

  let sessionData = null;
  // Use getSessionCookie to check for session presence without network call
  const sessionCookie = getSessionCookie(request);

  if (isProtectedPath && !sessionCookie) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("reason", "auth_required");
    signinUrl.searchParams.set("callbackURL", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  // We could fetch session here, but to avoid 503 timeouts, we rely on the destination page 
  // to perform the heavy validation. For onboarding/quiz redirects, we only check 
  // if the session cookie is present.
  
  // NOTE: If we REALLY need user data (banned check, onboarding step) in middleware, 
  // we must ensure the fetch doesn't stall.
  if (sessionCookie) {
    try {
      const requestHeaders = new Headers(request.headers);
      const baseUrl = request.nextUrl.origin;
      const response = await fetch(`${baseUrl}/api/auth/middleware-session`, {
        headers: requestHeaders,
        cache: 'no-store',
        signal: AbortSignal.timeout(5000) // Relaxed 5s timeout to prevent 503 hang under latency
      });

      if (response.ok) {
        sessionData = await response.json();
      }
    } catch (error) {
      console.error("🟢 [Middleware] Unified session fetch failed or timed out:", error);
    }
  }

  const session = sessionData?.session;
  let user = sessionData?.user;

  if (session && user) {
    // Redirect anyone landing on /beta-access to the appropriate next step
    if (isBetaAccessPath) {
      const dest = !user.currentSituation ? "/onboarding"
        : !user.class ? "/quiz"
        : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    // ONLY redirect if we are on a protected path AND it's NOT an API call or internal Next.js request
    if (isProtectedPath && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.includes('.')) {
      
      // 1. Check for Step 1: Initial Context (Country, Situation)
      if (!user.currentSituation && !isOnboardingPath && !isQuizPath) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // 2. Check for Step 2: Quiz (Psychometrics)
      if (user.currentSituation && !user.class && !isQuizPath && !isOnboardingPath) {
        return NextResponse.redirect(new URL("/quiz", request.url));
      }
    }
  }

  // Fix SEC-010: inject nonce into request headers (readable by server components via headers())
  // and set nonce-based CSP on the response (overrides next.config.mjs for matched routes)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", buildCSP(nonce));
  return response;
}

export const config = {
  // SEC-010: expanded to all HTML pages so every response gets a CSP nonce.
  // Static assets (_next/static, images, favicons) are excluded to avoid overhead.
  // API routes are excluded — they don't serve HTML and don't need CSP.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|woff2?|ttf|eot)|api/).*)",
  ],
};
