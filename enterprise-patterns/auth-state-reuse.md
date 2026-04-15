# Authentication State Reuse

The #1 performance optimization in enterprise Playwright suites. Login once, reuse the session across all tests.

## The Problem
Every test that starts with a login flow:
- Adds 5-15 seconds per test
- Hits the auth provider (Entra ID, Okta, etc.) hundreds of times
- Creates flakiness if the auth provider rate-limits

## The Solution: `storageState`

### 1. Create a global setup that logs in once

```typescript
// auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to app — triggers OAuth redirect
  await page.goto('/');
  
  // Fill in credentials (Entra ID example)
  await page.getByPlaceholder('Email').fill(process.env.TEST_USER_EMAIL!);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Password').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Handle "Stay signed in?" prompt
  await page.getByRole('button', { name: 'Yes' }).click();
  
  // Wait for app to load (confirms auth succeeded)
  await page.waitForURL('/dashboard');
  
  // Save auth state (cookies + localStorage)
  await page.context().storageState({ path: authFile });
});
```

### 2. Configure Playwright to use the saved state

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    // This runs first — logs in and saves state
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    
    // These run after setup — all start logged in
    {
      name: 'chromium',
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

### 3. Tests start already logged in

```typescript
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('shows dashboard after login', async ({ page }) => {
  // No login needed — storageState already has cookies
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

## Multiple Roles

```typescript
// auth.setup.ts
setup('admin auth', async ({ page }) => {
  // Login as admin
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});

setup('viewer auth', async ({ page }) => {
  // Login as viewer  
  await page.context().storageState({ path: 'playwright/.auth/viewer.json' });
});
```

```typescript
// playwright.config.ts — use different states per project
{
  name: 'admin-tests',
  use: { storageState: 'playwright/.auth/admin.json' },
  testMatch: /admin\/.*\.spec\.ts/,
  dependencies: ['setup'],
},
{
  name: 'viewer-tests',
  use: { storageState: 'playwright/.auth/viewer.json' },
  testMatch: /viewer\/.*\.spec\.ts/,
  dependencies: ['setup'],
},
```

## Important: Add to .gitignore

```
playwright/.auth/
```

Never commit auth state files — they contain session tokens.
