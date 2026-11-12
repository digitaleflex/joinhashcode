/** Vrai uniquement pour une URL http(s) : évite de rendre des liens `javascript:` ou `data:`. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}
