#!/usr/bin/env node

/**
 * Initialize Test Reporting System
 * 
 * This script sets up the required directories and configuration
 * for the test reporting system to function properly.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, "../test-results"),
  path.join(__dirname, "../reports"),
  path.join(__dirname, "../coverage"),
];

console.log("🔧 Initializing test reporting system...\n");

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`✓ Directory exists: ${dir}`);
  }
});

// Create .gitkeep files to ensure directories are tracked
dirs.forEach((dir) => {
  const keepFile = path.join(dir, ".gitkeep");
  if (!fs.existsSync(keepFile)) {
    fs.writeFileSync(keepFile, "");
    console.log(`✅ Created .gitkeep: ${dir}/.gitkeep`);
  }
});

console.log("\n✅ Test reporting system initialized!");
console.log("\nNext steps:");
console.log("1. Run tests: npm run test:run");
console.log("2. View report: npm run report:view");
console.log("3. Read docs: cat scripts/TEST-REPORT-README.md");
