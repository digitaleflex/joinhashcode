# MARKETING_COM.md — Le kit communautaire minimal (moratoire, tout manuel)

> **Date :** 2026-09-17 · Décisions liées : D-020 (4 rangs), D-021 (classement hebdo), D-022 (2 couches)
> **Règle :** un outil n'existe que si le manuel casse d'abord. Rien de codé avant les 5 "oui" (#378).
> **Orientation :** la COMMUNAUTÉ reste tech-générale ; la FILIÈRE est cyber. Les non-cyber sont des Auditeurs bienvenus.

---

## 1. Les 3 rangs d'orientation (pour ne plus être perdu)

| Couche | Pour qui | Ce qu'on leur donne |
|---|---|---|
| 🟡 **Auditeurs** (tous, continu) | membres non-cyber, curieux, dormants | défis ouverts, classement, Rentrée mensuelle — RIEN de plus à produire |
| 🔵 **Participants** (noyau du rituel) | ceux qui livrent des défis | parrain, review, classement hebdo, rang "Vérifié" à 3 evidences |
| 🟢 **La filière cyber** | ceux qui lèvent la main pour SOC/OSINT | le parcours complet → evidences → vivier → certification |

---

## 2. Les messages d'invitation (3 variantes prêtes à copier)

### Variante A — Ancien membre du vieux groupe HashCode (les 500+)
> Salut [Nom], tu te souviens de HashCode ?
> On a tout changé. Avant : un grand groupe où personne ne progressait.
> Maintenant : une filière cybersécurité concrète — chaque semaine un défi
> de 45 minutes, chaque semaine des preuves publiques de ce que tu as appris.
> On repart de zéro, petit et sérieux. Si tu veux la première session
> de la rentrée (1er samedi du mois), réponds à ce message. Les curieux
> restent les bienvenus aussi — ici, on regarde d'abord, on s'engage quand on veut.

### Variante B — Contact neuf (réseau social, 1:1)
> Salut [Nom] ! Je forme gratuitement des analystes cyber en français —
> SOC et investigation (OSINT). Pas de cours magistral : 1 défi par semaine,
> review publique, et à la clé un portfolio de preuves que les entreprises
> vérifient. Ça t'intéresse pour la prochaine rentrée (1er samedi du mois) ?

### Variante C — Dormant de la reconstruction (les 60 inscrits, les 50 silencieux)
> [Nom], tu as rejoint HashCode mais je ne t'ai jamais vraiment sollicité —
> ma faute. Voici la nouvelle formule en 1 ligne : 1 défi/semaine (45 min),
> une preuve publique à la clé, et une filière cybersécurité complète si
> tu veux aller jusqu'au métier. Un simple "oui" et je t'assigne un parrain
> pour la rentrée du 1er samedi.

---

## 3. Le tableau de suivi (1 feuille de calcul — PAS un CRM)

Colonnes exactes :

| Colonne | Valeurs |
|---|---|
| Membre | nom |
| Rang | A = Auditeur · P = Participant · V = Vérifié (3 evidences) · C = Certifié |
| Dernier défi livré | date |
| Dernier signe de vie | date (message, réaction, question) |
| Parrain | nom (les Participants+ en ont un) |
| Points de la semaine | chiffre (barème D-021) |
| Note | prénom + contexte perso |

**Le vendredi 5 minutes** : mise à jour. **Les inactifs ne sont ni harcelés ni supprimés** — ils restent Auditeurs ; la Rentrée mensuelle les réactive naturellement.

---

## 4. La cadence = la campagne (pas de newsletter, pas de nouveaux canaux)

```
Lundi     → Défi de la semaine (post WhatsApp)
Mercredi  → Relance courte + highlights
Vendredi  → Review + mise à jour du tableau
Samedi    → Cérémonie : classement hebdo (reset) + célébrations
            + le 1er samedi du mois : RENTRÉE (nouveaux + parrains)
```

**Chaque samedi EST la campagne.** C'est le seul système de communication du projet pendant le moratoire.

---

## 5. Ce qui arrive LORSQUE (et seulement lorsque)

| Déclencheur | L'outil qui devient justifié |
|---|---|
| > 50 inscrits suivis à la main | CRM léger / la plateforme reprend le tracking (Progress/ActivityLog existants) |
| 1er client B2B signé | **Brief mensuel de menaces** (newsletter B2B — acheteurs, PAS la communauté) |
| Fin Vague 3 (evidences en base) | Classement hebdo codé + invitation automatique au rang suivant |
| Rentrée > 15 nouveaux/mois | Funnel `/acquisition` rebranché (il existe déjà) + pages self-serve |

---

## 6. Les interdits (anti-repet des groupes morts)

1. ❌ Jamais compter les membres comme succès — la métrique est : evidences validées / semaine
2. ❌ Jamais un 2e canal grand public (Discord, newsletter communauté) — un canal, une cadence
3. ❌ Jamais obliger quelqu'un à être actif — il redescend Auditeur sans drama
4. ❌ Jamais d'automatisation avant que le manuel n'échoue

---

## 7. Les fiches méthode (1 défi = 1 fiche — jamais un défi sans leçon)

### Gabarit (30 min/semaine à remplir)

```
🎯 DÉFI #N — TITRE
⏱️ durée · 📱/💻 matériel
POURQUOI (3 lignes : le monde réel, pourquoi ça compte)
ÉTAPES numérotées avec liens vers tutos gratuits FR
📦 LIVRABLE attendu (précis : X lignes, quel format, lien)
⛔ PAROLES "je bloque" : parrain +2 points
```

### Fiche prête — DÉFI #1 : Audit la sécurité de ton téléphone

```
🎯 DÉFI #1 — AUDITE LA SÉCURITÉ DE TON TÉLÉPHONE
⏱️ 45 min · 📱 ton téléphone + un navigateur

POURQUOI
  80% des piratages de comptes en Afrique de l'Ouest passent par
  un téléphone mal protégé : pas de 2FA, mots de passe fuités,
  apps avec trop d'autorisations. Un analyste cyber commence
  TOUJOURS par comprendre ce qu'il protège — aujourd'hui,
  c'est ton téléphone.

ÉTAPES
  1. Liste tes 5 comptes les plus critiques (email, mobile money,
     WhatsApp Business, banque, réseaux pro) → note-les
  2. Active la 2FA sur chacun (Google Authenticator, ou 2FA SMS
     si tu n'as pas d'app) → note lesquels n'avaient RIEN
  3. Vérifie tes emails sur https://haveibeenpwned.com
     → note les fuites trouvées (date, source)
  4. Va dans Paramètres > Applications > Autorisations :
     désactive localisation/contacts/micro pour les apps qui
     n'en ont pas besoin → note ce que tu as coupé
  5. Change les 3 mots de passe les plus faibles
     (les mêmes sur plusieurs comptes = les premiers)

📦 LIVRABLE (vendredi, formulaire)
  Rapport de 10 lignes exactement :
  - AVANT : 3 vulnérabilités que tu avais (ex: pas de 2FA sur mobile money)
  - APRÈS : ce que tu as corrigé
  - CE QUE TU N'AS PAS RÉUSSI et pourquoi (honnêteté = pas de pénalité)

⭐ BONUS (pour les rapides) : installe un gestionnaire de mots de passe
  et note en 3 lignes ce que ça change à ta vie.

🔐 RAPPEL ÉTHIQUE : tu n'audites QUE ton téléphone. Jamais celui
  de quelqu'un d'autre — c'est la règle de la filière.
```

### Le barème de classement (rappel D-021)
Livraison +3 · Conforme +5 · Exemplaire +8 · Aide un pair +2 · Sans nouvelles −1
