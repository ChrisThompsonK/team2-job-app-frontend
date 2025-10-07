# Branch Reorganization Guide

## Current Situation
The `add-job-role-ui-only` branch contains multiple types of changes mixed together:
- Job role UI features (add job role form, delete button)
- Dark mode functionality
- Header/Footer design changes
- Environment variables setup
- README updates
- Biome configuration changes

## Goal
Separate these changes into focused branches for easier review and merging.

## Recommended Branch Structure

### Branch 1: `dark-mode-functionality`
**Purpose**: Dark mode toggle and related functionality  
**Files to include**:
- `public/js/accessibility.js` (dark mode logic)
- `public/kainos-dark-bg.png` (dark logo)
- `src/views/templates/header.njk` (dark mode button in header)
- `src/styles/input.css` (dark mode CSS - if modified)
- `tailwind.config.js` (dark mode configuration - if modified)
- `biome.json` (CSS rule exceptions for dark mode)

### Branch 2: `environment-variables-setup`
**Purpose**: Environment configuration system  
**Files to include**:
- `.env` 
- `.env.example`
- `.env.production.example`
- `src/config/environment.ts`
- `src/index.ts` (environment config integration)
- `docs/ENVIRONMENT_SETUP.md`
- `docs/CONFIGURATION_CHANGES.md`
- `docs/app-configuration.md`

### Branch 3: `add-job-role-form`
**Purpose**: Add new job role functionality  
**Files to include**:
- `src/views/job-role-list.njk` (add job role modal and form ONLY - not delete button)
- `src/plans/add-role.md`

### Branch 4: `delete-job-role-button`
**Purpose**: Delete job role functionality  
**Files to include**:
- `src/views/job-role-list.njk` (delete button and confirmation logic ONLY)

### Branch 5: `footer-social-links`
**Purpose**: Footer design updates  
**Files to include**:
- `src/views/templates/footer.njk`

### Branch 6: `readme-updates`
**Purpose**: Documentation updates  
**Files to include**:
- `README.md`

## Step-by-Step Instructions

### Step 1: Create the Dark Mode Branch
```bash
# Start from main
git checkout main

# Create new branch
git checkout -b dark-mode-functionality

# Copy specific files from add-job-role-ui-only
git checkout add-job-role-ui-only -- public/js/accessibility.js
git checkout add-job-role-ui-only -- public/kainos-dark-bg.png
git checkout add-job-role-ui-only -- src/views/templates/header.njk
git checkout add-job-role-ui-only -- tailwind.config.js
git checkout add-job-role-ui-only -- biome.json

# Commit the changes
git add .
git commit -m "Add dark mode functionality with header toggle"
```

### Step 2: Create the Environment Variables Branch
```bash
# Start from main
git checkout main

# Create new branch
git checkout -b environment-variables-setup

# Copy environment files
git checkout add-job-role-ui-only -- .env
git checkout add-job-role-ui-only -- .env.example
git checkout add-job-role-ui-only -- .env.production.example
git checkout add-job-role-ui-only -- src/config/
git checkout add-job-role-ui-only -- docs/ENVIRONMENT_SETUP.md
git checkout add-job-role-ui-only -- docs/CONFIGURATION_CHANGES.md
git checkout add-job-role-ui-only -- docs/app-configuration.md

# Update src/index.ts (only environment-related changes)
# You may need to manually edit this file to include only env config changes

# Commit the changes
git add .
git commit -m "Add environment variables configuration system"
```

### Step 3: Create the Add Job Role Branch
```bash
# Start from main
git checkout main

# Create new branch
git checkout -b add-job-role-form

# Copy the job-role-list.njk file
git checkout add-job-role-ui-only -- src/views/job-role-list.njk

# Now you need to manually edit src/views/job-role-list.njk to REMOVE the delete button
# Keep only the "Add Job Role" button and modal

# Also copy the planning doc
git checkout add-job-role-ui-only -- src/plans/add-role.md

# Commit the changes
git add .
git commit -m "Add job role form with validation"
```

### Step 4: Create the Delete Button Branch
```bash
# Start from the add-job-role-form branch (since delete depends on it)
git checkout add-job-role-form

# Create new branch
git checkout -b delete-job-role-button

# Copy the full job-role-list.njk from add-job-role-ui-only
git checkout add-job-role-ui-only -- src/views/job-role-list.njk

# The difference between this and add-job-role-form is the delete button

# Commit the changes
git add .
git commit -m "Add delete job role button with confirmation dialog"
```

### Step 5: Create Footer Updates Branch
```bash
# Start from main
git checkout main

# Create new branch
git checkout -b footer-social-links

# Copy footer
git checkout add-job-role-ui-only -- src/views/templates/footer.njk

# Commit the changes
git add .
git commit -m "Update footer with X (Twitter) and Facebook social links"
```

### Step 6: Create README Updates Branch
```bash
# Start from main
git checkout main

# Create new branch
git checkout -b readme-updates

# Copy README
git checkout add-job-role-ui-only -- README.md

# Commit the changes
git add .
git commit -m "Update README with new features documentation"
```

## Alternative: Automated Script

Instead of manually running all these commands, you can run this script:

```bash
#!/bin/bash

# Save this as reorganize-branches.sh and run: bash reorganize-branches.sh

# Dark Mode Branch
git checkout main
git checkout -b dark-mode-functionality
git checkout add-job-role-ui-only -- public/js/accessibility.js public/kainos-dark-bg.png src/views/templates/header.njk tailwind.config.js biome.json
git add .
git commit -m "Add dark mode functionality with header toggle"

# Environment Variables Branch
git checkout main
git checkout -b environment-variables-setup
git checkout add-job-role-ui-only -- .env .env.example .env.production.example src/config/ docs/ENVIRONMENT_SETUP.md docs/CONFIGURATION_CHANGES.md docs/app-configuration.md
git add .
git commit -m "Add environment variables configuration system"

# Footer Branch
git checkout main
git checkout -b footer-social-links
git checkout add-job-role-ui-only -- src/views/templates/footer.njk
git add .
git commit -m "Update footer with X (Twitter) and Facebook social links"

# README Branch
git checkout main
git checkout -b readme-updates
git checkout add-job-role-ui-only -- README.md
git add .
git commit -m "Update README with new features documentation"

echo "Branches created successfully!"
echo "Note: You'll need to manually split the job-role-list.njk changes"
```

## What to Do with `add-job-role-ui-only`

After creating all the new branches:
1. Keep `add-job-role-ui-only` as a backup
2. Or delete it: `git branch -D add-job-role-ui-only`
3. The original remote branch can stay as is or be deleted from GitHub

## Current Branch Status

- `adding-delete-button-no-functionality` - Already exists, contains delete button work from today
- `add-job-role-ui-only` - Original mixed branch (backup/reference)

## Recommendation

The simplest approach right now:
1. Keep `adding-delete-button-no-functionality` as is (it has today's delete button work)
2. Create a new `dark-mode-and-design` branch with just the design changes
3. Keep `add-job-role-ui-only` for reference but don't push more changes to it

Would you like me to execute this simpler plan?
