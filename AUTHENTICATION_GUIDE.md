# Authentication Implementation Guide

## Overview

This document describes the authentication and authorization system implemented in the Team 2 Job App Frontend.

## Architecture

### Components

1. **Models** (`src/models/auth-models.ts`)
   - `LoginRequest`: Interface for login credentials
   - `UserResponse`: User data including admin status
   - `AuthState`: Authentication state interface

2. **Service Layer** (`src/services/auth-service.ts`)
   - `AuthService`: Handles API calls to backend authentication endpoints
   - Methods: `login()`, `logout()`, `getCurrentUser()`

3. **Controller** (`src/controllers/auth-controller.ts`)
   - `AuthController`: Manages authentication logic and session storage
   - Handles login, logout, and current user retrieval

4. **Middleware** (`src/middleware/auth-middleware.ts`)
   - `requireAuth`: Protects routes requiring authentication
   - `requireAdmin`: Protects routes requiring admin privileges
   - `addUserToLocals`: Adds user data to template context

5. **Session Types** (`src/types/session.d.ts`)
   - TypeScript definitions for express-session

## Features

### Session Management
- **Library**: express-session
- **Duration**: 24 hours
- **Storage**: In-memory (server-side)
- **Cookie Settings**:
  - HttpOnly: true (prevents XSS)
  - Secure: true (in production, HTTPS only)
  - SameSite: not specified (defaults to 'lax')

### Role-Based Access Control
- **Two Roles**: Admin and Regular User
- **Controlled via**: `is_admin` boolean flag
- **Current Implementation**: Access level affects navigation visibility
- **Future Enhancement**: Admin-only job management (add, edit, delete)

## User Flow

### Unauthenticated User
1. Lands on any page
2. Sees only the Accessibility menu in header
3. Can access `/login` page
4. Cannot access job listings or other protected routes

### Authentication Process
1. User navigates to `/login`
2. Enters email and password
3. Frontend sends POST to `/api/auth/login`
4. Backend validates credentials
5. On success:
   - Backend returns user data with `is_admin` flag
   - Frontend stores user in session
   - Redirects to home page
6. On failure:
   - Error message displayed
   - User remains on login page

### Authenticated User
1. Session contains user data
2. Full navigation visible (Home, Jobs, About, Contact)
3. Header shows user email and role badge (if admin)
4. Can access protected routes
5. Logout button available

### Logout Process
1. User clicks "Logout" button in header
2. Frontend sends POST to `/api/auth/logout`
3. Session destroyed on frontend
4. Backend session cleared (if applicable)
5. Redirects to `/login` page

## Protected Routes

### Current Implementation

**Public Routes** (no authentication required):
- `/` - Home page
- `/login` - Login page
- All static assets

**Protected Routes** (authentication required):
- `/job-roles` - Job listings
- `/job-roles/:id` - Job details

### Future Enhancement

**Admin-Only Routes** (admin authentication required):
- `/admin/job-roles/new` - Create new job
- `/admin/job-roles/:id/edit` - Edit existing job
- `/admin/job-roles/:id/delete` - Delete job

## API Endpoints Required

### Backend Requirements

Your backend must implement these endpoints:

#### 1. Login Endpoint
```
POST /api/auth/login

Request Body:
{
  "email": "string",
  "password": "string"
}

Success Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@kainos.com",
    "is_admin": false
  }
}

Error Response (401):
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 2. Logout Endpoint
```
POST /api/auth/logout

Success Response (200):
{
  "success": true,
  "message": "Logout successful"
}

Error Response (500):
{
  "success": false,
  "message": "Logout failed"
}
```

#### 3. Current User Endpoint
```
GET /api/auth/me

Success Response (200):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@kainos.com",
    "is_admin": false
  }
}

