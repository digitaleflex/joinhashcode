import * as React from "react";
import { cn } from "@/lib/utils";

interface HashSymbolProps {
  className?: string;
  size?: number;
}

/** Simple hash/motorcycle emblem icon for HASHCODE branding. */
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

interface LogoProps {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  const sizeClasses = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };
  if (variant === "mark") {
    return (
      <HashSymbol className={cn("text-primary", className)} size={size === "sm" ? 24 : size === "md" ? 32 : 48} />
    );
  }
  return (
    <span className={cn("font-syne font-extrabold italic tracking-tight", sizeClasses[size], className)}>
      HASHCODE
    </span>
  );
}
