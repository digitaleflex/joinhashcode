# ─────────────────────────────────────────────
# Stage 1 : Dépendances (layer mis en cache par Docker si lockfile inchangé)
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps
ARG PNPM_VERSION=10.33.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# Copier UNIQUEMENT les fichiers de lockfile d'abord (exploite le cache Docker)
COPY package.json pnpm-lock.yaml .npmrc ./

# Cache pnpm persistant entre les builds via BuildKit (type=cache).
# Cela évite de re-télécharger tous les packages quand le lockfile change peu.
RUN --mount=type=cache,id=pnpm,target=/pnpm-store \
    pnpm config set store-dir /pnpm-store && \
    pnpm install --frozen-lockfile

# ─────────────────────────────────────────────
# Stage 2 : Build (compilé une seule fois, mis en cache)
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder
ARG PNPM_VERSION=10.33.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
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
# Stage 3 : Runner de production minimal
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner
ARG PNPM_VERSION=10.33.0
ARG PRISMA_VERSION=7.8.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Prisma CLI + dotenv installés globalement pour les migrations dans le conteneur éphémère.
# Cela évite de copier tout node_modules (~500 Mo - 1 Go) dans l'image finale.
# dotenv est requis car prisma.config.ts importe "dotenv/config".
RUN npm install -g prisma@${PRISMA_VERSION} dotenv

# Utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier uniquement les fichiers nécessaires au runtime (standalone)
COPY --from=builder /app/public ./public

# Répertoire uploads persistant — monté comme volume Docker en production
# Doit être APRÈS le COPY pour ne pas être écrasé
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# Prisma client (généré) + schema/migrations + config pour le runtime et les migrations
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Fichiers standalone Next.js (contient le serveur + les chunks + node_modules minimal bundlé)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Lancer le serveur standalone (pas besoin de `next start`)
CMD ["node", "server.js"]
