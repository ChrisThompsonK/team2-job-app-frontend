# Use Node.js 18 Alpine as base image (minimal and secure)
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy application source code
COPY . .

# Build the application (compile TypeScript and build CSS)
RUN npm run build:css:prod && \
    npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production
# Default API URL (can be overridden at runtime)
ENV API_BASE_URL=http://team2-backend:8000
ENV AUTH_API_BASE_URL=http://team2-backend:8000/api/auth

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
COPY --from=builder --chown=appuser:nodejs /app/src/views ./dist/views
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 3000

# Health check to monitor container status
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["npm", "start"]
