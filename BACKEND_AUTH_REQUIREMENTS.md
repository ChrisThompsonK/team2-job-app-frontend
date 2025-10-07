# Backend Requirements for Authentication System

## Overview
This document outlines what needs to be implemented in the backend to support the frontend authentication system.

---

## 🎯 PROMPT FOR AI TO CREATE BACKEND

Copy and paste this to your backend AI assistant:

```
I need you to implement a user authentication system for my Java/Spring Boot backend API. Here are the requirements:

## 1. Database Schema

Create a Users table with these fields:
- id: Integer, Primary Key, Auto-increment
- email: Varchar(255), Unique, Not Null
- password: Varchar(255), Not Null (will store bcrypt hashed passwords)
- is_admin: Boolean, Default false
- created_at: Timestamp, Default current timestamp
- updated_at: Timestamp, Auto-update on modification

Insert these two test users (hash the passwords with bcrypt):
1. Email: admin@kainos.com, Password: admin123, is_admin: true
2. Email: user@kainos.com, Password: user123, is_admin: false

## 2. API Endpoints

### POST /api/auth/login
- Accept JSON body: { "email": "string", "password": "string" }
- Validate credentials against database
- Use bcrypt to compare password with stored hash
- On success (200): Return { "id": number, "email": "string", "is_admin": boolean }
- On failure (401): Return { "success": false, "message": "Invalid email or password" }

### POST /api/auth/logout
- Clear any server-side session data
- Return (200): { "success": true, "message": "Logout successful" }

### GET /api/auth/me
- If user is authenticated, return (200): { "id": number, "email": "string", "is_admin": boolean }
- If not authenticated, return (401): { "success": false, "message": "Not authenticated" }

## 3. Security Requirements

- Use bcrypt with at least 10 salt rounds for password hashing
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on login endpoint (max 5 attempts per minute per IP)
- Enable CORS with credentials support for http://localhost:3000
- Validate all input data
- Don't expose sensitive error details to clients

## 4. Session Management (if applicable)

If using sessions:
- Configure session store (Redis recommended for production)
- Set session timeout to 24 hours
- Use secure, httpOnly cookies
- Generate random session IDs

## 5. Response Format

All responses should be JSON with appropriate status codes:
- 200: Success
- 401: Unauthorized
- 500: Server error

Please implement this authentication system with proper error handling, input validation, and security best practices.
```

---

## Additional Notes

### Technology Stack Considerations

**If using Spring Boot:**
- Use Spring Security for authentication
- BCryptPasswordEncoder for password hashing
- Spring Session with Redis for session management
- @CrossOrigin annotation for CORS

**If using Node.js/Express:**
- Use bcrypt for password hashing
- express-session with connect-redis
- cors middleware with credentials: true
- express-validator for input validation

**If using Django:**
- Use Django's built-in authentication
- django-cors-headers for CORS
- Django sessions framework
- Custom User model with is_admin field

### Testing the Backend

Once implemented, test with these curl commands:

```bash
# Test Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kainos.com","password":"admin123"}'

# Expected Response:
# {"id":1,"email":"admin@kainos.com","is_admin":true}

# Test Logout
curl -X POST http://localhost:8080/api/auth/logout

# Expected Response:
# {"success":true,"message":"Logout successful"}

# Test Get Current User (when authenticated)
curl http://localhost:8080/api/auth/me

# Expected Response:
# {"id":1,"email":"admin@kainos.com","is_admin":true}
```

### Integration Checklist

- [ ] Database created with users table
- [ ] Two test users inserted with hashed passwords
- [ ] POST /api/auth/login endpoint working
- [ ] POST /api/auth/logout endpoint working
- [ ] GET /api/auth/me endpoint working
- [ ] CORS configured to allow http://localhost:3000
- [ ] Passwords hashed with bcrypt
- [ ] Error responses in correct format
- [ ] Rate limiting implemented
- [ ] Input validation working

### Environment Variables

Make sure your backend has these configured:

```bash
# Database
DATABASE_URL=jdbc:mysql://localhost:3306/jobapp
DATABASE_USER=root
DATABASE_PASSWORD=your_password

# Security
JWT_SECRET=your-secret-key  # if using JWT
SESSION_SECRET=your-session-secret  # if using sessions

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Server
PORT=8080
```

### Common Issues

**CORS errors:**
- Ensure CORS is configured to allow credentials
- Add Access-Control-Allow-Credentials: true header
- Specify exact origin (http://localhost:3000) not wildcard

**Login not working:**
- Verify bcrypt comparison is working
- Check password was hashed before storing
- Ensure email lookup is case-insensitive

**Session not persisting:**
- Configure session store properly
- Set cookie domain and path correctly
- Ensure SameSite attribute is compatible

---

## Support

Once your backend is implemented:

1. Start your backend server (usually port 8080)
2. Start the frontend: `npm run dev`
3. Visit http://localhost:3000/login
4. Test with the provided credentials
5. Check browser console and network tab for any errors

If you encounter issues, check:
- Backend logs for errors
- Frontend console for CORS issues
- Network tab to see request/response format
- Database to verify users exist

---

## Next Steps After Backend Implementation

1. Test login with both user accounts
2. Verify session persistence after page refresh
3. Test protected routes (/job-roles)
4. Verify logout functionality
5. Check navigation updates based on auth state
6. Test admin badge appears for admin user

Then you can move on to implementing admin-only features like:
- Create new job posting (admin only)
- Edit existing job (admin only)
- Delete job posting (admin only)
