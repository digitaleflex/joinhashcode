// Next.js 15 Proxy middleware
// File named proxy.ts per Next.js 15 convention; exported as `middleware`
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie, getCookieCache } from "better-auth/cookies";

const PROTECTED_PATHS = ["/dashboard", "/missions", "/settings", "/squad", "/dossier", "/feedback", "/onboarding", "/quiz", "/reviewer", "/ateliers", "/specialization"];

export async function proxy(request: NextRequest) {
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Normalise www → non-www pour éviter les erreurs state_mismatch OAuth
  // (le cookie d'état est lié au domaine de la requête initiale)
  const host = request.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const url = new URL(request.url);
    url.host = host.replace("www.", "").replace(/:.*/, "");
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const pathname = request.nextUrl.pathname;
  const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (pathname.startsWith("/beta-access")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (process.env.MAINTENANCE_MODE === "true" && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (isProtectedPath && !sessionCookie) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("reason", "auth_required");
    signinUrl.searchParams.set("callbackURL", pathname);
    return NextResponse.redirect(signinUrl);
  }

  let sessionData: { session?: unknown; user?: Record<string, unknown> } | null = null;

  if (sessionCookie) {
    // Le cookie cache JWE (maxAge 2 min) reste périmé pendant le funnel
    // (onboarding → quiz → specialization) : la DB est à jour mais pas le
    // cookie. L'utiliser pour le funnel provoquait des boucles de redirection
    // /onboarding <-> /quiz, /quiz <-> /missions et /specialization <-> /dashboard.
    // On privilégie donc TOUJOURS la source fraîche (middleware-session → DB,
    // cache Redis invalidé après chaque étape du funnel) et on ne garde le JWE
    // qu'en repli si le fetch échoue (résilience, pas de boucle).
    let jweFallback: { session?: unknown; user?: Record<string, unknown> } | null = null;
    try {
      const decoded = await getCookieCache(request, {
        secret: process.env.BETTER_AUTH_SECRET,
      });
      if (decoded) jweFallback = decoded;
    } catch {
      // Décodage JWE échoue → on ignore le repli
    }

    try {
      const requestHeaders = new Headers(request.headers);
      const baseUrl = `${request.nextUrl.protocol}//${request.headers.get("host") || "127.0.0.1:3000"}`;
      const response = await fetch(`${baseUrl}/api/auth/middleware-session`, {
        headers: requestHeaders,
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        sessionData = await response.json();
      }
    } catch {
      // Source fraîche indisponible → repli sur le JWE
      sessionData = jweFallback;
    }
  }

  const session = sessionData?.session;
  const user = sessionData?.user;
  let nextResponse = NextResponse.next();

  if (session && user) {
    const isDeactivated = user.deactivatedAt && new Date(user.deactivatedAt as string) <= new Date();
    const isBanned = (user as Record<string, unknown>).banned === true;

    if (isDeactivated || isBanned) {
      if (pathname === "/reactivate") return nextResponse;
      if (pathname.startsWith("/signin")) return nextResponse;
      if (!pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL("/reactivate", request.url));
      }
      return NextResponse.json({ error: "Compte désactivé" }, { status: 403 });
    }

    const needsOnboarding = !user.currentSituation;
    const needsQuiz = user.currentSituation && !user.class;
    const needsSpecialization = user.class && !user.primaryDomain;
    const isSpecializationPath = pathname.startsWith("/specialization");
    const isOnboardingPath = pathname.startsWith("/onboarding");
    const isQuizPath = pathname.startsWith("/quiz");

    if (isProtectedPath && !pathname.startsWith("/api") && !pathname.includes(".")) {
      if (needsOnboarding && !isOnboardingPath && !isQuizPath) {
        nextResponse = NextResponse.redirect(new URL("/onboarding", request.url));
      } else if (needsQuiz && !isQuizPath && !isOnboardingPath) {
        nextResponse = NextResponse.redirect(new URL("/quiz", request.url));
      } else if (needsSpecialization && !isSpecializationPath && !isQuizPath && !isOnboardingPath) {
        nextResponse = NextResponse.redirect(new URL("/specialization", request.url));
      }

      if (isSpecializationPath && !needsSpecialization) {
        nextResponse = NextResponse.redirect(new URL("/dashboard", request.url));
      } else if (isOnboardingPath && !needsOnboarding) {
        // Onboarding terminé → quiz si pas encore de class, sinon dashboard.
        // (évite le détour /dashboard → /quiz qui peut faire penser à une boucle)
        nextResponse = NextResponse.redirect(new URL(user.class ? "/dashboard" : "/quiz", request.url));
      } else if (isQuizPath && !needsQuiz) {
        nextResponse = NextResponse.redirect(new URL("/missions", request.url));
      }
    }
  }

  return nextResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\.ico|.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|woff2?|ttf|eot)|api/).*)",
  ],
};

export { proxy as middleware }
