import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import xss from 'xss'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(str: string): string {
  // xss with empty whitelist effectively strips all tags robustly
  return xss(str, { whiteList: {}, stripIgnoreTag: true }).trim();
}

/**
 * Extracts the reliable client IP from request headers.
 * Following SEC-004, it trusts the LAST entry in X-Forwarded-For if multiple exist,
 * as it's the one added by our internal/trusted reverse proxy.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const ips = xff.split(",").map(ip => ip.trim());
    return ips[ips.length - 1] || "unknown";
  }
  return headers.get("x-real-ip") || "unknown";
}