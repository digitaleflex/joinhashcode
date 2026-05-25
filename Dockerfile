# Stage 1: Installation des dépendances
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build de l'application
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# URL fictive pour satisfaire prisma.config.ts au build (prisma generate ne se connecte pas)
ENV DIRECT_URL=postgresql://localhost:5432/build_placeholder
ENV DATABASE_URL=postgresql://localhost:5432/build_placeholder
RUN pnpm prisma generate
RUN pnpm build

# Stage 3: Runner léger de production
FROM node:20-alpine AS runner
RUN corepack enable
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma db push && pnpm start"]
