import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HashSymbolProps {
  className?: string;
  size?: number;
}

/** Simple hash/motorcycle emblem icon for HASHCODE branding (legacy fallback). */
export function HashSymbol({ className, size = 40 }: HashSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
      aria-hidden
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="bold" fontFamily="var(--font-syne), sans-serif">
        #
      </text>
    </svg>
  );
}

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  variant?: "full" | "mark";
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

const HEIGHTS: Record<LogoSize, number> = { sm: 28, md: 36, lg: 52 };

/**
 * HASHCODE brand logo.
 * - `full` uses the horizontal wordmark.
 * - `mark` uses the "H" emblem only.
 *
 * Two colour variants are shipped so the logo stays legible on dark and
 * light surfaces: the default white wordmark for the dark UI, and a
 * dark-graphite wordmark for light surfaces.
 */
export function Logo({ variant = "full", size = "md", className, priority }: LogoProps) {
  const height = HEIGHTS[size];

  if (variant === "mark") {
    return (
      <Image
        src="/brand/hashcode-mark.png"
        alt="HashCode"
        width={672}
        height={471}
        priority={priority}
        className={cn("w-auto", className)}
        style={{ height }}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/hashcode-wordmark-dark.png"
        alt="HashCode"
        width={1808}
        height={283}
        priority={priority}
        className="h-auto w-auto dark:hidden"
        style={{ height }}
      />
      <Image
        src="/brand/hashcode-wordmark.png"
        alt="HashCode"
        width={1808}
        height={283}
        priority={priority}
        className="hidden h-auto w-auto dark:block"
        style={{ height }}
      />
    </span>
  );
}
