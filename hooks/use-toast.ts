'use client';

// Compatibility shim: project migrated to Sonner, but some files still
// import the old Radix-style toast helper. Map the legacy signature to
// Sonner's API so call sites keep working.
import { toast as sonnerToast } from "sonner";

type LegacyToastInput = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export const toast = (input: LegacyToastInput | string) => {
  if (typeof input === "string") {
    sonnerToast(input);
    return;
  }

  const message = input.description
    ? `${input.title ?? ""}${input.title ? " — " : ""}${input.description}`
    : input.title ?? "";

  if (input.variant === "destructive") {
    sonnerToast.error(message, { duration: input.duration });
  } else {
    sonnerToast.success(message, { duration: input.duration });
  }
};

// Sonner does not expose ToastActionElement. We keep the symbol so legacy
// type-only imports keep compiling, but it has no runtime value.
export type ToastActionElement = unknown;

