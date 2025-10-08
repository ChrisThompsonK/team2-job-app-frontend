# Switching from JSON to Backend API

## ✅ What Changed

Your application now fetches job roles from the **backend API** instead of the local JSON file.

### Changes Made:

**File: `src/index.ts`**

**Before:**
```typescript
import { JsonJobRoleService } from "./services/job-role-service.js";

class App {
    private jobRoleService: JsonJobRoleService;
    
    constructor(config: AppConfig) {
        // ...
        this.jobRoleService = new JsonJobRoleService();
        // ...
    }
}
```

**After:**
```typescript
import { AxiosJobRoleService } from "./services/axios-job-role-service.js";

class App {
    private jobRoleService: AxiosJobRoleService;
    
    constructor(config: AppConfig) {
        // ...
        this.jobRoleService = new AxiosJobRoleService();
        // ...
    }
}
```

---

## 🧪 How to Test

### 1. Make Sure Backend is Running

First, ensure your backend is running on **http://localhost:8080**

Test with:
```bash
curl http://localhost:8080/api/job-roles
```

### 2. Start Your Frontend

```bash
npm run dev
```

### 3. Open in Browser

Navigate to:
- **http://localhost:3000/job-roles** - See all job roles from backend
- **http://localhost:3000/job-roles/1** - See specific job role details

### 4. Verify Data is from Backend

You should now see **12 job roles** from the backend:
1. Senior Software Engineer (Belfast)
2. Frontend Developer (Derry/Londonderry)
3. Product Manager (London)
4. UX/UI Designer (Birmingham)
5. Data Scientist (Dublin)
6. Cloud Infrastructure Engineer (Amsterdam)
7. Security Analyst (Frankfurt)
8. Quality Assurance Engineer (Gdańsk)
9. Business Intelligence Analyst (Indianapolis)
10. Technical Writer (Toronto)
11. Junior Software Developer (Dublin)
12. DevOps Engineer (London)

---

## 🔄 Switching Between Services

### To Use Backend API (Current):
```typescript
import { AxiosJobRoleService } from "./services/axios-job-role-service.js";
this.jobRoleService = new AxiosJobRoleService();
```

### To Use Local JSON File:
```typescript
import { JsonJobRoleService } from "./services/job-role-service.js";
this.jobRoleService = new JsonJobRoleService();
```

### To Use Different Backend URL:
```typescript
this.jobRoleService = new AxiosJobRoleService("http://localhost:8080");
// or
this.jobRoleService = new AxiosJobRoleService("https://api.yourbackend.com");
```

---

## 🚨 Troubleshooting

### Backend Data Not Showing?

1. **Check backend is running:**
   ```bash
   curl http://localhost:8080/api/job-roles
   ```

2. **Check frontend console for errors:**
   - Open browser DevTools (F12)
   - Look at Console tab for any errors

3. **Check backend logs:**
   - Look at your backend terminal for request logs

4. **Restart frontend:**
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

### Still Using Local JSON Data?

Make sure you've:
- ✅ Saved `src/index.ts`
- ✅ Restarted the dev server (`npm run dev`)
- ✅ Hard-refreshed your browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📊 Expected Behavior

### With Backend Connected:
- ✅ Shows 12 job roles
- ✅ Data includes roles from multiple countries
- ✅ Clicking on a role shows full details
- ✅ Data updates when backend changes

### Without Backend:
- ⚠️ Shows empty list or error message
- 💡 Check backend connection with: `npx tsx src/test-backend-connection.ts`

---

## 🎯 Next Steps

Now that you're connected to the backend:

1. **Add Authentication** - Protect routes with JWT tokens
2. **Add Loading States** - Show spinners while fetching data
3. **Add Error Handling** - Better error messages for users
4. **Add Caching** - Reduce API calls with client-side caching
5. **Add Filtering** - Filter job roles by location, band, etc.
