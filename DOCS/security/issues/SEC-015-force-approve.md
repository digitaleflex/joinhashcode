# SEC-015 — `forceApprove` ignore les critères de validation

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Broken Access Control / logique métier
- **Fichier** : `app/api/missions/[id]/review/route.ts:24, 62`

## Description

Le schéma de revue accepte `forceApprove: boolean`, qui permet d'approuver une soumission **en ignorant tous les critères requis** :

```ts
const reviewSchema = z.object({
  criteria: z.record(z.boolean()),
  feedback: z.string().min(20),
  forceApprove: z.boolean().optional().default(false), // ⚠️
});
// ...
if (allRequiredPassed || forceApprove) { /* approuve + verse XP */ }
```

Risque actuellement limité car le claim est réservé au staff (« Concierge Mode »), mais le design reste dangereux si la revue par pairs est rouverte.

## Impact

Validation arbitraire de missions (XP non mérité) par tout reviewer assigné, en contournant les critères.

## Correctif recommandé

Restreindre `forceApprove` strictement aux ADMIN (vérifier le rôle en base avant d'honorer le flag) et **journaliser** chaque usage :

```ts
if (forceApprove) {
  const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (me?.role !== "ADMIN") {
    return new NextResponse("forceApprove réservé aux administrateurs.", { status: 403 });
  }
  // logActivity({ action: "MISSION_FORCE_APPROVED", ... })
}
```

## Critères d'acceptation

- [ ] `forceApprove` rejeté (403) pour les non-ADMIN.
- [ ] Chaque `forceApprove` est journalisé (auteur, soumission).
- [ ] Test : reviewer non-admin avec `forceApprove` + critères non remplis → refus.
