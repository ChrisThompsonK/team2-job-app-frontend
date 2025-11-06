# Visual Guide: Page Object Model (POM)

## The Problem & Solution

### ❌ Problem Without POM

```
Test File 1 (login.spec.ts)
├── test 1
│   └── page.locator(...) → fill → click
├── test 2
│   └── page.locator(...) → fill → click  ← DUPLICATE!
└── test 3
    └── page.locator(...) → fill → click  ← DUPLICATE!

Test File 2 (profile.spec.ts)
├── test 1
│   └── page.locator(...) → fill → click  ← DUPLICATE!
└── test 2
    └── page.locator(...) → fill → click  ← DUPLICATE!

❌ Result: Selectors scattered everywhere, hard to maintain!
```

### ✅ Solution With POM

```
LoginPage (Page Object Model)
├── emailInput (private)
├── passwordInput (private)
├── loginButton (private)
└── login(email, password) ← ONE implementation

Test File 1 (login.spec.ts)
├── test 1 → loginPage.login(...)
├── test 2 → loginPage.login(...)
└── test 3 → loginPage.login(...)

Test File 2 (profile.spec.ts)
├── test 1 → loginPage.login(...)
└── test 2 → loginPage.login(...)

✅ Result: One selector definition, used everywhere!
```

---

## The Three Layers

### Layer 1: Page Objects
Where the "magic" happens - where you interact with the UI

```typescript
// e2e/pages/LoginPage.ts
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;        // ← WHERE
  private readonly passwordInput: Locator;
  
  async login(email: string, password: string) { // ← WHAT
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
  }
}
```

### Layer 2: Tests
What you want to verify - the business scenario

```typescript
// e2e/tests/login.spec.ts
test("should login successfully", async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.login("user@test.com", "password"); // ← WHAT
  
  expect(page.url()).not.toContain("/login");        // ← VERIFY
});
```

### Layer 3: Base Page
Shared utilities used by all page objects

```typescript
// e2e/pages/BasePage.ts
export class BasePage {
  async fillField(locator: Locator, value: string) {
    await locator.fill(value);  // ← HOW
  }
  
  async clickElement(locator: Locator) {
    await locator.click();      // ← HOW
  }
}
```

---

## Anatomy of a Page Object

```typescript
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  //
  // ┌─────────────────────────────────┐
  // │ PART 1: PRIVATE LOCATORS        │
  // │ (Hidden from tests)             │
  // └─────────────────────────────────┘
  //
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  //
  // ┌─────────────────────────────────┐
  // │ PART 2: CONSTRUCTOR             │
  // │ (Initialize locators)           │
  // └─────────────────────────────────┘
  //
  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".alert-error");
  }

  //
  // ┌─────────────────────────────────┐
  // │ PART 3: PUBLIC METHODS          │
  // │ (What tests use)                │
  // └─────────────────────────────────┘
  //
  
  // Navigation
  async navigate(): Promise<void> {
    await this.goto("/login");
  }

  // User Actions
  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  // Navigation to other pages
  async goToRegister(): Promise<void> {
    await this.page.click('a[href="/register"]');
  }

  // Verification/Checks
  async verifyPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.emailInput);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.getTextContent(this.errorMessage);
  }
}
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                          TEST                                │
│                   (login.spec.ts)                            │
│                                                              │
│  test("should login", async () => {                         │
│    const loginPage = new LoginPage(page);                   │
│    await loginPage.login("user@test.com", "password")  ┐    │
│  });                                                    │    │
└────────────────────────────────────────────────────────┼────┘
                                                         │
                                                         ↓
┌──────────────────────────────────────────────────────────────┐
│                    PAGE OBJECT (LoginPage)                   │
│                                                              │
│  async login(email, password) {                             │
│    await this.fillField(emailInput, email)            ┐     │
│    await this.fillField(passwordInput, password)      │ ──┐ │
│    await this.clickElement(loginButton)               │   │ │
│  }                                                     │   │ │
│                                                        │   │ │
│  Where:                                               │   │ │
│  - emailInput = page.locator(...)           ← once!   │   │ │
│  - passwordInput = page.locator(...)        ← once!   │   │ │
│  - loginButton = page.locator(...)          ← once!   │   │ │
└────────────────────────────────────────────────┼──────┼────┘
                                                 │      │
                                                 ↓      ↓
                                   ┌─────────────────────────────┐
                                   │    PLAYWRIGHT BROWSER API   │
                                   │  (Playwright internals)     │
                                   └─────────────────────────────┘
```

