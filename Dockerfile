# Multi-stage Dockerfile for EthosTron Live MCP Server
# Compatible with Glama.ai, Smithery.ai, and container runtimes

FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src/ ./src/

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY LICENSE README.md ./

USER node

ENTRYPOINT ["node", "dist/index.js"]
