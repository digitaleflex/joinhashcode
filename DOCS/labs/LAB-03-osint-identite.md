# 🎯 LAB #3 — PREMIÈRE VÉRIFICATION D'IDENTITÉ OSINT

⏱️ 60 min · 📱 téléphone OK (tout se fait dans un navigateur) · NIVEAU : N0

---

## POURQUOI CE LAB

Une PME de Cotonou veut signer un contrat avec un « expert cybersécurité »
rencontré en ligne. Un employeur reçoit un CV dont le parcours semble trop
beau. Une ONG doit vérifier à qui elle envoie de l'argent. Dans ces trois cas,
la même question : **est-ce que cette identité en ligne est réelle ?** L'OSINT
(Open Source Intelligence — investigation à partir de sources publiques et
gratuites) répond à cette question avec une méthode, pas avec de l'intuition.
C'est LE créneau que personne n'enseigne en Afrique francophone.

---

## CE QUE TU APPRENDS

- Construire une fiche de suivi d'investigation (la base de la traçabilité).
- Chercher avec des opérateurs précis au lieu de taper au hasard.
- Distinguer : « vérifié », « invérifiable », « contredit » — trois conclusions différentes.
- Écrire un rapport qui dit aussi ce que tu N'AS PAS pu vérifier (les limites).

---

## 🧪 LE PROFIL FICTIF DE CE LAB — « KOSSI »

> ⚠️ **Ce profil est 100 % inventé pour l'exercice.** L'e-mail et le site
> utilisent le domaine `example.com` : un domaine réservé officiellement aux
> tests, qui n'appartient à personne. Tu ne risques donc jamais de toucher une
> vraie personne. Le numéro de téléphone est un faux format évident.

**Contexte de la mission :** une PME de Cotonou (fictive, « TransLog SARL ») a
reçu cette candidature au téléphone via WhatsApp :

| Champ | Valeur revendiquée |
|---|---|
| Nom | Kossi Adjovi |
| Pseudo en ligne | `kossi_sec229` |
| E-mail | `kossi.sec229@example.com` |
| Téléphone | `+229 01 99 99 99 99` (faux numéro de démonstration) |
| Site portfolio | `https://kossi-sec229.example.com` |
| Affirmation 1 | « J'ai gagné le Cyber Challenge Cotonou 2025. » |
| Affirmation 2 | « J'ai 800 abonnés sur les réseaux sous le pseudo kossi_sec229. » |
| Affirmation 3 | « Mon portfolio prouve mes 3 ans d'expérience. » |

**Ta mission :** vérifier les 3 affirmations. Rien de plus — pas de chasse à
l'homme.

---

## ÉTAPES NUMÉROTÉES

### Étape 1 — Ouvre ta fiche de suivi (5 min)

Crée un tableau (papier, ou Google Sheets gratuit) avec 5 colonnes :

```
Affirmation | Outil utilisé | Recherche exacte tapée | Résultat obtenu | Verdict
```

Le verdict ne peut être que : **VÉRIFIÉ / INVÉRIFIABLE / CONTREDIT**. Écris la
date et l'heure à chaque recherche. Un rapport sans dates = pas de rapport.

### Étape 2 — Cherche le pseudo avec précision (15 min)

Dans Google (**https://www.google.com**) ou DuckDuckGo (**https://duckduckgo.com**),
tape le pseudo entre guillemets pour la recherche exacte :

```
"kossi_sec229"
```

Puis combine avec le contexte de l'affirmation 1 :

```
"kossi_sec229" "Cyber Challenge" Cotonou
```

> 📖 Les guillemets forcent le moteur à chercher l'expression exacte. Liste
> complète des opérateurs utiles (gratuit, en français) :
> **https://support.google.com/websearch/answer/244934**

Note chaque recherche dans ta fiche — y compris « 0 résultat ». **Un « 0
résultat » est une information**, pas un échec.

### Étape 3 — Vérifie l'existence du pseudo sur les plateformes (10 min)

Va sur **https://namechk.com** (gratuit) → tape `kossi_sec229` → l'outil te
monte sur quels réseaux ce pseudo est pris ou libre. Note les plateformes où
il existe. (Pas de compte trouvé ? Verdict : INVÉRIFIABLE pour l'affirmation 2.)

> 💡 Trouve d'autres outils gratuits en explorant l'arbre de l'OSINT Framework :
> **https://osintframework.com** (gratuit — une carte mentale de sources ouvertes).

### Étape 4 — Vérifie le site portfolio (15 min)

a) **Le domaine existe-t-il ?** Va sur **https://lookup.icann.org** (WHOIS
gratuit — l'annuaire officiel des propriétaires de noms de domaine) → tape
`kossi-sec229.example.com`. Puis tape un domaine réel que tu connais (ex.
`google.com`) pour voir à quoi ressemble une vraie réponse. Tu apprendras à
lire la date de création du domaine : un domaine créé hier qui revendique 3 ans
d'expérience = drapeau rouge 🚩.

b) **Le site a-t-il une histoire ?** Va sur la Wayback Machine :
**https://web.archive.org** → colle l'URL du portfolio. Si Archive.org n'a
aucune capture d'un site « ancien et actif depuis 3 ans », c'est un indice à
noter.

### Étape 5 — Conclus (15 min)

Remplis ton rapport (gabarit ci-dessous). La règle d'or de l'OSINT :
**tu ne prouves pas que Kossi ment — tu documentes ce que les sources publiques
disent.** L'absence de trace n'est pas une preuve de mensonge (beaucoup de
gens réels sont peu visibles en ligne). C'est pour ça que la rubrique
« limites » existe.

---

## 📦 LIVRABLE ATTENDU

Un **rapport de vérification** (1 à 2 pages) avec ces 5 rubriques :

```
1. CONTEXTE — qui demande, quoi, quand (3 lignes)
2. MÉTHODE — la liste exacte de tes recherches (outil + requête + date/heure)
3. CONSTATS — ton tableau de suivi rempli, une ligne par affirmation
4. CONCLUSION — verdict par affirmation : VÉRIFIÉ / INVÉRIFIABLE / CONTREDIT,
   avec la source qui le justifie
5. LIMITES — ce que tu n'as PAS pu vérifier et pourquoi (min. 2 lignes)
```

**Conforme si :** chaque conclusion cite une recherche précise que n'importe
qui peut refaire (outil + requête exacte), et que la rubrique LIMITES est
remplie — ne rien écrire là-dedans = non conforme.

---

## ⭐ BONUS (optionnel)

- Fais la même vérification sur TA propre identité en ligne. Qu'est-ce qu'un inconnu trouverait ? C'est l'exercice « empreinte numérique », et il est passionnant à plusieurs dans le groupe.
- Room gratuite pour aller plus loin dans la recherche : « Google Dorking » sur TryHackMe → **https://tryhackme.com/room/googledorking**

---

## ⛔ JE BLOQUE ?

Envoie ton tableau à mi-parcours dans le groupe WhatsApp — un parrain relit ta
méthode AVANT que tu conclues. C'est même recommandé. **+2 points au répondeur.**

---

## 🔐 RAPPEL ÉTHIQUE

Le profil de ce lab est fictif et sans risque. En situation réelle : on
n'enquête que sur des **sources ouvertes et publiques**, JAMAIS on ne contacte
les proches de la cible, JAMAIS on ne divulgue d'informations personnelles
privées (adresse physique, numéro privé, photos intimes) — c'est du doxxing,
interdit par notre charte et par les lois locales (protection des données
personnelles : APDP au Bénin, CDP au Sénégal, etc.). Le livrable reste dans le
cadre de la formation.