---

## Comparison: Before vs After

### BEFORE: Without POM ❌

```typescript
// test 1
test("should login", async ({ page }) => {
  await page.goto("/login");
  
  const emailField = page.locator('input[name="email"]');
  const passwordField = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');
  
  await emailField.fill("test@example.com");
  await passwordField.fill("password123");
  await submitButton.click();
  
  expect(page.url()).not.toContain("/login");
});

// test 2
test("should show error on invalid email", async ({ page }) => {
  await page.goto("/login");
  
  const emailField = page.locator('input[name="email"]');      // ← DUPLICATE!
  const passwordField = page.locator('input[name="password"]'); // ← DUPLICATE!
  const submitButton = page.locator('button[type="submit"]');   // ← DUPLICATE!
  
  await emailField.fill("invalid-email");
  await passwordField.fill("password123");
  await submitButton.click();
  
  // ... more code
});

// Problems:
// ❌ Selectors repeated in every test
// ❌ If selector changes → must update all tests
// ❌ Lots of boilerplate code
// ❌ Hard to read what the test actually does
// ❌ Difficult to reuse login logic
```

### AFTER: With POM ✅

```typescript
// LoginPage object (defined once)
export class LoginPage extends BasePage {
  private readonly emailInput = page.locator('input[name="email"]');
  private readonly passwordInput = page.locator('input[name="password"]');
  private readonly loginButton = page.locator('button[type="submit"]');

  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }
}

// test 1
test("should login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login("test@example.com", "password123");
  
  expect(page.url()).not.toContain("/login");
});

// test 2
test("should show error on invalid email", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login("invalid-email", "password123");
  
  // ... more code
});

// Benefits:
// ✅ Selectors defined once in LoginPage
// ✅ Change selector → update one place
// ✅ Clean, minimal boilerplate
// ✅ Tests are super readable
// ✅ Easy to reuse login logic
```

---

## Locator Types Visualization

```
HTML Page
│
├─ By Name         input[name="email"]
│  └─ Best for: Form fields with names
│
├─ By Type         input[type="password"]
│  └─ Best for: Input types (email, password, etc)
│
├─ By ID           #loginForm
│  └─ Best for: Unique elements (but can change)
│
├─ By Class        .btn-primary
│  └─ Best for: Styled elements (but can change)
│
├─ By Test ID      [data-testid="submit"]  ← RECOMMENDED
│  └─ Best for: Stable, semantic
│
├─ By Text         button:has-text("Login")
│  └─ Best for: Accessible (but fragile)
│
└─ By Role         button[role="submit"]
   └─ Best for: Accessibility-first (semantic)

⭐ BEST: data-testid
   - Stable
   - Explicit intent
   - Not style/structure dependent
   - Easy to find for debugging
```

---

## Method Naming Convention

```typescript
// GOOD: Describes user action
async login(email, password) { }           ✅
async goToRegister() { }                   ✅
async isErrorDisplayed() { }               ✅
async submitApplicationForm(data) { }      ✅

// BAD: Describes HTML/implementation
async fillEmailAndClickLogin() { }         ❌
async clickSubmitButton() { }              ❌
async checkErrorDiv() { }                  ❌
async typeInFormFields(data) { }           ❌

Why? Tests should read like business scenarios, not code.

Good: "When user logs in with valid credentials..."
Bad: "When user clicks submit button after filling email..."
```

---

## Reusability Example

### ❌ Without POM: Selectors scattered

```typescript
// In login.spec.ts
await page.locator('input[name="email"]').fill(email);

// In profile.spec.ts
await page.locator('input[name="email"]').fill(email);

// In settings.spec.ts
await page.locator('input[name="email"]').fill(email);

If selector changes → manually update 3+ places ❌
```

### ✅ With POM: One definition

```typescript
// In LoginPage
private readonly emailInput = page.locator('input[name="email"]');
async login(email) { await this.fillField(this.emailInput, email); }

// In login.spec.ts
await loginPage.login(email);

// In profile.spec.ts
const loginPage = new LoginPage(page);
await loginPage.login(email);

// In settings.spec.ts
const loginPage = new LoginPage(page);
await loginPage.login(email);

If selector changes → update one place in LoginPage ✅
```

---

## Encapsulation Concept

