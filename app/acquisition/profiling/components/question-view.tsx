"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Question, ProfileAnswers, QuestionOption } from "@/lib/acquisition/types";

interface QuestionViewProps {
  question: Question;
  answers: ProfileAnswers;
  value: unknown;
  error: string | null;
  onSingle: (v: string) => void;
  onMultiToggle: (v: string) => void;
  onTextChange: (v: string) => void;
  onCountry: (v: string) => void;
  onContinue: () => void;
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-destructive" role="alert">
      {children}
    </p>
  );
}

export function QuestionView({
  question,
  answers,
  value,
  error,
  onSingle,
  onMultiToggle,
  onTextChange,
  onCountry,
  onContinue,
}: QuestionViewProps) {
  const options = React.useMemo(
    () => question.options ?? [],
    [question.options],
  );

  // Keyboard shortcuts: 1-9 select option N (single-choice only).
  React.useEffect(() => {
    if (question.type !== "single_choice" || options.length === 0) return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= options.length) {
        e.preventDefault();
        onSingle(options[n - 1].value);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question.type, options, onSingle]);

  return (
    <div>
      <h2 className="font-syne font-bold text-xl sm:text-2xl tracking-tight text-foreground leading-snug">
        {question.title}
      </h2>
      {question.description && (
        <p className="mt-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
          {question.description}
        </p>
      )}

      <div className="mt-6">
        {question.type === "single_choice" && (
          <div className="grid gap-2.5">
            {options.map((o, i) => (
              <OptionCard
                key={o.value}
                option={o}
                selected={value === o.value}
                onSelect={onSingle}
                index={i}
              />
            ))}
          </div>
        )}

        {question.type === "multi_choice" && (
          <MultiChoiceView
            options={options}
            selected={(value as string[]) ?? []}
            onToggle={onMultiToggle}
            onContinue={onContinue}
            required={question.required}
          />
        )}

        {question.type === "text" && (
          <TextView
            value={(value as string) ?? ""}
            placeholder={question.placeholder}
            onChange={onTextChange}
            onContinue={onContinue}
            error={error}
            type="text"
            maxLength={question.maxChars}
            required={question.required}
          />
        )}

        {question.type === "email" && (
          <TextView
            value={(value as string) ?? ""}
            placeholder={question.placeholder}
            onChange={onTextChange}
            onContinue={onContinue}
            error={error}
            type="email"
            maxLength={question.maxChars}
            required={question.required}
          />
        )}

        {question.type === "longtext" && (
          <LongTextView
            value={(value as string) ?? ""}
            placeholder={question.placeholder}
            onChange={onTextChange}
            onContinue={onContinue}
            error={error}
            minChars={question.minChars}
            maxChars={question.maxChars}
            suggestions={
              question.id === "threeMonthGoal"
                ? ["Décrocher mon premier stage", "Finir mon portfolio", "Lancer mon premier projet", "Être à l'aise avec les bases"]
                : undefined
            }
          />
        )}

        {question.type === "country" && (
          <div className="space-y-3">
            <CountrySelect value={(value as string) ?? ""} onChange={onCountry} />
            {error && <ErrorNote>{error}</ErrorNote>}
            <Button size="lg" className="w-full" onClick={onContinue} disabled={!value}>
              Continuer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
// Option card — single or multi-select

interface OptionCardProps {
  option: QuestionOption;
  selected: boolean;
  onSelect: (v: string) => void;
  index: number;
  variant?: "radio" | "checkbox";
}

function OptionCard({ option, selected, onSelect, index, variant = "radio" }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        "w-full text-left rounded-lg border px-4 py-3 flex items-start gap-3 transition-all duration-150",
        selected
          ? "border-primary bg-primary/10 ring-1 ring-primary"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/30",
      )}
    >
      <span
        className={cn(
          "shrink-0 size-5 rounded-full border flex items-center justify-center mt-0.5",
          selected ? "border-primary bg-primary" : "border-muted-foreground/40",
        )}
      >
        {selected && (
          <span className="size-2 rounded-full bg-primary-foreground" />
        )}
      </span>
      <span className="min-w-0">
        {option.emoji && <span className="text-base">{option.emoji}</span>}
        <span className={cn("ml-1 font-medium text-foreground", option.emoji && "ml-2")}>
          {option.label}
        </span>
        {option.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
        )}
        {option.hint && (
          <p className="mt-0.5 text-[11px] text-muted-foreground/60 font-mono">{option.hint}</p>
        )}
      </span>
    </button>
  );
}

