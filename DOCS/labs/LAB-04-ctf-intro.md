# 🎯 LAB #4 — TON PREMIER CTF (CAPTURE THE FLAG)

⏱️ 45 min pour démarrer (le jeu continue autant que tu veux) · 💻 ordinateur conseillé (📱 possible mais moins confortable) · NIVEAU : N0

---

## POURQUOI CE LAB

Un CTF (Capture The Flag — « attrape le drapeau ») est un jeu légal où tu
résous des énigmes de sécurité pour trouver des « flags » : des textes cachés
comme `THM{exemple123}`. C'est le passage obligatoire du débutant : les
recruteurs cyber regardent les CTF réussis comme preuve de compétence, parce
qu'on ne peut pas tricher un flag. Et c'est surtout le moment où tu découvres
que la cybersécurité, c'est fun.

---

## CE QUE TU APPRENDS

- Le déroulé d'un CTF : lire l'énigme → chercher → tester → valider le flag.
- Que 90 % de la solution, c'est savoir chercher (moteur de recherche + lecture).
- Documenter ta méthode pendant que tu joues — la différence entre « j'ai eu de la chance » et « je sais reproduire ».
- Ta première utilisation d'outils d'analyse d'image guidée par la room.

---

## ÉTAPES NUMÉROTÉES

### Étape 1 — Ouvre la room OhSINT (5 min)

Connecte-toi à TryHackMe (compte créé au LAB #1) puis ouvre :
**https://tryhackme.com/room/ohsint** — room **gratuite**, niveau « intro »,
c'est LE premier CTF conseillé aux débutants du monde entier.

### Étape 2 — Lis tout le scénario avant de toucher quoi que ce soit (5 min)

OhSINT raconte une histoire : quelqu'un a posté une image mystérieuse sur un
forum. Les tâches (tasks) te guident pas à pas. La Task 1 t'explique comment
valider chaque flag dans la plateforme.

### Étape 3 — Télécharge l'image et ouvre-la (10 min)

La room te donne une image à télécharger. Sur PC : double-clique pour
l'ouvrir. Sur téléphone : ouvre-la dans la galerie puis zoome au maximum.
**Le premier flag est souvent écrit dans l'image elle-même** — regarde chaque
coin, en bas, en haut, dans le décor. C'est un indice : l'observation avant la
technologie.

### Étape 4 — Suis les tâches 2 à 5 (20 min)

Chaque tâche t'apprend UN réflexe (ex. : « les images cachent des informations
dans leurs métadonnées — données techniques stockées à l'intérieur du fichier »).
Quand tu ne sais pas :
1. Relis la question — elle contient souvent la piste.
2. Cherche sur Google les mots exacts de la tâche + « ohsint ».
3. Si ça bloque 10 min → ⛔ (voir plus bas). Bloquer fait partie du jeu.

**Objectif de ce lab : minimum 3 flags validés.** Pas la totalité de la room.

### Étape 5 — Écris ta méthode PENDANT le jeu (continu)

Garde un carnet ouvert. À chaque flag trouvé, note en une ligne :
« j'ai cherché X, j'ai trouvé Y, parce que Z ». À la fin, tu auras ta matière
pour le livrable.

---

## 📦 LIVRABLE ATTENDU

Un message ou fichier texte avec :

1. **Les flags trouvés** (min. 3) : `Task N → THM{...}` — la plateforme
   TryHackMe affiche tes tâches validées, joins une capture d'écran de la page
   de la room avec tes checks verts comme preuve.
2. **5 lignes de méthode** : pour chaque flag, UNE phrase honnête :
   « j'ai fait quoi, comment, pourquoi ça a marché ».

**Longueur :** 5 phrases + 1 capture. **Conforme si :** les 3 flags sont validés
sur TA page TryHackMe et que les 5 lignes expliquent la démarche (pas juste
« j'ai cherché sur Google » — QUOI cherché, et QU'EST-CE qui t'a mis sur la voie).

---

## ⭐ BONUS (optionnel)

- Finis toute la room OhSINT (elle mérite d'être finie en 2ᵉ session).
- Enchaîne sur **PicoCTF** : **https://play.picoctf.org/practice** — 100 % gratuit, toute l'année, des centaines de défis classés par thème (crypto, forensic, web…). Choisis un défi « Beginner » et valide un 2ᵉ type de flag.

---

## ⛔ JE BLOQUE ?

Dans le groupe WhatsApp, poste : la tâche + ce que tu as déjà essayé + pendant
combien de temps. Une question précise obtient une réponse précise.
**+2 points au répondeur.** Interdiction de poster le flag lui-même — laisse
les autres chercher !

---

## 🔐 RAPPEL ÉTHIQUE

Un CTF est un espace autorisé : tout y est légal parce que la machine est
faite pour ça. Dehors, ces mêmes techniques sur un site, un compte ou un
téléphone qui ne t'appartient pas = délit (accès non autorisé aux systèmes
informatiques — lois cyber du Bénin, Sénégal, Côte d'Ivoire, Togo…). Règle
absente de ce programme : « je teste sur les autres ». Règle présente :
« je teste sur ce qui est prévu pour moi ».
