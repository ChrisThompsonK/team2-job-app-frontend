# Backend API Connection Guide

This guide explains how to connect the frontend to the backend API server.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Configuration](#configuration)
3. [Using the API](#using-the-api)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Testing Connections](#testing-connections)
7. [Switching Between JSON and API](#switching-between-json-and-api)

## Quick Start

### 1. Configure Backend URL

Update your `.env` file with the backend API URL:

```env
API_BASE_URL=http://localhost:8080
API_TIMEOUT=10000
```

### 2. Use API Service

The frontend already has an API client configured. To use it:

```typescript
// Import the API service
import { ApiJobRoleService } from './services/api-job-role-service.js';

// Create an instance
const apiService = new ApiJobRoleService();

// Use it to fetch data
const jobRoles = await apiService.getJobRoles();
const jobRole = await apiService.getJobRoleById(1);
```

## Configuration

### Environment Variables

Set these in your `.env` file:

```env
# Backend API base URL (no trailing slash)
API_BASE_URL=http://localhost:8080

# Request timeout in milliseconds
API_TIMEOUT=10000
```

### API Configuration File

The API client is configured in `src/services/api.ts`:

```typescript
import axios from "axios";
import { env } from "../config/env.js";

const api = axios.create({
  baseURL: env.apiBaseUrl,        // From .env
  timeout: env.apiTimeout,        // From .env
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Using the API

### Method 1: Using API Service (Recommended)

Use the `ApiJobRoleService` class for a clean, type-safe interface:

```typescript
import { ApiJobRoleService } from './services/api-job-role-service.js';

const service = new ApiJobRoleService();

// Get all job roles
const allRoles = await service.getJobRoles();

// Get active job roles only
const activeRoles = await service.getActiveJobRoles();

// Get specific job role by ID
const role = await service.getJobRoleById(1);
```

### Method 2: Using API Client Directly

Use the `jobRolesAPI` object for direct control:

```typescript
import { jobRolesAPI } from './services/api.js';

// Get all job roles
const response = await jobRolesAPI.getAll();
const jobRoles = response.data;

// Get active job roles
const activeResponse = await jobRolesAPI.getActive();
const activeRoles = activeResponse.data;

// Get job role by ID
const roleResponse = await jobRolesAPI.getById(1);
const role = roleResponse.data;

// Create new job role
const newRole = await jobRolesAPI.create({
  roleName: "Software Engineer",
  location: "Belfast",
  // ... other fields
});

// Update existing job role
const updated = await jobRolesAPI.update(1, {
  roleName: "Senior Software Engineer"
});

// Delete job role
await jobRolesAPI.delete(1);
```

### Method 3: Using Axios Instance Directly

For custom endpoints or advanced usage:

```typescript
import api from './services/api.js';

// Custom GET request
const response = await api.get('/custom-endpoint');

// Custom POST request
const created = await api.post('/custom-endpoint', { data: 'value' });

// With query parameters
const filtered = await api.get('/jobs', {
  params: { location: 'Belfast', active: true }
});

// With custom headers
const auth = await api.get('/jobs', {
  headers: { 'Authorization': 'Bearer token' }
});
```

## API Endpoints

The following endpoints are configured:

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/jobs` | Get all job roles | None |
| `GET` | `/jobs/active` | Get active job roles | None |
| `GET` | `/jobs/:id` | Get job role by ID | `id: number` |
| `POST` | `/jobs` | Create new job role | Job role data |
| `PUT` | `/jobs/:id` | Update job role | `id: number`, Updated data |
| `DELETE` | `/jobs/:id` | Delete job role | `id: number` |

### Expected Response Format

**List of job roles** (`GET /jobs`, `GET /jobs/active`):
```json
[
  {
    "jobRoleId": 1,
    "roleName": "Software Engineer",
    "location": "Belfast",
    "capability": "Engineering",
    "band": "Consultant",
    "closingDate": "2025-12-31"
  }
]
```

**Single job role** (`GET /jobs/:id`):
```json
{
  "jobRoleId": 1,
  "roleName": "Software Engineer",
  "description": "Full description...",
  "responsibilities": "Key responsibilities...",
  "jobSpecLink": "https://...",
  "location": "Belfast",
  "capability": "Engineering",
  "band": "Consultant",
  "closingDate": "2025-12-31",
  "status": "Open",
  "numberOfOpenPositions": 3
}
```

## Error Handling

### Automatic Error Handling

The `ApiJobRoleService` automatically handles errors and returns empty arrays or null:

```typescript
const service = new ApiJobRoleService();

// Returns empty array if API fails
const roles = await service.getJobRoles();
// roles = [] if error occurs

// Returns null if not found or error
const role = await service.getJobRoleById(999);
// role = null if error occurs
```

### Manual Error Handling

For custom error handling, use try-catch:

```typescript
import { jobRolesAPI } from './services/api.js';

try {
  const response = await jobRolesAPI.getAll();
  const jobRoles = response.data;
  console.log('Successfully fetched:', jobRoles);
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('Server error:', error.response.status);
    console.error('Error data:', error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
    console.error('Check if backend is running');
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
}
```

### Common Error Scenarios

**Backend not running**:
```
Error: connect ECONNREFUSED 127.0.0.1:8080
Solution: Start the backend server
```

**Wrong API URL**:
```
Error: getaddrinfo ENOTFOUND api.example.com
Solution: Check API_BASE_URL in .env file
```

**Timeout**:
```
Error: timeout of 10000ms exceeded
Solution: Increase API_TIMEOUT or check backend performance
```

**404 Not Found**:
```
Error: Request failed with status code 404
Solution: Verify endpoint exists on backend
```

## Testing Connections

### 1. Test Backend Availability

```bash
# Test if backend is running
curl http://localhost:8080/health

# Or use the browser
open http://localhost:8080/health
```

### 2. Test API Endpoints

```bash
# Get all job roles
curl http://localhost:8080/jobs

# Get specific job role
curl http://localhost:8080/jobs/1

# Get active job roles
curl http://localhost:8080/jobs/active
```

### 3. Test from Frontend

Create a test file `src/test-api.ts`:

```typescript
import { ApiJobRoleService } from './services/api-job-role-service.js';

async function testAPI() {
  const service = new ApiJobRoleService();
  
  console.log('Testing API connection...');
  
  try {
    // Test getting all roles
    const roles = await service.getJobRoles();
    console.log(`✓ Fetched ${roles.length} job roles`);
    
    // Test getting specific role
    if (roles.length > 0) {
      const firstRole = await service.getJobRoleById(roles[0].jobRoleId);
      console.log(`✓ Fetched role details:`, firstRole?.roleName);
    }
    
    console.log('✓ API connection successful!');
  } catch (error) {
    console.error('✗ API connection failed:', error);
  }
}

testAPI();
```

Run it:
```bash
npx tsx src/test-api.ts
```

## Switching Between JSON and API

### Current Setup (JSON)

Currently using `JsonJobRoleService` in `src/index.ts`:

```typescript
import { JsonJobRoleService } from "./services/job-role-service.js";

// Using JSON file service
this.jobRoleService = new JsonJobRoleService();
```

### Switch to API

To use the backend API instead, update `src/index.ts`:

```typescript
import { ApiJobRoleService } from "./services/api-job-role-service.js";

// Using API service
this.jobRoleService = new ApiJobRoleService();
```

### Hybrid Approach (Fallback)

Use API with JSON fallback:

```typescript
import { ApiJobRoleService } from "./services/api-job-role-service.js";
import { JsonJobRoleService } from "./services/job-role-service.js";

class HybridJobRoleService implements JobRoleService {
  private apiService = new ApiJobRoleService();
  private jsonService = new JsonJobRoleService();
  
  async getJobRoles(): Promise<JobRoleResponse[]> {
    // Try API first
    const apiRoles = await this.apiService.getJobRoles();
    
    // Fallback to JSON if API returns empty
    if (apiRoles.length === 0) {
      console.log('API empty, using JSON fallback');
      return this.jsonService.getJobRoles();
    }
    
    return apiRoles;
  }
  
  async getJobRoleById(id: number): Promise<JobRoleDetailedResponse | null> {
    // Try API first
    const apiRole = await this.apiService.getJobRoleById(id);
    
    // Fallback to JSON if API returns null
    if (!apiRole) {
      console.log(`API returned null for ID ${id}, using JSON fallback`);
      return this.jsonService.getJobRoleById(id);
    }
    
    return apiRole;
  }
}

// Use hybrid service
this.jobRoleService = new HybridJobRoleService();
```

## Advanced Features

### Adding Request Interceptors

Add authentication or logging to all requests:

```typescript
// In src/services/api.ts
import axios from "axios";
import { env } from "../config/env.js";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (env.isDevelopment) {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (env.isDevelopment) {
      console.log(`← ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.error('Unauthorized - redirecting to login');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Adding Retry Logic

Automatically retry failed requests:

```typescript
import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({ /* config */ });

// Add retry logic
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status >= 500;
  }
});
```

## Troubleshooting

### CORS Issues

If you get CORS errors, the backend needs to allow your frontend origin:

**Backend needs to set**:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Connection Refused

```
✗ Check backend is running: npm run dev (in backend directory)
✗ Check API_BASE_URL matches backend port
✗ Check firewall isn't blocking the connection
```

### Timeout Issues

```
✗ Increase API_TIMEOUT in .env
✗ Check backend performance
✗ Check network connectivity
```

## Best Practices

1. **Always use environment variables** for API URLs
2. **Handle errors gracefully** - don't crash the app
3. **Add loading states** in UI during API calls
4. **Cache responses** when appropriate
5. **Use TypeScript types** for type safety
6. **Log errors** but not in production
7. **Test API connectivity** before deploying
8. **Use interceptors** for common logic
9. **Implement retry logic** for transient failures
10. **Document your endpoints** for team members

## Next Steps

1. ✅ Configure `.env` with backend URL
2. ✅ Test backend connectivity
3. ✅ Switch from JSON to API service
4. ✅ Add error handling in UI
5. ✅ Add loading states
6. ✅ Test all CRUD operations
7. ✅ Deploy and configure production URLs
