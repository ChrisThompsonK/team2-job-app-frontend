# Environment Variables Setup Guide

This document provides a comprehensive guide to setting up and using environment variables in the Team 2 Job App Frontend.

## Quick Start

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file** with your configuration:
   ```env
   API_BASE_URL=http://localhost:8080  # Update to match your backend
   SESSION_SECRET=your-secure-secret   # Change for production
   ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

## Environment Files

- **`.env`**: Local development configuration (not committed to git)
- **`.env.example`**: Template with all available variables and descriptions
- **`.env.production.example`**: Production configuration template

## Configuration

### Server Configuration

```env
PORT=3000              # Port number for the Express server
HOST=localhost         # Host address for the server
NODE_ENV=development   # Environment mode: development, production, test
```

### API Configuration

```env
API_BASE_URL=http://localhost:8080  # Backend API base URL
API_TIMEOUT=10000                   # Request timeout in milliseconds
```

### Application Configuration

```env
APP_NAME=team2-job-app-frontend  # Application name
APP_VERSION=1.0.0                # Application version
```

### Security Configuration

```env
SESSION_SECRET=change-me-in-production  # Session encryption secret
```

**Important**: Generate a secure random string for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Logging Configuration

```env
LOG_LEVEL=info  # Options: error, warn, info, debug
```

### URL Configuration

```env
FRONTEND_URL=http://localhost:3000  # Frontend application URL
```

### Feature Flags

```env
ENABLE_DEBUG=false      # Enable debug mode (verbose logging)
ENABLE_ANALYTICS=false  # Enable analytics tracking
```

## Environment Validation

The application automatically validates environment variables on startup. If validation fails, the application will exit with an error message detailing what needs to be fixed.

### Validation Rules

- **PORT**: Must be between 1 and 65535
- **API_TIMEOUT**: Must be a positive number
- **SESSION_SECRET**: Must be changed from default in production
- **LOG_LEVEL**: Must be one of: error, warn, info, debug

## Production Deployment

### Option 1: Using .env.production file

1. Create `.env.production`:
   ```bash
   cp .env.production.example .env.production
   ```

2. Update with production values:
   ```env
   NODE_ENV=production
   API_BASE_URL=https://api.yourdomain.com
   SESSION_SECRET=<secure-random-string>
   LOG_LEVEL=warn
   ENABLE_ANALYTICS=true
   ```

3. Deploy with:
   ```bash
   NODE_ENV=production npm start
   ```

### Option 2: Using Environment Variables

Set environment variables directly in your hosting platform (Heroku, AWS, Azure, etc.):

```bash
export NODE_ENV=production
export PORT=3000
export API_BASE_URL=https://api.yourdomain.com
export SESSION_SECRET=<secure-secret>
npm start
```

## Usage in Code

### Importing Configuration

```typescript
import { env } from './config/env.js';

// Access environment variables
console.log(env.apiBaseUrl);
console.log(env.port);
console.log(env.isDevelopment);
```

### Available Properties

```typescript
env.nodeEnv          // Current environment
env.isDevelopment    // Boolean: is development
env.isProduction     // Boolean: is production
env.isTest           // Boolean: is test
env.port             // Server port number
env.host             // Server host
env.apiBaseUrl       // Backend API URL
env.apiTimeout       // API timeout in ms
env.appName          // Application name
env.appVersion       // Application version
env.sessionSecret    // Session secret
env.logLevel         // Logging level
env.frontendUrl      // Frontend URL
env.enableDebug      // Debug flag
env.enableAnalytics  // Analytics flag
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, random secrets** in production
3. **Rotate secrets regularly** in production environments
4. **Limit access** to environment variables in your deployment platform
5. **Use different secrets** for each environment
6. **Audit environment changes** in production

## Troubleshooting

### Error: Environment validation failed

Check that all required variables are set and have valid values:

```bash
# Check if .env exists
ls -la .env

# Verify .env contents
cat .env
```

### Error: Cannot find module './config/env.js'

Ensure you've created the environment configuration file:

```bash
# Check if the config directory exists
ls -la src/config/

# The env.ts file should exist
ls -la src/config/env.ts
```

### API connection issues

Verify your API_BASE_URL is correct:

```bash
# Test backend connectivity
curl http://localhost:8080/health

# Check environment variable
echo $API_BASE_URL
```

## Support

For issues or questions:
1. Check the main README.md
2. Review the .env.example file
3. Verify all environment variables are set correctly
4. Check the application logs for validation errors
