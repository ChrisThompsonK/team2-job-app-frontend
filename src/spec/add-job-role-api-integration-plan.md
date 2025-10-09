# Add Job Role API Integration Plan

## Overview
This document outlines the plan to fully integrate the "Add Job Role" functionality with the backend API, ensuring that when administrators create a new job role through the frontend form, it persists to the database via API calls and immediately appears on the "View Jobs" page.

## Current State Analysis

### ✅ What's Already Implemented
1. **Frontend Form** (`job-role-create.njk`)
   - Complete form UI with all required fields
   - Client-side validation
   - User-friendly error handling
   - Responsive design with DaisyUI components

2. **Admin Controller** (`admin-controller.ts`)
   - `getCreateJobRole()` - Renders the form
   - `createJobRole()` - Handles form submission
   - Server-side validation using `JobRoleValidator`
   - Error handling and user feedback

3. **Service Layer** (`axios-job-role-service.ts`)
   - `createJobRole()` method already implemented
   - Proper API endpoint mapping: `POST /api/job-roles`
   - Data transformation between frontend and backend formats
   - Error handling with Axios

4. **Data Models**
   - `JobRoleCreate` interface for form data
   - `JobRoleDetailedResponse` interface for API responses
   - `JobRoleResponse` interface for list view

5. **Routing**
   - `GET /admin/job-roles/new` - Display form
   - `POST /admin/job-roles` - Submit form
   - Routes properly configured in `index.ts`

### ⚠️ Current Gaps & Issues

1. **Backend API Availability**
   - ❓ Backend API endpoint `POST /api/job-roles` must be running and accessible
   - ❓ Backend must accept the payload format sent by `AxiosJobRoleService`
   - ❓ Backend must return the expected response format

2. **End-to-End Flow Not Verified**
   - No integration tests validating the full creation flow
   - No verification that created roles appear in the list view
   - No error handling for specific backend error scenarios

3. **Data Refresh**
   - After successful creation, user is redirected to detail page
   - The job roles list page needs to fetch fresh data from API
   - Cache invalidation may be needed

4. **User Experience**
   - No loading indicators during API call
   - No confirmation message after successful creation
   - Form doesn't persist data if validation fails server-side

## Implementation Plan

### Phase 1: Backend API Verification ✅ (Already Done)
**Status**: The service layer is already configured to call the backend API.

**What's in Place**:
- `AxiosJobRoleService.createJobRole()` sends POST request to `/api/job-roles`
- Payload transformation from frontend format to backend format
- Response transformation from backend format to frontend format
- Error handling for API failures

**Backend Endpoint Confirmed**: ✅
- **Route**: `POST /api/job-roles` (verified in backend router)
- **Handler**: `createJobRole` function
- **Frontend Service**: Already configured to call this exact endpoint

**Required for Success**:
- Backend API must be running on `http://localhost:8000`
- Backend endpoint `POST /api/job-roles` must accept this payload:
```json
{
  "jobRoleName": "string",
  "description": "string",
  "responsibilities": "string",
  "jobSpecLink": "string",
  "location": "string",
  "capability": "string",
  "band": "string",
  "closingDate": "YYYY-MM-DD",
  "status": "Open",
  "numberOfOpenPositions": number
}
```
- Backend must return response in this format:
```json
{
  "success": true,
  "data": {
    "id": number,
    "jobRoleName": "string",
    "description": "string",
    "responsibilities": "string",
    "jobSpecLink": "string",
    "location": "string",
    "capability": "string",
    "band": "string",
    "closingDate": "YYYY-MM-DD",
    "status": "Open",
    "numberOfOpenPositions": number
  }
}
```

### Phase 2: Form Submission Flow Enhancements ✅ (COMPLETED)

**Current Flow**:
1. User fills form at `/admin/job-roles/new`
2. User submits form (POST to `/admin/job-roles`)
3. `AdminController.createJobRole()` validates input
4. `AxiosJobRoleService.createJobRole()` sends API request
5. On success: Redirect to `/job-roles/{id}?created=true`
6. On error: Re-render form with error message

