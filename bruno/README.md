# Bruno Integration Tests

This directory contains integration tests for the Job App Frontend using [Bruno](https://www.usebruno.com/).

## Overview

Bruno is an API testing tool that allows you to test HTTP endpoints with a simple, git-friendly format. These tests validate the login functionality and overall application health.

## Test Files

- **health-check.bru** - Validates that the application is running and can connect to the backend
- **login-integration.bru** - Tests successful login with valid credentials
- **login-invalid-credentials.bru** - Tests that invalid credentials are rejected
- **login-validation.bru** - Tests that empty/missing credentials are validated

## Prerequisites

Before running the tests, ensure:

1. **Frontend server is running** on `http://localhost:3000`
   ```bash
   npm run dev
   ```

2. **Backend API is running** (optional but recommended)
   - The health check will show connection status
   - Login tests require a working backend with valid test users

## Running the Tests

### Run All Integration Tests
```bash
npm run test:integration
```

### Run Specific Tests
```bash
# Run only health check
npm run test:integration:health

# Run only login test
npm run test:integration:login

# Run with verbose output and HTML report
npm run test:integration:verbose
```

### Run Tests with Bruno CLI Directly
```bash
# Run all tests in the collection
npx bru run bruno

# Run a specific test file
npx bru run bruno/health-check.bru

# Run with environment variables
npx bru run bruno --env local

# Run with output file
npx bru run bruno --output results.json
```

## Using Bruno Desktop App

You can also use the Bruno desktop application for a GUI experience:

1. Download Bruno from [https://www.usebruno.com/](https://www.usebruno.com/)
2. Open the `bruno` directory as a collection
3. Run tests interactively
4. View responses and debug easily

## Test Data

The tests use the following test credentials (update as needed):

- **Valid credentials** (login-integration.bru):
  - Email: `test@example.com`
  - Password: `Password123!`

- **Invalid credentials** (login-invalid-credentials.bru):
  - Email: `invalid@example.com`
  - Password: `WrongPassword123!`

**Note**: Update these credentials in the test files to match your test environment.

## Environment Configuration

Environment variables can be configured in `bruno/environments/local.bru`:

- `baseUrl`: Frontend application URL (default: `http://localhost:3000`)
- `apiUrl`: API endpoint URL (default: `http://localhost:3000/api`)
- `backendUrl`: Backend service URL (default: `http://localhost:8080`)

## Test Structure

Each Bruno test file contains:

1. **Meta**: Test name, type, and sequence
2. **Request**: HTTP method, URL, headers, and body
3. **Assertions**: Expected response status codes
4. **Tests**: JavaScript test functions for validation
5. **Docs**: Documentation about the test

## Expected Results

### Health Check
- ✅ Status: 200
- ✅ Response: `{ "status": "ok", "backend": "connected|error|unreachable" }`

### Login Integration (Valid)
- ✅ Status: 200 or 302 (redirect)
- ✅ Session created
- ✅ Redirect to homepage

### Login Invalid Credentials
- ✅ Status: 400 or 401
- ✅ HTML response with error message
- ✅ No session created

### Login Validation (Empty Fields)
- ✅ Status: 400
- ✅ HTML response with validation errors
- ✅ No session created

## Troubleshooting

### Tests Failing?

1. **Server not running**
   - Ensure `npm run dev` is running
   - Check `http://localhost:3000` in browser

2. **Backend connection issues**
   - Health check will show backend status
   - Backend is optional for most tests

3. **Invalid credentials**
   - Update test credentials to match your environment
   - Ensure test user exists in the backend

4. **Port conflicts**
   - Ensure port 3000 is not in use by another app
   - Update `baseUrl` in environment if using different port

### Debug Mode

Run tests with verbose output:
```bash
npx bru run bruno --verbose
```

View detailed error messages and response bodies to troubleshoot issues.

## Integration with CI/CD

These tests can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run Bruno Integration Tests
  run: |
    npm run dev &
    sleep 5  # Wait for server to start
    npm run test:integration
```

## Best Practices

1. **Keep tests independent** - Each test should be self-contained
2. **Use realistic data** - Test with data that mirrors production
3. **Clean up** - Ensure tests don't leave artifacts
4. **Document changes** - Update test files when endpoints change
5. **Version control** - All test files are tracked in git

## Resources

- [Bruno Documentation](https://docs.usebruno.com/)
- [Bruno CLI Reference](https://docs.usebruno.com/cli/overview)
- [Bruno Scripting](https://docs.usebruno.com/scripting/introduction)

## Contributing

When adding new integration tests:

1. Create a new `.bru` file in this directory
2. Follow the existing naming convention
3. Add comprehensive test assertions
4. Document the test in this README
5. Update package.json if new scripts are needed
