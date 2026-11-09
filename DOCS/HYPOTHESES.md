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

| KPI | Cible | Actuel |
|---|---|---|
| Landing → Quiz | > 70 % | — |
| Quiz terminé | > 90 % | — |
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
