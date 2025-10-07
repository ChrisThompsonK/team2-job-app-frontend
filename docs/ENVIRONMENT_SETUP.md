# Environment Variables Setup

## Overview
This document describes the environment variable configuration system for the Kainos Job Application Portal frontend, following Node.js best practices as outlined in `app-configuration.md`.

## What is Configuration?

Configuration refers to settings that control how your application behaves **without changing the code itself**. This includes:
- Server settings (port, host)
- API endpoints and timeouts
- Feature flags (enabling/disabling features)
- Logging levels
- Application metadata

## Why Environment Variables?

Environment variables allow us to:
- 🔒 **Security**: Keep configuration separate from code
- 🔄 **Flexibility**: Run the same code in different environments (dev, staging, production)
- ✨ **Simplicity**: Change settings without redeploying code
- 🤝 **Collaboration**: Different developers can use different local settings

## Configuration Files

### 1. `.env` (Local Development) - **NOT COMMITTED**
- Contains your personal development configuration
- **Never committed to git** (in .gitignore)
- Copy from `.env.example` to get started
- Used when running `npm run dev`

### 2. `.env.example` (Template) - **COMMITTED**
- Template showing all available environment variables
- Documents what variables exist and their defaults
- Safe to commit - contains no secrets
- New developers copy this to `.env`

### 3. `.env.production.example` (Production Template) - **COMMITTED**
- Example production configuration
- Shows production-appropriate values
- Reference for deployment configuration
- Safe to commit - contains no real credentials

### 4. `src/config/environment.ts` (Configuration Module)
- Centralized configuration management
- Type-safe environment variable access
- Validates required variables at startup
- Provides sensible defaults for all values
- Exports `config` object and utility functions

### 5. `scripts/validate-env.js` (Validation Script)
- Validates environment configuration
- Can be run before deployment
- Logs current configuration for debugging

## Environment Variables

### Server Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Server port | `3000` | `8080` |
| `HOST` | Server host | `localhost` | `0.0.0.0` |

### API Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `API_BASE_URL` | Backend API URL | `http://localhost:8080` | `https://api.example.com` |
| `API_TIMEOUT` | Request timeout (ms) | `5000` | `10000` |

### Application Information
| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | `Kainos Job Application Portal` |
| `APP_VERSION` | Version number | `1.0.0` |
| `APP_DESCRIPTION` | Short description | `Modern Job Application Frontend` |

### Feature Flags
| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_MOCK_DATA` | Use mock data fallback | `true` |
| `ENABLE_DARK_MODE` | Enable dark mode feature | `true` |
| `ENABLE_ACCESSIBILITY_FEATURES` | Enable a11y features | `true` |

### Logging
| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `LOG_LEVEL` | Logging verbosity | `info` | `debug`, `info`, `warn`, `error` |
| `ENABLE_DEBUG_LOGS` | Debug logging | `false` | `true`, `false` |

### Session/Storage
| Variable | Description | Default |
|----------|-------------|---------|
| `SESSION_TIMEOUT` | Session timeout (ms) | `3600000` (1 hour) |
| `STORAGE_PREFIX` | LocalStorage key prefix | `kainos_job_app_` |

## Understanding Environment Variables in Node.js

### How It Works

In Node.js, all environment variables are available through the `process.env` object:

```typescript
// Reading environment variables (always strings!)
const port = process.env.PORT;           // "3000" (string)
const nodeEnv = process.env.NODE_ENV;    // "development"

