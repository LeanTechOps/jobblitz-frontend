# Stage 1: Build
FROM node:22-alpine AS builder

# Update Alpine packages to fix security vulnerabilities
# Add ca-certificates for HTTPS connections
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat ca-certificates && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Bake prod env vars into the build
RUN cp .env.prod .env

RUN npm run build

# Stage 2: Serve
FROM node:22-alpine AS runner

# Update Alpine packages
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat && \
    rm -rf /var/cache/apk/*

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Install only production dependencies (--ignore-scripts skips husky prepare)
COPY package*.json ./
RUN npm install --omit=dev --omit=optional --ignore-scripts && npm cache clean --force

# Copy build output from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

USER nextjs

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]
