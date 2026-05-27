# ─────────────────────────────────────────────
# Stage 1 : Dépendances (layer mis en cache par Docker si lockfile inchangé)
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copier UNIQUEMENT les fichiers de lockfile d'abord (exploite le cache Docker)
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────────
# Stage 2 : Build (compilé une seule fois, mis en cache)
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars must be available at build time (baked into client bundle)
ARG NEXT_PUBLIC_APP_URL=https://joinhashcode.com
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

ENV NEXT_TELEMETRY_DISABLED=1
# URLs fictives pour satisfaire Prisma au build (aucune connexion réelle)
ENV DIRECT_URL=postgresql://localhost:5432/build_placeholder
ENV DATABASE_URL=postgresql://localhost:5432/build_placeholder
# Secret fictif pour passer le build Next.js sans BetterAuthError
ENV BETTER_AUTH_SECRET=build_placeholder_secret
# Token fictif pour passer la collecte de pages Next.js sans crash
ENV QSTASH_TOKEN=build_placeholder_token
ENV NODE_ENV=production

RUN pnpm prisma generate
# Mode standalone = image finale ultra-légère (pas de node_modules dans le runner)
RUN pnpm build

# ─────────────────────────────────────────────
# Stage 3 : Runner de production minimal (comme Vercel)
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier uniquement les fichiers nécessaires au runtime (standalone)
COPY --from=builder /app/public ./public
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/node_modules ./node_modules

# Fichiers standalone Next.js (contient le serveur + les chunks)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Lancer le serveur standalone (pas besoin de `next start`)
CMD ["node", "server.js"]