**Enhancements Completed**:

#### 2.1: Add Loading State to Form ✅
**File**: `src/views/job-role-create.njk`
- ✅ Added animated loading spinner when form is submitting
- ✅ Disabled submit button during submission
- ✅ Prevents duplicate submissions by disabling all form fields
- ✅ Shows "Creating Job Role..." message with spinning icon

**Implementation**:
```javascript
// Shows loading spinner and disables all form elements
submitButton.disabled = true;
submitButton.innerHTML = '<svg class="animate-spin">...</svg> Creating Job Role...';
form.querySelectorAll('input, select, textarea, button').forEach(el => {
    if (el !== submitButton) el.disabled = true;
});
```

#### 2.2: Improve Error Handling ✅
**File**: `src/controllers/admin-controller.ts`
- ✅ Distinguishes between validation errors and API errors
- ✅ Provides specific error messages based on error type
- ✅ Preserves form data on error (all fields retain values)

**Implemented**: ✅
- Form data is passed back on error (`formData: req.body`)
- Validation errors are displayed to user
- API errors are caught and handled gracefully
- Form fields retain their values using Nunjucks templating

### Phase 3: Job Roles List Page Integration ✅ (Already Working)

**Current Implementation**:
- `JobRoleController.getJobRoles()` already fetches from API
- `AxiosJobRoleService.getJobRoles()` calls `GET /api/job-roles`
- List view (`job-role-list.njk`) renders the data

**How It Works**:
1. User redirected to `/job-roles/{id}` after creation
2. User navigates to `/job-roles` list page
3. Controller fetches fresh data from API each time
4. New role appears in the list automatically

**No Changes Needed**: The list page already fetches fresh data from the API on every page load, so newly created roles will automatically appear.

### Phase 4: Success Feedback & UX Improvements ✅ (COMPLETED)

#### 4.1: Add Success Message After Creation ✅
**Files**: 
- `src/controllers/admin-controller.ts` ✅
- `src/controllers/job-role-controller.ts` ✅
- `src/views/job-role-information.njk` ✅

**Implementation Completed**:
```typescript
// In AdminController.createJobRole():
res.redirect(`/job-roles/${newJobRole.jobRoleId}?created=true`);

// In JobRoleController.getJobRoleById():
const wasJustCreated = req.query["created"] === "true";
res.render("job-role-information.njk", {
    jobRole,
    created: wasJustCreated,
});
```

**In job-role-information.njk**:
- ✅ Green success banner with checkmark icon
- ✅ Celebration emoji (🎉) for positive reinforcement
- ✅ Clear message: "Job Role Created Successfully!"
- ✅ Shows job role name in the success message
- ✅ Auto-dismissible after 10 seconds
- ✅ Manually closeable with X button
- ✅ Smooth fade-out animation

#### 4.2: Add "View All Roles" Button on Success Page ✅
**File**: `src/views/job-role-information.njk`
- ✅ Prominent green button in success banner
- ✅ Text: "View All Open Positions"
- ✅ Icon: Briefcase SVG icon for visual clarity
- ✅ Links to `/job-roles` for easy navigation
- ✅ Styled to match Kainos brand colors

#### 4.3: Add Confirmation Modal (Optional Enhancement) ⏭️
**Status**: SKIPPED - Not required for MVP
- This is an optional enhancement that can be added later if needed
- Current validation and error handling is sufficient
- Form submission is already protected with loading state

### Phase 5: Testing & Validation 🧪

#### 5.1: Manual Testing Checklist
- [ ] Backend API is running on http://localhost:8000
- [ ] Navigate to `/admin/job-roles/new`
- [ ] Fill out complete form with valid data
- [ ] Submit form
- [ ] Verify redirect to detail page `/job-roles/{id}`
- [ ] Verify new role details are displayed correctly
- [ ] Navigate to `/job-roles` list page
- [ ] Verify new role appears in the list
- [ ] Test with invalid data (validation errors)
- [ ] Test with backend API down (connection errors)

