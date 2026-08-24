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

# Entry point script (must be before USER nextjs for chmod)
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