```typescript
┌─────────────────────────────────────────────┐
│           EXTERNAL VIEW (Tests)             │
│                                             │
│  loginPage.login("user@test.com", "pwd")   │ ← Simple interface
│                                             │
└─────────────────────────────────────────────┘
         ↓                                ↑
    What tests see:                What tests DON'T need to know:
    Simple method name             - How many fields?
    Clear parameters               - What are the selectors?
    Predictable behavior           - How is data entered?
                                   - How are errors handled?
         ↓                                ↑
┌─────────────────────────────────────────────┐
│           INTERNAL VIEW (LoginPage)         │
│                                             │
│  private emailInput: Locator                │ ← Hidden
│  private passwordInput: Locator             │ ← Hidden
│                                             │
│  async login(email, password) {             │ ← Implementation
│    await this.fillField(emailInput, ...)   │
│    await this.fillField(passwordInput, ..) │
│  }                                          │
└─────────────────────────────────────────────┘

Encapsulation = Tests see only what they need to know!
```

---

## Project Structure Now

```
Your Project
│
├── e2e/
│   ├── README.md                  ← UPDATED: Enhanced POM docs
│   ├── POM-GUIDE.md              ← NEW: Comprehensive guide
│   ├── POM-QUICK-REFERENCE.md    ← NEW: Quick reference
│   │
│   ├── pages/
│   │   ├── BasePage.ts           ← Base class with common methods
│   │   ├── LoginPage.ts          ← Login page object
│   │   ├── JobRolesListPage.ts   ← Job roles listing page object
│   │   └── JobApplicationPage.ts ← Application form page object
│   │
│   ├── tests/
│   │   ├── login.spec.ts         ← REFACTORED: Using LoginPage POM
│   │   ├── jobRolesList.spec.ts  ← Already using POM
│   │   └── jobApplication.spec.ts ← Already using POM
│   │
│   └── fixtures/
│       ├── testData.ts
│       └── files/
│
└── POM-REFACTORING-SUMMARY.md    ← NEW: Summary of changes
```

---

## Reading Progression

1. **Get Started (5 min)**
   - This file (visual guide)
   - POM-QUICK-REFERENCE.md

2. **Understand Basics (15 min)**
   - e2e/README.md "What is POM?" section
   - Review: e2e/tests/login.spec.ts
   - Review: e2e/pages/LoginPage.ts

3. **Learn Deeply (30 min)**
   - e2e/POM-GUIDE.md
   - Study examples and best practices
   - Review other page objects

4. **Practice (ongoing)**
   - Write your own page objects
   - Refactor existing tests
   - Use as reference while coding

---

## Quick Decision Tree

```
Do you need to interact with a page element in a test?

  ├─ YES
  │  │
  │  ├─ Is there already a page object for this page?
  │  │  │
  │  │  ├─ YES → Use the existing page object method
  │  │  │        await myPage.doSomething()
  │  │  │
  │  │  └─ NO → Create a new page object
  │  │           1. Extend BasePage
  │  │           2. Add private locators
  │  │           3. Add public methods
  │  │           4. Use in tests
  │  │
  │  └─ Otherwise → Add the method to the existing page object
  │
  └─ This is the POM workflow!
```

---

## Key Differences at a Glance

| Aspect | Without POM | With POM |
|--------|------------|----------|
| **Selector location** | In tests | In page objects |
| **Duplication** | High | None |
| **Maintenance** | Hard | Easy |
| **Test readability** | Poor | Excellent |
| **Reusability** | Low | High |
| **Learning curve** | Flat | Slight |
| **Scalability** | Hard | Easy |
| **Test speed to write** | Fast initially | Slower, but faster overall |

---

## Remember This

> ✨ **POM = Encapsulation + Reusability + Clarity** ✨

- **Encapsulation**: Hide selectors, expose methods
- **Reusability**: Define once, use everywhere
- **Clarity**: Tests read like stories, not code

---

## Next Steps

1. ✅ Read this visual guide
2. 📖 Review POM-QUICK-REFERENCE.md
3. 👀 Look at refactored login.spec.ts
4. 📚 Deep dive into POM-GUIDE.md if needed
5. ✍️ Create your own page object for a new feature
6. 🎯 Keep using POM for all new tests

---

## Getting Help

- **Quick questions**: Check POM-QUICK-REFERENCE.md
- **Deep understanding**: Read POM-GUIDE.md
- **Examples**: Look at existing page objects in e2e/pages/
- **Inspiration**: Review working tests in e2e/tests/

**Happy testing! 🚀**