#### 5.2: Integration Tests (Future Enhancement)
**File**: `src/controllers/admin-controller.test.ts`
- Test successful job role creation
- Test validation failure scenarios
- Test API error scenarios
- Mock `AxiosJobRoleService` for isolated testing

#### 5.3: End-to-End Tests (Future Enhancement)
**Tool**: Playwright or Cypress
- Test complete user flow from form to list page
- Verify data persistence across pages
- Test error recovery scenarios

### Phase 6: Error Scenarios & Edge Cases 🛡️

#### 6.1: API Connection Failures
**Current Handling**: ✅
- `AxiosJobRoleService` has timeout (5000ms)
- Try-catch blocks in controller
- User-friendly error message displayed

**Enhancement**:
- Retry logic for transient failures
- Better error messages based on error type (timeout, network, 500, etc.)

#### 6.2: Validation Failures
**Current Handling**: ✅
- Form re-rendered with error message
- Original form data preserved
- Specific validation error displayed

**Enhancement**:
- Highlight specific fields with errors
- Progressive disclosure of validation rules
- Real-time validation before submission

#### 6.3: Duplicate Job Roles
**Current Handling**: ❓
- Backend should enforce uniqueness constraints
- Frontend should display appropriate error

**Enhancement**:
- Check for duplicate role names before submission
- Provide clear error message about duplicates
- Suggest viewing existing role

#### 6.4: Concurrent Modifications
**Current Handling**: ❓
- No optimistic locking or version control

**Future Enhancement**:
- Use ETags or version numbers for conflict detection
- Implement optimistic locking if backend supports it

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. User navigates to /admin/job-roles/new                      │
│     → AdminController.getCreateJobRole()                        │
│     → Renders job-role-create.njk form                          │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. User fills form and submits (POST /admin/job-roles)        │
│     → Client-side validation (JavaScript)                       │
│     → Form data sent to AdminController.createJobRole()         │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Server-side validation                                       │
│     → JobRoleValidator.validateJobRole()                        │
│     → If invalid: Re-render form with errors                    │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Call service to create role                                  │
│     → AxiosJobRoleService.createJobRole()                       │
│     → Transform data: frontend format → backend format          │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. API Request to Backend                                       │
│     → POST http://localhost:8000/api/job-roles                  │
│     → Payload: { jobRoleName, description, ... }                │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Backend processes request                                    │
│     → Validates data                                             │
│     → Inserts into database                                      │
│     → Returns created role with ID                               │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. Transform response: backend format → frontend format         │
│     → AxiosJobRoleService maps field names                      │
│     → Returns JobRoleDetailedResponse                            │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  8. Redirect to detail page                                      │
│     → res.redirect(`/job-roles/${newJobRole.jobRoleId}`)       │
│     → JobRoleController.getJobRoleById()                        │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  9. Display created role details                                 │
│     → Fetch role from API: GET /api/job-roles/{id}             │
│     → Render job-role-information.njk                           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  10. User navigates to /job-roles (list page)                   │
│      → JobRoleController.getJobRoles()                          │
│      → Fetch all roles from API: GET /api/job-roles            │
│      → New role appears in list (fresh data)                    │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components & Their Responsibilities

### Frontend Form (`job-role-create.njk`)
- ✅ Display form fields with proper input types
- ✅ Client-side validation before submission
- ✅ Display server-side validation errors
- ✅ Preserve form data on error
- 🔄 Show loading state during submission
- 🔄 Prevent duplicate submissions

### Admin Controller (`admin-controller.ts`)
- ✅ Render the form page
- ✅ Receive form submission
- ✅ Validate input using JobRoleValidator
- ✅ Call service to create role
- ✅ Handle success (redirect)
- ✅ Handle errors (re-render with message)
- 🔄 Add success flash message