// Remember: All values are strings, even numbers!
const portNumber = parseInt(process.env.PORT || '3000', 10);  // Convert to number
```

**Important**: All environment variable values are **strings**, even if they look like numbers!

### The .env File Pattern

Instead of setting environment variables manually every time:
```bash
PORT=3000 NODE_ENV=development node app.js  # Tedious!
```

We use a `.env` file:
```
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:8080
```

The `dotenv` package loads these into `process.env` automatically.

## Getting Started

### First Time Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values (optional):**
   ```bash
   nano .env
   ```
   
   All variables have sensible defaults, so you can leave them as-is!

3. **Run the application:**
   ```bash
   npm run dev
   ```

That's it! The application will:
- Load `.env` automatically via `import 'dotenv/config'`
- Validate configuration at startup
- Use defaults for any missing values
- Log configuration in development mode

### Using Configuration in Code

The configuration is centralized in `src/config/environment.ts`:

```typescript
import config from './config/environment.js';

// Access configuration values (all type-safe!)
console.log(config.appName);           // "Kainos Job Application Portal"
console.log(config.port);              // 3000 (number)
console.log(config.enableDarkMode);    // true (boolean)
console.log(config.apiBaseUrl);        // "http://localhost:8080"

// Check environment
if (config.nodeEnv === 'production') {
  // Production-specific logic
}

// Use utility functions
import { isDevelopment, isProduction } from './config/environment.js';

if (isDevelopment()) {
  console.log('Running in development mode');
}
```

### Type Conversion

Since `process.env` values are always strings, the config module handles conversion:

```typescript
// In environment.ts
port: parseInt(process.env.PORT || '3000', 10),              // String → Number
enableMockData: parseBoolean(process.env.ENABLE_MOCK_DATA),  // String → Boolean
```

## Configuration Module Architecture

Following the pattern from `app-configuration.md`, our configuration system provides:

### 1. Early Loading
```typescript
// At the VERY TOP of src/index.ts
import 'dotenv/config';  // Must be first!

