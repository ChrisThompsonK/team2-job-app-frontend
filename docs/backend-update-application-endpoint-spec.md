# Backend API Specification: Update Application Endpoint

## Overview
This document specifies the required backend endpoint for updating existing job applications. This functionality allows applicants to modify their cover letter and/or replace their CV file for applications that are still in progress.

---

## Endpoint Details

### **PUT /api/applications/:id**

Updates an existing application's cover letter and/or CV file.

---

## Request

### URL Parameters
- `id` (number, required) - The unique identifier of the application to update

### Headers
```
Content-Type: multipart/form-data
```

### Request Body (multipart/form-data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `coverLetter` | string | No | Updated cover letter text (max 5000 characters) |
| `cv` | file | No | New CV file to replace existing one (PDF, DOC, or DOCX, max 5MB) |

### Notes
- At least one field (`coverLetter` or `cv`) should be provided
- If `cv` is not provided, the existing CV should remain unchanged
- If `coverLetter` is not provided, the existing cover letter should remain unchanged
- The `applicantName` and `applicantEmail` **cannot** be changed via this endpoint

---

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": {
    "id": 3,
    "jobRoleId": 46,
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "coverLetter": "Updated cover letter text...",
    "cvFileName": "John_Doe_CV_Updated.pdf",
    "cvMimeType": "application/pdf",
    "hasCv": true,
    "status": "in progress",
    "submittedAt": "2025-10-23T10:42:23.000Z",
    "updatedAt": "2025-10-23T14:30:00.000Z",
    "jobRole": {
      "id": 46,
      "jobRoleName": "Software Engineer",
      "description": "...",
      "location": "Belfast",
      "capability": "Engineering",
      "band": "Consultant",
      "closingDate": "2026-03-04T14:54:25.000Z",
      "status": "Open"
    }
  }
}
```

---

## Error Responses

### 400 Bad Request - Invalid Data
```json
{
  "success": false,
  "message": "Invalid file type. Only PDF, DOC, and DOCX files are allowed"
}
```

### 403 Forbidden - Cannot Update
```json
{
  "success": false,
  "message": "Applications can only be updated while in 'pending', 'in progress', or 'under_review' status"
}
```

### 404 Not Found - Application Doesn't Exist
```json
{
  "success": false,
  "message": "Application not found"
}
```

### 413 Payload Too Large - File Size Exceeded
```json
{
  "success": false,
  "message": "File size exceeds maximum limit of 5MB"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while updating the application"
}
```

---

## Business Rules

1. **Editable Statuses**: Applications can only be updated if their status is:
   - `pending`
   - `in progress`
   - `under_review`

2. **Non-editable Fields**: The following fields cannot be modified via this endpoint:
   - `applicantName`
   - `applicantEmail`
   - `jobRoleId`
   - `status` (should be updated via separate workflow endpoint)

3. **File Validation**:
   - Accepted file types: PDF, DOC, DOCX
   - Maximum file size: 5MB
   - File must be valid and not corrupted

4. **Optional Fields**:
   - If `coverLetter` is not provided, keep the existing cover letter
   - If `cv` is not provided, keep the existing CV file

5. **Timestamps**:
   - `submittedAt` should remain unchanged
   - `updatedAt` should be set to the current timestamp

---

## Database Updates

When an application is updated:
1. Update the `coverLetter` field if provided
2. If a new CV is provided:
   - Store the new CV file
   - Update `cvFileName` with the new filename
   - Update `cvMimeType` with the new file's MIME type
   - Delete the old CV file (optional, for storage management)
3. Update the `updatedAt` timestamp to current time

---

## Example Request

```bash
curl -X PUT http://localhost:8000/api/applications/3 \
  -H "Content-Type: multipart/form-data" \
  -F "coverLetter=I am excited to apply for this position..." \
  -F "cv=@/path/to/updated_cv.pdf"
```

---

## Frontend Integration

The frontend will:
1. Send PUT request to `/api/applications/:id`
2. Include updated cover letter and/or new CV file
3. Handle success by redirecting to success page
4. Handle errors by displaying appropriate error messages

---

## Testing Scenarios

### Test Case 1: Update Cover Letter Only
- **Action**: Submit new cover letter without CV file
- **Expected**: Cover letter updated, CV remains unchanged

### Test Case 2: Update CV Only
- **Action**: Submit new CV file without cover letter
- **Expected**: CV replaced, cover letter remains unchanged

### Test Case 3: Update Both Fields
- **Action**: Submit new cover letter and new CV file
- **Expected**: Both fields updated successfully

### Test Case 4: Update Application with Non-Editable Status
- **Action**: Try to update application with status "accepted" or "rejected"
- **Expected**: 403 Forbidden error

### Test Case 5: Invalid File Type
- **Action**: Submit file with .txt or .jpg extension
- **Expected**: 400 Bad Request error

### Test Case 6: File Too Large
- **Action**: Submit CV file larger than 5MB
- **Expected**: 413 Payload Too Large error

### Test Case 7: Application Not Found
- **Action**: Submit update for non-existent application ID
- **Expected**: 404 Not Found error

---

## Priority
**High** - This feature is required for applicants to manage their applications effectively.

## Estimated Effort
Medium - Requires file handling, validation, and database update logic similar to the create application endpoint.

---

## Notes for Backend Team
- This endpoint is similar to the POST `/api/applications` endpoint but updates existing records
- Ensure proper authentication/authorization (applicant can only update their own applications)
- Consider implementing rate limiting to prevent abuse
- Log update actions for audit purposes
- Maintain backward compatibility with the existing application data structure
