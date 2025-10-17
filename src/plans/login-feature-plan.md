# Login Feature Implementation Plan

## 1. Planning & Design

- **Requirements:**
  - Login form (username/email + password)
  - Authenticate against backend `/api/users/login` endpoint
  - Show error messages for invalid credentials
  - Redirect to dashboard or admin area on success

- **Affected Layers:**
  - Controller: Handles login GET/POST
  - Service: Communicates with backend API
  - Model: User login request/response types
  - View: Nunjucks login form template
  - Utils: Validation for login form

---

## 2. Implementation Steps

a. **Models**
- Create `user-login-request.ts` and `user-login-response.ts` in `src/models/`

b. **Service**
- Add `loginUser` method to `axios-user-service.ts` in `src/services/`
  - POST to `/api/users/login` with credentials
  - Return user info or error

c. **Controller**
- Add `UserController` in `src/controllers/`
  - `getLoginPage` (GET `/login`): renders login form
  - `postLogin` (POST `/login`): validates, calls service, handles errors/success

d. **View**
- Create `login.njk` in `src/views/`
  - Form for username/email and password
  - Error display block

e. **Utils**
- Add `user-validator.ts` in `src/utils/`
  - Validate login form fields

f. **Route Registration**
- Register `/login` GET and POST routes in `src/index.ts`

g. **Session Handling**
- On successful login, set session/cookie (if using sessions)
- Redirect to protected area

h. **Testing**
- Add unit tests for controller, service, and validator

---

## 3. Todo List

1. Define user login models
2. Implement login service method
3. Create user controller with login logic
4. Build Nunjucks login template
5. Add login form validation utility
6. Register login routes
7. Handle session/cookie on login
8. Write unit tests
