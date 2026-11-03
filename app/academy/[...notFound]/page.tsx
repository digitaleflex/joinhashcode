import { notFound } from "next/navigation"

/**
 * Catch-all for unknown /academy/* paths so the 404 is rendered inside the
 * Academy layout (navbar + footer) instead of the bare global 404.
 */
export default function AcademyCatchAll() {
  notFound()
}
