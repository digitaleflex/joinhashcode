# HASHCODE ASSUMPTIONS

> Document d'hypothèses produit. Chaque entrée sera validée ou invalidée par les données des bêta-testeurs.
> Classées par niveau de risque — les 🔴 sont testées en premier.

---

## Légende

### États
| État | Signification |
|---|---|
| 🟡 Non testé | Pas encore observé |
| 🟢 Validé | Confirmé par plusieurs utilisateurs |
| 🔴 Invalidé | Contraire à ce qu'on observait |
| 🟠 Partiel | Vrai pour certains, pas pour d'autres |

### Niveaux de risque

| Risque | Impact si faux |
|---|---|
| 🔴 Critique | Le produit doit changer fondamentalement |
| 🟠 Important | Impact fort sur l'engagement ou la rétention |
| 🟢 Optimisation | Amélioration marginale |

### Confiance
Pourcentage basé sur le nombre d'observations (pas d'utilisateurs uniques).
Une hypothèse avec 2 observations a une confiance faible même si 🟢.

---

## 🔴 Critiques

| # | Hypothèse | État | Confiance |
|---|---|---|---|
| H1 | Les utilisateurs comprennent la promesse de HashCode en < 30s sur la Landing | 🟡 | — |
| H3 | La révélation émotionnelle (douleur + vérités) crée un choc de reconnaissance qui engage | 🟡 | — |
| H5 | L'orientation 90 jours motive à commencer le premier atelier | 🟡 | — |
| H13 | L'objectif 90 jours réduit l'abandon avant la première semaine | 🟡 | — |
| H15 | Les utilisateurs reviennent après leur première session sans relance email | 🟡 | — |
| H16 | Ils recommandent HashCode à un ami après avoir obtenu leur profil | 🟡 | — |
| H20 | Les débutants francophones citent l'absence de preuve vérifiable comme leur principal frein pour décrocher un premier stage ou emploi cyber (hypothèse sur le **problème**, D-030) | 🟡 | — |
| H21 | Des employeurs (au moins 2 sur 5 interrogés) présélectionneraient un junior cyber sur un dossier de preuves relues par des pairs (D-030) | 🟡 | — |

## 🟠 Importants

| # | Hypothèse | État | Confiance |
|---|---|---|---|
| H2 | Les 5 questions pré-quiz augmentent l'engagement | 🟡 | — |
| H4 | Les utilisateurs choisissent une spécialisation sans hésitation > 2 min | 🟡 | — |
| H6 | Les emails augmentent le retour sur la plateforme après 7 jours | 🟡 | — |
| H7 | Les nouveaux membres comprennent spontanément leur prochaine étape sur le dashboard | 🟡 | — |
| H8 | La boucle Apprendre → Pratiquer → Valider est comprise sans explication | 🟡 | — |
| H10 | Les ateliers en format « étape de parcours » sont plus motivants que des cours isolés | 🟡 | — |
| H12 | Les utilisateurs terminent le premier atelier en une seule session | 🟡 | — |
| H14 | Une Evidence motive plus qu'un badge ou un score | 🟡 | — |
| H17 | Les utilisateurs veulent un mentor plus qu'un groupe | 🟡 | — |

## 🟢 Optimisations

| # | Hypothèse | État | Confiance |
|---|---|---|---|
| H9 | Les widgets masqués aux nouveaux membres réduisent la charge cognitive | 🟡 | — |
| H11 | Un atelier de 45 min est la durée maximale pour un débutant | 🟡 | — |
| H18 | ~~Les squads de 5 sont trop petites / trop grandes~~ — caduque : squads supprimées (D-027) | — | — |
| H19 | Les utilisateurs préfèrent les défis individuels aux défis d'équipe | 🟡 | — |

---

## Métriques cibles

> Redéfinies le 12/11/2026 (D-030) : le quiz est facultatif et les ateliers sont fusionnés dans les Labs, donc
> « Landing → Quiz », « Quiz terminé » et « Premier atelier démarré / terminé » n'ont plus de sens. La chaîne suit
> maintenant la boucle *lab → relecture → preuve*. **Aucune cible n'est inventée** : « — » signifie qu'elle reste à
> fixer avec les premières mesures ; seules deux cibles existaient déjà et sont conservées.

| KPI | Définition | Source | Cible | Actuel |
|---|---|---|---|---|
| Inscriptions | Comptes créés | `activity_log` (`USER_SIGNUP`) | — | — |
| Onboarding terminé | Inscrits avec `currentSituation` renseignée | `User` | — | — |
| Domaine choisi | Membres avec `primaryDomain` | `User` | — | — |
| Premier lab soumis | Membres avec au moins une soumission | `MissionSubmission` | — | — |
| Première preuve validée | Membres avec au moins une soumission `APPROVED` | `MissionSubmission` / `User.missionsCompletedCount` | > 30 % *(cible d'origine)* | — |
| Preuve rendue visible | Membres validés ayant activé « Visibilité recruteur » | `User.talentVisible` | — | — |
| Délai inscription → première soumission | Médiane | `User.createdAt`, `MissionSubmission.createdAt` | — | — |
| Délai de relecture | Médiane entre soumission et décision | `MissionSubmission`, `MissionReview` | — | — |
| Retour J+7 | Membres actifs 7 jours après l'inscription | à définir : le signal `j7Activated` repose sur la Mission 01, en cours de remplacement (#471) | > 40 % *(cible d'origine, à reconfirmer)* | — |
| Activation émotionnelle | Note donnée en session | sessions utilisateurs (#480) | — | — |

### Critères de décision de D-030
| Critère | Seuil | Hypothèse | Actuel |
|---|---|---|---|
| Membres avec une preuve publique | ≥ 10 | H14, H20 | — |
| Employeurs (sur 5) qui présélectionneraient sur ce type de dossier | ≥ 2 | H21 | — |

> **Écart restant** : l'entonnoir d'analyse de l'admin (`lib/activation-funnel.ts`, `/admin/analytics`) compte encore des
> étapes « quiz », « choix de profil » et « premier atelier » (conditions sur `class` et sur la Mission 01). Il est à
> aligner sur la chaîne ci-dessus avant de s'y fier (lié à #471).

---|---|---|
| Landing → Quiz | > 70 % | — ⚠ à redéfinir (D-030 : le quiz est facultatif, la landing renvoie vers la connexion) |
| Quiz terminé | > 90 % | — ⚠ à redéfinir (D-030 : mesure d'une option, plus d'une étape) |
| Choix spécialisation | > 80 % | — |
| Premier atelier démarré | > 60 % | — |
| Premier atelier terminé | > 50 % | — |
| Première Evidence obtenue | > 30 % | — |
| Retour J+7 | > 40 % | — |
| TTV (Time To Value) | < 5 min | — |
| Activation émotionnelle | > 7/10 | — |

---

## Rituel hebdomadaire

```
5 utilisateurs observés
        ↓
Top 5 frictions → FRICTIONS.md
        ↓
3 hypothèses traitées (🔴 en priorité)
        ↓
1 décision → DECISIONS.md
        ↓
1 amélioration livrée
        ↓
Mesure de l'impact
```
