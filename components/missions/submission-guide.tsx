"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, GitBranch, Globe, FileText, Check, Clock, Users, Award } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Lis le briefing",
    description: "Comprends bien l'objectif et les livrables attendus avant de commencer. Chaque mission précise clairement ce qui est évalué.",
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    number: "02",
    title: "Réalise le travail",
    description: "Complète la mission à ton rythme. Pour les missions GitHub, crée un dépôt public (ou invite joinhashcode comme collaborateur si privé).",
    icon: GitBranch,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    number: "03",
    title: "Soumets ton livrable",
    description: "Entre le lien GitHub, l'URL de ton projet, ou ta réponse selon la méthode demandée. Vérifie que le lien est accessible avant de valider.",
    icon: Globe,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    number: "04",
    title: "Revue par la communauté",
    description: "Un reviewer examine ta soumission sous 48h. Il peut l'approuver, demander une révision, ou te donner un feedback détaillé.",
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    number: "05",
    title: "Récompense XP",
    description: "Une fois approuvée, tu reçois les XP de la mission. Un travail exemplaire peut rapporter des XP bonus et un badge spécial.",
    icon: Award,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const TIPS = [
  "Un dépôt GitHub avec un README clair augmente tes chances d'approbation.",
  "Réponds aux notes de révision point par point pour accélérer la validation.",
  "La rétrospection optionnelle améliore les missions pour toute la communauté.",
];

export function SubmissionGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-[9px] font-mono uppercase tracking-wider text-zinc-500 hover:text-primary hover:bg-primary/5 transition-all"
        >
          <HelpCircle className="size-3" />
          Guide de soumission
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-zinc-950 border-white/10 rounded-3xl p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <HelpCircle className="size-4" />
              </div>
              Comment soumettre une mission ?
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-none">
          {/* Steps */}
          <div className="space-y-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`flex gap-4 p-4 rounded-2xl border ${step.bg} ${step.border}`}
                >
                  <div className={`shrink-0 p-2 rounded-xl ${step.bg} border ${step.border}`}>
                    <Icon className={`size-4 ${step.color}`} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black font-mono ${step.color}`}>{step.number}</span>
                      <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-zinc-500" />
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-zinc-500">Conseils pratiques</span>
            </div>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <Check className="size-3 text-primary shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
