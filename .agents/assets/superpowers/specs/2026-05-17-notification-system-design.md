# HASHCODE — Spécification : Système de Notifications Hybride (Site + Email)

## Vision
Créer une boucle de feedback constante et motivante pour les bâtisseurs de HASHCODE. Le système doit garantir que chaque victoire (mission, niveau) est célébrée et que chaque période d'inactivité est adressée via des rappels intelligents.

## Architecture : "Reliable Transmission" (QStash)
Pour éviter de ralentir l'expérience utilisateur et garantir la délivrabilité, nous utilisons **QStash** comme gestionnaire de file d'attente (Background Worker) et planificateur (Cron).

### 1. Flux de Notification Directe (Trigger)
- **Événement** : Mission validée, Niveau supérieur atteint.
- **Action API** : L'API principale envoie un message à QStash via `publishJSON`.
- **Worker** : QStash rappelle l'endpoint interne `/api/internal/notify`.
- **Résultat** : Insertion dans la table `Notification` (DB) + Envoi de l'email via `emailService` (Resend).

### 2. Flux de Rappel d'Activité (Cron)
- **Planification** : Cron QStash configuré pour tourner toutes les 24h (ex: 20h00).
- **Endpoint** : `/api/internal/cron/check-activity`.
- **Logique** : Identifie les utilisateurs dont `lastCheckinAt` est > 24h et envoie une notification `DAILY_REMINDER`.

## Modèle de Données (Prisma)

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // MISSION_APPROVED, LEVEL_UP, DAILY_REMINDER, SYSTEM
  title     String
  message   String   @db.Text
  link      String?  // Ex: /missions
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([isRead])
  @@map("notification")
}
```

## Composants UI/UX (Aesthétique Cyber-Modern)

### 1. `NotificationBell` (Dashboard TopBar)
- Icône de cloche avec badge de comptage dynamique.
- Menu déroulant (dropdown) affichant les 5 dernières notifications.
- Effet de glow sur les notifications non lues.

### 2. `NotificationCenter` (Page dédiée ou Sidebar)
- Historique complet des transmissions reçues.
- Possibilité de "Tout marquer comme lu".

### 3. Real-time Toasts (Sonner)
- Si l'utilisateur est actif lors de la réception (via polling ou rechargement), un toast spécial apparaît avec le son de notification HASHCODE (optionnel).

## Sécurité
- Les endpoints `/api/internal/*` seront protégés par une vérification de signature `QSTASH_CURRENT_SIGNING_KEY` pour éviter les appels malveillants externes.

## Plan d'implémentation
1. **Schema** : Ajouter `Notification` à `schema.prisma` et migrer.
2. **API Interne** : Créer l'endpoint de réception des notifications.
3. **Integration** : Brancher les triggers dans les routes Missions et Onboarding.
4. **UI** : Développer le composant `NotificationBell`.
5. **Cron** : Configurer la tâche de rappel quotidien.

---
*Spécification rédigée le 17 Mai 2026 — Prête pour implémentation.*
