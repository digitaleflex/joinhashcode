"use client";

import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { StepFieldType, StepField } from "@/lib/onboarding-mission";

const FIELD_TYPES: { value: StepFieldType; label: string }[] = [
  { value: "TEXT", label: "Texte court" },
  { value: "TEXTAREA", label: "Texte long" },
  { value: "SELECT", label: "Sélection unique" },
  { value: "MULTI_SELECT", label: "Sélection multiple" },
  { value: "SKILLS", label: "Compétences" },
  { value: "ENV", label: "Environnement" },
  { value: "SLIDER", label: "Curseur" },
  { value: "SCORED_CRITERIA", label: "Critères notés" },
  { value: "SOLUTIONS_TABLE", label: "Tableau solutions" },
  { value: "EISENHOWER", label: "Matrice Eisenhower" },
  { value: "ROADMAP", label: "Roadmap" },
  { value: "RISK_TABLE", label: "Tableau risques" },
  { value: "SMART_GOALS", label: "Objectifs SMART" },
  { value: "SYNTHESIS", label: "Synthèse" },
  { value: "DYNAMIC_TABLE", label: "Tableau dynamique" },
];

const optionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const columnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["text", "textarea", "select"]).optional(),
});

const fieldSchema = z.object({
  key: z.string().min(1, "Clé requise"),
  label: z.string().min(1, "Libellé requis"),
  type: z.string().min(1, "Type requis"),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  maxLength: z.coerce.number().optional(),
  minLines: z.coerce.number().optional(),
  hint: z.string().optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  step: z.coerce.number().optional(),
  minItems: z.coerce.number().optional(),
  options: z.array(optionSchema).optional(),
  columns: z.array(columnSchema).optional(),
});

const fieldsFormSchema = z.object({
  fields: z.array(fieldSchema),
});

type FieldFormValues = z.infer<typeof fieldsFormSchema>;

interface FieldBuilderProps {
  initialFields?: StepField[];
  onChange?: (fields: StepField[]) => void;
}

const REQUIRES_OPTIONS_TYPES = new Set(["SELECT", "MULTI_SELECT", "DYNAMIC_TABLE"]);
const REQUIRES_MIN_MAX = new Set(["SLIDER"]);
const REQUIRES_MIN_ITEMS = new Set([
  "DYNAMIC_TABLE",
  "SOLUTIONS_TABLE",
  "RISK_TABLE",
  "ROADMAP",
  "SMART_GOALS",
]);
const REQUIRES_COLUMNS = new Set(["DYNAMIC_TABLE"]);
const REQUIRES_OPTIONS = new Set(["SELECT", "MULTI_SELECT"]);

function fieldToForm(f: StepField): z.infer<typeof fieldSchema> {
  return {
    key: f.key,
    label: f.label,
    type: f.type,
    placeholder: f.placeholder ?? "",
    required: f.required ?? false,
    maxLength: f.maxLength,
    minLines: f.minLines,
    hint: f.hint ?? "",
    min: f.min,
    max: f.max,
    step: f.step,
    minItems: f.minItems,
    options: f.options?.map((o) => ({ value: o.value, label: o.label })) ?? [],
    columns: f.columns?.map((c) => ({ key: c.key, label: c.label, type: c.type })) ?? [],
  };
}

function formToField(f: z.infer<typeof fieldSchema>): StepField {
  const base: StepField = {
    key: f.key,
    label: f.label,
    type: f.type as StepFieldType,
  };
  if (f.placeholder) base.placeholder = f.placeholder;
  if (f.required) base.required = true;
  if (f.maxLength) base.maxLength = f.maxLength;
  if (f.minLines) base.minLines = f.minLines;
  if (f.hint) base.hint = f.hint;
  if (f.min !== undefined && f.min !== null) base.min = f.min;
  if (f.max !== undefined && f.max !== null) base.max = f.max;
  if (f.step !== undefined && f.step !== null) base.step = f.step;
  if (f.minItems !== undefined && f.minItems !== null) base.minItems = f.minItems;
  if (f.options && f.options.length > 0 && REQUIRES_OPTIONS.has(f.type)) {
    base.options = f.options.filter((o) => o.value || o.label);
  }
  if (f.columns && f.columns.length > 0 && REQUIRES_COLUMNS.has(f.type)) {
    base.columns = f.columns.filter((c) => c.key || c.label);
  }
  return base;
}

