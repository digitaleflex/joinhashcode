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
