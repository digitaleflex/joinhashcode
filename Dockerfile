FROM node:22.23.0-alpine

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

RUN mkdir -p /app/public/uploads

COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs prisma ./prisma
COPY --chown=nextjs:nodejs prisma.config.ts ./
COPY --chown=nextjs:nodejs generated ./generated
COPY --chown=nextjs:nodejs public ./public

RUN mkdir -p /tmp/prisma-cli && \
    cd /tmp/prisma-cli && \
    npm install prisma@7.8.0 --no-save --no-package-lock && \
    cp -r /tmp/prisma-cli/node_modules/. /app/node_modules/

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy 2>&1 && node server.js"]
