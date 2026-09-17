# 🎯 LAB #1 — TON PREMIER PAS DANS LE TERMINAL LINUX

⏱️ 45 min · 📱 téléphone ou 💻 ordinateur (un navigateur suffit) · NIVEAU : N0

---

## POURQUOI CE LAB

Dans un SOC (Security Operations Center — le centre où des analystes surveillent
les attaques informatiques), les serveurs tournent sous Linux. Quand une alerte
arrive, l'analyste ne clique pas sur des icônes : il tape des commandes pour
lire des fichiers de logs (journaux d'événements d'un système). Si tu maîtrises
le terminal Linux, 80 % des outils du métier s'ouvrent à toi. Ce lab est ta
première rencontre avec ce terminal — sans rien installer.

---

## CE QUE TU APPRENDS

- Ouvrir un vrai terminal Linux depuis ton navigateur, sans installer quoi que ce soit.
- Taper tes 3 premières commandes et comprendre ce qu'elles répondent.
- Comprendre la phrase « je suis où, je vois quoi, qui suis-je ? » — le réflexe de base de tout analyste.
- Faire une capture d'écran preuve (evidence) de ton travail.

---

## ÉTAPES NUMÉROTÉES

### Étape 1 — Crée ton compte TryHackMe (5 min)

Va sur **https://tryhackme.com** → `Sign Up` → e-mail + mot de passe. C'est
gratuit (le plan gratuit suffit pour ce lab). TryHackMe = une plateforme
d'entraînement à la cybersécurité qui tourne directement dans le navigateur.

> 💡 Sur téléphone : le site s'utilise bien dans Chrome ou Firefox mobile.

### Étape 2 — Ouvre la room « Linux Fundamentals Part 1 » (2 min)

Lien direct : **https://tryhackme.com/room/linuxfundamentalspart1** (gratuit).
Une « room » = une leçon interactive avec des questions à la fin.

### Étape 3 — Déploie la machine virtuelle (10 min)

Dans la room, cherche le bouton **Start Machine** (en bas à droite sur mobile).
Un petit terminal s'ouvre dans la page — c'est un vrai ordinateur Linux, à
distance, dans ton navigateur. Ne l'éteins pas avant la fin du lab.

> ⚠️ Si le déploiement est lent (connexion faible), attends — ça arrive. Lance
> le lab quand tu as 45 min stables (cybercafé : créneau calme = matin).

### Étape 4 — Tape tes 3 commandes (15 min)

Dans le terminal noir, tape exactement ces commandes, une par une, puis
`Entrée` :

```bash
pwd
```
→ répond où tu te trouves dans l'arborescence (print working directory).

```bash
ls
```
→ liste les fichiers et dossiers autour de toi (list).

```bash
whoami
```
→ répond avec quel utilisateur tu es connecté (qui suis-je ?).

Fais-les 2 fois chacune. La 2ᵉ fois, tu les taperas sans regarder. C'est gagné.

### Étape 5 — Lis la leçon des Tasks 1 à 4 (10 min)

Remonte les Tasks 1 à 4 de la room (Introduction, Background, First Machine,
First Commands). Réponds aux 2-3 questions intégrées — elles valident ta
compréhension. Les Tasks 5 à 7 : pour plus tard, pas aujourd'hui.

### Étape 6 — Prépare ta preuve (3 min)

Prends une **capture d'écran** du terminal où on voit les 3 commandes et leurs
réponses. Sur Android : `Power + Volume bas`. Sur PC : touche `Impr. écran`.

---

## 📦 LIVRABLE ATTENDU

Un message (WhatsApp ou poste sur la plateforme) contenant :

1. **3 lignes** — une par commande : `nom de la commande` + `ce qu'elle fait, avec tes mots à toi`.
2. **1 capture d'écran** — ton terminal avec `pwd`, `ls` et `whoami` et leurs réponses visibles.

**Longueur :** 5 lignes + 1 image. **Conforme si :** les 3 réponses sont
visibles sur TA capture (pas celle de la doc) et tes explications sont en tes
propres mots.

---

## ⭐ BONUS (optionnel)

- Apprends 2 commandes de plus dans la room : `cd` (changer de dossier) et `cat` (afficher un fichier). Ajoute-les à ton livrable.
- Quand tu as fini : la room « Learn Linux » (gratuite) sur TryHackMe → **https://tryhackme.com/room/zthlinux**

---

## ⛔ JE BLOQUE ?

Envoie ta capture d'écran + ta question dans le groupe WhatsApp → un parrain
ou un membre répond. **+2 points au répondeur.** Bloqué sur le déploiement de
la machine ? Dis depuis quand tu attends et avec quelle connexion.

---

## 🔐 RAPPEL ÉTHIQUE

Tu travailles sur une machine d'entraînement fournie par la plateforme — c'est
autorisé et légal. Ce que tu apprends ne s'utilise JAMAIS sur un ordinateur, un
compte ou un réseau qui ne t'appartient pas ou sans autorisation écrite. Lois
locales : l'accès non autorisé à un système informatique est un délit partout
dans l'espace UEMOA.
