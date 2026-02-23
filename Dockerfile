# Build from the Nx workspace root (directory that contains nx.json and package.json).
# Docker build context must be this directory (my-workspace), e.g.:
#   docker build -f my-workspace/Dockerfile -t myapp my-workspace
FROM node:20-alpine AS base
WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json* .npmrc* ./
COPY nx.json tsconfig.base.json* ./

# Install dependencies (ci when lockfile exists, else install; use --omit=dev not --production)
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy rest of workspace (nx.json already present so Nx finds the workspace)
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build all apps or a specific app, e.g. npx nx run-many -t build
RUN npx nx run-many -t build

# Optional: run from a specific app, e.g. api-gateway
# FROM node:20-alpine AS runner
# WORKDIR /app
# COPY --from=base /app/dist/apps/api-gateway ./
# COPY --from=base /app/node_modules ./node_modules
# CMD ["node", "main.js"]
