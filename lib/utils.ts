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
 * Obfuscates a sequential member number into a professional, non-intuitive ID.
 * Example: 1 -> "HC-B4A1", 2 -> "HC-K9X2"
 */
export function generatePassportId(memberNumber: number | null): string {
  if (!memberNumber) return "HC-INIT";
  
  // Deterministic "noise" based on the number itself
  const salt = (memberNumber * 12345) % 10000;
  const hex = salt.toString(16).toUpperCase().padStart(3, '0');
  const checkDigit = (memberNumber % 9);
  
  return `HC-${hex}${checkDigit}${memberNumber % 10}`;
}
