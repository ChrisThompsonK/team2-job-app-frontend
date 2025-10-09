---
applyTo: '**'
---

# Feature Implementation Standards

## Overview
All features must follow the project's MVC architecture, TypeScript best practices, and quality standards. This document defines the mandatory criteria for feature completion.

## Definition of Done (DoD)

A feature is complete ONLY when ALL criteria are met:

### 1. Architecture Compliance
- [ ] Follows MVC structure: controllers → services → models
- [ ] Controllers handle HTTP requests/responses only
- [ ] Services contain business logic and data access
- [ ] Models define TypeScript interfaces and types
- [ ] Views use Nunjucks templates with proper data binding
- [ ] Dependencies injected via constructor (no hardcoded instances)
- [ ] ES modules used exclusively (`.js` extensions in imports)

### 2. Code Quality
- [ ] TypeScript strict mode compliance (no `any` types)
- [ ] All functions have proper TypeScript types
- [ ] JSDoc comments on public methods
- [ ] Named exports (not default exports, except main app)
- [ ] Passes `npm run check` (Biome format + lint) with zero errors
- [ ] Passes `npm run type-check` with zero errors
- [ ] Line width ≤ 120 characters, 2-space indentation

### 3. Testing Requirements
- [ ] Unit tests for all new functions/methods
- [ ] Test coverage ≥ 80% for new code
- [ ] Tests use Vitest with global describe/it/expect
- [ ] Happy path and error cases covered
- [ ] External dependencies properly mocked
- [ ] All tests pass: `npm run test:run`

### 4. UI/UX (Frontend Features)
- [ ] DaisyUI components used where applicable
- [ ] Tailwind CSS v4 utilities for styling
- [ ] Responsive design (mobile-first)
- [ ] Nunjucks templates follow existing patterns
- [ ] Forms use `fieldset` + `validator` pattern
- [ ] Error messages displayed with Nunjucks filters
- [ ] Loading states implemented
- [ ] Empty states handled gracefully

### 5. Validation & Security
- [ ] All user inputs validated
- [ ] Validation logic in separate validator classes
- [ ] User-friendly error messages
- [ ] Nunjucks autoescape enabled (XSS prevention)
- [ ] No sensitive data in error responses
- [ ] Proper HTTP status codes used

### 6. Documentation
- [ ] README.md updated with new features/dependencies
- [ ] Inline comments explain complex logic (WHY, not WHAT)
- [ ] TypeScript types serve as documentation
- [ ] New scripts documented in README
- [ ] Asking the user whether they want the feature to be documented in a separate md file

### 7. Error Handling
- [ ] Try/catch blocks in all controller methods
- [ ] Services throw typed errors
- [ ] Error responses render `error.njk` template
- [ ] Console.error for server-side errors
- [ ] Graceful degradation for failures

## Implementation Workflow

### Phase 1: Planning & Design
1. **Understand Requirements**
   - Clarify all requirements and acceptance criteria
   - Identify affected layers (controllers, services, models, views)
   
2. **Design Architecture**
   - Plan controller routes and methods
   - Design service interfaces and implementations
   - Define TypeScript interfaces for data models
   - Sketch view templates structure

3. **Create Todo List**
   - Break work into logical steps
   - Mark tasks as not-started/in-progress/completed
   - Use `manage_todo_list` tool for tracking

### Phase 2: Implementation
1. **Create Models**
   - Define TypeScript interfaces in `src/models/`
   - Export with named exports
   - Use strict types (no `any`)

2. **Implement Services**
   - Create service classes in `src/services/`
   - Implement service interface
   - Add error handling
   - Use async/await for async operations

3. **Build Controllers**
   - Create controller classes in `src/controllers/`
   - Inject service dependencies via constructor
   - Use arrow functions for route handlers
   - Wrap logic in try/catch blocks
   - Render views or send JSON responses

4. **Create Views (if applicable)**
   - Build Nunjucks templates in `src/views/`
   - Use DaisyUI components
   - Add Tailwind CSS utilities
   - Handle empty and error states
   - Ensure responsive design

### Phase 3: Testing
1. **Write Unit Tests**
   - Create `.test.ts` files alongside source files
   - Test all public methods
   - Mock external dependencies
   - Aim for 80%+ coverage
   - Run `npm run test:run` to verify

