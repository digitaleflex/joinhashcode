# Gel des dépôts satellites (CLEAN-08, #482)

Décision D-030 : mission unique = dossier de preuves vérifiées d'un analyste cyber junior.
Les deux dépôts satellites ne sont plus maintenus activement.

## Dépôts concernés

- `digitaleflex/hashcode-learning-platform`
- `digitaleflex/hashcode-profiling-engine`

## Statut

**Gelés** (freeze) à partir du 16/11/2026 : plus aucun commit de développement,
aucune nouvelle feature, aucune correction non critique. Les dépôts restent
accessibles en lecture pour référence historique.

L'archivage GitHub (bouton "Archive this repository") est une action humaine
à effectuer par le propriétaire du compte ; elle n'est pas scriptable depuis ce dépôt.

## Raison

- `hashcode-learning-platform` : contenu d'apprentissage générique hors périmètre cyber (D-026).
- `hashcode-profiling-engine` : moteur psychométrique (quiz) devenu facultatif (D-030) ;
  le quiz reste dans ce dépôt (`components/quiz`, `lib/questions`) jusqu'à la décision
  de suppression après les sessions utilisateurs (B1 étape 3).

## Conséquences

- Aucune dépendance de production de `joinhashcode-community` vers ces dépôts.
- Toute évolution future se fait dans `joinhashcode-community`.
