# 🎯 LAB #2 — TA PREMIÈRE ALERTE D'ANALYSTE SOC

⏱️ 60 min (fractionnable en 2 × 30 min) · 💻 ordinateur conseillé (📱 possible) · NIVEAU : N0

---

## POURQUOI CE LAB

Un analyste SOC N1 (niveau 1 — le premier maillon de la chaîne) passe sa
journée devant une file d'alertes. Chaque alerte dit : « quelque chose de
suspect est arrivé ». Son travail : décider vite et bien — grave ou pas grave ?
90 % des alertes sont de fausses alarmes. Les 10 % restantes, si tu les rates,
peuvent être une intrusion réelle dans une banque ou un opérateur télécom. Ce
lab te met dans la peau de l'analyste, sur de vraies alertes simulées.

---

## CE QUE TU APPRENDS

- Le vocabulaire du triage (alerte, faux positif, escalade) — défini ci-dessous.
- Lire une alerte : qui, quoi, quand, où — les 4 questions automatiques.
- Prendre une décision justifiée : « grave » ou « pas grave », avec les preuves.
- Rédiger un mini-rapport de qualification, comme au travail.

---

## 📖 MINI-LEXIQUE FR (à lire AVANT de commencer)

| Mot | Définition simple |
|---|---|
| **Alerte** | Message automatique déclenché par un système de surveillance quand un comportement suspect est détecté (ex. : 50 tentatives de connexion en 1 minute). |
| **Triage** | Examen rapide d'une alerte pour décider : je traite, j'escalade, ou je ferme. Comme un infirmier aux urgences qui décide qui opère en premier. |
| **Faux positif** | Alarme déclenchée pour rien : le comportement était légitime. (« Le système a crié loup. ») |
| **Vrai positif** | Alarme justifiée : l'attaque était réelle. |
| **Escalade** | Transférer une alerte grave vers un analyste senior (N2) ou le responsable. |
| **SIEM** | Le logiciel central qui collecte les logs et génère les alertes (Security Information and Event Management). |
| **Cas / ticket** | Dossier ouvert pour suivre une alerte du début à la fin. |

---

## ÉTAPES NUMÉROTÉES

### Étape 1 — Échauffement : le vocabulaire en contexte (10 min)

Ouvre la room gratuite « SOC Fundamentals » :
**https://tryhackme.com/room/socfundamentals** (gratuit sur TryHackMe).
Lis seulement l'introduction et la partie « alert handling » (gestion
d'alertes). Ne fais pas les questions — c'est l'échauffement.

### Étape 2 — Crée ton compte LetsDefend (5 min)

**https://letsdefend.io** → `Sign up for free`. Le plan **Basic (gratuit)**
donne accès à un environnement SOC simulé avec un nombre limité d'alertes —
assez pour ce lab. (La plateforme appartient désormais à Hack The Box ; la
connexion peut passer par un compte HTB.)

> 💡 Alternative si l'inscription bloque : **https://blueteamlabs.online**
> (Blue Team Labs Online). Le plan gratuit donne accès à des « investigations »
> introductives dans le navigateur.

### Étape 3 — Ouvre ta première alerte (10 min)

Dans le simulateur de SOC, choisis une alerte de niveau faible ou moyen
(n'attaque pas le rouge d'entrée). Ouvre-la. Elle contient des détails :
adresse IP, utilisateur, horodatage, nom de la règle déclenchée.

### Étape 4 — Pose les 4 questions (15 min)

Sur ton carnet ou dans un fichier vide, réponds par écrit :

1. **QUI ?** — quel utilisateur / quelle adresse IP a fait l'action ?
2. **QUOI ?** — quelle action exacte a déclenché l'alerte ?
3. **QUAND ?** — à quelle heure, une fois ou des centaines de fois ?
4. **OÙ ?** — quel système est concerné (serveur mail, poste de travail, pare-feu…) ?

Puis ajoute la 5ᵉ, celle de l'analyste : **est-ce que ça ressemble à un usage
normal de cet utilisateur ?** (C'est ça, le triage.)

### Étape 5 — Décide et documente (10 min)

Choisis : **GRAVE** (j'escalade) ou **PAS GRAVE** (faux positif, je ferme).
Il n'y a pas de piège : c'est ta justification qui est notée. Dans LetsDefend,
enregistre ta décision dans la plateforme si l'option est disponible (sinon,
sur ton rapport).

### Étape 6 — Rédige ton rapport (10 min)

Utilise le gabarit du livrable ci-dessous. Écris-le dans un fichier texte ou
ton carnet — c'est ton livrable.

---

## 📦 LIVRABLE ATTENDU

Un **rapport de qualification** d'une alerte (max 1 page) avec ces 6 rubriques :

```
ALERTE : [nom de la règle / sujet de l'alerte]
QUI / QUOI / QUAND / OÙ : [une ligne chacun]
DÉCISION : GRAVE (escalade) ou PAS GRAVE (faux positif)
POURQUOI : [3 raisons, chacune appuyée sur un détail VU dans l'alerte]
ACTION : [ce que tu as fait ou ferais dans les 5 prochaines minutes]
```

**Conforme si :** la décision est accompagnée d'exactement 3 raisons, et que
chaque raison cite un élément concret de l'alerte (une IP, un compte, un
chiffre, une heure) — pas « ça louche ».

---

## ⭐ BONUS (optionnel)

- Qualifie une 2ᵉ alerte et compare : ta méthode a-t-elle été plus rapide ?
- Rends le compte-rendu oral à un ami : 60 secondes pour expliquer « faux positif ». S'il comprend, tu as compris.

---

## ⛔ JE BLOQUE ?

Capture d'écran de l'alerte (sans données sensibles — c'est un lab) + ta
question dans le groupe WhatsApp. Un parrain t'accompagne sur le premier triage.
**+2 points au répondeur.**

---

## 🔐 RAPPEL ÉTHIQUE

Toutes les alertes de ce lab sont **simulées** par la plateforme. Dans la vraie
vie, un analyste SOC agit uniquement dans le système de son employeur, sous
autorisation. Ne scanne, n'attaque et n'accède à AUCUN système hors d'un
environnement d'entraînement prévu pour toi.