function MultiChoiceView({
  options,
  selected,
  onToggle,
  onContinue,
  required,
}: {
  options: QuestionOption[];
  selected: string[];
  onToggle: (v: string) => void;
  onContinue: () => void;
  required: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((o) => (
          <OptionCard
            key={o.value}
            option={o}
            selected={selected.includes(o.value)}
            onSelect={onToggle}
            index={0}
            variant="checkbox"
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-muted-foreground">
          {selected.length > 0
            ? `${selected.length} sélectionné${selected.length > 1 ? "s" : ""}`
            : required
              ? "Choisis au moins une option"
              : "Facultatif — tu peux passer"}
        </span>
        <Button
          size="default"
          onClick={onContinue}
          disabled={required && selected.length === 0}
        >
          {selected.length > 0 ? "Continuer" : required ? "Continuer" : "Passer"}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
// Text input

interface TextViewProps {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  error: string | null;
  type?: "text" | "email";
  maxLength?: number;
  required?: boolean;
}

function TextView({ value, placeholder, onChange, onContinue, error, type = "text", maxLength, required }: TextViewProps) {
  const [blurred, setBlurred] = React.useState(false);
  const showError = error || (blurred ? "" : "");
  return (
    <div className="space-y-3">
      <input
        type={type}
        value={value}
        autoFocus
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setBlurred(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onContinue();
          }
        }}
        className={cn(
          "w-full h-14 rounded-lg border bg-card px-4 text-base sm:text-lg text-foreground placeholder:text-muted-foreground transition-colors duration-180 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          showError ? "border-destructive" : "border-border",
        )}
      />
      {showError && <ErrorNote>{showError}</ErrorNote>}
      <div className="flex items-center justify-between gap-3">
        {!required && <span className="text-xs text-muted-foreground">Facultatif</span>}
        <Button
          size="lg"
          className="w-full"
          onClick={onContinue}
          disabled={required ? !value.trim() : false}
        >
          {value.trim() || required ? "Continuer" : "Passer"}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
// Long text

interface LongTextViewProps {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  error: string | null;
  minChars?: number;
  maxChars?: number;
  suggestions?: string[];
}

function LongTextView({ value, placeholder, onChange, onContinue, error, minChars, maxChars, suggestions }: LongTextViewProps) {
  const len = value.trim().length;
  const [blurred, setBlurred] = React.useState(false);
  const showError = error || (blurred ? "" : "");
  return (
    <div className="space-y-3">
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className="rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <textarea
        value={value}
        autoFocus
        rows={3}
        placeholder={placeholder}
        maxLength={maxChars}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setBlurred(true)}
        className={cn(
          "w-full rounded-lg border bg-card px-4 py-3 text-base sm:text-lg text-foreground placeholder:text-muted-foreground transition-colors duration-180 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none leading-relaxed",
          showError ? "border-destructive" : "border-border",
        )}
      />
      <div className="flex items-center justify-between text-xs">
        <span
          className={cn(
            "text-muted-foreground",
            minChars && len > 0 && len < minChars && "text-destructive",
          )}
        >
          {minChars && len < minChars
            ? `Encore ${minChars - len} caractères`
            : "Une phrase suffit."}
        </span>
        {maxChars && (
          <span className="font-mono text-muted-foreground">
            {len}/{maxChars}
          </span>
        )}
      </div>
      {showError && <ErrorNote>{showError}</ErrorNote>}
      <Button size="lg" className="w-full" onClick={onContinue} disabled={!value.trim()}>
        Continuer
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
// Country select

function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const countries = [
    "Bénin", "Togo", "Ghana", "Nigeria", "Côte d'Ivoire", "Sénégal",
    "France", "Belgique", "Suisse", "Canada", "Maroc", "Algérie",
    "Tunisie", "Autre",
  ];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-14 rounded-lg border border-border bg-card px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none"
    >
      <option value="">— Pays —</option>
      {countries.map((c) => (
        <option key={c} value={c.toLowerCase()}>{c}</option>
      ))}
    </select>
  );
}
