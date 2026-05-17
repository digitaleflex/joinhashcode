# Quiz Result Revelation — Design Spec
**Date:** 2026-05-17
**Scope:** Refonte de la page résultat du quiz (post-analyse) + ajout d'un écran pré-quiz de diagnostic

---

## Objectif

Transformer la page résultat actuelle (scores + channels) en une expérience en 3 étapes qui :
1. Fait **ressentir la douleur réelle** de l'étudiant avant de montrer les chiffres
2. Crée un **choc de reconnaissance** ("comment ils savent ça sur moi ?")
3. Rend visible le contenu verrouillé pour déclencher l'envie de payer

Audience cible : étudiants en informatique débutants/intermédiaires, Afrique de l'Ouest francophone.

---

## Principe fondamental : Zéro IA, 100% humain

**Aucun appel LLM, aucune génération de texte dynamique.** Tout le contenu est écrit à la main, relu, validé. L'utilisateur ne doit jamais sentir qu'une machine lui parle — il doit sentir que quelqu'un qui a vécu sa situation lui parle.

### Règles de ton pour tous les textes
- Parler comme un ami qui a traversé la même galère, pas comme une startup
- Pas de mots anglais inutiles (pas de "skills", "roadmap", "feedback" sauf si naturel en contexte)
- Phrases courtes, directes, sans fioriture
- Jamais de superlatif marketing ("incroyable", "révolutionnaire", "unique")
- Le "tu" est intime, pas commercial
- Les vérités doivent faire un peu mal — pas être rassurantes tout de suite
- La promesse arrive en dernier, après la douleur, pas avant

### Ce qui est algorithmique (et doit le rester)
- Calcul du profil dominant → routing vers le bon contenu statique
- Détection hybride (écart < 15%) → sélection des vérités combinées
- Affichage conditionnel du diagnostic pré-quiz (localStorage)
- Génération du lien WhatsApp avec nom du profil
- Tout le reste est du contenu statique soigneusement rédigé

---

## Changements dans le flux utilisateur

### Avant (flux actuel)
```
Onboarding (pays + situation + objectifs)
  → Quiz 13 questions
  → Animation analyse
  → Page résultat : scores + channels + CTA
  → Dashboard
```

### Après (nouveau flux)
```
Onboarding (pays + situation + objectifs)
  → [NOUVEAU] Écran diagnostic pré-quiz (5 questions rapides)
  → Quiz 13 questions (inchangé)
  → Animation analyse (inchangée)
  → [REFONTE] Page résultat en 3 étapes
      Étape 1 : Révélation émotionnelle (plein écran)
      Étape 2 : Scores psychométriques (scroll)
      Étape 3 : Missions verrouillées + CTA (scroll)
  → Dashboard
```

---

## 1. Écran Diagnostic Pré-Quiz

**Fichier :** `components/quiz/pre-quiz-diagnostic.tsx` (nouveau)
**Insertion :** Entre la fin de l'onboarding et l'affichage du quiz

### But
Exposer la douleur de l'étudiant *par ses propres mots* avant qu'il commence le quiz. Chaque "non" ou réponse honnête renforce sa conscience de son propre désordre.

### 5 questions (oui/non ou choix rapide)
1. "As-tu un projet informatique terminé que tu peux montrer aujourd'hui ?" → Oui / Pas encore
2. "Sais-tu exactement dans quel métier tu veux travailler dans 2 ans ?" → Oui / Pas vraiment
3. "Combien de langages ou frameworks as-tu commencé sans aller au bout ?" → 0-1 / 2-3 / 4+
4. "As-tu un mentor ou quelqu'un qui guide ta progression ?" → Oui / Non
5. "Te sens-tu souvent perdu sur quoi apprendre ensuite ?" → Rarement / Parfois / Souvent

### Comportement
- Pas de score affiché, pas de feedback immédiat
- Les réponses sont stockées localement (localStorage) et envoyées avec les résultats du quiz à l'API
- Sert à personnaliser les "3 vérités" sur la page résultat (amplification contextuelle)
- UI : une question à la fois, transition fluide, barre de progression légère
- Durée estimée : 45 secondes

### Données transmises
Les réponses du diagnostic sont ajoutées au payload `POST /api/quiz` dans un champ `diagnosticAnswers: Record<string, string>`.

---

## 2. Page Résultat — Étape 1 : Révélation Émotionnelle

**Fichier :** Refonte de `components/quiz/quiz.tsx` section résultat (lignes 269–439)
**Nouveau composant suggéré :** `components/quiz/result-revelation.tsx`

