# Notification Database Setup Design

## Goal
Implement the database model for the notification system in HASHCODE community platform.

## Architecture
The notification system will use a `Notification` model linked to the `User` model via a one-to-many relationship. Notifications will be stored in a dedicated table `notification`.

## Data Model

### Notification Model
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // MISSION_APPROVED, LEVEL_UP, DAILY_REMINDER, SYSTEM
  title     String
  message   String   @db.Text
  link      String?  // e.g., /missions
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([isRead])
  @@map("notification")
}
```

### User Model Update
Add `notifications Notification[]` to the `User` model.

## Approaches

### Approach 1: Basic Notification Model (Recommended)
Follow the provided schema exactly. It includes essential fields: `type`, `title`, `message`, `link`, and `isRead`. It uses `cuid()` for IDs and includes necessary indexes for performance.

### Approach 2: Extended Notification Model
Add fields like `metadata` (Json) for more complex notifications or `expiresAt` for transient notifications.
**Trade-off:** Adds complexity that might not be needed yet (YAGNI).

## Recommendation
Use Approach 1 as it is sufficient for the initial implementation and follows the specific task instructions.

## Security & Performance
- `onDelete: Cascade` ensures notifications are cleaned up when a user is deleted.
- Indexes on `userId` and `isRead` optimize common queries (fetching user notifications, filtering unread ones).
- `@@map("notification")` follows the project's lowercase table naming convention.

## Verification Plan
- Run `prisma validate` to ensure the schema is correct.
- Run `npx prisma db push` to apply changes to the database.
- Run `npx prisma generate` to update the client.
- Create a test script to verify that the `Notification` model is accessible via Prisma Client.
