# Backend Connection Testing Guide

## ✅ Backend Status: CONNECTED

Your backend is successfully connected and working on **http://localhost:8080**

## 🔍 How to Check Backend Connection

### Method 1: Run the Test Script (Easiest)

```bash
npx tsx src/test-backend-connection.ts
```

This will show you:
- ✅ If the backend is connected
- 📊 How many job roles were fetched
- 📄 Details of a specific job role

**Expected output when connected:**
```
✅ SUCCESS! Backend is connected.
📊 Found 12 job role(s):
  - ID: 1, Role: Senior Software Engineer
  - ID: 2, Role: Frontend Developer
  ...
```

**Expected output when NOT connected:**
```
❌ FAILED! Backend is not connected or not responding.
   Make sure your backend is running on http://localhost:8080
```

---

### Method 2: Use curl (Command Line)

Test the job roles endpoint:
```bash
curl http://localhost:8080/api/job-roles
```

Test a specific job role:
```bash
curl http://localhost:8080/api/job-roles/1
```

**Expected:** You should see JSON data with job roles

---

### Method 3: Use Your Browser

Open these URLs in your browser:
- http://localhost:8080/api/job-roles (all job roles)
- http://localhost:8080/api/job-roles/1 (specific job role)

**Expected:** You should see JSON data displayed

---

### Method 4: Check from VS Code Terminal

```bash
# Quick connection test
curl -s http://localhost:8080/api/job-roles | head -c 100

# Check if backend is responding
curl -I http://localhost:8080/api/job-roles
```

---

## 📋 Backend Data Format

The backend returns data in this format:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "jobRoleName": "Senior Software Engineer",
      "location": "Belfast, Northern Ireland",
      "capability": "Engineering",
      "band": "Senior",
      "closingDate": "2026-02-10T18:30:23.000Z",
      ...
    }
  ]
}
```

The `AxiosJobRoleService` automatically maps this to your frontend format:
- `id` → `jobRoleId`
- `jobRoleName` → `roleName`
- Extracts data from `response.data.data`

---

## 🚨 Troubleshooting

### Backend Not Connected?

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8080/api/job-roles
   ```

2. **If you get "Connection refused":**
   - Make sure your backend server is started
   - Check that it's running on port 8080
   - Verify no firewall is blocking the connection

3. **If backend is on a different port/URL:**
   Update the service constructor:
   ```typescript
   const service = new AxiosJobRoleService('http://localhost:YOUR_PORT');
   ```

4. **Check backend logs:**
   Look at your backend terminal for any errors

---

## 📊 Current Status

**Last Test Results:**
- ✅ Backend is CONNECTED on http://localhost:8080
- ✅ Found 12 job roles
- ✅ Both endpoints working:
  - GET /api/job-roles ✓
  - GET /api/job-roles/:id ✓

**Available Job Roles:**
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
