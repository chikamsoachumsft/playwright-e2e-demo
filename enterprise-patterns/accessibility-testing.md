# Accessibility Testing with Playwright + axe-core

Automated accessibility (a11y) testing catches WCAG violations early. Playwright integrates with axe-core via `@axe-core/playwright`.

## Setup

```bash
npm install -D @axe-core/playwright
```

## Basic Usage

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no a11y violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

## Scoped Scanning

```typescript
test('navigation is accessible', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .include('nav')          // Only scan the <nav> element
    .analyze();

  expect(results.violations).toEqual([]);
});

test('form is accessible', async ({ page }) => {
  await page.goto('/settings');

  const results = await new AxeBuilder({ page })
    .include('form.settings')
    .exclude('.third-party-widget')  // Exclude elements you don't control
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## WCAG Level Targeting

```typescript
test('meets WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Handling Known Issues

```typescript
test('dashboard a11y (with known exceptions)', async ({ page }) => {
  await page.goto('/dashboard');

  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])  // Known issue, tracked in backlog
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Rich Failure Reporting

```typescript
test('full a11y audit', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  // Generate readable failure message
  const violations = results.violations.map(v => ({
    rule: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.length,
    help: v.helpUrl,
  }));

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
```

## All-Pages Audit Pattern

```typescript
const pages = ['/', '/dashboard', '/settings', '/profile', '/help'];

for (const url of pages) {
  test(`a11y: ${url}`, async ({ page }) => {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

## Built-in Playwright Assertions (no axe needed)

Playwright also has native role-based assertions:

```typescript
test('button is accessible', async ({ page }) => {
  await page.goto('/');

  // Verify element has correct ARIA role and name
  const btn = page.getByRole('button', { name: 'Submit' });
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();

  // Check tab order
  await page.keyboard.press('Tab');
  await expect(btn).toBeFocused();
});

test('form labels are correct', async ({ page }) => {
  await page.goto('/form');
  
  // getByLabel verifies label-input association
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Password').fill('secret');
});
```

## CI Integration

Run a11y tests as a separate job so they don't block the main E2E suite:

```yaml
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - run: npx playwright test --project=a11y
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: a11y-report
          path: playwright-report/
```

## Enterprise Value
- **Legal compliance**: WCAG 2.1 AA is legally required in many jurisdictions (ADA, EAA, Section 508)
- **Shift-left**: Catch violations in PR checks before they reach production
- **Automated coverage**: axe-core catches ~57% of WCAG issues automatically
- **Remaining 43%**: Requires manual testing (screen reader, keyboard navigation, cognitive load)
