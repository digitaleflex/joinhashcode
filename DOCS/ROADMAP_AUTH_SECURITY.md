# Roadmap d'Implémentation : Sécurité & Auth HASHCODE

Ce document définit les priorités pour durcir le système d'authentification et améliorer l'expérience utilisateur post-fix.

## 🎯 Priorité Alpha : Sécurité Critique (Immédiat)
*Objectif : Empêcher les abus et protéger les comptes.*

### 1. Durcissement du Rate Limiting (Brute-force)
- **Pourquoi :** Actuellement, 5 tentatives/min sur l'OTP est trop permissif.
- **Action :** Passer à 3 tentatives/min et ajouter une expiration plus agressive.
- **Fichier :** `lib/auth.ts`

### 2. Validation stricte des domaines Email
- **Pourquoi :** Éviter les inscriptions massives via des emails temporaires (disposable emails).
- **Action :** Intégrer une liste noire de domaines ou utiliser une validation Zod plus stricte.

---

## 🚀 Priorité Beta : Expérience & Confiance (Court Terme)
*Objectif : Professionnaliser les échanges et sécuriser les accès.*

### 3. MFA via TOTP (Google Authenticator/Authy)
- **Pourquoi :** L'email est un point de faille unique. Le TOTP est plus rapide et plus sûr.
- **Action :** Activer le plugin `twoFactor` de Better Auth et créer l'interface de setup dans `/settings`.

### 4. Branding des Emails (React Email + Resend)
- **Pourquoi :** Les emails système bruts nuisent à la crédibilité de HASHCODE.
- **Action :** Créer des templates HTML/CSS "Cyber-Modern" pour les liens magiques et les codes OTP.

---

## 🛡️ Priorité Gamma : Gestion Avancée (Moyen Terme)
*Objectif : Donner le contrôle total à l'utilisateur.*

### 5. Audit des Sessions Actives
- **Pourquoi :** Permettre aux utilisateurs de voir et déconnecter les autres appareils.
- **Action :** Créer un composant "Security Dashboard" listant les sessions actives (User Agent, IP).

---

# Issues GitHub (Prêtes à copier/coller)

## Issue #1: [Security] Hardening Rate Limiting for OTP sign-in
**Description:**
Reduce the attack surface for OTP brute-force attacks.
- Update `/api/auth/sign-in/email-otp` limit from 5 to 3 requests per minute.
- Implement a cooldown period after 3 failed attempts.

## Issue #2: [Feature] Implement Two-Factor Authentication (TOTP)
**Description:**
Enhance account security by adding TOTP support.
- Enable `twoFactor` plugin in `lib/auth.ts`.
- Create UI in `/settings` to generate QR codes and manage backup codes.

## Issue #3: [UX] Cyber-Modern Email Branding
**Description:**
Replace default Better Auth emails with branded HASHCODE templates.
- Integrate `@react-email/components`.
- Design templates for Magic Link and Verification OTP.
