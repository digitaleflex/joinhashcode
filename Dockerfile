FROM node:22.23.0-alpine AS base

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

RUN mkdir -p /app/public/uploads

# Prisma CLI global + @prisma/config local (pour prisma.config.ts)
RUN npm install prisma@7.8.0 --no-save --no-package-lock --global && \
    npm install @prisma/config@7.8.0 --no-save --no-package-lock

# Répertoires vides montés via bind au runtime
RUN mkdir -p /app/.next/standalone /app/.next/static /app/prisma /app/generated

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "prisma migrate deploy 2>&1; node /app/.next/standalone/server.js"]