2. **Manual Testing**
   - Test in development with `npm run dev`
   - Verify all user workflows
   - Test error scenarios
   - Check responsive behavior

### Phase 4: Quality Assurance
1. **Run Quality Checks**
   ```bash
   npm run type-check  # Must pass
   npm run check       # Must pass
   npm run test:run    # Must pass
   ```

2. **Update Documentation**
   - Update README.md with changes
   - Add/update JSDoc comments
   - Document new environment variables

3. **Final Review**
   - Verify all DoD criteria met
   - Check for console.log statements (remove them)
   - Ensure no commented-out code
   - Verify imports use `.js` extensions

## Code Patterns

### Controller Pattern
```typescript
import type { Request, Response } from "express";
import type { FeatureService } from "../services/feature-service.js";

export class FeatureController {
  private featureService: FeatureService;

  constructor(featureService: FeatureService) {
    this.featureService = featureService;
  }

  public getFeatures = async (_req: Request, res: Response): Promise<void> => {
    try {
      const features = await this.featureService.getFeatures();
      res.render("feature-list.njk", { features });
    } catch (error) {
      console.error("Error in FeatureController.getFeatures:", error);
      res.status(500).render("error.njk", {
        message: "Could not load features. Please try again later.",
      });
    }
  };
}
```

### Service Pattern
```typescript
import type { Feature } from "../models/feature.js";

export interface FeatureService {
  getFeatures(): Promise<Feature[]>;
  getFeatureById(id: number): Promise<Feature | null>;
}

export class FeatureMemoryService implements FeatureService {
  private features: Feature[] = [];

  public async getFeatures(): Promise<Feature[]> {
    return this.features;
  }

  public async getFeatureById(id: number): Promise<Feature | null> {
    return this.features.find(f => f.id === id) ?? null;
  }
}
```

### Model Pattern
```typescript
export interface Feature {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
}

export interface FeatureCreateRequest {
  name: string;
  description: string;
}
```

### Validator Pattern
```typescript
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class FeatureValidator {
  public validateFeature(data: FeatureData): ValidationResult {
    if (!data.name || data.name.trim().length < 3) {
      return {
        isValid: false,
        error: "Name must be at least 3 characters long.",
      };
    }

    return { isValid: true };
  }
}
```

### View Pattern (Nunjucks)
```html
{% extends "templates/layout.njk" %}

{% block content %}
<div class="container mx-auto p-4">
  {% if features.length > 0 %}
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {% for feature in features %}
          <tr>
            <td>{{ feature.name }}</td>
            <td>{{ feature.description }}</td>
          </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
  {% else %}
    <div class="alert alert-info">
      <span>No features available.</span>
    </div>
  {% endif %}
</div>
{% endblock %}
```

## Quality Gates (Must Pass)

Before completion, ALL gates must pass:

1. **Build Gate**: `npm run build` → Success
2. **Type Gate**: `npm run type-check` → 0 errors
3. **Format Gate**: `npm run check` → 0 errors
4. **Test Gate**: `npm run test:run` → All pass
5. **Coverage Gate**: New code ≥ 80% coverage
6. **Manual Gate**: Feature works in development

## Project-Specific Rules

### Imports
- Always use `.js` extensions in TypeScript imports
- Use `type` keyword for type-only imports
- Named exports preferred (except main app)

### TypeScript
- No `any` types (use `unknown` if needed)
- Enable all strict checks
- Use `interface` for object shapes
- Use `type` for unions/intersections

### Styling
- DaisyUI components first
- Tailwind utilities for customization
- Use `@theme` directive in CSS for Tailwind v4
- No inline styles

### Testing
- Global Vitest functions (no imports needed)
- Mock services/dependencies with `vi.fn()`
- Use `beforeEach` for test setup
- Descriptive test names

### Error Handling
- Controller: try/catch → render error.njk
- Service: throw errors with messages
- Views: display errors with Nunjucks filters
- Always use proper HTTP status codes

## Rejection Criteria

Features will be rejected if:
- Any quality gate fails
- Tests missing or inadequate
- Documentation not updated
- Architecture patterns violated
- TypeScript errors present
- Biome checks fail

## Enforcement

These standards are **MANDATORY**. No exceptions unless explicitly discussed and approved. This ensures:
- Consistent architecture
- Maintainable codebase
- Type safety
- Quality code
- Professional deliverables

---

**Remember**: Quality over speed. Do it right the first time.
