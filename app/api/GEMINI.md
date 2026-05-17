# HASHCODE API - Engineering Standards

## General Principles
- **RESTful Design:** Use standard HTTP methods (GET, POST, PUT, DELETE).
- **Authentication:** All protected routes MUST use `auth.api.getSession()`.
- **Validation:** Use Zod for request body validation.
- **Errors:** Return structured JSON errors with appropriate status codes (400, 401, 403, 404, 500).

## Security (EHAF Standard)
- Treat all external input as untrusted.
- Enforce server-side authorization checks for every sensitive action.
- Sanitize database queries (Prisma handles this via parameterized queries).
- Never return sensitive user data (passwords, internal IDs) in responses.

## Mission Submissions
- Endpoints for missions are located in `app/api/missions/`.
- Always check `user.level` against `mission.requiredLevel` before processing.
- Use `$transaction` when updating multiple models (e.g., creating a submission and updating user XP).
