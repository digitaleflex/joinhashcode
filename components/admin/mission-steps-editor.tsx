"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Layers,
  Plus,
  Pencil,
} from "lucide-react";
import { FieldBuilder } from "./field-builder";
import type { MissionSubDef, StepField } from "@/lib/onboarding-mission";

interface MissionStepsEditorProps {
  slug: string;
  steps: MissionSubDef[];
}

export function MissionStepsEditor({ slug, steps }: MissionStepsEditorProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [editedSteps, setEditedSteps] = useState<Record<string, StepField[]>>({});

  const getFields = (step: MissionSubDef) =>
    editedSteps[step.key] ?? step.fields;

  const handleFieldsChange = (stepKey: string, fields: StepField[]) => {
    setEditedSteps((prev) => ({ ...prev, [stepKey]: fields }));
  };

  return (
    <div className="glass-card rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-mono text-primary uppercase tracking-wider flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Étapes de la mission
        </h2>
        <Badge variant="outline" className="font-mono text-[10px] text-zinc-400 border-zinc-700">
          {steps.length} étape{steps.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 font-mono text-xs space-y-2">
          <Layers className="h-8 w-8 mx-auto text-zinc-700" />
          <p>Aucune étape définie pour cette mission.</p>
          <p className="text-zinc-600">
            Les étapes sont actuellement définies dans TypeScript.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const isExpanded = expandedStep === step.key;
            const fields = getFields(step);
            const fieldCount = fields.length;
            const requiredCount = fields.filter((f) => f.required).length;

            return (
              <div
                key={step.key}
                className="border border-zinc-800 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedStep(isExpanded ? null : step.key)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/50 transition-colors text-left"
                >
                  <span className="font-mono text-[10px] text-zinc-600 w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-200 font-medium">
                        {step.title}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-600">
                        ({step.shortTitle})
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className="font-mono text-[9px] text-zinc-400 border-zinc-700"
                    >
                      {fieldCount} champ{fieldCount > 1 ? "s" : ""}
                    </Badge>
                    {requiredCount > 0 && (
                      <Badge
                        variant="outline"
                        className="font-mono text-[9px] text-amber-400 border-amber-500/30"
                      >
                        {requiredCount} requis
                      </Badge>
                    )}
                    {step.independent && (
                      <Badge
                        variant="outline"
                        className="font-mono text-[9px] text-emerald-400 border-emerald-500/30"
                      >
                        Indépendant
                      </Badge>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-4">
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Pencil className="h-3 w-3" />
                        key: {step.key}
                      </span>
                      {step.scoreMax && (
                        <span>scoreMax: {step.scoreMax}</span>
                      )}
                    </div>

                    <FieldBuilder
                      initialFields={step.fields}
                      onChange={(fields) =>
                        handleFieldsChange(step.key, fields)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          className="w-full border-dashed border-zinc-700 text-zinc-500 font-mono text-xs cursor-not-allowed"
        >
          <Plus className="h-3.5 w-3.5 mr-2" />
          Ajouter une étape
          <span className="ml-2 text-[9px] text-zinc-600">(bientôt disponible)</span>
        </Button>
        <p className="text-[9px] text-zinc-600 font-mono text-center mt-2">
          Les étapes sont actuellement définies dans TypeScript ({`lib/${slug.replace(/-/g, "-")}-mission.ts`})
        </p>
      </div>
    </div>
  );
}
