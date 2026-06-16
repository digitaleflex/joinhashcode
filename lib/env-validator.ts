const CRITICAL_ENV_VARS = [
  "BETTER_AUTH_SECRET",
  "DATABASE_URL",
  "DIRECT_URL",
] as const

const CRITICAL_IF_PRODUCTION = [
  "RESEND_API_KEY",
  "SENTRY_DSN",
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
    console.error("")
    console.error("🔴 [ENV] Variables d'environnement critiques manquantes :")
    for (const name of missing) {
      console.error(`  - ${name}`)
    }
    console.error("🔴 [ENV] Le processus va s'arrêter.")
    console.error("")
    throw new Error(`Variables d'environnement manquantes : ${missing.join(", ")}`)
  }

  console.log("🟢 [ENV] Toutes les variables critiques sont présentes.")
}
