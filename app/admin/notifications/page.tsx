"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Megaphone, 
  Send, 
  AlertTriangle, 
  Info, 
  Zap,
  Globe,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("SYSTEM");
  const [link, setLink] = useState("");

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirm("Diffuser cette annonce à TOUTE la communauté ? Cette action est irréversible.")) return;

    try {
      setLoading(true);
      const response = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, type, link: link || null }),
      });

      if (!response.ok) throw new Error("Broadcast failed");
      
      const data = await response.json();
      toast.success(`Succès : ${data.count} agents notifiés.`);
      setTitle("");
      setMessage("");
      setLink("");
    } catch (error: unknown) {
      toast.error("Erreur lors de la diffusion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold text-primary flex items-center gap-3 tracking-tighter uppercase">
            <Megaphone className="h-8 w-8" />
            Broadcast Center
          </h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">
            Diffuse des directives et annonces globales sur tous les terminaux.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
            <Card className="glass-card bg-zinc-900/40 border-white/5 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                    <CardTitle className="text-lg font-mono uppercase text-white flex items-center gap-2">
                        <Send className="size-4 text-primary" />
                        Nouvelle_Transmission
                    </CardTitle>
                    <CardDescription className="text-[10px] font-mono uppercase">L'impact est global et immédiat.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleBroadcast} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase font-black">Type_Notification</label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="bg-black/40 border-white/10 font-mono text-white h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                    <SelectItem value="SYSTEM">
                                        <div className="flex items-center gap-2"><Info className="size-3 text-blue-400" /> SYSTEM_INFO</div>
                                    </SelectItem>
                                    <SelectItem value="WARNING">
                                        <div className="flex items-center gap-2"><AlertTriangle className="size-3 text-amber-500" /> PRIORITY_WARNING</div>
                                    </SelectItem>
                                    <SelectItem value="EVENT">
                                        <div className="flex items-center gap-2"><Zap className="size-3 text-primary" /> SPECIAL_EVENT</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase font-black">Titre_Alerte</label>
                            <Input 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ex: MAINTENANCE_SECTEUR_B4"
                                className="bg-black/40 border-white/10 font-mono text-white h-12 rounded-xl focus-visible:ring-primary/30"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase font-black">Message_Directif</label>
                            <Textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Détails de la transmission..."
                                className="bg-black/40 border-white/10 font-mono text-white min-h-[120px] rounded-2xl focus-visible:ring-primary/30"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase font-black">Redirection_URL (Optionnel)</label>
                            <Input 
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="/missions/clx-23"
                                className="bg-black/40 border-white/10 font-mono text-white h-12 rounded-xl focus-visible:ring-primary/30"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading || !title || !message}
                            className="w-full bg-primary text-black hover:bg-primary/90 font-black uppercase h-14 rounded-2xl shadow-[0_0_20px_#C5F44130] transition-all group"
                        >
                            {loading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <>
                                    Exécuter Broadcast_Global
                                    <Globe className="ml-2 size-4 group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
            <Card className="glass-card bg-primary/5 border-primary/20 rounded-3xl p-6 border-dashed">
                <h3 className="text-primary font-black uppercase text-xs flex items-center gap-2 mb-4">
                    <Info className="size-4" />
                    Règles d&apos;envoi
                </h3>
                <ul className="space-y-4">
                    {[
                        "Chaque utilisateur recevra une notification instantanée.",
                        "Le flux d'activité global sera mis à jour.",
                        "Éviter les abus pour ne pas saturer l'attention des agents.",
                        "Les notifications prioritaires (WARNING) s'affichent avec une lueur spécifique."
                    ].map((text, i) => (
                        <li key={i} className="flex gap-3 items-start">
                            <div className="size-1 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_5px_#C5F441]" />
                            <p className="text-[11px] text-zinc-400 font-mono leading-tight uppercase">{text}</p>
                        </li>
                    ))}
                </ul>
            </Card>

            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex flex-col items-center text-center space-y-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <Megaphone className="size-8 text-primary" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase text-white tracking-wide text-opacity-80">Portée Maximale</h4>
                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider italic">Prêt pour impact sur la grille.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
