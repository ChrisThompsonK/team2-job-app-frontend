# Axios Usage Example

This document demonstrates how to use the `AxiosJobRoleService` to fetch job roles from the backend.

## Example 1: Basic Usage with Default Backend URL

```typescript
import { AxiosJobRoleService } from "./services/axios-job-role-service.js";

async function basicExample() {
    const service = new AxiosJobRoleService();

    // Fetch all job roles
    const allRoles = await service.getJobRoles();
    console.log("All job roles:", allRoles);

    // Fetch a specific job role by ID
    const roleDetail = await service.getJobRoleById(1);
    console.log("Job role 1 details:", roleDetail);
}
```