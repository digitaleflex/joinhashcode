export function parsePagination(searchParams: URLSearchParams) {
  const rawPage = searchParams.get("page")
  const rawLimit = searchParams.get("limit")
  const page = Math.max(1, safeParseInt(rawPage, 1, 10000))
  const limit = Math.min(100, safeParseInt(rawLimit, 50, 1000))
  return { page, limit }
}

function safeParseInt(value: string | null, fallback: number, max: number): number {
  if (value === null) return fallback
  const parsed = parseInt(value, 10)
  if (isNaN(parsed) || parsed < 1) return fallback
  return Math.min(parsed, max)
}
