"use client";

import { cn } from "@/lib/utils";

interface CountrySelectProps {
  value: string;
  onChange: (v: string) => void;
}

const COUNTRIES = [
  "Bénin", "Togo", "Ghana", "Nigeria", "Côte d'Ivoire", "Sénégal",
  "France", "Belgique", "Suisse", "Canada", "Maroc", "Algérie",
  "Tunisie", "Autre",
];

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full h-14 rounded-lg border border-border bg-card px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none",
      )}
    >
      <option value="">— Pays —</option>
      {COUNTRIES.map((c) => (
        <option key={c} value={c.toLowerCase()}>{c}</option>
      ))}
    </select>
  );
}
