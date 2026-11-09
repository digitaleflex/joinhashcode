import * as axe from "axe-core"

export interface A11yViolation {
  id: string
  impact: "minor" | "moderate" | "serious" | "critical"
  description: string
  help: string
  helpUrl: string
  nodes: Array<{
    html: string
    target: string
    failureSummary: string
  }>
  tags: string[]
}

export interface A11yAuditResult {
  url: string
  timestamp: string
  violations: A11yViolation[]
  passes: number
  incomplete: number
  inapplicable: number
  contrastIssues: Array<{
    element: string
    selector: string
    ratio: number
    required: number
    level: "AA" | "AAA"
  }>
  semanticIssues: Array<{
    type: "heading" | "landmark" | "focus"
    message: string
    selector: string
  }>
  score: number
}

function targetToString(target: axe.UnlabelledFrameSelector): string {
  if (Array.isArray(target)) {
    return target.join(" > ")
  }
  return String(target)
}

export async function auditPage(html: string, url: string): Promise<A11yAuditResult> {
  const result = await axe.run(html, {
    runOnly: {
      type: "tag",
      values: ["wcag2aa", "wcag21aa", "best-practice"],
    },
    resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
  })

  const violations: A11yViolation[] = result.violations.map((v) => ({
    id: v.id,
    impact: v.impact as "minor" | "moderate" | "serious" | "critical",
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes.map((n) => ({
      html: n.html,
      target: targetToString(n.target),
      failureSummary: n.failureSummary ?? "",
    })),
    tags: v.tags,
  }))

  const contrastIssues = violations
    .filter((v) => v.id.includes("color-contrast") || v.id.includes("contrast"))
    .flatMap((v) =>
      v.nodes.map((n) => ({
        element: n.html.substring(0, 200),
        selector: n.target,
        ratio: 0,
        required: v.id.includes("aaa") ? 7 : 4.5,
        level: v.id.includes("aaa") ? ("AAA" as const) : ("AA" as const),
      }))
    )

  const semanticIssues: A11yAuditResult["semanticIssues"] = []

  const headingViolations = violations.filter((v) =>
    ["heading-order", "heading-levels", "html-has-lang", "page-has-heading-one"].includes(v.id)
  )
  headingViolations.forEach((v) => {
    v.nodes.forEach((n) => {
      semanticIssues.push({
        type: "heading",
        message: v.help,
        selector: n.target,
      })
    })
  })

  const landmarkViolations = violations.filter((v) =>
    ["region", "main", "banner", "contentinfo", "complementary", "search"].includes(v.id)
  )
  landmarkViolations.forEach((v) => {
    v.nodes.forEach((n) => {
      semanticIssues.push({
        type: "landmark",
        message: v.help,
        selector: n.target,
      })
    })
  })

  const focusViolations = violations.filter((v) =>
    ["focus-order-semantics", "focus-visible", "keyboard", "tabindex"].some((t) => v.id.includes(t))
  )
  focusViolations.forEach((v) => {
    v.nodes.forEach((n) => {
      semanticIssues.push({
        type: "focus",
        message: v.help,
        selector: n.target,
      })
    })
  })

  const criticalCount = violations.filter((v) => v.impact === "critical").length
  const seriousCount = violations.filter((v) => v.impact === "serious").length
  const moderateCount = violations.filter((v) => v.impact === "moderate").length
  const minorCount = violations.filter((v) => v.impact === "minor").length

  const score = Math.max(
    0,
    100 - criticalCount * 20 - seriousCount * 10 - moderateCount * 5 - minorCount * 1
  )

  return {
    url,
    timestamp: new Date().toISOString(),
    violations,
    passes: result.passes.length,
    incomplete: result.incomplete.length,
    inapplicable: result.inapplicable.length,
    contrastIssues,
    semanticIssues,
    score,
  }
}

export function generateReport(results: A11yAuditResult[]): string {
  const summary = {
    totalPages: results.length,
    averageScore: Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length),
    totalViolations: results.reduce((acc, r) => acc + r.violations.length, 0),
    criticalViolations: results.reduce((acc, r) => acc + r.violations.filter((v) => v.impact === "critical").length, 0),
    seriousViolations: results.reduce((acc, r) => acc + r.violations.filter((v) => v.impact === "serious").length, 0),
    pagesWithIssues: results.filter((r) => r.violations.length > 0).length,
  }

  const details = results.map((r) => ({
    url: r.url,
    score: r.score,
    violations: r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    })),
    contrastIssues: r.contrastIssues.length,
    semanticIssues: r.semanticIssues.length,
  }))

  return JSON.stringify(
    {
      summary,
      generatedAt: new Date().toISOString(),
      details,
    },
    null,
    2
  )
}