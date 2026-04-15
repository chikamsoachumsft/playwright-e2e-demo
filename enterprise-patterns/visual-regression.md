# Visual Regression Testing with Playwright

Built-in screenshot comparison — no third-party tools (Percy, Applitools) required.

## How It Works

1. First run: captures **baseline** screenshots and saves them as golden files
2. Subsequent runs: captures new screenshots and compares pixel-by-pixel
3. Diffs beyond threshold → test fails with a visual diff image

## Basic Usage

```typescript
import { test, expect } from '@playwright/test';

test('homepage visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('dashboard card visual', async ({ page }) => {
  await page.goto('/dashboard');
  const card = page.locator('.stats-card').first();
  await expect(card).toHaveScreenshot('stats-card.png');
});
```

## Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      // Allow 0.2% pixel difference (font rendering varies across OS)
      maxDiffPixelRatio: 0.002,
      // Or use absolute pixel count
      // maxDiffPixels: 100,
      // Animation threshold
      animations: 'disabled',
    },
  },
  // Generate screenshots per-project (different per browser)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],
});
```

## Updating Baselines

When the UI intentionally changes:

```bash
# Update all baselines
npx playwright test --update-snapshots

# Update specific test file baselines
npx playwright test homepage.spec.ts --update-snapshots
```

Baselines are stored in `tests/__screenshots__/` by default. **Commit these to git.**

## Handling Dynamic Content

```typescript
test('dashboard with masked dynamic areas', async ({ page }) => {
  await page.goto('/dashboard');
  
  await expect(page).toHaveScreenshot('dashboard.png', {
    // Mask elements that change (timestamps, avatars, ads)
    mask: [
      page.locator('.timestamp'),
      page.locator('.user-avatar'),
      page.locator('.live-counter'),
    ],
    // Or mask with a specific color
    maskColor: '#FF00FF',
  });
});
```

## Full-Page Screenshots

```typescript
test('full page visual', async ({ page }) => {
  await page.goto('/long-page');
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
  });
});
```

## CI Considerations

- **Cross-OS differences**: Font rendering differs between macOS/Linux/Windows. Run visual tests on a consistent OS (use Docker image in CI).
- **Store baselines per-platform**: Playwright auto-namespaces by project + platform.
- **Review diffs in CI**: Upload `test-results/` artifact — it contains the expected, actual, and diff images.

```yaml
# In GitHub Actions
- name: Upload visual diffs
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: visual-diffs
    path: test-results/
    retention-days: 7
```

## When to Use Visual Regression

| Good For | Not Great For |
|---|---|
| Marketing/landing pages | Highly dynamic dashboards |
| Design system components | Pages with live data |
| Email templates | Pages with animations |
| PDF/report rendering | Content-heavy pages that change daily |

## Alternative: Snapshot Testing (DOM)

For non-visual structural checks:

```typescript
test('table structure', async ({ page }) => {
  await page.goto('/data');
  const table = page.locator('table');
  await expect(table).toMatchAriaSnapshot(`
    - table:
      - rowgroup:
        - row "Name Email Role":
          - columnheader "Name"
          - columnheader "Email"
          - columnheader "Role"
  `);
});
```
