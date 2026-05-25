# P3 — Cron : libération automatique des claims expirés

**Priorité :** 🔴 Critique  
**Effort estimé :** ~2h  
**Pourquoi c'est bloquant :** Quand un reviewer claim une soumission, elle passe à `IN_REVIEW`. S'il ne revient jamais, la soumission reste bloquée indéfiniment. L'auteur attend sans réponse, et aucun autre reviewer ne peut intervenir. C'est un dead lock silencieux.

---

## Contexte

- Modèle `MissionSubmission` dans Prisma a : `status`, `reviewerId`, `updatedAt`
- Status `IN_REVIEW` = un reviewer a claimé mais n'a pas encore soumis sa review
- Les crons existants sont dans `app/api/internal/cron/` :
  - `squad-decay/route.ts` — décroissance cohésion squad
  - `check-activity/route.ts` — vérification activité utilisateurs
- Les crons sont déclenchés via **QStash** (voir `lib/qstash.ts`)
- L'authentification des crons internes se fait via un header secret ou via la vérification QStash

---

## Ce qu'il faut faire

### Étape 1 — Créer le fichier de cron

Créer : `app/api/internal/cron/release-claims/route.ts`

```ts
// app/api/internal/cron/release-claims/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const CLAIM_TIMEOUT_HOURS = 48

export async function POST(req: NextRequest) {
  // Vérification d'authentification interne (reprendre le pattern des autres crons)
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cutoff = new Date()
  cutoff.setHours(cutoff.getHours() - CLAIM_TIMEOUT_HOURS)

  // Trouver toutes les soumissions IN_REVIEW dont le updatedAt dépasse le timeout
  const staleSubmissions = await db.missionSubmission.findMany({
    where: {
      status: "IN_REVIEW",
      updatedAt: { lt: cutoff },
    },
    select: { id: true, missionId: true, userId: true, reviewerId: true },
  })

  if (staleSubmissions.length === 0) {
    return NextResponse.json({ released: 0, message: "Rien à libérer." })
  }

  // Libérer toutes les soumissions expirées
  const result = await db.missionSubmission.updateMany({
    where: {
      id: { in: staleSubmissions.map(s => s.id) },
    },
    data: {
      status: "PENDING",
      reviewerId: null,
    },
  })

  console.log(`[cron/release-claims] ${result.count} soumissions libérées.`)

  return NextResponse.json({
    released: result.count,
    ids: staleSubmissions.map(s => s.id),
  })
}
```

### Étape 2 — Enregistrer le cron dans QStash

Ouvrir `lib/qstash.ts` (ou le fichier qui configure les crons QStash).

Ajouter une fonction pour planifier ce cron, ou l'ajouter à la liste des crons planifiés au démarrage.

Si les crons sont planifiés via l'API QStash au démarrage, ajouter :

```ts
// Dans le fichier de configuration des crons (ex: lib/crons.ts ou là où les autres sont définis)
{
  url: `${process.env.NEXT_PUBLIC_APP_URL}/api/internal/cron/release-claims`,
  cron: "0 */6 * * *",  // Toutes les 6 heures
  name: "release-stale-claims",
}
```

### Étape 3 — Ajouter `CRON_SECRET` dans les variables d'environnement

Vérifier que `CRON_SECRET` est défini dans `.env.production` sur le VPS :

```env
CRON_SECRET=un_secret_long_et_aleatoire_minimum_32_chars
```

Et dans GitHub Secrets pour que le CI ait connaissance de sa valeur si besoin.

### Étape 4 — (Bonus UX) Notifier l'auteur quand sa soumission est libérée

Dans le cron, après `updateMany`, envoyer une notification à chaque auteur libéré :

```ts
// Après le updateMany dans le cron
for (const submission of staleSubmissions) {
  await triggerNotification({
    userId: submission.userId,
    type: "MISSION_REVIEW_RELEASED",
    message: "Ta soumission est de nouveau disponible pour review — un nouveau reviewer va bientôt la prendre en charge.",
    entityId: submission.missionId,
  })
}
```

> **Note :** Si `MISSION_REVIEW_RELEASED` n'existe pas dans les types de notification, l'ajouter dans `lib/qstash.ts` ou le fichier de types correspondant.

---

## Test manuel

Pour tester sans attendre 48h :
1. Créer une soumission et la faire passer à `IN_REVIEW` via l'API claim
2. En base, modifier manuellement `updatedAt` à une date de plus de 48h (`UPDATE mission_submission SET updated_at = NOW() - INTERVAL '3 days' WHERE status = 'IN_REVIEW'`)
3. Appeler `POST /api/internal/cron/release-claims` avec le bon header Authorization
4. Vérifier que la soumission est revenue à `PENDING` et `reviewer_id` est null

---

## Fichiers touchés
- `app/api/internal/cron/release-claims/route.ts` — créer
- `lib/qstash.ts` ou fichier de config crons — ajouter la planification
- `.env.production` sur VPS — vérifier `CRON_SECRET`
