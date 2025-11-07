# Integration Tests

This directory contains integration tests for the Job App Frontend written in TypeScript using Vitest.

## Overview

Integration tests validate that the frontend application works correctly with the backend API. These tests make real HTTP requests to the running server and verify responses.

## Test Files

- **login.integration.test.ts** - Tests for login functionality including:
  - Health check validation
  - Valid login scenarios
  - Invalid login rejection
  - Input validation
  - Response format verification

## Running Integration Tests

### Run all integration tests once
```bash
npm run test:integration
```

### Run integration tests in watch mode (auto-rerun on changes)
```bash
npm run test:integration:watch
```

### Run integration tests with UI dashboard
```bash
npm run test:integration:ui
```

### Run specific test file
```bash
vitest run test-automation/integration/login.integration.test.ts
```

### Run with verbose output
```bash
vitest run test-automation/integration --reporter=verbose
```

## Prerequisites

Before running integration tests:

1. **Frontend server must be running** on `http://localhost:3000`
   ```bash
   npm run dev
   ```

2. **Valid test user must exist in backend**
   - Email: `jimbob@example.com`
   - Password: `JimBob123!`

3. **Backend API must be running** (if applicable)
   - The application will show connection status in health checks

## Test Structure

Each integration test file follows this pattern:

1. **Setup** - Initialize test configuration and environment
2. **Health Check** - Verify server is accessible
3. **Happy Path** - Test successful scenarios
4. **Error Cases** - Test validation and error handling
5. **Assertions** - Validate status codes, response format, and behavior

## Test Configuration

Tests use the following constants (edit test file to customize):

- `BASE_URL`: http://localhost:3000 (application URL)
- `VALID_EMAIL`: jimbob@example.com
- `VALID_PASSWORD`: JimBob123!
- `INVALID_EMAIL`: invalid@example.com
- `INVALID_PASSWORD`: WrongPassword123!

## Expected Results

### Health Check
- ✅ Server responds with 200 status
- ✅ Application is accessible at http://localhost:3000

### Valid Login
- ✅ Status: 200 or 302 (redirect)
- ✅ Authenticates user
- ✅ Redirects to home page
- ✅ Response time < 2 seconds

### Invalid Login
- ✅ Status: 400 or 401
- ✅ Does not authenticate user
- ✅ Returns error response

### Validation
- ✅ Rejects empty email
- ✅ Rejects empty password
- ✅ Rejects invalid email format
- ✅ Returns appropriate status codes

## Troubleshooting

### Tests fail to connect
- Ensure frontend server is running: `npm run dev`
- Check that port 3000 is accessible
- Verify no firewall blocking localhost:3000

### Login tests fail with "Invalid credentials"
- Confirm test user exists in backend
- Verify correct email and password in test file
- Check backend database has the test user

### Tests timeout
- Ensure server startup is complete (wait for "Server running" message)
- Check for any blocking operations in the application
- Increase timeout if server is slow (adjust test file)

### Port already in use
- Find process using port 3000: `lsof -i :3000`
- Kill the process or use a different port
- Update `BASE_URL` in test file if using different port

## Adding New Integration Tests

When adding new integration tests:

1. Create a new file in `test-automation/integration/` named `*.integration.test.ts`
2. Import Vitest globals: `describe`, `it`, `expect`, `beforeAll`, `afterAll`
3. Test real HTTP endpoints against running server
4. Include health checks and error cases
5. Use clear, descriptive test names
6. Add documentation comments

## Best Practices

1. **Keep tests independent** - Each test should be self-contained
2. **Use realistic data** - Test with actual credentials and scenarios
3. **Test error cases** - Validate handling of invalid inputs
4. **Check status codes** - Verify appropriate HTTP responses
5. **Measure performance** - Ensure reasonable response times
6. **Clean output** - Use descriptive test names and assertions

## Integration with CI/CD

These tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Start server
  run: npm run dev &
  
- name: Wait for server
  run: sleep 5
  
- name: Run integration tests
  run: npm run test:integration
```

## Comparison with Other Test Types

| Test Type | Speed | Coverage | Complexity |
|-----------|-------|----------|-----------|
| Unit Tests | ⚡⚡⚡ Fast | 🎯 Focused | 💡 Simple |
| Integration Tests | ⚡⚡ Medium | 🎯 Realistic | 💡 Moderate |
| E2E Tests (Playwright) | ⚡ Slow | 🎯 Complete | 💡 Complex |

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
