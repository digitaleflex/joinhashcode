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
| D-023 | **Promesse Reboot conservée : 3 axes de communauté (Web · Cyber · IA)** — le pivot investit UN produit (filière cyber SOC/OSINT), pas le nombre de terrains. La communauté reste dev/cyber/IA (auditeurs, missions self-serve : les 12 missions multi-domaines servent les axes Web/AI). La filière investie (labs codés, evidences, vivier, certification) = cyber uniquement pendant 12 mois | Promesse reboot.joinhashcode.com ("3 Axes : web, cyber, IA") ≠ produit. Les 12 missions existantes = le couloir self-serve des axes non investis. Un 2e axe ne s'investira qu'avec le revenu (M12+) | 17/09/2026 | Eurin | ✅ Actée |
| D-020 | **Échelle communautaire à 4 rangs** : Auditeur (entrée libre WhatsApp, continue) → Participant (1er défi livré) → Vérifié (3 evidences validées → visible dans le Vivier) → Certifié (examen). Entrée TOUJOURS libre ; c'est le STATUT qui se gagne, jamais l'accès. Rentrée mensuelle (1er samedi), parrainage obligatoire des nouveaux | Filtrer l'entrée tuerait le funnel (86% réseaux sociaux). La preuve ouvre la couche commerciale (Vivier), pas la porte. Format validé manuellement avant codage (Promotions #389) | 17/09/2026 | Eurin | ✅ Actée |
| D-021 | **Classement hebdo à réinitialisation** — manuel WhatsApp pendant le moratoire, codé seulement après Vague 3 (alimenté par les scores de rubrique, filtré filière cyber — jamais le leaderboard générique gelé) | Reset hebdo = les débutants peuvent gagner (anti-démoralisation) ; manuel = 0 code pendant la validation humaine ; il devient la spécification du leaderboard codé | 17/09/2026 | Eurin | ✅ Actée |
| D-022 | **Deux couches de rituel** : couche 1 = groupe WhatsApp (conversation, entraide, cérémonie — ne jamais migrer) ; couche 2 = plateforme (evidence, portfolio, vivier — ce qu'un tiers doit POUVOIR voir) | "Compléter, pas remplacer" — la preuve, la durée et la vente sont structurellement impossibles dans un chat | 17/09/2026 | Eurin | ✅ Actée |


---

## Décision de lancement — 31/10/2026

| ID | Décision | Justification | Date | Responsable | Statut |
|---|---|---|---|---|---|
| D-024 | **Périmètre produit actif : trois domaines — Web Development, Cybersécurité et IA appliquée.** JoinHashCode est la plateforme unifiée qui accueille, oriente, fait apprendre, pratiquer et valoriser les compétences dans ces trois domaines. Il ne s'agit pas de construire trois plateformes ni de promettre une profondeur identique avant qu'elle soit réellement disponible. | Le lancement doit refléter le périmètre communautaire et produit confirmé par le fondateur. La spécialisation cyber de D-014 reste une décision historique de priorisation, mais ne peut plus limiter seule la vision publique et le périmètre actif. La disponibilité des contenus et fonctionnalités doit rester transparente. | 31/10/2026 | Eurin | ✅ Actée |
| D-025 | **D-014 et D-023 sont conservées comme décisions historiques, mais leur restriction « investissement cyber uniquement pendant 12 mois » est supersédée par D-024 pour le périmètre produit actif.** Les éléments cyber existants restent valables et peuvent être réutilisés comme contenu du domaine Cybersécurité. | Éviter une contradiction entre vision active, vitrine, onboarding et backlog. La trace historique est conservée ; aucune donnée ou fonctionnalité cyber n'est supprimée par cette décision. | 31/10/2026 | Eurin | ✅ Actée |

### Conséquences d'exécution de D-024
- La vitrine présente les trois domaines actifs et décrit précisément les expériences réellement disponibles.
- L'onboarding propose une orientation parmi ces domaines sans créer de comptes ou profils distincts.
- Chaque domaine doit avoir au minimum une première action réelle, testable et documentée avant d'être présenté comme activable au lancement.
- Les capacités plus avancées peuvent être livrées progressivement ; elles ne doivent pas être simulées ni annoncées comme disponibles.
- Les décisions D-015 (gel de la gamification générique) et D-019 (CORE avancé différé) ne sont pas annulées par D-024.
- Toute évolution du périmètre devra être documentée dans ce registre avant de modifier les promesses publiques.


---

## Grand nettoyage — 09/11/2026

| ID | Décision | Justification | Date | Responsable | Statut |
|---|---|---|---|---|---|
| D-026 | **Domaine phare : Cybersécurité.** Les trois domaines de D-024 restent présentés publiquement (avec leur maturité réelle), mais seul le domaine Cybersécurité reçoit de nouveaux développements tant que la traction n'est pas démontrée. | ~10 actifs hebdo mesurés (09/2026), 19 hypothèses non testées, 6 semaines entre D-014 et D-024. La dispersion est le premier risque du projet. Cyber = demande réelle (63 %), validation objective (labs/CTF), créneau francophone. | 09/11/2026 | Eurin | ✅ Actée |
| D-027 | **Le code gelé (D-015) est supprimé, pas conservé.** Squads (UI/API), leaderboard, guide, spécialisation, check-in, admin core/fraud/mentorat/knowledge-hub/interventions/squads, libs gamification. Le plugin better-auth `organization` est conservé (D-016, futures Promotions). Les **données** restent en base jusqu'à la phase 4 (export + sauvegarde avant toute migration destructive). Point de retour : tag git `pre-nettoyage`. | ~8 500 lignes gelées jamais supprimées depuis 09/2026 (Vague 5 #377 non exécutée) ; du code gelé coûte en maintenance, en lecture et en surface d'attaque. | 09/11/2026 | Eurin | ✅ Actée |
| D-028 | **Gel des fonctionnalités pendant 6 semaines après le nettoyage.** Aucune nouvelle fonctionnalité sans une hypothèse `H-xx` qu'elle teste ; priorité aux sessions utilisateurs (objectif : 20) et au remplissage de `HYPOTHESES.md` / `FRICTIONS.md`. | Le produit n'a pas encore été confronté à ses utilisateurs ; le ratio code/utilisateurs est inversé. | 09/11/2026 | Eurin | ✅ Actée |
| D-029 | **Plus de verrou par niveau.** Tous les labs sont accessibles ; l'éligibilité relecteur = 3 labs validés (plus de condition de niveau). L'XP, les niveaux et les badges sont retirés du produit. | Depuis le découplage XP de 09/2026, plus aucune action ne faisait monter de niveau : les labs CORE/PRO (13 modules HEF sur 17) et le rôle de relecteur étaient inaccessibles aux nouveaux membres. Cohérent avec D-020 (l'accès est libre, le statut se gagne par la preuve). | 09/11/2026 | Eurin | ✅ Actée |
