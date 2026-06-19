# Documentation API : Système d"Escouades (Better Auth Organization)

Ce document répertorie toutes les routes API et les fonctionnalités de gestion d"équipe implémentées dans HASHCODE via le plugin Better Auth Organization.

## 🏢 Gestion des Organisations (Better Auth)

Ces routes sont gérées nativement par le plugin Better Auth, mais elles sont utilisées par nos composants frontend.

| Route (Action Client)                      | Rôle                                                       | Accès                          |
| :----------------------------------------- | :--------------------------------------------------------- | :----------------------------- |
| `authClient.organization.create`           | Crée une nouvelle escouade. Le créateur devient **Owner**. | Tout utilisateur sans escouade |
| `authClient.organization.inviteMember`     | Envoie une invitation sécurisée par email.                 | Owner / Admin                  |
| `authClient.organization.removeMember`     | Exclut un membre de l"escouade.                            | Owner / Admin                  |
| `authClient.organization.updateMemberRole` | Change le rôle (Chef, Admin, Membre) d"un utilisateur.     | Owner                          |
| `authClient.organization.update`           | Modifie le nom, le logo ou le slug de l"escouade.          | Owner                          |
| `authClient.organization.leave`            | Permet à un membre de quitter volontairement l"escouade.   | Membre / Admin                 |
| `authClient.organization.listInvitations`  | Récupère les invitations reçues par l"utilisateur actuel.  | Tout utilisateur               |
| `authClient.organization.acceptInvitation` | Accepte une invitation et rejoint l"escouade.              | Utilisateur invité             |

---

## 🛡️ Sécurité Avancée (2FA)

HASHCODE implémente la double authentification pour protéger les comptes des agents.

| Route (Action Client)             | Rôle                                                                    | Accès                         |
| :-------------------------------- | :---------------------------------------------------------------------- | :---------------------------- |
| `authClient.twoFactor.enable`     | Démarre la configuration 2FA (génère QR Code & Codes de secours).       | Tout utilisateur (mdp requis) |
| `authClient.twoFactor.verifyTotp` | Vérifie le code de l"appli pour finaliser l"activation ou se connecter. | Tout utilisateur              |
| `authClient.twoFactor.disable`    | Désactive la protection 2FA.                                            | Tout utilisateur (mdp requis) |

---

## 🚀 Routes API Personnalisées (HASHCODE)

Ces routes étendent les capacités de Better Auth pour ajouter la dimension "Place de marché" et "Candidature".

### 1. Découverte Publique

- **Route :** `GET /api/squad/public`
- **Rôle :** Liste toutes les escouades dont le champ `isPrivate` est à `false`.
- **Données retournées :** Liste des escouades avec membres (ID, Nom, Image) et score de cohésion.

### 2. Candidatures (Join Requests)

- **Route :** `POST /api/squad/join-request`
- **Rôle :** Permet à un utilisateur de postuler à une escouade publique.
- **Sécurité :** Vérifie si l"utilisateur est déjà dans un groupe ou s"il a déjà postulé.

### 3. Liste des Candidats (pour les Chefs)

- **Route :** `GET /api/squad/join-request?organizationId=ID`
- **Rôle :** Affiche les candidatures en attente pour une escouade spécifique.
- **Accès :** Restreint aux Owners et Admins de l"escouade.

### 4. Réponse aux Candidatures

- **Route :** `POST /api/squad/join-request/respond`
- **Rôle :** Accepte ou refuse un candidat.
- **Effet secondaire :** Si accepté, l"utilisateur est ajouté à l"organisation et la cohésion d"escouade augmente de **+10%**.

---

## 🛠️ Modèles de Données (Prisma)

### Organization

- `cohesionScore` (Float) : Niveau de synchronisation de l"équipe (0.0 à 1.0).
- `streakCount` (Int) : Nombre de jours consécutifs de haute activité.
- `requiredLevel` (Int) : Niveau minimum requis pour postuler (futur).
- `isPrivate` (Boolean) : Définit si l"escouade est visible publiquement.

### JoinRequest

- `status` : "PENDING", "ACCEPTED", "REJECTED".
- Gère le lien entre un `User` et une `Organization` avant le recrutement final.

---

## 🛡️ Règles de Sécurité

1.  **Protection du Chef :** Un "Owner" ne peut pas quitter son escouade sans avoir nommé un successeur via `updateMemberRole`.
2.  **Scoping :** La plupart des actions de Better Auth utilisent l"escouade "active" dans la session, empêchant un utilisateur d"interagir avec une escouade dont il n"est pas membre.
3.  **Validation :** Toutes les routes API vérifient systématiquement la session et les permissions locales au sein de l"organisation.