### Layout
Plein écran, fond sombre (#0a0a0a), centré verticalement. Pas de navigation latérale, pas de header complexe. Une seule chose à voir.

### Éléments (de haut en bas)
1. **Badge profil** — pill avec point animé + "Profil identifié" — couleur du profil
2. **Nom du profil** — très grand (clamp 52px→84px), font-weight 800, couleur du profil
3. **Déclaration de douleur** — 2-3 lignes, 18-22px, fond neutre, mot-clé en gras
4. **3 Vérités** — 3 cartes sombres, bordure gauche colorée, icône + texte (première phrase en gras)
5. **Scroll hint** — chevron animé + "Voir mon analyse détaillée"

### Contenu par profil

Tous les textes sont écrits pour sonner comme un pair qui a vécu la même chose — pas comme un produit qui analyse. Ton brut, direct, sans suremballage.

**Builder** (couleur #B8FF3B)
- Douleur : "Tu sais construire. Le problème, c'est que tu construis **seul, dans le vide** — sans savoir si ce que tu fais vaut quelque chose."
- Vérité 1 🔁 : "**Tu recommences souvent de zéro.** Pas parce que tu es instable — parce que personne ne t'a montré comment avancer étape par étape."
- Vérité 2 🔇 : "**Ton entourage ne comprend pas ce que tu fais.** Ni ta famille, ni tes amis. Tu construis quelque chose qu'ils ne voient pas encore."
- Vérité 3 🧱 : "**Tu accumules des projets non terminés.** Chacun t'a appris quelque chose — mais aucun ne te représente encore. Ça, ça change ici."

**Créateur** (couleur #A855F7)
- Douleur : "Tu as des idées que les autres n'ont pas encore. Mais tu passes plus de temps à **tout imaginer tout seul** qu'à créer vraiment."
- Vérité 1 🎨 : "**Tu crées, puis tu effaces.** Pas parce que c'est mauvais — parce que tu n'as personne à qui montrer avant que ce soit parfait."
- Vérité 2 🔦 : "**Tu te perds dans les détails.** Une idée en entraîne une autre, et tu n'arrives jamais à la ligne d'arrivée."
- Vérité 3 🪟 : "**Tu manques d'une scène.** Pas de talent — tu n'as juste jamais eu le bon endroit pour montrer ce que tu fais vraiment."

**Stratège** (couleur #22D3EE)
- Douleur : "Tu vois tout plus loin que les autres. Le problème, c'est que pendant que tu analyses, **les autres agissent** — et toi tu regardes."
- Vérité 1 🧠 : "**Tu penses beaucoup, tu livres peu.** Pas par paresse — tu veux que ce soit bien fait avant de commencer. Ça t'immobilise."
- Vérité 2 📐 : "**Personne ne te demande ton avis.** Pourtant tu vois des choses que les autres ratent. Il te manque un cadre où ta profondeur est valorisée."
- Vérité 3 🔗 : "**Tu travailles seul sur des idées qui méritent une équipe.** Ici tu trouves les personnes qui ont besoin exactement de ce que tu sais faire."

**Catalyst** (couleur #F97316)
- Douleur : "Tu motives tout le monde autour de toi. Mais à la fin de la journée, **qui te motive, toi ?**"
- Vérité 1 🔥 : "**Tu donnes beaucoup, tu reçois peu.** Tu portes des groupes entiers sans structure pour toi-même. Tu t'épuises."
- Vérité 2 🌀 : "**Ton énergie part dans tous les sens.** Pas par manque de sérieux — tu n'as pas encore trouvé le cadre qui concentre ce que tu apportes."
- Vérité 3 🤝 : "**Tu es fait pour bâtir des communautés.** Ici on t'en donne une vraie — avec des gens aussi engagés que toi."

### Profils hybrides
Si écart < 15% entre profil primaire et secondaire : combiner les déclarations.
Format : "Tu es à la fois Builder et Créateur — [douleur combinée]."
Les 3 vérités alternent : 2 du profil primaire, 1 du secondaire.

---

## 3. Page Résultat — Étape 2 : Scores Psychométriques

Visible au scroll après l'étape 1.

### Éléments
1. **Label section** — "Analyse psychométrique" (11px, uppercase, espacé)
2. **Grille 2×2 scores** — 4 cartes, profil dominant mis en avant (bordure + fond teinté + valeur colorée)
3. **Carte membre** — avatar initiales, pseudo, numéro membre, niveau, XP, badge profil
4. **Bouton partage** — "↗ Partager ma carte profil sur WhatsApp" (lien `wa.me` avec texte prégénéré + URL profil)

### Lien WhatsApp
Format du message partagé :
```
Je viens de découvrir mon profil HASHCODE : [NOM PROFIL] 🎯
Fais le quiz et découvre le tien → hashcode.community/quiz
```

---

## 4. Page Résultat — Étape 3 : Contenu Verrouillé + CTA

Visible au scroll après l'étape 2.

### Éléments
1. **Titre section** — "X missions t'attendent dans le Guild [Profil]"
2. **Liste missions** — 5 items visibles : 2 déverrouillées (dot coloré + XP), 3 verrouillées (opacité 45% + 🔒) + ligne "+ N autres missions..."
3. **Preuve sociale** — box avec 3 avatars + texte de preuve locale (ville africaine + résultat concret)
4. **CTA primaire** — "Rejoindre le Guild [Profil] →" (fond couleur profil, texte noir, full width sur mobile)
5. **CTA secondaire** — "Retourner à l'accueil" (lien discret)

### Missions par profil (2 déverrouillées + preview des verrouillées)

**Builder** : Construire ton premier projet en 48h (+50 XP) · Documenter et publier ton code (+30 XP) · [verrouillé×3+]
**Créateur** : Créer et publier ton premier design system (+50 XP) · Lancer un projet en public (+30 XP) · [verrouillé×3+]
**Stratège** : Produire une analyse produit complète (+50 XP) · Rédiger une roadmap pour un vrai projet (+30 XP) · [verrouillé×3+]
**Catalyst** : Animer ta première session communautaire (+50 XP) · Recruter 3 membres pour ton Guild (+30 XP) · [verrouillé×3+]

### Preuve sociale par profil
Textes courts, concrets, locaux. Pas de chiffres inventés — à remplacer par de vraies données dès que disponibles. Pour le lancement, les textes sont formulés de façon à rester crédibles même sans stats réelles.

- Builder : "Des Builders comme toi ont livré leurs premiers projets et décroché leurs premiers clients depuis ce Guild."
- Créateur : "Des Créateurs du Guild ont publié des projets pour la première fois — et reçu des retours vrais, pas des likes vides."
- Stratège : "Des Stratèges du Guild ont rejoint des équipes qui avaient besoin exactement de leur façon de penser."
- Catalyst : "Des Catalysts du Guild ont lancé leurs propres cercles d'apprentissage dans leurs villes."

Note : quand les premières données réelles arrivent (J+30), remplacer par des chiffres et villes précis.

---

## Architecture technique

### Composants à créer
| Composant | Fichier | Description |
|-----------|---------|-------------|
| `PreQuizDiagnostic` | `components/quiz/pre-quiz-diagnostic.tsx` | 5 questions pré-quiz |
| `ResultRevelation` | `components/quiz/result-revelation.tsx` | Étape 1 plein écran |
| `ResultScores` | `components/quiz/result-scores.tsx` | Étape 2 scores + membre |
| `ResultLocked` | `components/quiz/result-locked.tsx` | Étape 3 missions + CTA |
| `ResultPage` | `components/quiz/result-page.tsx` | Orchestrateur des 3 étapes |

### Données de contenu
Créer `lib/profile-content.ts` — objet exporté `PROFILE_CONTENT` avec toutes les déclarations de douleur, vérités, missions et preuves sociales par profil. Zod schema pour typage fort.

### Modifications existantes
- `components/quiz/quiz.tsx` : remplacer le bloc résultat (lignes 269–439) par `<ResultPage result={result} />`
- `app/quiz/page.tsx` : insérer `<PreQuizDiagnostic>` avant le quiz si `diagnosticDone` n'est pas dans localStorage
- `app/api/quiz/route.ts` : accepter et stocker le champ `diagnosticAnswers` dans le `QuizResult`
- `prisma/schema.prisma` : ajouter `diagnosticAnswers Json?` sur le modèle `QuizResult`

### Pas de changement
- Algorithme d'analyse (`lib/analysis.ts`) — inchangé
- Animation d'analyse — inchangée
- Dashboard — inchangé
- Middleware — inchangé

---

## Critères de succès

1. Un étudiant qui fait le quiz doit dire spontanément "c'est exactement moi" en lisant l'étape 1
2. Le bouton partage WhatsApp doit générer du trafic entrant organique
3. Le contenu verrouillé doit créer une friction positive (visible mais inaccessible)
4. La page doit être fluide sur mobile bas de gamme (connexion 3G, écran 360px)

---

## Hors scope (cette version)

- Logique de paiement / paywall réel
- Retake quiz après consultation du profil
- Personnalisation des vérités basée sur les réponses du diagnostic (amplification contextuelle) — prévu V2
- Notifications push post-résultat
- Tout appel à un LLM ou génération de texte dynamique — jamais dans ce flux
