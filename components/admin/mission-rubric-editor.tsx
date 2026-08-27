"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Scale } from "lucide-react";

export interface RubricCriterion {
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

interface MissionRubricEditorProps {
  value: RubricCriterion[];
  onChange: (value: RubricCriterion[]) => void;
}

export function MissionRubricEditor({ value, onChange }: MissionRubricEditorProps) {
  const [items, setItems] = useState<RubricCriterion[]>(value);

  const totalWeight = useMemo(
    () => items.reduce((sum, c) => sum + c.weight, 0),
    [items]
  );

  const update = (next: RubricCriterion[]) => {
    setItems(next);
    onChange(next);
  };

  const add = () => {
    update([...items, { name: "", description: "", maxScore: 10, weight: 1 }]);
  };

  const remove = (index: number) => {
    update(items.filter((_, i) => i !== index));
  };

  const patch = (index: number, patch: Partial<RubricCriterion>) => {
    const next = items.map((c, i) => (i === index ? { ...c, ...patch } : c));
    update(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-zinc-500 font-mono text-xs">
          Aucun critère. Ajoutez des critères pour définir la grille d&apos;évaluation.
        </p>
      )}
      {items.map((criterion, i) => (
        <div
          key={i}
          className="border border-zinc-800 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-600">
              Critère #{i + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-6 w-6"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              value={criterion.name}
              onChange={(e) => patch(i, { name: e.target.value })}
              placeholder="Nom du critère"
              className="bg-zinc-900 border-zinc-800 font-mono text-sm"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={criterion.maxScore}
                  onChange={(e) =>
                    patch(i, { maxScore: Number(e.target.value) || 0 })
                  }
                  placeholder="Score max"
                  className="bg-zinc-900 border-zinc-800 font-mono text-sm"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={criterion.weight}
                  onChange={(e) =>
                    patch(i, { weight: Number(e.target.value) || 0 })
                  }
                  placeholder="Poids"
                  className="bg-zinc-900 border-zinc-800 font-mono text-sm"
                />
              </div>
            </div>
          </div>
          <Textarea
            value={criterion.description}
            onChange={(e) => patch(i, { description: e.target.value })}
            placeholder="Description du critère..."
            className="bg-zinc-900 border-zinc-800 font-mono text-xs min-h-[60px]"
          />
        </div>
      ))}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="h-7 border-primary text-primary hover:bg-primary/10"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Ajouter un critère
        </Button>
        {items.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Scale className="h-3.5 w-3.5 text-primary" />
            <span className={totalWeight === 1 ? "text-emerald-400" : "text-amber-400"}>
              Poids total : {totalWeight}
            </span>
            {totalWeight !== 1 && (
              <span className="text-zinc-500">(recommandé : 1.0)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
