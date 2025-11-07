import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://localhost:3000';
const VALID_EMAIL = 'jimbob@example.com';
const VALID_PASSWORD = 'JimBob123!';
const INVALID_EMAIL = 'invalid@example.com';
const INVALID_PASSWORD = 'WrongPassword123!';

interface LoginResponse {
  status: number;
  redirectUrl?: string;
  isAuthenticated?: boolean;
  error?: string;
}

/**
 * Helper function to login via HTTP request
 */
async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);

  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
    redirect: 'manual', // Don't follow redirects automatically
  });

  // Status 2xx and 3xx (including redirects) indicate successful authentication
  const isAuthenticated = response.status >= 200 && response.status < 400;

  return {
    status: response.status,
    redirectUrl: response.headers.get('location') ?? undefined,
    isAuthenticated,
  };
}

/**
 * Helper function to check application health
 */
async function checkHealth(): Promise<{
  status: number;
  isHealthy: boolean;
}> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    return {
      status: response.status,
      isHealthy: response.ok,
    };
  } catch {
    return {
      status: 0,
      isHealthy: false,
    };
  }
}

describe('Login Integration Tests', () => {
  beforeAll(async () => {
    console.log('✅ Login integration test suite initialized');
  }, 30000); // 30 second timeout for beforeAll hook

  afterAll(() => {
    console.log('✅ Login integration tests completed');
  });

  describe('Health Check', () => {
    it('should have application running and accessible', async () => {
      const health = await checkHealth();
      expect(health.status).toBe(200);
      expect(health.isHealthy).toBe(true);
    });
  });

  describe('Valid Login', () => {
    it('should successfully login with valid credentials', async () => {
      const result = await loginUser(VALID_EMAIL, VALID_PASSWORD);

      expect(result.status).toBeOneOf([200, 302]);
      expect(result.isAuthenticated).toBe(true);
    });

    it('should redirect to home page on successful login', async () => {
      const result = await loginUser(VALID_EMAIL, VALID_PASSWORD);

      if (result.status === 302) {
        expect(result.redirectUrl).toBe('/');
      }
    });

    it('should return response in reasonable time', async () => {
      const startTime = Date.now();
      await loginUser(VALID_EMAIL, VALID_PASSWORD);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Invalid Login', () => {
    it('should reject login with invalid credentials', async () => {
      const result = await loginUser(INVALID_EMAIL, INVALID_PASSWORD);

      expect(result.status).toBeOneOf([400, 401]);
    });

    it('should reject login with incorrect password', async () => {
      const result = await loginUser(VALID_EMAIL, INVALID_PASSWORD);

      expect(result.status).toBeOneOf([400, 401]);
    });

    it('should reject login with non-existent email', async () => {
      const result = await loginUser(INVALID_EMAIL, VALID_PASSWORD);

      expect(result.status).toBeOneOf([400, 401]);
    });

    it('should not authenticate on failed login', async () => {
      const result = await loginUser(INVALID_EMAIL, INVALID_PASSWORD);

      expect(result.isAuthenticated).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should reject login with empty email', async () => {
      const result = await loginUser('', VALID_PASSWORD);

      expect(result.status).toBeOneOf([400, 401]);
    });

    it('should reject login with empty password', async () => {
      const result = await loginUser(VALID_EMAIL, '');

      expect(result.status).toBeOneOf([400, 401]);
    });

    it('should reject login with both fields empty', async () => {
      const result = await loginUser('', '');

      expect(result.status).toBeOneOf([400, 401]);
    });

    it('should reject login with invalid email format', async () => {
      const result = await loginUser('notanemail', VALID_PASSWORD);

      expect(result.status).toBeOneOf([400, 401]);
    });
  });

  describe('Response Format', () => {
    it('should return JSON or HTML content', async () => {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=test@test.com&password=test',
        redirect: 'manual',
      });

      const contentType = response.headers.get('content-type');
      expect(contentType).toMatch(/html|json/i);
    });

    it('should set appropriate status codes', async () => {
      const validResult = await loginUser(VALID_EMAIL, VALID_PASSWORD);
      const invalidResult = await loginUser(INVALID_EMAIL, INVALID_PASSWORD);

      // Valid should be 2xx or 3xx
      expect(validResult.status).toBeGreaterThanOrEqual(200);
      expect(validResult.status).toBeLessThan(400);

      // Invalid should be 4xx
      expect(invalidResult.status).toBeGreaterThanOrEqual(400);
      expect(invalidResult.status).toBeLessThan(500);
    });
  });
});
