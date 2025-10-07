# Add Job Role Feature Plan

## Overview
Implementation plan for adding a new job role feature with admin UI for creating job roles. This feature will be UI-only initially, with no backend integration required.

## Database Schema Reference
Based on the `job_roles` table schema:
- `id` (integer, auto-generated)
- `job_role_name` (text, required)
- `description` (text, required)
- `responsibilities` (text, required)
- `job_spec_link` (text, required)
- `location` (text, required)
- `capability` (text, required)
- `band` (text, required)
- `closing_date` (integer, required)
- `status` (text, default: 'active')
- `number_of_open_positions` (integer, default: 1)
- `created_at` (integer, auto-generated)
- `updated_at` (integer, auto-generated)

## Task Breakdown

### 1. Design Add Job-Role Button UI
**File:** `src/views/job-role-list.njk`
- Add an "Add New Job Role" button in the header section
- Position it prominently near the job roles count
- Style it to match the existing design system
- Make it visible only to admin users (placeholder logic)

### 2. Implement Pop-up Modal for Job-Role Entry
**File:** `src/views/job-role-list.njk`
- Create a modal overlay with backdrop
- Design form with the following fields:
  - Job Role Name (text input)
  - Job Spec Summary (textarea)
  - SharePoint Link (URL input)
  - Responsibilities (textarea)
  - Number of Open Positions (number input, default: 1)
  - Location (dropdown)
  - Closing Date (date picker)
- Add form validation styling
- Include Save and Cancel buttons
- Make modal responsive and accessible

### 3. Integrate Button and Modal Interaction
**File:** `src/views/job-role-list.njk`
- Add JavaScript to handle:
  - Opening modal when button is clicked
  - Closing modal when cancel button or backdrop is clicked
  - Form field interactions and basic validation
  - Modal animations/transitions
- Ensure modal is initially hidden
- Add escape key support for closing modal

### 4. Update Documentation
**File:** `README.md`
- Document the new add job role UI feature
- Add notes about admin-only functionality
- Include development notes about the modal implementation
- Note that backend integration is pending

## Implementation Notes

### Styling Approach
- Use existing Tailwind CSS classes to match current design
- Maintain consistency with gradient themes (blue-600 to green-600)
- Ensure accessibility with proper focus management
- Use backdrop blur effects similar to existing header

### JavaScript Requirements
- Vanilla JavaScript (no framework dependencies)
- Event listeners for button clicks and form interactions
- Simple show/hide modal functionality
- Basic form validation feedback

### Admin Access
- For now, the button will be visible to all users
- Future implementation will add proper admin role checking
- Placeholder comment indicating where admin check should go

### Form Fields Configuration
- Text inputs for: job_role_name, sharepoint_link
- Textareas for: job_spec_summary, responsibilities
- Number input for: number_of_open_positions
- Date input for: closing_date
- Select dropdown for: location

### Responsive Design
- Modal should work on mobile devices
- Form should stack vertically on smaller screens
- Button should remain accessible on all screen sizes

## Future Enhancements (Not in Scope)
- Backend API integration for saving job roles
- Admin authentication and authorization
- Form validation with server-side checks
- Success/error message handling
- Edit existing job roles functionality
- Delete job roles functionality

## Testing Considerations
- Modal opens and closes correctly
- Form fields accept appropriate input
- Responsive design works across devices
- Accessibility features function properly
- No JavaScript errors in console