Error Response (401):
{
  "success": false,
  "message": "Not authenticated"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Hashed with bcrypt
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Test Data

```sql
-- Admin user (password: admin123)
INSERT INTO users (email, password, is_admin) 
VALUES (
  'admin@kainos.com', 
  '$2b$10$...',  -- Hash of 'admin123'
  true
);

-- Regular user (password: user123)
INSERT INTO users (email, password, is_admin) 
VALUES (
  'user@kainos.com', 
  '$2b$10$...',  -- Hash of 'user123'
  false
);
```

## Security Considerations

### Current Implementation
- ✅ Server-side sessions (no JWT in localStorage)
- ✅ HttpOnly cookies (prevents XSS token theft)
- ✅ Session expiration (24 hours)
- ✅ HTTPS in production (via secure cookie flag)

### Backend Security Requirements
- ❗ **Password hashing**: Use bcrypt with salt rounds >= 10
- ❗ **SQL injection prevention**: Use parameterized queries
- ❗ **Rate limiting**: Implement login attempt throttling
- ❗ **CORS configuration**: Restrict allowed origins
- ❗ **Input validation**: Validate all user inputs
- ❗ **Session security**: Use secure session store (Redis, MongoDB)

### Recommended Improvements
1. Add CSRF protection
2. Implement refresh tokens for extended sessions
3. Add account lockout after failed attempts
4. Log authentication events
5. Add email verification
6. Implement 2FA for admin accounts

## Environment Variables

Required environment variables:

```bash
# Application
NODE_ENV=development
PORT=3000

# Backend API
API_BASE_URL=http://localhost:8080

# Session
SESSION_SECRET=your-random-secret-key-here
```

## Testing

### Manual Testing Steps

1. **Unauthenticated Access**
   - Visit http://localhost:3000
   - Verify only Accessibility menu visible
   - Try accessing http://localhost:3000/job-roles
   - Should receive 401 error

2. **Login as Regular User**
   - Visit http://localhost:3000/login
   - Enter: user@kainos.com / user123
   - Click "Login"
   - Verify redirect to home
   - Check navigation is now visible
   - Verify no "Admin" badge

3. **Login as Admin**
   - Logout
   - Login with: admin@kainos.com / admin123
   - Verify "Admin" badge appears next to email
   - Verify full navigation access

4. **Session Persistence**
   - Refresh page
   - Verify still logged in
   - Close browser
   - Reopen within 24 hours
   - Verify still logged in

5. **Logout**
   - Click "Logout" button
   - Verify redirect to login page
   - Verify navigation hidden
   - Try accessing /job-roles
   - Should receive 401 error

## Troubleshooting

### Login not working
- Check backend is running on correct port
- Verify `API_BASE_URL` environment variable
- Check browser console for errors
- Verify backend returns correct response format

### Session not persisting
- Check `SESSION_SECRET` is set
- Verify cookies are enabled in browser
- Check session middleware is loaded before routes
- Ensure session store is configured correctly

### Navigation not updating
- Verify `addUserToLocals` middleware is applied
- Check template syntax in header.njk
- Clear browser cache
- Check session data is being stored

## Future Enhancements

1. **Admin Job Management**
   - Add job creation form (admin only)
   - Edit job functionality (admin only)
   - Delete job with confirmation (admin only)

2. **Password Reset**
   - Forgot password flow
   - Email verification
   - Secure reset tokens

3. **User Management**
   - Admin can view all users
   - Admin can promote/demote users
   - User profile pages

4. **Enhanced Security**
   - Two-factor authentication
   - Login history and audit logs
   - Suspicious activity alerts

5. **Social Login**
   - OAuth2 integration
   - Google/Microsoft sign-in
   - LinkedIn authentication

## Support

For questions or issues with authentication:
1. Check this document
2. Review backend API documentation
3. Check browser console for errors
4. Verify environment variables
5. Test with provided credentials

## Credentials Reference

**Admin User**
- Email: admin@kainos.com
- Password: admin123

**Regular User**
- Email: user@kainos.com
- Password: user123
