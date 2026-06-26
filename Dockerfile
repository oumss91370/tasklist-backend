# syntax=docker/dockerfile:1

# ---- Stage 1 : build (compilation TypeScript + génération du client Prisma) ----
FROM node:20-slim AS builder
WORKDIR /app
# OpenSSL est requis par les moteurs Prisma
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2 : runtime minimal et non-root ----
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && useradd -m -u 10001 appuser
# Code compilé, dépendances et schéma Prisma uniquement
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
