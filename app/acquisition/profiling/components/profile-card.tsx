"use client";

import type { GeneratedProfile } from "@/lib/acquisition/types";

const DOMAIN_LABEL: Record<string, string> = {
  web: "Web Development",
  cybersecurity: "Cybersecurity",
  ai: "Applied AI",
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Débutant",
  practicing: "Pratique",
  autonomous: "Autonome",
  advanced: "Avancé",
};

interface ProfileCardProps {
  profile: GeneratedProfile;
  goal?: string;
}

export function ProfileCard({ profile, goal }: ProfileCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 mt-2">
        <Field label="Domaine" value={DOMAIN_LABEL[profile.domainLabel] ?? profile.domainLabel} />
        <Field label="Niveau" value={LEVEL_LABEL[profile.levelLabel] ?? profile.levelLabel} />
        <Field label="Objectif" value={profile.goalLabel} />
        <Field label="Style" value={profile.styleLabel} />
        <Field label="Mentorat" value={profile.mentoringLabel} />
      </div>
      {goal && (
        <div className="mt-5 pt-5 border-t border-border/70">
          <span className="font-mono text-xs text-muted-foreground">Objectif à 3 mois</span>
          <p className="mt-1 text-foreground italic font-syne text-base">« {goal} »</p>
        </div>
      )}
      {profile.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {profile.tags.slice(0, 8).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-sm border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <div className="mt-0.5 text-sm text-foreground font-medium">{value}</div>
    </div>
  );
}
