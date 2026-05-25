# Audit RED TEAM : Pre-Mortem & Scénarios de Destruction
## 09. Comment Hashcode Community va mourir (et comment l'éviter)

**Date :** 20 Mai 2026
**Cible :** Hashcode Community
**Exercice :** Pre-Mortem (Adversarial Analysis)

---

### Introduction : La Logique Red Team

La Red Team n'est pas là pour vous rassurer. Notre mission est de simuler que nous sommes dans 18 mois, et que **Hashcode a fait faillite**. Notre but est d'expliquer *pourquoi* cela s'est produit, afin que vous puissiez construire les défenses dès aujourd'hui.

Voici le rapport d'autopsie préventive.

---

### I. Matrice de Destruction (Scénarios d'Échec)

#### 1. Le Piège de la "Ville Fantôme" (Communauté & Psychologie)
- **Scénario :** Les utilisateurs s'inscrivent, font le Quiz, adorent leur profil de Guilde, puis arrivent sur un Dashboard vide sans indication claire sur "quoi faire ensuite". Ils ferment l'onglet et ne reviennent jamais. C'est la mort silencieuse.
- **Probabilité :** 🔴 Très Élevée
- **Impact :** 💀 FATAL
- **Contre-mesures :** Implémenter un état vide (Empty State) extrêmement agressif. La "Première Mission" doit être faisable en moins de 5 minutes (ex: "Mettez à jour votre bio GitHub et collez le lien ici").
- **Signaux faibles à surveiller :** Le ratio (Inscriptions / Première mission soumise) est inférieur à 40%.

#### 2. Le Burn-out du Solopreneur (Gouvernance & Opérations)
- **Scénario :** Le fondateur solo passe 3 mois à coder un algorithme d'IA complexe pour corriger automatiquement le code des utilisateurs. Pendant ce temps, les 50 premiers utilisateurs attendent du contenu, s'ennuient et partent. Le fondateur s'épuise sur du code qui n'est utilisé par personne.
- **Probabilité :** 🔴 Très Élevée
- **Impact :** 💀 FATAL
- **Contre-mesures :** Bannir toute automatisation complexe pour le MVP. Faire les corrections de missions *à la main*. L'architecture doit rester "Boring" (Next.js standard, sans surcouche exotique).
- **Signaux faibles à surveiller :** Vous passez plus de 3 jours consécutifs à coder sans interagir avec un seul utilisateur potentiel.

#### 3. Falsification des Scores (Sécurité & Crédibilité)
- **Scénario :** Une faille basique d'API (Mass Assignment ou IDOR) permet à des utilisateurs de modifier leur propre score "Vibrancy" ou "Confidence" en envoyant une requête POST modifiée. Les vrais talents voient ça et perdent instantanément confiance dans la plateforme. Les entreprises fuient.
- **Probabilité :** 🟡 Moyenne
- **Impact :** 💀 FATAL
- **Contre-mesures :** Appliquer la norme EHAF rigoureusement. Validation Zod stricte sur chaque endpoint. Les scores d'évolution (Vibrancy, Drift) ne doivent *jamais* pouvoir être modifiés par le client, ils doivent être calculés côté serveur (Server Actions).
- **Signaux faibles à surveiller :** Un utilisateur de niveau 1 passe au niveau 50 en moins de 24h.

#### 4. Le Gouffre de la Dette Technique (Architecture & Infrastructure)
- **Scénario :** L'utilisation de Prisma avec des requêtes `.include()` trop profondes (Users -> Guilds -> Missions -> Submissions -> Reviews) crée un problème de N+1 queries. À partir de 500 utilisateurs, le dashboard met 8 secondes à charger. Le coût de la base de données explose.
- **Probabilité :** 🟡 Moyenne
- **Impact :** 🟠 Sévère
- **Contre-mesures :** Ajouter des index en BDD (Postgres) sur les clés étrangères. Utiliser le cache de Next.js (`unstable_cache` ou cache réseau) pour les classements de Guildes qui n'ont pas besoin d'être mis à jour à la seconde.
- **Signaux faibles à surveiller :** Temps de réponse de l'API > 300ms. Utilisation mémoire de la DB > 70% pour un faible trafic.

#### 5. L'Échec de Rétention par Élitiste (UX & Comportemental)
- **Scénario :** Les missions sont trop dures. Seuls les "Seniors" y arrivent. Les juniors se sentent écrasés, n'osent pas poster leur code de peur d'être jugés. La plateforme devient un club élitiste toxique et la croissance stagne.
- **Probabilité :** 🟡 Moyenne
- **Impact :** 🟠 Sévère
- **Contre-mesures :** Équilibrage de la difficulté. Créer une catégorie de missions "First Blood" ou "Noob Friendly" où la seule règle est la bienveillance.
- **Signaux faibles à surveiller :** 10% des utilisateurs concentrent 90% des validations de missions.

#### 6. Mort Légale et Réglementaire (Juridique & Privacy)
- **Scénario :** Hashcode traite des données comportementales (profilage) sans CGU claires. Un utilisateur mécontent signale la plateforme pour non-respect du RGPD, entraînant le blocage des services tiers (hébergeurs, auth) ou une mauvaise presse.
- **Probabilité :** 🟢 Faible
- **Impact :** 🟠 Sévère
- **Contre-mesures :** Checkbox obligatoire "J'accepte que Hashcode analyse mes données pour définir mon profil" à l'inscription. Politique de confidentialité stricte.
- **Signaux faibles à surveiller :** Plaintes d'utilisateurs sur Twitter concernant l'utilisation de leurs données.

---

### II. Synthèse du Pre-Mortem

En tant que Red Team, notre conclusion est sans appel : **La menace principale n'est pas technique, elle est opérationnelle.**

La stack (Next.js/Prisma/Supabase) est suffisamment résiliente pour encaisser les erreurs. Ce qui tuera Hashcode, c'est l'ego du développeur : vouloir coder l'application parfaite au lieu de gérer la communauté de manière "sale" mais authentique (conciergerie) pendant les 3 premiers mois.

**Votre Règle de Survie Absolue :**
Si une fonctionnalité n'impacte pas directement (1) le fait qu'un utilisateur soumette une mission ou (2) le fait qu'il reçoive une validation sociale de ses pairs... **Ne la codez pas.**