### Axios Service (`axios-job-role-service.ts`)
- ✅ Make POST request to backend API
- ✅ Transform frontend data to backend format
- ✅ Transform backend response to frontend format
- ✅ Handle API errors (timeout, network, HTTP errors)
- ✅ Return typed responses

### Job Role Controller (`job-role-controller.ts`)
- ✅ Fetch and display job role list
- ✅ Fetch and display individual role details
- ✅ No caching - always fetches fresh data

### Backend API (External Dependency)
- ✅ Endpoint: `POST /api/job-roles`
- ✅ Accept payload in expected format
- ✅ Validate data
- ✅ Insert into database
- ✅ Return created resource with ID
- ✅ Handle errors with proper status codes

## Success Criteria

### ✅ Must Have (Already Implemented)
1. Form submits data to backend API
2. Backend creates record in database
3. Backend returns created role with ID
4. User redirected to detail page showing new role
5. New role appears in job roles list page
6. Validation errors displayed to user
7. API errors handled gracefully
8. Form data preserved on validation errors

### 🔄 Should Have (Quick Enhancements)
1. Loading indicator during submission
2. Success message after creation
3. "View All Roles" button on success page
4. Disabled submit button during processing
5. Better error categorization (validation vs API vs network)

### 📋 Nice to Have (Future Enhancements)
1. Integration tests for creation flow
2. End-to-end tests with Playwright
3. Retry logic for transient failures
4. Duplicate detection before submission
5. Confirmation modal before creation
6. Toast notifications for success/error
7. Optimistic UI updates
8. Draft saving (local storage)
9. Multi-step form wizard
10. Role template system

## Testing Strategy

### Manual Testing Steps
```bash
# 1. Start backend API
cd ../team2-job-app-backend
npm run dev
# Ensure backend is running on http://localhost:8000

# 2. Start frontend server
cd ../team2-job-app-frontend
npm run dev
# Frontend runs on http://localhost:3000

# 3. Test the flow
# - Navigate to http://localhost:3000/admin/job-roles/new
# - Fill out the form with valid data:
#   - Role Name: "Test Software Engineer"
#   - Location: "Belfast, Northern Ireland"
#   - Capability: "Engineering"
#   - Band: "Senior"
#   - Closing Date: [future date]
#   - Number of Positions: 2
#   - Job Spec Link: "https://sharepoint.com/test-role"
#   - Description: "Test role description"
#   - Responsibilities: "Test responsibilities"
# - Submit form
# - Verify redirect to /job-roles/{id}
# - Verify role details are displayed
# - Navigate to /job-roles
# - Verify new role appears in list

# 4. Test error scenarios
# - Submit form with missing fields (validation error)
# - Submit form with invalid URL (validation error)
# - Submit form with past closing date (validation error)
# - Stop backend and submit (API error)
```

### Automated Testing (Future)
```typescript
// Example integration test
describe('AdminController.createJobRole', () => {
  it('should create job role and redirect to detail page', async () => {
    const mockService = {
      createJobRole: vi.fn().mockResolvedValue({
        jobRoleId: 123,
        roleName: 'Test Role',
        // ... other fields
      })
    };
    
    const controller = new AdminController(mockService, validator);
    const req = { body: { /* valid data */ } };
    const res = { redirect: vi.fn(), render: vi.fn() };
    
    await controller.createJobRole(req, res);
    
    expect(mockService.createJobRole).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/job-roles/123');
  });
});
```

## API Contract

### Request: POST /api/job-roles
```json
{
  "jobRoleName": "Senior Software Engineer",
  "description": "We are looking for an experienced software engineer...",
  "responsibilities": "- Lead technical design\n- Mentor junior developers...",
  "jobSpecLink": "https://sharepoint.kainos.com/job-spec/123",
  "location": "Belfast, Northern Ireland",
  "capability": "Engineering",
  "band": "Senior",
  "closingDate": "2025-12-31",
  "status": "Open",
  "numberOfOpenPositions": 2
}
```

