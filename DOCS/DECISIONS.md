# Registre des décisions produit

> Chaque décision est traçable : quelle hypothèse l'a motivée, quelle observation l'a justifiée, quel impact elle a eu.
> Sans ce document, les apprentissages restent des anecdotes.

---

## Format

| Colonne | Description |
|---|---|
| ID | D-XXX |
| Décision | Ce qui a été changé |
| Justification | Hypothèse(s) + observation(s) clés |
| Date | JJ/MM/AAAA |
| Responsable | Qui a pris la décision |
| Statut | ✅ Actée / 🔄 En cours / ⏳ Planifiée |

---

## Décisions existantes (rétroactives)

| ID | Décision | Justification | Date | Responsable | Statut |
|---|---|---|---|---|---|
| D-001 | Remplacer le dashboard générique par « Mon Parcours » | Avant : un nouveau membre voyait des widgets qu'il ne comprenait pas. Après : une seule question « Quelle est la prochaine étape ? » | 15/07/2026 | Eurin | ✅ |
| D-002 | Ajouter l'écran de Choix de spécialisation entre la Révélation et l'Orientation | Les utilisateurs avaient besoin de valider activement leur direction avant de recevoir un plan d'action | 15/07/2026 | Eurin | ✅ |
| D-003 | Ajouter l'orientation 90 jours après le choix de spécialisation | Sans objectif temporel concret, le premier atelier n'avait pas de contexte motivant | 15/07/2026 | Eurin | ✅ |
| D-004 | Réécrire les 8 emails en ton coach (plus de cyberpunk) | Le ton hacker créait une distance — les utilisateurs ne se sentaient pas accompagnés | 15/07/2026 | Eurin | ✅ |
| D-005 | Retirer la carte exemple de résultat sur la Landing | Elle ajoutait du bruit visuel sans prouver la valeur du produit | 15/07/2026 | Eurin | ✅ |
| D-006 | Ajouter une boucle de progression Apprendre → Pratiquer → Valider | Les utilisateurs ne voyaient pas le chemin complet — chaque action semblait isolée | 15/07/2026 | Eurin | ✅ |
| D-007 | Remplacer la phase « Guide » du Welcome Modal par une « Feuille de route » | Le guide expliquait des concepts, la feuille de route montre une action immédiate | 15/07/2026 | Eurin | ✅ |
| D-008 | Masquer ActivityFeed/AmbassadorGoal/connectivité aux nouveaux membres | Avant : le dashboard était plein d'éléments incompréhensibles. Après : seulement l'objectif et la prochaine étape | 15/07/2026 | Eurin | ✅ |
| D-009 | Implémenter mainObjective filtering dans les recommandations de spécialisation | Le paramètre était accepté par l'API mais jamais utilisé — les recommandations ignoraient l'objectif | 15/07/2026 | Tech | ✅ |
| D-010 | Dédupliquer PROFILE_COLORS / CLASS_COLORS | Deux sources de vérité pour les couleurs — dérive garantie à la première modification | 15/07/2026 | Tech | ✅ |

---

## Prochaines décisions (espace réservé)

> Les décisions ci-dessous seront tranchées après les premiers bêta-tests.

| ID | Décision à prendre | En attendant |
|---|---|---|
| D-011 | Garder ou supprimer le Quiz Feedback Card (post-quiz survey) après la révélation | Conservé, sera réévalué après 20 sessions |
| D-012 | Remplacer les profils Builder/Creator/Strategist/Catalyst par des noms plus parlants | Conservé, sera testé avec les utilisateurs |
| D-013 | Ajouter un niveau 5 (ELITE+) ou supprimer le code mort associé | Code conservé, seuil non défini |

---

## 🔄 PIVOT — Décisions du 17/09/2026

| ID | Décision | Justification | Date | Responsable | Statut |
|---|---|---|---|---|---|
| D-014 | **PIVOT : direction unique — filière cyber SOC/OSINT**. Une seule chose pendant 12 mois : la première filière « de zéro à analyste cyber employable » d'Afrique francophone. Référence : `DOCS/PIVOT_CYBER.md` | Données mesurées : 200 invitations → 60 inscrits → 10 actifs, 0 budget, 0 mentor payable. Marché : pénurie structurelle cyber documentée (Xpertize Africa 07/2026), 63% de la communauté demande le cyber, créneau OSINT francophone vide (vérifié 17/09/2026), cyber auto-validable sans mentor (labs/CTF). KPI 500 actifs enterré. | 17/09/2026 | Eurin + audit session | ✅ Actée |
| D-015 | La gamification générique (XP, streaks, cohésion squad, leaderboards, 4 profils comme fondation) est GELÉE | Couplée à l'ancienne vision ; auto-validable ≠ n'exige pas de mentors ; données conservées, fichiers intacts (suppression Vague 5 #377). Découplage D1-D8 exécuté (commit `282ebef`) | 17/09/2026 | Eurin | ✅ Actée |
| D-016 | Plugin better-auth `organization` conservé → devenir « Promotions » (cohortes) | Option A de l'audit (D8) : zéro migration, réutilise le socle. Suppression complète rejetée (coût élevé, gain nul) | 17/09/2026 | Eurin | ✅ Actée |
| D-017 | Vocabulaire produit : Labs · Parcours · Portfolio · Vivier · Evidence | Les mots entraînent le produit. « Mission » reste le modèle DB, l'UI dit Labs | 17/09/2026 | Eurin | ✅ Actée |
| D-018 | Règle monétisation amendée : parcours membre GRATUIT ; seuls les services humains immédiats payants (mentorat 1:1, reversement 70-80% mentor). Validation des evidences TOUJOURS gratuite | Éviter le piège B2C GoMyCode ; résoudre la pénurie de mentors sans casser le moat | 17/09/2026 | Eurin | ✅ Actée |
| D-019 | Kalman/CORE avancé enterré jusqu'à 1000 actifs | Over-engineering sans utilisateurs ; heuristique simple suffit au N0→N1 | 17/09/2026 | Eurin | ✅ Actée |
| D-020 | **Échelle communautaire à 4 rangs** : Auditeur (entrée libre WhatsApp, continue) → Participant (1er défi livré) → Vérifié (3 evidences validées → visible dans le Vivier) → Certifié (examen). Entrée TOUJOURS libre ; c'est le STATUT qui se gagne, jamais l'accès. Rentrée mensuelle (1er samedi), parrainage obligatoire des nouveaux | Filtrer l'entrée tuerait le funnel (86% réseaux sociaux). La preuve ouvre la couche commerciale (Vivier), pas la porte. Format validé manuellement avant codage (Promotions #389) | 17/09/2026 | Eurin | ✅ Actée |
| D-021 | **Classement hebdo à réinitialisation** — manuel WhatsApp pendant le moratoire, codé seulement après Vague 3 (alimenté par les scores de rubrique, filtré filière cyber — jamais le leaderboard générique gelé) | Reset hebdo = les débutants peuvent gagner (anti-démoralisation) ; manuel = 0 code pendant la validation humaine ; il devient la spécification du leaderboard codé | 17/09/2026 | Eurin | ✅ Actée |
| D-022 | **Deux couches de rituel** : couche 1 = groupe WhatsApp (conversation, entraide, cérémonie — ne jamais migrer) ; couche 2 = plateforme (evidence, portfolio, vivier — ce qu'un tiers doit POUVOIR voir) | "Compléter, pas remplacer" — la preuve, la durée et la vente sont structurellement impossibles dans un chat | 17/09/2026 | Eurin | ✅ Actée |
