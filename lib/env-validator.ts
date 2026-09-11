import { logError, logInfo } from "./logger";

const CRITICAL_ENV_VARS = [
  "BETTER_AUTH_SECRET",
  "DATABASE_URL",
  "DIRECT_URL",
] as const

const CRITICAL_IF_PRODUCTION = [
  "RESEND_API_KEY",
] as const

export function validateEnv() {
  if (process.env.NODE_ENV !== "production") return

  const missing: string[] = []

  for (const name of CRITICAL_ENV_VARS) {
    if (!process.env[name]) missing.push(name)
  }

  for (const name of CRITICAL_IF_PRODUCTION) {
    if (!process.env[name]) missing.push(name)
  }

  if (missing.length > 0) {
    for (const name of missing) {
      logError("Env Validator", `Variable manquante: ${name}`);
    }
    throw new Error(`Variables d'environnement manquantes : ${missing.join(", ")}`)
  }

  logInfo("Env Validator", "Toutes les variables critiques sont présentes.")
}