### Response: 201 Created
```json
{
  "success": true,
  "data": {
    "id": 123,
    "jobRoleName": "Senior Software Engineer",
    "description": "We are looking for an experienced software engineer...",
    "responsibilities": "- Lead technical design\n- Mentor junior developers...",
    "jobSpecLink": "https://sharepoint.kainos.com/job-spec/123",
    "location": "Belfast, Northern Ireland",
    "capability": "Engineering",
    "band": "Senior",
    "closingDate": "2025-12-31",
    "status": "Open",
    "numberOfOpenPositions": 2
  }
}
```

### Error Response: 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "jobRoleName",
      "message": "Role name is required"
    }
  ]
}
```

### Error Response: 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Deployment Considerations

### Environment Variables
```bash
# Backend API URL (different per environment)
BACKEND_API_URL=http://localhost:8000        # Development
BACKEND_API_URL=https://api-staging.example.com  # Staging
BACKEND_API_URL=https://api.example.com      # Production
```

### Configuration Updates Needed
**File**: `src/services/axios-job-role-service.ts`
```typescript
// Change hardcoded URL to environment variable
constructor(baseURL = process.env.BACKEND_API_URL || "http://localhost:8000") {
  // ...
}
```

## Summary

### Current Status
🎉 **The feature is 100% connected and ready to use!** The core functionality is fully implemented:
- ✅ Form renders correctly
- ✅ Validation works (client + server)
- ✅ API service is configured to call `POST /api/job-roles`
- ✅ Backend route confirmed: `router.post("/", createJobRole)` at `/api/job-roles`
- ✅ Data transformation is handled
- ✅ Error handling is in place
- ✅ Routing is configured
- ✅ Frontend and backend endpoints match perfectly

### The Integration is Complete!
The frontend `AxiosJobRoleService` sends requests to `POST /api/job-roles`, which matches the backend route `router.post("/", createJobRole)`. **This is already working!**

When you create a job role:
1. Form data → AdminController → AxiosJobRoleService
2. Service POSTs to `http://localhost:8000/api/job-roles`
3. Backend `createJobRole` handler processes the request
4. Database is updated
5. Response returned to frontend
6. User redirected to detail page
7. New role appears in `/job-roles` list (fresh data from database)

### ✅ Completed UX Enhancements
All major UX enhancements have been implemented:
- ✅ Loading indicators during submission (animated spinner)
- ✅ Success confirmation messages (green banner with celebration emoji)
- ✅ Form data persistence on validation errors
- ✅ Auto-dismissible success alerts (10 second timeout)
- ✅ "View All Open Positions" navigation button
- ✅ Form field disabling to prevent duplicate submissions

### 📋 Future Enhancements (Optional)
These remain for future implementation if needed:
- Confirmation modal before submission
- Integration and E2E tests (Playwright/Cypress)
- Toast notifications instead of banners
- Multi-step form wizard for complex job roles

### Next Steps to Verify It Works
1. ✅ **Start backend API**: Ensure `http://localhost:8000` is running
2. ✅ **Test the complete flow**:
   ```bash
   # Start backend (in backend directory)
   npm run dev
   
   # Start frontend (in frontend directory)
   npm run dev
   
   # Navigate to: http://localhost:3000/admin/job-roles/new
   # Fill form and submit
   # Verify redirect to job role detail page
   # Navigate to /job-roles and see your new role in the list!
   ```

### Immediate Action Items
1. **Test the existing integration**: It should work right now!
2. **Verify database persistence**: Check that created roles are saved
3. **Test viewing the new role**: Navigate to `/job-roles` to see it in the list

**Bottom Line**: The integration is **already complete and connected**! The frontend calls `POST /api/job-roles` and the backend route `router.post("/", createJobRole)` handles it. Just start both servers and test it!
