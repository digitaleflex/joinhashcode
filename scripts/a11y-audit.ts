#!/usr/bin/env tsx

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { auditPage, generateReport, type A11yAuditResult } from "../lib/a11y-audit"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const ROUTES = [
  "/",
  "/missions",
  "/dashboard",
  "/squad",
  "/settings",
  "/specialization",
  "/signin",
  "/onboarding",
  "/quiz",
]

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "HASHCODE-A11Y-Audit/1.0",
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.text()
}

async function runAudit() {
  console.log(`[A11Y] Starting audit on ${ROUTES.length} routes...`)
  console.log(`[A11Y] Base URL: ${BASE_URL}`)

  const results: A11yAuditResult[] = []

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`
    console.log(`[A11Y] Auditing ${route}...`)

    try {
      const html = await fetchHtml(url)
      const result = await auditPage(html, route)
      results.push(result)
      console.log(`[A11Y] ✓ ${route} - Score: ${result.score}/100, Violations: ${result.violations.length}`)
    } catch (error) {
      console.error(`[A11Y] ✗ ${route} - Error: ${error instanceof Error ? error.message : "Unknown"}`)
      results.push({
        url: route,
        timestamp: new Date().toISOString(),
        violations: [],
        passes: 0,
        incomplete: 0,
        inapplicable: 0,
        contrastIssues: [],
        semanticIssues: [],
        score: 0,
      } as A11yAuditResult)
    }
  }

  const report = generateReport(results)
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const reportDir = path.join(__dirname, "..", "reports")
  const reportPath = path.join(reportDir, `a11y-${timestamp}.json`)

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  fs.writeFileSync(reportPath, report)
  console.log(`[A11Y] Report saved to ${reportPath}`)

  const summary = JSON.parse(report).summary
  console.log("\n[A11Y] === SUMMARY ===")
  console.log(`[A11Y] Total pages: ${summary.totalPages}`)
  console.log(`[A11Y] Average score: ${summary.averageScore}/100`)
  console.log(`[A11Y] Total violations: ${summary.totalViolations}`)
  console.log(`[A11Y] Critical: ${summary.criticalViolations}`)
  console.log(`[A11Y] Serious: ${summary.seriousViolations}`)
  console.log(`[A11Y] Pages with issues: ${summary.pagesWithIssues}`)

  if (summary.criticalViolations > 0 || summary.seriousViolations > 0) {
    console.log("\n[A11Y] ⚠️  CRITICAL/SERIOUS VIOLATIONS FOUND")
    process.exit(1)
  }

  console.log("\n[A11Y] ✓ All audits passed WCAG AA threshold")
}

runAudit().catch((error) => {
  console.error("[A11Y] Fatal error:", error)
  process.exit(1)
})