# 🧪 DOCS/labs — Les 5 premiers labs HashCode (filière cyber N0)

> **Statut au 13/11/2026 : branchés en brouillon (issue #479, BUILD-01).** Les 5 fiches sont importées comme labs
> (`Mission`, catégorie `CYBER`) à partir de `content/labs/cyber/*.json` par `prisma/seed-labs.ts`, appelé par `pnpm db:seed`
> (idempotent : un lab nouveau naît en `DRAFT`, une relance met à jour le contenu sans toucher au statut). Le brief
> du membre est la fiche Markdown ci-dessous, les consignes de relecture sont dans `evaluatorNotes`. **Aucun lab n'est
> publié** : il reste à valider chaque fiche et à passer le statut en `PUBLISHED` depuis l'admin. Une fois publiés, les
> labs apparaissent en tête de `/missions`. Références : `DOCS/PIVOT_CYBER.md` (D-014, historique), `DOCS/DECISIONS.md`
> (D-030) et `DOCS/PRODUCT_VISION.md`.
>
> **Avant de les brancher :** (1) **re-vérifier tous les liens** (voir « Ressources citées ») ; (2) faire valider chaque fiche
> par le fondateur ; (3) tenir compte du fait que ces labs s'appuient sur des plateformes tierces (TryHackMe, LetsDefend,
> Blue Team Labs Online) : la preuve est une capture ou un rapport, pas un résultat vérifiable automatiquement.

---

## La règle de la filière

**Jamais un défi sans fiche méthode.** Chaque lab ci-dessous contient sa propre
méthode : les étapes numérotées EXPLIQUENT comment faire, le livrable dit quoi
rendre, et le critère « conforme » dit comment c'est noté. Un débutant avec un
téléphone et 45 minutes doit pouvoir terminer chaque lab sans assistance.

---

## Les 5 labs

| # | Fiche | Compétence visée | Durée | Matériel | Livrable |
|---|---|---|---|---|---|
| 1 | [`LAB-01-linux.md`](LAB-01-linux.md) | Terminal Linux — 3 commandes de base (TryHackMe « Linux Fundamentals Part 1 », gratuit) | 45 min | 📱 ou 💻 | 3 commandes expliquées + capture d'écran |
| 2 | [`LAB-02-soc-alerte.md`](LAB-02-soc-alerte.md) | Triage d'une alerte SOC N1 (LetsDefend plan gratuit, alternative Blue Team Labs Online) + mini-lexique FR | 60 min | 💻 (📱 possible) | Rapport de qualification (grave / pas grave, pourquoi, action) |
| 3 | [`LAB-03-osint-identite.md`](LAB-03-osint-identite.md) | Vérification d'identité OSINT sur un profil **fictif** fourni dans la fiche | 60 min | 📱 ou 💻 | Rapport structuré : sources, traçabilité, conclusion, limites |
| 4 | [`LAB-04-ctf-intro.md`](LAB-04-ctf-intro.md) | Premier CTF (TryHackMe « OhSINT », gratuit) — minimum 3 flags | 45 min | 💻 conseillée (📱 possible) | Flags validés (capture) + 5 lignes de méthode |
| 5 | [`LAB-05-rapport-fraude.md`](LAB-05-rapport-fraude.md) | Rapport d'investigation — arnaque mobile money UEMOA, pattern générique + cas **fictif** | 60 min | 📱 ou 💻 | Rapport à 5 rubriques (contexte, méthode, preuves, conclusion, limites) |

**Ordre conseillé :** 1 → 2 → 4 → 3 → 5. Le LAB #1 crée le compte TryHackMe
réutilisé au LAB #4 ; le LAB #2 donne le vocabulaire ; le LAB #5 est le plus
professionnel — à faire quand les 4 autres sont validés.

---

## 📋 Rubrique d'évaluation (les 3 niveaux)

Chaque livrable est évalué sur trois marches. C'est la rubrique publique —
les corrigés détaillés restent internes (`DOCS/PIVOT_CYBER.md` §5 : « les
élèves voient la rubrique, pas les corrigés »).

