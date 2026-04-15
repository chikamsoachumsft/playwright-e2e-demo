# Page Object Model (POM) in Playwright

The standard pattern for organizing tests at scale. Separates page interaction logic from test assertions.

## Why POM Matters in Enterprise

- **200+ tests** become unmaintainable without it
- Locator changes affect **one file** instead of dozens
- Non-technical team members can read tests as business flows
- Enables reuse of common flows (login, navigation, forms)

## Basic Structure

```
tests/
├── pages/
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   ├── settings.page.ts
│   └── components/
│       ├── header.component.ts
│       └── data-table.component.ts
├── fixtures/
│   └── test-data.ts
├── login.spec.ts
├── dashboard.spec.ts
└── settings.spec.ts
```

## Example Page Object

```typescript
// pages/dashboard.page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly statsGrid: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.statsGrid = page.locator('[data-testid="stats-grid"]');
    this.createButton = page.getByRole('button', { name: 'Create New' });
    this.searchInput = page.getByPlaceholder('Search...');
    this.table = page.locator('table.data-table');
  }

  async goto() {
    await this.page.goto('/dashboard');
    await expect(this.heading).toBeVisible();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Wait for table to update (debounced search)
    await this.page.waitForResponse(resp =>
      resp.url().includes('/api/search') && resp.status() === 200
    );
  }

  async getRowCount() {
    return this.table.locator('tbody tr').count();
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async getStatValue(label: string) {
    return this.statsGrid
      .locator(`[data-stat="${label}"]`)
      .locator('.value')
      .textContent();
  }
}
```

## Using POM in Tests

```typescript
// dashboard.spec.ts
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard.page';

test.describe('Dashboard', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.goto();
  });

  test('shows correct heading', async () => {
    await expect(dashboard.heading).toHaveText('Dashboard');
  });

  test('search filters table results', async () => {
    await dashboard.search('project-alpha');
    const count = await dashboard.getRowCount();
    expect(count).toBeGreaterThan(0);
  });

  test('create button navigates to form', async ({ page }) => {
    await dashboard.clickCreate();
    await expect(page).toHaveURL(/\/create$/);
  });
});
```

## Reusable Components

```typescript
// pages/components/data-table.component.ts
import { type Locator } from '@playwright/test';

export class DataTable {
  constructor(private root: Locator) {}

  async getRowCount() {
    return this.root.locator('tbody tr').count();
  }

  async getCell(row: number, col: number) {
    return this.root.locator(`tbody tr:nth-child(${row}) td:nth-child(${col})`).textContent();
  }

  async sortBy(column: string) {
    await this.root.locator(`th:has-text("${column}")`).click();
  }
}
```

## Advanced: Custom Fixtures

For truly large suites, extend Playwright's `test` with auto-instantiated page objects:

```typescript
// fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { SettingsPage } from '../pages/settings.page';

type Fixtures = {
  dashboardPage: DashboardPage;
  settingsPage: SettingsPage;
};

export const test = base.extend<Fixtures>({
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
});

export { expect } from '@playwright/test';
```

```typescript
// Now tests are cleaner:
import { test, expect } from '../fixtures/test-fixtures';

test('dashboard loads', async ({ dashboardPage }) => {
  await dashboardPage.goto();
  await expect(dashboardPage.heading).toBeVisible();
});
```

## Rules of Thumb
1. **One page object per page/view** — don't over-abstract
2. **Keep assertions in tests, not page objects** — page objects return data, tests assert on it
3. **Use components for reusable UI elements** (tables, modals, forms)
4. **Don't wrap every Playwright method** — only create methods for multi-step interactions
