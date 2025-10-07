# ✅ Backend Connection Setup Complete

Your frontend application is now **successfully connected to the backend API using Axios**!

## What Was Changed

### 1. Created API Configuration (`src/services/api.ts`)
- **Axios instance** configured with environment variables
- Base URL: `http://localhost:8080`
- Timeout: 10 seconds
- Pre-configured endpoints for job roles API

### 2. Updated API Endpoints
Changed from `/jobs` to match backend structure:
- `GET /api/job-roles` - Get all job roles
- `GET /api/job-roles/active` - Get active job roles  
- `GET /api/job-roles/:id` - Get specific job role

### 3. Enhanced API Job Role Service (`src/services/api-job-role-service.ts`)
- Added **data mapping** to convert backend format to frontend format
- Backend uses: `{id, jobRoleName, ...}`
- Frontend uses: `{jobRoleId, roleName, ...}`
- Handles backend response wrapper: `{success: boolean, data: T}`

### 4. Updated Main Application (`src/index.ts`)
- ✅ **Switched from JSON file to API service**
- Changed: `JsonJobRoleService` → `ApiJobRoleService`
- Now fetches data from backend at `http://localhost:8080`

## Data Flow

```
Frontend App (port 3000)
    ↓
ApiJobRoleService
    ↓
Axios Client (src/services/api.ts)
    ↓
Backend API (port 8080)
    ↓
Response: {success: true, data: [...]}
    ↓
Data Mapper (converts backend → frontend format)
    ↓
Nunjucks Templates (renders UI)
```

## Field Name Mapping

| Backend Field      | Frontend Field       | Notes                    |
|--------------------|---------------------|--------------------------|
| `id`               | `jobRoleId`         | Primary key             |
| `jobRoleName`      | `roleName`          | Job title               |
| `location`         | `location`          | Same                    |
| `capability`       | `capability`        | Same                    |
| `band`             | `band`              | Same                    |
| `closingDate`      | `closingDate`       | ISO date string         |
| `status`           | `status`            | "active" or "draft"     |
| `description`      | `description`       | Full description        |
| `responsibilities` | `responsibilities`  | Key responsibilities    |
| `jobSpecLink`      | `jobSpecLink`       | Sharepoint link         |

## Current Status

✅ **Frontend running on:** http://localhost:3000  
✅ **Backend connected to:** http://localhost:8080  
✅ **Data fetching:** Live from backend API  
✅ **Type checking:** Passing  
✅ **Compilation:** Successful  
✅ **Environment variables:** Configured  

## Testing the Connection

### View in Browser
Open: http://localhost:3000/job-roles

You should see **12 job roles** fetched from the backend API, including:
- Senior Software Engineer (Belfast)
- Frontend Developer (Derry)
- Product Manager (London)
- UX/UI Designer (Birmingham)
- Data Scientist (Dublin)
- And 7 more...

### Test via Terminal
```bash
# Test backend directly
curl http://localhost:8080/api/job-roles

# Test frontend (rendered HTML)
curl http://localhost:3000/job-roles
```

## How It Works Now

1. **User visits** http://localhost:3000/job-roles
2. **Express route** calls `JobRoleController.getAllJobRoles()`
3. **Controller** calls `apiJobRoleService.getJobRoles()`
4. **Service** makes HTTP request via Axios to backend
5. **Backend responds** with `{success: true, data: [...]}`
6. **Data mapper** converts backend format to frontend format
7. **Template** renders the job roles list
8. **User sees** live data from the database

## Error Handling

The system is robust with fallback behavior:
- ✅ If backend is down → Returns empty array (no crash)
- ✅ If job role not found → Returns null  
- ✅ If network timeout → Catches error and continues
- ✅ Console logs errors for debugging

## Next Steps (Optional)

### 1. Add Loading States
Show spinners while fetching data from API

### 2. Add Error Messages  
Display user-friendly messages if backend is unavailable

### 3. Add Caching
Cache API responses to reduce backend calls

### 4. Add Retry Logic
Automatically retry failed requests

### 5. Switch Between Sources
You can easily switch back to JSON file if needed:
```typescript
// In src/index.ts
import { JsonJobRoleService } from "./services/job-role-service.js";
this.jobRoleService = new JsonJobRoleService(); // Use JSON instead
```

## Files Modified

- ✅ `src/services/api.ts` - **CREATED** - Axios configuration
- ✅ `src/services/api-job-role-service.ts` - **UPDATED** - Added data mapping
- ✅ `src/index.ts` - **UPDATED** - Uses ApiJobRoleService instead of JSON

## Environment Variables Used

```env
API_BASE_URL=http://localhost:8080
API_TIMEOUT=10000
```

## Production Deployment

When deploying to production, update `.env`:
```env
API_BASE_URL=https://api.yourcompany.com
API_TIMEOUT=15000
```

---

**🎉 Your frontend is now fully integrated with the backend using Axios!**

All data is now coming from your backend API server. The application automatically maps backend data formats to frontend formats, handles errors gracefully, and provides type-safe API calls.
