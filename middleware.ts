import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (process.env.MAINTENANCE_MODE === "true" && request.nextUrl.pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

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

  if (!isProtectedPath && !isBetaAccessPath) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (isProtectedPath && !sessionCookie) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("reason", "auth_required");
    signinUrl.searchParams.set("callbackURL", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  let sessionData = null;
  if (sessionCookie) {
    try {
      const requestHeaders = new Headers(request.headers);
      const baseUrl = request.nextUrl.origin;
      const response = await fetch(`${baseUrl}/api/auth/middleware-session`, {
        headers: requestHeaders,
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        sessionData = await response.json();
      }
    } catch (error) {
      console.error("🟢 [Middleware] Session fetch failed:", error);
    }
  }

  const session = sessionData?.session;
  const user = sessionData?.user;

  if (session && user) {
    if (isBetaAccessPath) {
      const dest = !user.currentSituation ? "/onboarding"
        : !user.class ? "/quiz"
        : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    if (isProtectedPath && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.includes('.')) {
      if (!user.betaKeyId && !isBetaAccessPath) {
        return NextResponse.redirect(new URL("/beta-access", request.url));
      }
      if (!user.currentSituation && !isOnboardingPath && !isQuizPath) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      if (user.currentSituation && !user.class && !isQuizPath && !isOnboardingPath) {
        return NextResponse.redirect(new URL("/quiz", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|woff2?|ttf|eot)|api/).*)",
  ],
};

export { proxy as middleware };
