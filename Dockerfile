# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducible builds
RUN npm ci --prefer-offline --ignore-scripts && \
    npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript and CSS - Explicitly specify tsconfig
RUN npm run build:css && ./node_modules/.bin/tsc -p tsconfig.json

# Production stage - Using alpine for minimal size
FROM node:22-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies only with minimal footprint
RUN npm ci --only=production --ignore-scripts --omit=optional && \
    npm cache clean --force && \
    rm -rf ~/.npm /tmp/*

# Aggressive node_modules cleanup - remove all unnecessary files
RUN find /app/node_modules -type f \( \
    -name "*.md" -o \
    -name "*.ts" -o \
    -name "*.tsx" -o \
    -name "*.test.js" -o \
    -name "*.spec.js" -o \
    -name "*.example.js" -o \
    -name "*.d.ts.map" -o \
    -name "README*" -o \
    -name "CHANGELOG*" -o \
    -name "LICENSE*" -o \
    -name "AUTHORS*" -o \
    -name "HISTORY*" -o \
    -name ".eslintrc*" -o \
    -name ".prettierrc*" -o \
    -name "jest.config.*" \) -delete && \
    find /app/node_modules -type d \( \
    -name ".github" -o \
    -name "docs" -o \
    -name "examples" -o \
    -name "test" -o \
    -name "tests" -o \
    -name "__tests__" -o \
    -name "fixtures" -o \
    -name "coverage" -o \
    -name ".git" \) -exec rm -rf {} + 2>/dev/null || true

# Copy built application from builder stage (only compiled JS)
COPY --from=builder /app/dist ./dist

# Copy public assets (minified CSS already included)
COPY --from=builder /app/public ./public

# Copy views (Nunjucks templates)
COPY --from=builder /app/src/views ./dist/views

# Remove development files not needed at runtime
RUN rm -f dist/*.test.js dist/**/*.test.js

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/index.js"]