export function FieldBuilder({ initialFields = [], onChange }: FieldBuilderProps) {
  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldsFormSchema) as Resolver<FieldFormValues>,
    defaultValues: {
      fields: initialFields.map(fieldToForm),
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddField = () => {
    append({
      key: "",
      label: "",
      type: "TEXT",
      placeholder: "",
      required: false,
      hint: "",
      options: [],
      columns: [],
    });
    setExpandedIndex(fields.length);
  };

  const emitChange = () => {
    const values = form.getValues("fields");
    onChange?.(values.map(formToField));
  };

  return (
    <Form {...form}>
      <div className="space-y-3">
        {fields.length === 0 && (
          <div className="text-center py-8 text-zinc-500 font-mono text-xs">
            Aucun champ pour cette étape.
          </div>
        )}

        {fields.map((field, index) => {
          const currentType = form.watch(`fields.${index}.type`);
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={field.id}
              className="border border-zinc-800 rounded-lg bg-zinc-900/50 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    if (index > 0) {
                      move(index, index - 1);
                      emitChange();
                    }
                  }}
                  disabled={index === 0}
                  className="text-zinc-600 hover:text-zinc-300 disabled:opacity-30"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (index < fields.length - 1) {
                      move(index, index + 1);
                      emitChange();
                    }
                  }}
                  disabled={index === fields.length - 1}
                  className="text-zinc-600 hover:text-zinc-300 disabled:opacity-30"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <GripVertical className="h-3.5 w-3.5 text-zinc-700" />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-zinc-300 truncate block">
                    {form.watch(`fields.${index}.label`) || "Nouveau champ"}
                  </span>
                  <span className="font-mono text-xs text-zinc-600 truncate block">
                    {form.watch(`fields.${index}.key`) || "key"} · {currentType}
                  </span>
                </div>
                {form.watch(`fields.${index}.required`) && (
                  <Badge variant="outline" className="text-3xs border-amber-500/30 text-amber-400">
                    Requis
                  </Badge>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="h-7 text-zinc-400 hover:text-white"
                >
                  {isExpanded ? "Fermer" : "Éditer"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    remove(index);
                    emitChange();
                    if (expandedIndex === index) setExpandedIndex(null);
                  }}
                  className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.key`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono text-zinc-400">
                            Clé
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              className="bg-zinc-900 border-zinc-800 font-mono text-xs"
                              onBlur={() => emitChange()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.label`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono text-zinc-400">
                            Libellé
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              className="bg-zinc-900 border-zinc-800 font-mono text-xs"
                              onBlur={() => emitChange()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.type`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono text-zinc-400">
                            Type
                          </FormLabel>
                          <Select
                            onValueChange={(v) => {
                              f.onChange(v);
                              emitChange();
                            }}
                            value={f.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900 border-zinc-800 font-mono text-xs">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                              {FIELD_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.placeholder`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono text-zinc-400">
                            Placeholder
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              className="bg-zinc-900 border-zinc-800 font-mono text-xs"
                              onBlur={() => emitChange()}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.hint`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono text-zinc-400">
                            Indice
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              className="bg-zinc-900 border-zinc-800 font-mono text-xs"
                              onBlur={() => emitChange()}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.required`}
                      render={({ field: f }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={f.value}
                              onCheckedChange={(v) => {
                                f.onChange(v);
                                emitChange();
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-xs text-zinc-300 cursor-pointer">
                            Requis
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    {(currentType === "TEXT" || currentType === "TEXTAREA") && (
                      <FormField
                        control={form.control}
                        name={`fields.${index}.maxLength`}
                        render={({ field: f }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormLabel className="text-xs font-mono text-zinc-500">
                              Max
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...f}
                                value={f.value ?? ""}
                                className="w-20 bg-zinc-900 border-zinc-800 font-mono text-xs"
                                onBlur={() => emitChange()}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    {REQUIRES_MIN_MAX.has(currentType) && (
                      <>
                        <FormField
                          control={form.control}
                          name={`fields.${index}.min`}
                          render={({ field: f }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="text-xs font-mono text-zinc-500">
                                Min
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...f}
                                  value={f.value ?? ""}
                                  className="w-20 bg-zinc-900 border-zinc-800 font-mono text-xs"
                                  onBlur={() => emitChange()}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`fields.${index}.max`}
                          render={({ field: f }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="text-xs font-mono text-zinc-500">
                                Max
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...f}
                                  value={f.value ?? ""}
                                  className="w-20 bg-zinc-900 border-zinc-800 font-mono text-xs"
                                  onBlur={() => emitChange()}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    {REQUIRES_MIN_ITEMS.has(currentType) && (
                      <FormField
                        control={form.control}
                        name={`fields.${index}.minItems`}
                        render={({ field: f }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormLabel className="text-xs font-mono text-zinc-500">
                              Min items
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...f}
                                value={f.value ?? ""}
                                className="w-20 bg-zinc-900 border-zinc-800 font-mono text-xs"
                                onBlur={() => emitChange()}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {REQUIRES_OPTIONS.has(currentType) && (
                    <OptionsEditor
                      control={form.control}
                      index={index}
                      onCommit={emitChange}
                    />
                  )}

                  {REQUIRES_COLUMNS.has(currentType) && (
                    <ColumnsEditor
                      control={form.control}
                      index={index}
                      onCommit={emitChange}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddField}
          className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-primary hover:border-primary/40 font-mono text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-2" />
          Ajouter un champ
        </Button>
      </div>
    </Form>
  );
}

function OptionsEditor({
  control,
  index,
  onCommit,
}: {
  control: ReturnType<typeof useForm<FieldFormValues>>["control"];
  index: number;
  onCommit: () => void;
}) {
  const name = `fields.${index}.options` as const;

  return (
    <div className="space-y-2">
      <FormLabel className="text-xs font-mono text-zinc-400">Options</FormLabel>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const options: { value: string; label: string }[] = field.value ?? [];
          return (
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={opt.value}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = { ...next[i], value: e.target.value };
                      field.onChange(next);
                    }}
                    onBlur={onCommit}
                    placeholder="value"
                    className="bg-zinc-900 border-zinc-800 font-mono text-xs flex-1"
                  />
                  <Input
                    value={opt.label}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = { ...next[i], label: e.target.value };
                      field.onChange(next);
                    }}
                    onBlur={onCommit}
                    placeholder="Label"
                    className="bg-zinc-900 border-zinc-800 font-mono text-xs flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      field.onChange(options.filter((_, j) => j !== i));
                      onCommit();
                    }}
                    className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  field.onChange([...options, { value: "", label: "" }]);
                }}
                className="text-xs font-mono text-zinc-500 hover:text-primary"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter une option
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}

function ColumnsEditor({
  control,
  index,
  onCommit,
}: {
  control: ReturnType<typeof useForm<FieldFormValues>>["control"];
  index: number;
  onCommit: () => void;
}) {
  const name = `fields.${index}.columns` as const;

  return (
    <div className="space-y-2">
      <FormLabel className="text-xs font-mono text-zinc-400">Colonnes</FormLabel>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const columns: { key: string; label: string; type?: string }[] = field.value ?? [];
          return (
            <div className="space-y-2">
              {columns.map((col, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={col.key}
                    onChange={(e) => {
                      const next = [...columns];
                      next[i] = { ...next[i], key: e.target.value };
                      field.onChange(next);
                    }}
                    onBlur={onCommit}
                    placeholder="key"
                    className="bg-zinc-900 border-zinc-800 font-mono text-xs flex-1"
                  />
                  <Input
                    value={col.label}
                    onChange={(e) => {
                      const next = [...columns];
                      next[i] = { ...next[i], label: e.target.value };
                      field.onChange(next);
                    }}
                    onBlur={onCommit}
                    placeholder="Label"
                    className="bg-zinc-900 border-zinc-800 font-mono text-xs flex-1"
                  />
                  <Select
                    value={col.type ?? "text"}
                    onValueChange={(v) => {
                      const next = [...columns];
                      next[i] = { ...next[i], type: v };
                      field.onChange(next);
                      onCommit();
                    }}
                  >
                    <SelectTrigger className="w-28 bg-zinc-900 border-zinc-800 font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="textarea">Texte long</SelectItem>
                      <SelectItem value="select">Sélection</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      field.onChange(columns.filter((_, j) => j !== i));
                      onCommit();
                    }}
                    className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  field.onChange([...columns, { key: "", label: "", type: "text" }]);
                }}
                className="text-xs font-mono text-zinc-500 hover:text-primary"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter une colonne
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
