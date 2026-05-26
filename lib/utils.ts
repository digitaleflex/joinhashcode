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

/**
 * Calculates the similarity between two strings using Levenshtein distance.
 * Returns a value between 0 and 1, where 1 is identical.
 */
export function getSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = Array.from({ length: len1 + 1 }, () => new Int32Array(len2 + 1));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  return 1 - distance / Math.max(len1, len2);
}