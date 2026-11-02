"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
}

/** Keep only letters/digits, uppercase, capped to `length`. */
function sanitize(raw: string, length: number): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, length);
}

/**
 * Segmented one-time-code input.
 *
 * A single visually-hidden input drives the boxes so that:
 * - mobile email clients can autofill the code (`autoComplete="one-time-code"`);
 * - paste, backspace and arrow keys behave natively;
 * - the value stays a single controlled string for the caller.
 */
export function OtpInput({
  value,
  onChange,
  length = 8,
  disabled,
  autoFocus,
  label = "Code de sécurité",
}: OtpInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const chars = Array.from({ length }, (_, index) => value[index] ?? "");
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <div
      className="relative"
      onClick={() => inputRef.current?.focus()}
      data-disabled={disabled ? "true" : undefined}
    >
      <div className="flex justify-between gap-1.5 sm:gap-2" aria-hidden="true">
        {chars.map((char, index) => (
          <div
            key={index}
            className={cn(
              "flex h-12 flex-1 items-center justify-center rounded-xl border font-mono text-lg font-bold tracking-widest transition-colors",
              char
                ? "border-primary/40 bg-primary/5 text-white"
                : "border-white/10 bg-white/[0.02] text-zinc-600",
              index === activeIndex &&
                !disabled &&
                "border-primary/60 ring-2 ring-primary/20",
            )}
          >
            {char || "·"}
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(sanitize(event.target.value, length))}
        onPaste={(event) => {
          event.preventDefault();
          onChange(sanitize(event.clipboardData.getData("text"), length));
        }}
        type="text"
        inputMode="text"
        autoComplete="one-time-code"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={length}
        disabled={disabled}
        aria-label={`${label} (${length} caractères)`}
        className="absolute inset-0 h-full w-full cursor-text rounded-xl bg-transparent text-transparent caret-transparent opacity-0 outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}
