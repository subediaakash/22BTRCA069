# syntax=docker/dockerfile:1

# --- Base image with Bun ---
FROM oven/bun:1.1.28 AS base
WORKDIR /app

# --- Dependencies layer ---
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY bun.lock package.json tsconfig.json ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile

RUN bun x prisma generate

# --- Runtime image ---
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /root/.cache/prisma /root/.cache/prisma

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost:3000/health || exit 1

CMD ["bun", "run", "index.ts"] 