| Niveau | Critère | Ce que ça veut dire |
|---|---|---|
| ✅ **Livrable** | Le fichier/message existe et contient TOUTES les rubriques exigées par la fiche, dans le format demandé. | Rendu complet, même imparfait. Débloque le lab suivant. |
| 🎯 **Qualité** | Chaque critère « conforme si » de la fiche est coché : preuves traçables, décisions justifiées par des éléments VUS, limites honnêtes. | Preuve inspectable : un tiers peut refaire tes recherches et tomber sur les mêmes faits. |
| 🌟 **Exemplaire** | Le livrable est publiable tel quel comme evidence publique (portfolio) : clarté, structure, et un petit plus (bonus réussi, méthode transférable, alerte communautaire utile). | Sert de modèle aux promotions suivantes ; cité dans les vitrines HashCode. |

**Passage N0 → N1 :** les 5 labs au niveau 🎯 minimum = premier palier vérifié
du parcours (à connecter dans `Evidence` / `LabRubric` en Vague 2, issue #374).

---

## Ressources citées (gratuites au 17/09/2026 — **à re-vérifier**, plus de deux mois ont passé)

| Ressource | Usage | Lien |
|---|---|---|
| TryHackMe — Linux Fundamentals Part 1 | LAB-01 | https://tryhackme.com/room/linuxfundamentalspart1 |
| TryHackMe — SOC Fundamentals | LAB-02 | https://tryhackme.com/room/socfundamentals |
| LetsDefend (plan Basic gratuit) | LAB-02 | https://letsdefend.io |
| Blue Team Labs Online (plan gratuit) | LAB-02 alt. | https://blueteamlabs.online |
| TryHackMe — OhSINT | LAB-04 | https://tryhackme.com/room/ohsint |
| TryHackMe — Google Dorking | LAB-03 bonus | https://tryhackme.com/room/googledorking |
| PicoCTF (pratique permanente gratuite) | LAB-04 bonus | https://play.picoctf.org/practice |
| OSINT Framework | LAB-03 | https://osintframework.com |
| Namechk (recherche de pseudo) | LAB-03 | https://namechk.com |
| ICANN Lookup (WHOIS gratuit) | LAB-03, LAB-05 | https://lookup.icann.org |
| Wayback Machine | LAB-03, LAB-05 | https://web.archive.org |
| VirusTotal (analyse de lien) | LAB-05 | https://www.virustotal.com/gui/home/url |
| Aide Google — opérateurs de recherche | LAB-03 | https://support.google.com/websearch/answer/244934 |

> ⚠️ TryHackMe fait évoluer ses rooms entre gratuit et premium. Les rooms
> listées ici ont été vérifiées gratuites (curations communautaires 2025-2026)
> — si une room passe premium, la remplacer par la suivante de même thème et
> mettre à jour ce README.

---

## À faire au branchement (issue #479)

1. ✅ *Fait (brouillon)* — **Importer chaque fiche comme un lab** (`Mission`), en contenu et non en code : brief (`fullBriefing`), livrables
   attendus (`deliverables`), artefacts à soumettre (`submissionSchema`) et critères de relecture
   (`acceptanceCriteria` : les « conforme si » de la fiche). La rubrique à trois niveaux ci-dessus guide la relecture ; il n'existe
   plus de modèle `LabRubric` — les critères sont portés par chaque lab (PR #451).
2. **Aucune page à créer** : la soumission d'un livrable et la relecture par un pair existent
   (`/missions/[id]`, `/reviewer/submissions/[submissionId]`).
3. **Ne jamais exposer les corrigés** : ils vont dans `evaluatorNotes`, jamais dans le brief du membre.
4. **Re-vérifier les liens** (politique de gratuité de TryHackMe, LetsDefend, Blue Team Labs Online).
5. **Valider le ton avec 2 débutants réels** (test de lisibilité de 45 minutes), voir les sessions préparées dans l'issue #480.

---

*Fiches rédigées en français simple, tutoiement, jargon défini à sa première
apparition. Chaque fiche porte son bloc éthique : sources ouvertes, jamais
d'attaque réelle, pas de doxxing, lois locales.*