import express from 'express';
// ... other imports
```

**Why first?** Other modules might need environment variables during initialization.

### 2. Validation at Startup
The config module validates variables when loaded:
```typescript
// In environment.ts
function validateRequiredVariables(): void {
  const required = ['DATABASE_URL', 'API_KEY'] as const;
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
```

**Note**: This frontend app doesn't have truly required variables (all have defaults). In production apps with databases or external APIs, you would validate those.

### 3. Type Safety
All configuration is strongly typed through the `Config` interface:
```typescript
interface Config {
  port: number;           // Not string!
  enableMockData: boolean; // Not string!
  apiBaseUrl: string;
}
```

### 4. Centralized Access
All configuration accessed through one object:
```typescript
import config from './config/environment.js';

app.listen(config.port);  // Not process.env.PORT!
```

### 5. Sensible Defaults
Every variable has a default, so the app works without `.env`:
```typescript
port: parseInt(process.env.PORT || '3000', 10),
enableMockData: parseBoolean(process.env.ENABLE_MOCK_DATA, true),
```

### 6. Development Logging
In development mode, configuration is logged at startup:
```typescript
if (config.nodeEnv === 'development') {
  logConfig();  // Shows all settings for debugging
}
```

## Production Deployment

### ⚠️ Important: Don't Use .env Files in Production!

Following best practices from `app-configuration.md`:

**In production, use platform-specific environment variable tools:**
- **Heroku**: Dashboard or `heroku config:set`
- **Vercel/Netlify**: Dashboard environment variables section
- **Docker**: `-e` flags or docker-compose `environment:`
- **Kubernetes**: ConfigMaps and Secrets
- **AWS**: Parameter Store or Secrets Manager
- **Azure**: App Service Configuration

**Why?**
- ✅ Better security and encryption
- ✅ Access control (who can see/modify variables)
- ✅ Audit logs of changes
- ✅ No risk of committing secrets
- ✅ Easy to update without redeployment

### Local Production Testing

To test production settings locally:

1. **Copy production example:**
   ```bash
   cp .env.production.example .env
   ```

2. **Update for your environment:**
   - Set `NODE_ENV=production`
   - Update `API_BASE_URL` to your production API
   - Disable mock data: `ENABLE_MOCK_DATA=false`
   - Use warn/error log level: `LOG_LEVEL=warn`

3. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

### Environment-Specific Files

You can create multiple env files for different contexts:
- `.env` - Your local development (not committed)
- `.env.local` - Local overrides (not committed)
- `.env.test` - Testing configuration (can be committed)
- `.env.development` - Development defaults (can be committed)
- `.env.production.example` - Production reference (committed)

## Best Practices & Common Mistakes

### ✅ DO

1. **Always provide defaults** for non-sensitive values
   ```typescript
   const port = parseInt(process.env.PORT || '3000', 10);
   ```

2. **Validate required variables** at startup
   ```typescript
   if (!process.env.API_KEY) {
     throw new Error('API_KEY is required');
   }
   ```

3. **Use .env for local development** only
   - Production should use platform-specific tools

4. **Document all variables** in `.env.example`
   - Include descriptions and default values

5. **Load dotenv early** (at the very top of entry point)
   ```typescript
   import 'dotenv/config';  // Must be first!
   ```

6. **Use a centralized config module**
   ```typescript
   import config from './config/environment.js';  // ✅
   // Not: process.env.PORT everywhere ❌
   ```

### ❌ DON'T

1. ❌ **Never commit `.env` files** to version control
2. ❌ **Don't forget that env vars are strings**
   ```typescript
   // Wrong: treats "3000" as a string
   app.listen(process.env.PORT);
   
   // Right: converts to number
   app.listen(parseInt(process.env.PORT || '3000', 10));
   ```
3. ❌ **Don't hardcode values** "just for testing"
4. ❌ **Don't use the same secrets** in dev and prod
5. ❌ **Don't load dotenv too late** in the application

## Security Best Practices

1. ✅ **Never commit `.env` files** - Already in .gitignore
2. ✅ **Use `.env.example` for documentation** - Safe to commit
3. ✅ **Rotate sensitive values regularly** - API keys, secrets, tokens
4. ✅ **Use environment variables for all secrets** - Never hardcode
5. ✅ **Validate configuration on startup** - Fail fast with clear errors
6. ✅ **Use platform tools in production** - Not .env files
7. ✅ **Principle of least privilege** - Only give access to those who need it

## Testing

### Validate Configuration
```bash
npm run build
node scripts/validate-env.js
```

### Test Different Environments
```bash
# Development
NODE_ENV=development npm run dev

# Production (after build)
NODE_ENV=production npm start
```

## Troubleshooting

### Missing Variables Warning
If you see: `⚠️ Missing environment variables: NODE_ENV, PORT. Using defaults.`

**Solution:** Create a `.env` file with the required variables.

### Configuration Not Loading
**Check:**
1. `.env` file exists in project root
2. Variables are in correct format: `KEY=value`
3. No quotes around values (unless needed)
4. File has correct line endings (LF, not CRLF)

### Changes Not Taking Effect
**Solution:** Restart the development server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Benefits

### For Developers
- 🔧 Easy local configuration
- 📝 Self-documenting through `.env.example`
- 🛡️ Type-safe configuration access
- 🔍 Validation catches issues early

### For Operations
- 🚀 Simple deployment configuration
- 🔐 Secure secrets management
- 🌍 Environment-specific settings
- 📊 Configuration logging for debugging

### For the Application
- ⚙️ Centralized configuration
- 🎯 Feature flags for gradual rollouts
- 📈 Flexible scaling (port, host)
- 🔄 Easy environment switching

## Future Enhancements

Potential improvements:
- Add configuration schema validation (e.g., using Zod)
- Implement configuration hot-reloading
- Add configuration encryption for sensitive values
- Create web UI for configuration management
- Add configuration versioning
- Implement remote configuration fetching

## Summary

The environment variable system provides:
- ✅ Centralized configuration management
- ✅ Type-safe access to all settings
- ✅ Validation and sensible defaults
- ✅ Documentation and examples
- ✅ Security best practices
- ✅ Easy deployment configuration

All configuration is now managed through environment variables with proper validation, typing, and documentation.
