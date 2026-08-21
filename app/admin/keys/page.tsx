"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Key, 
  CheckCircle2, 
  Clock,
  RefreshCcw,
  Copy
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Prisma } from "@/generated/prisma/client";

type BetaKey = Prisma.BetaKeyGetPayload<object>;

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<BetaKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generateCount, setCount] = useState(1);
  const [generating, setGenerating] = useState(false);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/keys");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setKeys(data as BetaKey[]);
    } catch {
      toast.error("Erreur lors du chargement des clés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const response = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: generateCount }),
      });
      if (!response.ok) throw new Error("Failed to generate");
      toast.success(`${generateCount} clé(s) générée(s)`);
      fetchKeys();
    } catch {
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Révoquer cette clé ?")) return;

    try {
      const response = await fetch(`/api/admin/keys/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Clé révoquée");
      fetchKeys();
    } catch {
      toast.error("Erreur lors de la révocation");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Clé copiée");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <Key className="h-8 w-8" />
            Clés d'accès
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Gère les habilitations d'entrée pour la phase Beta.
          </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden px-3">
                <span className="text-[10px] font-mono text-zinc-500 mr-2 uppercase">Quantité</span>
                <Input 
                    type="number" 
                    value={generateCount} 
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-16 h-10 border-none bg-transparent font-mono text-white text-center focus-visible:ring-0"
                    min="1"
                    max="50"
                />
            </div>
            <Button 
                onClick={handleGenerate} 
                disabled={generating}
                className="bg-primary text-black hover:bg-primary/90 font-mono font-bold uppercase tracking-tight h-12 px-6 rounded-xl shadow-[0_0_15px_#C5F44140]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Générer
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm space-y-2">
            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">Total_Keys</div>
            <div className="text-3xl font-black text-white font-mono">{keys.length}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm space-y-2">
            <div className="text-emerald-500 text-[10px] font-mono uppercase tracking-widest text-opacity-60">Actives</div>
            <div className="text-3xl font-black text-emerald-400 font-mono">{keys.filter(k => k.isUsed).length}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm space-y-2">
            <div className="text-primary text-[10px] font-mono uppercase tracking-widest text-opacity-60">En_Réserve</div>
            <div className="text-3xl font-black text-primary font-mono">{keys.filter(k => !k.isUsed).length}</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400 font-mono uppercase text-[10px] py-4">Clé</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-[10px] py-4">Statut</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-[10px] py-4">Utilisé par</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-[10px] py-4">Date de création</TableHead>
              <TableHead className="text-zinc-400 font-mono uppercase text-[10px] py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-zinc-600 font-mono text-xs italic">
                    <RefreshCcw className="h-4 w-4 animate-spin mx-auto mb-2 opacity-20" />
                    Synchronisation du registre d'accès...
                </TableCell>
              </TableRow>
            ) : keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-zinc-600 font-mono text-xs">
                  Aucun jeton d'accès en circulation.
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow key={key.id} className="border-zinc-800 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                        <code className="text-white font-mono font-black text-base bg-white/5 px-2 py-1 rounded">
                            {key.key}
                        </code>
                        <button 
                            onClick={() => copyToClipboard(key.key)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-primary transition-all"
                        >
                            <Copy className="h-3 w-3" />
                        </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {key.isUsed ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-[9px] uppercase">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Activé
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-zinc-700 text-zinc-500 font-mono text-[9px] uppercase">
                        <Clock className="h-3 w-3 mr-1" /> En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {key.usedBy ? (
                      <span className="text-zinc-300 font-bold text-xs font-mono uppercase">{key.usedBy}</span>
                    ) : (
                      <span className="text-zinc-700 font-mono text-[10px]">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-zinc-500 font-mono text-[10px]">
                      {new Date(key.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                      onClick={() => handleDelete(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
