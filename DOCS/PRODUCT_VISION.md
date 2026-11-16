# Vision — JoinHashCode

> **Figée jusqu'au 10/02/2027** (engagement de 90 jours, D-030). Elle ne change que par la règle
> anti-pivot : une décision qui modifie la promesse, le domaine phare ou le périmètre doit citer au
> moins 10 observations utilisateurs ou 5 entretiens employeurs, dans `DOCS/DECISIONS.md`.
> Dernière mise à jour : 12/11/2026. L'ancienne vision est archivée dans `DOCS/archive/PRODUCT_VISION_2026-07.md`.

## Mission
Révéler le potentiel tech africain francophone en le transformant en **compétences prouvées**.

## La promesse
> **Sur JoinHashCode, tu prouves ce que tu sais faire, sur du travail réel relu par un pair.**

## Le problème (une hypothèse, pas un fait)
Un débutant francophone qui apprend seul n'a aucun moyen crédible de montrer ce qu'il sait faire à
quelqu'un qui peut l'embaucher. **À vérifier** : H20 (l'absence de preuve est-elle son principal frein ?)
et H21 (des employeurs présélectionneraient-ils sur ces preuves ?). Aucune des deux n'est testée à ce jour.

## La boucle
```
lab  →  soumission  →  relecture par un pair  →  preuve publique (/u/[pseudo])
```
Domaine phare : la **cybersécurité**, cible *analyste SOC N1* (D-026, D-030). Web et IA appliquée restent
présentés, sans développement. Tout ce qui ne raccourcit pas le chemin vers la première preuve est supprimé ou gelé.

## Pour qui
- **Les membres** : débutants francophones d'Afrique. Mesures du 17/09/2026 : ≈ 200 invitations, 60 inscrits,
  10 actifs par semaine, quasi tous débutants ; sondage de 204 réponses : 70 % intéressés par le web, 63 % par la cybersécurité.
- **Les employeurs** (hypothèse H21) : équipes qui recrutent des juniors cyber, avec des mots qu'ils emploient :
  fraude, vérification, diligence ; jamais « OSINT » en accroche.

## Ce que nous faisons
- Des **labs cyber** à soumettre : 5 fiches rédigées (`DOCS/labs/`), à brancher (issue #479).
- Un socle d'ingénierie **HEF** (17 modules, 169 missions), publié tel quel.
- La **relecture par un pair** : la modération et tout membre ayant validé 3 labs.
- Une **preuve publique** par lab validé, sur une page que le recruteur inspecte. Un profil est privé par défaut.

## Ce que nous ne faisons pas
XP, niveaux, badges et squads (D-027, D-029) · quiz obligatoire (D-030) · ateliers séparés des labs ·
API publique, vivier automatisé et matching · mentorat payant et certification (plus tard, D-018, D-020) ·
nouveau développement web ou IA · réécriture de la stack.

## Principes conservés
Accès gratuit, **le statut se gagne, jamais l'accès** (D-020) · la validation d'une preuve est toujours gratuite (D-018) ·
WhatsApp pour la conversation, la plateforme pour la preuve (D-022) · ne jamais présenter comme disponible ce qui ne l'est pas (D-024).

## Comment on saura que ça marche (D-030)
- **Réussite** : au moins 10 membres avec une preuve publique **et** au moins 2 employeurs sur 5 interrogés qui présélectionneraient sur ce type de dossier.
- **Arrêt** : moins de 2 employeurs sur 5 intéressés → le problème est invalidé ; on revoit la cible avant d'ajouter du code.

## Où en est-on (12/11/2026)
| Brique | État |
|---|---|
| Boucle lab → relecture → preuve | Câblée de bout en bout, **parcours non essayé à la main** avec de vrais comptes |
| Labs cyber SOC N1 | Rédigés, **non branchés** sur la plateforme |
| Sessions utilisateurs, entretiens employeurs | **Aucun réalisé** (préparation : issue #480) |
| Indicateurs d'usage récents | Aucun relevé depuis le 17/09/2026 |

## Références
`DOCS/DECISIONS.md` (D-030) · `DOCS/HYPOTHESES.md` · `DOCS/GLOSSAIRE.md` · `DOCS/NETTOYAGE_SUIVI.md` · épopée #469.
