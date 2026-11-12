# HashCode Command Center — Vision

> **Statut (12/11/2026) : non implémentée et hors périmètre (D-030).** Les modules d'administration gelés ont été supprimés (D-027). Aucune implémentation n'est prévue pendant l'engagement de 90 jours (`DOCS/PRODUCT_VISION.md`). Conservée pour mémoire.

> Document de vision pour le futur back-office. Ne pas implémenter avant la phase Build suivante.
> Priorité actuelle : Learn (bêta-tests, validation d'hypothèses).

---

## Principe

Le dashboard admin actuel est un CRUD de gestion. Le Command Center sera un **centre de pilotage de l'écosystème** : data produit, pédagogique, communautaire et organisationnel convergent en une seule vue.

---

## Mission Control (page d'accueil)

Une seule question : **« Sur quoi dois-je agir aujourd'hui ? »**

```
🔴 3 membres bloqués depuis > 7 jours
🟠 2 hypothèses critiques non testées
🟡 1 atelier avec taux d'abandon élevé
🔵 5 observations Founder Lab en attente
🟢 4 décisions prêtes à implémenter
```

---

## Modules

### 1. 🧪 Product Discovery
Reflet direct de HYPOTHESES.md + APPRENTISSAGES.md + FRICTIONS.md.
- Nombre d'hypothèses par état (🟡🟢🔴🟠)
- Sessions utilisateurs récentes
- Décisions associées
- Expériences en cours

### 2. ⚙️ Founder Lab
Chaque observation devient un objet traçable :
`Observation → Impact → Recommandation → Décision → Implémentation → Résultat`
Vision par membre (Joanice, José, Daniella, Steve)

### 3. 📋 Centre des décisions
Registre complet (reflet de DECISIONS.md).
- Filtrable par statut, responsable, période
- Impact mesuré (ex: « +18 % conversion »)

### 4. 📚 Knowledge Hub
Accès à tous les documents :
- HOP, HOA, HAIOS
- Playbooks, Standards, RFC
- Templates, Lessons Learned

### 5. ❤️ Health Center
Santé de l'écosystème en un coup d'œil :
- Plateforme, Academy, Founder Lab, CORE, Community
- Scores /100 par brique

### 6. 📈 Product Analytics
KPI produit en temps réel :
- Conversion (Landing → Quiz → Choix → Atelier → Evidence)
- Activation, Rétention
- TTV, Time To First Action, Activation émotionnelle

### 7. 🧠 CORE Insights
Recommandations automatiques du moteur CORE :
- Membres bloqués + cause probable + recommandation
- Patterns d'abandon détectés
- Suggestions d'ateliers / mentors

### 8. 👥 Cohortes
Suivi par cohorte d'inscription :
- Progression moyenne, ateliers terminés, evidences, mentors
- Health Score par cohorte

### 9. 🎯 Talent Operations
Vue 360° d'un membre :
- Profil → Objectif → Progression → Evidences → Mentor → Historique complet

### 10. 📅 Timeline globale
Flux temps réel de l'écosystème :
- Observations créées, hypothèses validées, décisions prises, features déployées

---

## Architecture technique (conceptuelle)

```text
Page d'accueil

Mission Control

↓

Modules indépendants (chacun son endpoint API)
    ├── Product Discovery    ← docs/HYPOTHESES.md + docs/APPRENTISSAGES.md
    ├── Founder Lab          ← nouvelle table `observations`
    ├── Centre décisions     ← docs/DECISIONS.md
    ├── Knowledge Hub        ← docs/*.md
    ├── Health Center        ← métriques système
    ├── Analytics            ← KPI en temps réel
    ├── CORE Insights        ← lib/analysis.ts + lib/evolution-engine.ts
    ├── Cohortes             ← agrégations Prisma
    ├── Talent Ops           ← GET /api/admin/users/[id]
    └── Timeline             ← activity_log
```

---

## Timing

| Phase | Action |
|---|---|
| Maintenant (Learn) | Rien — priorité aux bêta-tests |
| Après 20 sessions | Valider/invalider les hypothèses critiques (H1, H3, H5, H13) |
| Après validation des hypothèses clés | Revoir la priorité du Command Center |
| Build suivante | Commencer par Mission Control + Product Discovery |

---

## Sujets ouverts

- Faut-il un module dédié pour chaque document ou une vue unique ?
- Les observations Founder Lab doivent-elles être stockées en base ou rester dans des fichiers ?
- CORE Insights : règles explicites (actuelles) ou ML (future) ?
