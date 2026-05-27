# Spécifications & Documentation des API HASHCODE 🚀

Ce document répertorie, détaille et sécurise toutes les routes API critiques et importantes implémentées au sein de la plateforme HASHCODE (Next.js 15 App Router).

---

## 🔑 1. Authentification & Accès (`/api/auth`)

Ces routes gèrent la sécurité, l'accès à la bêta privée et les sessions des utilisateurs.

| Méthode | Route | Rôle / Description | Accès / Sécurité |
| :--- | :--- | :--- | :--- |
| `POST/GET` | `/api/auth/[...all]` | Catch-all pour **Better Auth** (connexion, déconnexion, récupération de session). | Public / CSRF-safe |
| `POST` | `/api/auth/beta-verify` | Valide une clé bêta pour permettre le processus d'inscription. | Clé requise |
| `POST` | `/api/auth/card-verify` | Permet d'associer et d'authentifier une carte de membre physique. | Session utilisateur requis |

---

## 📋 2. Onboarding & Profiling (`/api/onboarding`)

Gère le funnel d'entrée des nouveaux utilisateurs avant l'accès au tableau de bord.

| Méthode | Route | Rôle / Description | Accès / Sécurité |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/onboarding` | Enregistre la situation de l'utilisateur (pays, objectifs, niveau technique). | Session valide requis |
| `POST` | `/api/onboarding/post-quiz` | Enregistre les aspirations fines (focus, blocages) après le quiz psychométrique. | Session valide requis |

---

## 🎯 3. Système de Missions (`/api/missions`)

La boucle de gameplay principale : sélection, réservation et soumission des livrables techniques.

| Méthode | Route | Rôle / Description | Accès / Sécurité |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/missions` | Récupère la liste des missions adaptées à la classe et au niveau. | Session active |
| `POST` | `/api/missions/[id]/claim` | Réserve une mission pour une durée limitée (Claim). | Un claim actif max |
| `POST` | `/api/missions/[id]/retrospective` | Soumet la rétrospective facultative après la réalisation. | Session active |
| `POST` | `/api/missions/[id]/review` | Soumet une évaluation ou demande de peer-review (concierge). | Rôle validateur requis |

---

## 👥 4. Gestion des Escouades (`/api/squad`)

Routes permettant aux développeurs de se regrouper en équipes pour affronter des défis hybrides.

| Méthode | Route | Rôle / Description | Accès / Sécurité |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/squad/public` | Récupère la liste de toutes les escouades publiques non privées. | Authentifié (Cache 60s) |
| `POST` | `/api/squad/create` | Crée une nouvelle escouade (organisation). Le créateur devient propriétaire. | Limité à 1 escouade |
| `POST` | `/api/squad/join-request` | Postule à une escouade (anti-spam : max 3 requêtes en attente). | Rate-limité par IP |
| `POST` | `/api/squad/join-request/respond` | Accepte ou rejette un candidat. Augmente la cohésion si accepté (+10%). | Owner / Admin uniquement |
| `POST` | `/api/squad/leave` | Permet à un membre de quitter volontairement son escouade. | Membre (Propriétaire exclu) |
| `POST` | `/api/squad/update` | Met à jour le nom, logo, ou visibilité de l'escouade. | Owner / Admin uniquement |

---

## 👤 5. Espace Utilisateur (`/api/user`)

Gestion du profil et gamification personnelle.

| Méthode | Route | Rôle / Description | Accès / Sécurité |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/me` | Récupère les informations privées filtrées (sécurisées des hashs sensibles). | Session active |
| `POST` | `/api/user/checkin` | Effectue le check-in quotidien (+XP / Streak). Requis : min 20 caractères. | 1 fois par 20 heures |
| `POST` | `/api/user/avatar` | Permet de téléverser et recadrer une image de profil. | Session active |
| `POST` | `/api/user/card/generate` | Génère la carte de membre digitale avec les scores de Vibrancy. | Session active |
| `PATCH` | `/api/user/update` | Met à jour les liens de réseaux sociaux (GitHub, Twitter, LinkedIn). | Session active |
| `DELETE`| `/api/user/delete` | Supprime définitivement le compte utilisateur (Nettoyage en cascade). | Validation mot de passe |

---

## 🛠️ 6. API d'Administration & Concierge (`/api/admin`)

Ces routes critiques sont réservées au personnel HASHCODE pour administrer la plateforme en direct.

| Méthode | Route | Rôle / Description | Accès / Sécurité |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/log` | Récupère les logs d'activité administrateur (ActivityLog). | Rôle ADMIN requis |
| `GET/POST`| `/api/admin/keys` | Liste et génère de nouvelles clés d'accès à la bêta. | Rôle ADMIN requis |
| `DELETE` | `/api/admin/keys/[id]` | Inactive ou détruit une clé bêta. | Rôle ADMIN requis |
| `GET/POST`| `/api/admin/missions` | Gère la création de nouvelles missions dans la base globale. | Rôle ADMIN / MODERATOR |
| `PUT/DELETE`| `/api/admin/missions/[id]` | Modifie ou supprime définitivement une mission. | Rôle ADMIN / MODERATOR |
| `POST` | `/api/admin/notifications/broadcast` | Envoie une notification système générale à tous les utilisateurs. | Rôle ADMIN requis |
| `GET/PATCH`| `/api/admin/submissions` | Liste et modère (concierge) les livrables des utilisateurs (Paginé). | Rôle ADMIN / MODERATOR |
| `GET` | `/api/admin/users/export` | Exporte toutes les données utilisateurs au format CSV. | Rôle ADMIN requis |

---

## ⚙️ 7. Tâches de Fond, Crons & Webhooks (`/api/internal` / `/api/webhooks`)

Exécutées de manière asynchrone par des services serveurs tiers (Upstash / Resend).

| Méthode | Route | Rôle / Description | Fournisseur / Sécurité |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/internal/cron/check-activity` | Parcourt l'activité et met à jour les streaks quotidiens des utilisateurs. | Planificateur QStash |
| `GET` | `/api/internal/cron/cleanup` | Purge hebdomadaire des invitations expirées et des vieux logs. | Planificateur QStash |
| `GET` | `/api/internal/cron/release-claims` | Libère automatiquement les missions réservées mais expirées (Timeout). | Planificateur QStash |
| `GET` | `/api/internal/cron/squad-decay` | Gère la baisse d'activité et la décadence de cohésion des escouades inactives. | Planificateur QStash |
| `POST` | `/api/webhooks/resend` | Réceptionne les bounced e-mails et les plaintes de spam. | Webhook Resend |

---

## 🛡️ Règles Générales de Sécurité Appliquées (EHAF Security)
1. **Échappement SQL & Injection :** Intégralement géré au niveau de la couche ORM Prisma à l'aide de requêtes paramétrées natives.
2. **Filtration des Payloads :** Toutes les routes acceptant des corps de requêtes appliquent un typage et une validation stricte à l'aide de schémas **Zod**.
3. **MFA Enforcement :** Pour les actions administratives critiques ou la modification des informations de connexion, la validation par double authentification (TOTP) est activée si configurée par l'administrateur.
