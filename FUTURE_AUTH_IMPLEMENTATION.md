# Future Authentication Implementation

## Overview
Authentication has been removed from the application to prepare for a clean implementation using [better-auth](https://www.better-auth.com/) in the next sprint.

## Why better-auth?

Better-auth is a modern, framework-agnostic authentication library for TypeScript that provides:

- 🔐 **Type-safe authentication** - Full TypeScript support with excellent type inference
- 🎨 **Framework agnostic** - Works with React, Vue, Svelte, Express, and more
- 🔑 **Multiple auth methods** - Email/password, OAuth (Google, GitHub, etc.), magic links, passkeys
- 🛡️ **Security first** - Built-in CSRF protection, secure session handling, rate limiting
- 🎯 **Developer friendly** - Intuitive API and excellent documentation
- 🔌 **Extensible** - Plugin system for custom functionality
- 📦 **Database agnostic** - Works with PostgreSQL, MySQL, SQLite, MongoDB
- 🚀 **Production ready** - Used in production applications

## Resources

- **Official Documentation**: https://www.better-auth.com/
- **Getting Started**: https://www.better-auth.com/docs/installation
- **Node.js Integration**: https://www.better-auth.com/docs/integrations/node
- **API Reference**: https://www.better-auth.com/docs/api-reference
- **GitHub Repository**: https://github.com/better-auth/better-auth

## Planned Implementation (Next Sprint)

### 1. Installation & Setup

```bash
# Install better-auth
npm install better-auth

# Install database adapter (if needed)
npm install better-auth-adapter-postgres
# or npm install better-auth-adapter-mysql
```

### 2. Authentication Configuration

Create a `src/lib/auth.ts` file to configure better-auth:

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // Database connection configuration
    provider: "postgres", // or "mysql", "sqlite"
    url: process.env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    // Add more providers as needed
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
```

### 3. Add Authentication Routes

Update `src/index.ts` to add better-auth routes:

```typescript
import { auth } from "./lib/auth.js";

// Mount better-auth routes
app.use("/api/auth/*", auth.handler);
```

### 4. Create Authentication Middleware

```typescript
// src/middleware/auth.ts
import { auth } from "../lib/auth.js";

export const requireAuth = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = session.user;
  req.session = session.session;
  next();
};

export const requireAdmin = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user.role === "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  req.user = session.user;
  next();
};
```

### 5. Update Frontend Components

Create client-side authentication utilities:

```typescript
// src/client/auth.ts
export async function signIn(email: string, password: string) {
  const response = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  window.location.href = "/login";
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/session");
  return response.json();
}
```

### 6. Protect Routes

```typescript
// Protected routes example
app.get("/job-roles", requireAuth, jobRoleController.getJobRoles);
app.post("/job-roles", requireAdmin, jobRoleController.createJobRole);
app.put("/job-roles/:id", requireAdmin, jobRoleController.updateJobRole);
app.delete("/job-roles/:id", requireAdmin, jobRoleController.deleteJobRole);
```

### 7. Update Login Page

Update `src/views/login.njk` with functional login form that calls better-auth endpoints.

### 8. Add User Management Features

- User profile pages
- Password reset functionality
- Email verification
- Account settings

## Planned Features

### Phase 1: Core Authentication
- [x] Clean removal of old authentication code
- [ ] Install and configure better-auth
- [ ] Email/password authentication
- [ ] Session management
- [ ] Protected routes middleware

### Phase 2: Enhanced Security
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication (TOTP)
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection

### Phase 3: Social Authentication
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] Microsoft OAuth (for Kainos integration)

### Phase 4: Advanced Features
- [ ] Role-based access control (Admin/User)
- [ ] Magic link authentication
- [ ] Passkey support (WebAuthn)
- [ ] Account linking (multiple providers)

### Phase 5: Admin Features
- [ ] User management dashboard
- [ ] Permission management
- [ ] Audit logs
- [ ] Session management

## Database Schema

Better-auth will automatically create these tables:

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Accounts table (for OAuth providers)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Verification tokens table
CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);
```

## Environment Variables

Add these to `.env`:

```bash
# Better Auth Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/jobapp
SESSION_SECRET=your-super-secret-session-key-change-in-production

# OAuth Providers (when ready)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Configuration (for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Migration Path

### From Current State to better-auth

1. ✅ **Current State**: All authentication code removed, clean slate
2. **Next Sprint**: Install and configure better-auth
3. **After Sprint**: Full authentication with email/password
4. **Future Sprints**: Add OAuth, 2FA, and advanced features

## Testing Strategy

1. **Unit Tests**: Test authentication middleware and utilities
2. **Integration Tests**: Test login/logout flows
3. **E2E Tests**: Test complete user journeys
4. **Security Tests**: Test for common vulnerabilities

## Current State

The application currently has:
- ✅ No authentication dependencies
- ✅ Clean routing without auth guards
- ✅ No authentication state management
- ✅ Public access to all routes
- ✅ Login page with disabled form (ready for implementation)
- ✅ Navigation without auth-based conditional rendering

**Ready for clean better-auth implementation! 🚀**

## Timeline

- **Sprint 1 (Current)**: Authentication removal ✅
- **Sprint 2 (Next)**: better-auth implementation with email/password
- **Sprint 3**: OAuth providers and email verification
- **Sprint 4**: Advanced features (2FA, passkeys, magic links)
- **Sprint 5**: Admin features and user management

## Questions or Need Help?

- **Documentation**: https://www.better-auth.com/docs
- **Discord Community**: https://discord.gg/better-auth
- **GitHub Issues**: https://github.com/better-auth/better-auth/issues
- **Examples**: https://github.com/better-auth/better-auth/tree/main/examples

---

**Note**: This document serves as a roadmap for the authentication implementation. It will be updated as we progress through the implementation phases.
