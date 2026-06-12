# SEC-017 — Réponses quiz non validées

- **Gravité** : 🔵 Faible · **Priorité** : P3 · **Statut** : 🔴 OPEN
- **Catégorie** : Logique métier
- **Fichier** : `app/actions/quiz.ts:11-14, 60`

## Description

`QuizSubmissionSchema` valide seulement que `answers` est un tableau de strings non vide. Aucune vérification que les réponses correspondent à de vraies questions/options.

## Impact

Un utilisateur peut forger ses réponses pour **forcer sa classe** (Builder/Creator/…). Impact faible (auto-positionnement), mais fausse les statistiques et la recommandation.

## Correctif recommandé

Valider `answers` contre la banque de questions (`lib/questions.ts`) : longueur attendue, valeurs ∈ options autorisées par question.

```ts
import { QUESTIONS } from "@/lib/questions";
// answers.length === QUESTIONS.length && answers.every((a, i) => QUESTIONS[i].options.includes(a))
```

## Critères d'acceptation

- [ ] Longueur de `answers` = nombre de questions.
- [ ] Chaque réponse ∈ options valides de sa question.
- [ ] Soumission forgée → 400.
