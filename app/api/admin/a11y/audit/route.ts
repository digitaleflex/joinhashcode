import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (!dbUser || !["ADMIN"].includes(dbUser.role)) {
      return NextResponse.json({ message: "Accès refusé (ADMIN requis)" }, { status: 403 })
    }

    const body = await req.json()
    const { urls } = body

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ message: "urls requis (tableau non vide)" }, { status: 400 })
    }

    const results = []

    for (const url of urls) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
        const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`

        const response = await fetch(fullUrl, {
          headers: {
            "User-Agent": "HASHCODE-A11Y-Audit/1.0",
          },
        })

        if (!response.ok) {
          results.push({
            url,
            error: `HTTP ${response.status}: ${response.statusText}`,
            score: 0,
            violations: [],
          })
          continue
        }

        const html = await response.text()

        const { auditPage } = await import("@/lib/a11y-audit")
        const auditResult = await auditPage(html, url)
        results.push(auditResult)
      } catch (error) {
        results.push({
          url,
          error: error instanceof Error ? error.message : "Erreur inconnue",
          score: 0,
          violations: [],
        })
      }
    }

    const summary = {
      totalPages: results.length,
      averageScore: results.length > 0 ? Math.round(results.reduce((acc, r) => acc + (r.score ?? 0), 0) / results.length) : 0,
      totalViolations: results.reduce((acc, r) => acc + (r.violations?.length ?? 0), 0),
      criticalViolations: results.reduce((acc, r) => acc + (r.violations?.filter((v: { impact: string }) => v.impact === "critical").length ?? 0), 0),
      seriousViolations: results.reduce((acc, r) => acc + (r.violations?.filter((v: { impact: string }) => v.impact === "serious").length ?? 0), 0),
    }

    return NextResponse.json({ results, summary })
  } catch (error: unknown) {
    console.error("[ADMIN_A11Y_AUDIT_POST]", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (!dbUser || !["ADMIN"].includes(dbUser.role)) {
      return NextResponse.json({ message: "Accès refusé (ADMIN requis)" }, { status: 403 })
    }

    const audits = await prisma.activityLog.findMany({
      where: {
        action: "A11Y_AUDIT_COMPLETED",
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        metadata: true,
      },
    })

    return NextResponse.json({ audits })
  } catch (error: unknown) {
    console.error("[ADMIN_A11Y_AUDIT_GET]", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}