# Guide de Génération des Clés de Production — HASHCODE

Ce document détaille, étape par étape, comment générer et configurer l'ensemble des clés secrètes et identifiants nécessaires pour déployer l'application HASHCODE en production de manière totalement autonome et sécurisée.

Toutes ces clés doivent être reportées dans le fichier de production de votre serveur (généralement configuré via le fichier [.env.production](file:///c:/Users/PC/Documents/GitHub/hashcode-community/.env.production) ou dans les variables d'environnement de votre hébergeur).

---

## Sommaire

1. [Clé Secrète Better Auth (Sécurité de Session)](#1-clé-secrète-better-auth-sécurité-de-session)
2. [Authentification de la Base de Données & Traefik Basic Auth](#2-authentification-de-la-base-de-données--traefik-basic-auth)
3. [Identifiants Google OAuth (Connexion Google)](#3-identifiants-google-oauth-connexion-google)
4. [Identifiants GitHub OAuth (Connexion GitHub)](#4-identifiants-github-oauth-connexion-github)
5. [Clés API Resend (Envoi de Mails de Sécurité)](#5-clés-api-resend-envoi-de-mails-de-sécurité)
6. [Jetons Upstash QStash (Tâches de fond & Chronomètres)](#6-jetons-upstash-qstash-tâches-de-fond--chronomètres)

---

## 1. Clé Secrète Better Auth (Sécurité de Session)

Cette clé est requise pour chiffrer les jetons d'authentification et sécuriser les sessions utilisateur.

### Comment la générer :
Ouvrez votre terminal (local ou sur le serveur) et exécutez la commande suivante :
```bash
openssl rand -base64 32
```
*Cette commande va générer une chaîne de caractères aléatoire hautement sécurisée de 32 octets encodée en Base64 (ex: `K4bEF/8phwv/Xx3fo//J0ltwp5aZDYvwF9wL79Q86+k=`).*

### Configuration dans `.env.production` :
```env
BETTER_AUTH_SECRET="votre_cle_generee_ici"
BETTER_AUTH_URL="https://joinhashcode.com"
NEXT_PUBLIC_APP_URL="https://joinhashcode.com"
```

---

## 2. Authentification de la Base de Données & Traefik Basic Auth

### A. Chaînes de Connexion PostgreSQL de Production
En production, configurez les variables de connexion de votre instance PostgreSQL :
```env
DATABASE_URL="postgresql://db_user:strong_password@prod-db-host:5432/hashcode?schema=public&sslmode=require"
DIRECT_URL="postgresql://db_user:strong_password@prod-db-host:5432/hashcode?schema=public&sslmode=require"
```

### B. Générer le Hash pour le Basic Auth de Traefik (Accès Adminer)
Pour protéger l'interface d'administration `db.joinhashcode.com` au niveau de Traefik, vous devez générer un couple `Utilisateur:Mot_de_passe_hashé`.

#### Comment le générer :
1. **Sur votre terminal** (si vous avez `apache2-utils` installé) :
   ```bash
   htpasswd -nb admin mon_mot_de_passe_ultra_secu
   ```
   *Exemple de retour : `admin:$apr1$e45mnZdt$7yuID6BXmqUHg26RrFIayQ`*

2. **Alternative en ligne** : Utilisez un générateur en ligne fiable de mot de passe `htpasswd` (de type MD5 ou Bcrypt).
3. **Report dans le fichier [compose.yaml](file:///c:/Users/PC/Documents/GitHub/hashcode-community/compose.yaml)** :
   > [!IMPORTANT]
   > Dans le fichier `compose.yaml`, vous devez impérativement **doubler les caractères `$`** (les remplacer par `$$`) dans le hash pour éviter que Docker Compose ne les interprète comme des variables d'environnement locales.
   
   *Exemple :*
   `"traefik.http.middlewares.adminer-auth.basicauth.users=admin:$$apr1$$e45mnZdt$$7yuID6BXmqUHg26RrFIayQ"`

---

## 3. Identifiants Google OAuth (Connexion Google)

Pour permettre la connexion via Google en production.

### Comment les générer :
1. Rendez-vous sur la [Console Google Cloud](https://console.cloud.google.com/).
2. Créez un nouveau projet ou sélectionnez votre projet existant.
3. Allez dans **API et services** > **Écran de consentement OAuth** :
   * Choisissez le type **Externe**.
   * Remplissez les informations obligatoires (Nom de l'application, e-mail de support).
   * Ajoutez le domaine autorisé : `joinhashcode.com`.
4. Allez dans **API et services** > **Identifiants** :
   * Cliquez sur **Créer des identifiants** > **ID de client OAuth**.
   * Sélectionnez **Application Web**.
   * **Origines JavaScript autorisées** : `https://joinhashcode.com`
   * **URI de redirection autorisés** :
     `https://joinhashcode.com/api/auth/callback/google`
5. Récupérez l'**ID de client** et le **Code secret du client**.

### Configuration dans `.env.production` :
```env
GOOGLE_CLIENT_ID="votre_google_client_id_ici"
GOOGLE_CLIENT_SECRET="votre_google_client_secret_ici"
```

---

## 4. Identifiants GitHub OAuth (Connexion GitHub)

Pour permettre la connexion via GitHub en production.

### Comment les générer :
1. Connectez-vous sur votre compte GitHub et allez dans **Settings** > **Developer Settings** > **OAuth Apps**.
2. Cliquez sur **Register a new application** :
   * **Application name** : `HASHCODE Production`
   * **Homepage URL** : `https://joinhashcode.com`
   * **Authorization callback URL** :
     `https://joinhashcode.com/api/auth/callback/github`
3. Cliquez sur **Register application**.
4. Copiez le **Client ID**.
5. Cliquez sur **Generate a new client secret** et copiez le code secret généré.

### Configuration dans `.env.production` :
```env
GITHUB_CLIENT_ID="votre_github_client_id_ici"
GITHUB_CLIENT_SECRET="votre_github_client_secret_ici"
```

---

## 5. Clés API Resend (Envoi de Mails de Sécurité)

Resend est utilisé pour l'envoi des e-mails contenant les codes de connexion sécurisés à usage unique (Magic Link/OTP).

### Comment les générer :
1. Créez un compte sur [Resend.com](https://resend.com/).
2. Allez dans la section **Domains** et ajoutez votre nom de domaine `joinhashcode.com`.
3. Configurez les clés DNS fournies (DKIM/SPF) chez votre registraire de domaine pour valider la délivrabilité.
4. Allez dans **API Keys** > **Create API Key** :
   * **Name** : `HASHCODE Prod Key`
   * **Permission** : `Sending Access`
5. Copiez la clé API générée (commence par `re_`).

### Configuration dans `.env.production` :
```env
RESEND_API_KEY="re_votre_cle_resend_ici"
RESEND_DOMAIN="https://joinhashcode.com"
```

---

## 6. Jetons Upstash QStash (Tâches de fond & Chronomètres)

Upstash QStash est l'outil serverless utilisé pour gérer les files d'attente de messages et les planifications asynchrones (Crons).

### Comment les générer :
1. Créez un compte sur [Upstash.com](https://upstash.com/).
2. Allez dans la console **QStash**.
3. Récupérez les informations de signature dans l'onglet **Details** :
   * **QSTASH_TOKEN** : Le jeton Bearer d'authentification.
   * **Current Signing Key** : Clé de signature active des messages.
   * **Next Signing Key** : Clé de signature de rotation.

### Configuration dans `.env.production` :
```env
QSTASH_URL="https://qstash-us-east-1.upstash.io"
QSTASH_TOKEN="votre_qstash_token_ici"
QSTASH_CURRENT_SIGNING_KEY="votre_current_signing_key_ici"
QSTASH_NEXT_SIGNING_KEY="votre_next_signing_key_ici"
```
