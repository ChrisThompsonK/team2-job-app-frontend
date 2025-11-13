# Use Node.js 22 Alpine as base image (minimal and secure)
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (optimized with flags to reduce build time)
RUN npm ci --only=production --no-audit --no-fund

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for build, optimized)
RUN npm ci --no-audit --no-fund

# Copy application source code
COPY . .

# Build the application (compile TypeScript and build CSS)
RUN npm run build:css:prod && \
    npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Create data directory for session storage
RUN mkdir -p /app/data && \
    chown -R appuser:nodejs /app/data

# Copy production dependencies from deps stage
COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/public ./public
# TypeScript build doesn't copy .njk template files, so copy them separately
COPY --from=builder --chown=appuser:nodejs /app/src/views ./dist/views
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

# Switch to non-root user
USER appuser

# Expose the application port (default: 3000, override with PORT env var)
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Health check to monitor container status
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["npm", "start"]
