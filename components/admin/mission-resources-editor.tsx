"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export interface MissionResource {
  label: string;
  url: string;
  type: "doc" | "video" | "link" | "code";
}

interface MissionResourcesEditorProps {
  value: MissionResource[];
  onChange: (value: MissionResource[]) => void;
}

const RESOURCE_TYPES = [
  { value: "link", label: "Lien" },
  { value: "doc", label: "Documentation" },
  { value: "video", label: "Vidéo" },
  { value: "code", label: "Code" },
];

export function MissionResourcesEditor({ value, onChange }: MissionResourcesEditorProps) {
  const [items, setItems] = useState<MissionResource[]>(value);

  const update = (next: MissionResource[]) => {
    setItems(next);
    onChange(next);
  };

  const add = () => {
    update([...items, { label: "", url: "", type: "link" }]);
  };

  const remove = (index: number) => {
    update(items.filter((_, i) => i !== index));
  };

  const patch = (index: number, patch: Partial<MissionResource>) => {
    const next = items.map((r, i) => (i === index ? { ...r, ...patch } : r));
    update(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-zinc-500 font-mono text-xs">Aucune ressource.</p>
      )}
      {items.map((res, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row gap-2 border border-zinc-800 rounded-lg p-3"
        >
          <div className="flex-1 min-w-0">
            <Input
              value={res.label}
              onChange={(e) => patch(i, { label: e.target.value })}
              placeholder="Libellé"
              className="bg-zinc-900 border-zinc-800 font-mono text-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={res.url}
              onChange={(e) => patch(i, { url: e.target.value })}
              placeholder="https://..."
              className="bg-zinc-900 border-zinc-800 font-mono text-sm"
            />
          </div>
          <div className="w-full md:w-40 shrink-0">
            <Select value={res.type} onValueChange={(v) => patch(i, { type: v as MissionResource["type"] })}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                {RESOURCE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0 self-center"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="h-7 border-primary text-primary hover:bg-primary/10"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Ajouter une ressource
      </Button>
    </div>
  );
}
