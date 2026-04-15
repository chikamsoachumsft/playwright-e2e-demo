# Playwright vs Cypress — Migration Guide

## Why Teams Migrate from Cypress

| Cypress Limitation | How Playwright Solves It |
|---|---|
| **Single-tab only** — can't test multi-tab flows, OAuth popups | First-class multi-page, multi-context support |
| **Same-origin constraint** (relaxed but still limiting) | No origin restrictions |
| **iframes are painful** — `cy.iframe()` plugin needed | `page.frameLocator()` works natively |
| **Paid parallel** — Cypress Cloud required for CI parallelism | Free `--shard` flag, split across any CI runners |
| **JS/TS only** — can't support .NET or Python teams | Supports TS/JS, Python, .NET, Java |
| **No native network-level control** — intercepts at app level | Full browser-level network interception |
| **Component testing lock-in** — framework-specific runners | Component testing in a real browser |

## Feature Comparison

| Feature | Cypress | Playwright |
|---|---|---|
| Multi-tab/window | No | Yes |
| iframes | Plugin (fragile) | Built-in `frameLocator()` |
| Cross-origin | Workarounds needed | No restrictions |
| Browsers | Chromium, Firefox, WebKit (experimental) | Chromium, Firefox, WebKit (stable) |
| Languages | JS/TS only | JS/TS, Python, .NET, Java |
| Parallel in CI | Cypress Cloud (paid) | Free `--shard` |
| Network mocking | `cy.intercept()` | `page.route()` |
| API testing | `cy.request()` | `request` context (full HTTP client) |
| Visual regression | Third-party / Cypress Cloud | Built-in `toHaveScreenshot()` |
| Test runner | Mocha-based | Playwright Test (built-in) |
| Retries | Built-in | Built-in |
| Time-travel debug | Cypress GUI (excellent) | Trace Viewer (excellent) |
| Watch mode | `cypress open` (interactive) | `--ui` mode (interactive) |
| In-browser execution | Yes (runs inside browser) | No (controls browser externally) |
| Dashboard/analytics | Cypress Cloud (paid) | HTML report (free), Allure, etc. |

## Key Differences in Philosophy

**Cypress** runs *inside* the browser — this gives it the time-travel debugger and fast execution but limits it to single-tab, same-origin scenarios.

**Playwright** runs *outside* the browser via protocols — this gives it unrestricted access to multi-tab, multi-origin, iframe, and download scenarios but requires `async/await`.

## Migration Path

### Syntax Mapping

| Cypress | Playwright |
|---|---|
| `cy.visit('/page')` | `await page.goto('/page')` |
| `cy.get('.btn')` | `page.locator('.btn')` |
| `cy.get('.btn').click()` | `await page.locator('.btn').click()` |
| `cy.get('input').type('text')` | `await page.locator('input').fill('text')` |
| `cy.contains('Submit')` | `page.getByText('Submit')` |
| `cy.get('.btn').should('be.visible')` | `await expect(page.locator('.btn')).toBeVisible()` |
| `cy.intercept('GET', '/api/*')` | `await page.route('/api/*', ...)` |
| `cy.request('POST', '/api')` | `const resp = await request.post('/api')` |
| `cy.wait('@alias')` | `await page.waitForResponse('/api/*')` |
| `cy.fixture('data.json')` | `JSON.parse(fs.readFileSync('fixtures/data.json'))` |
| `beforeEach(() => { ... })` | `test.beforeEach(async ({ page }) => { ... })` |

### Key Mindset Shift
- **Everything is `async/await`** — Cypress chains are synchronous-looking; Playwright is explicitly async
- **No implicit subjects** — Cypress chains hold state; Playwright uses explicit locator variables
- **Fixtures are just files** — no special `cy.fixture()` API needed

## What Cypress Does Better
- **Interactive test runner** — `cypress open` is slightly more polished for local dev (though Playwright `--ui` mode is catching up)
- **Time-travel debugging** — stepping through commands in the GUI is very intuitive
- **Ecosystem plugins** — large plugin marketplace (though many are now unnecessary in Playwright)
- **Lower learning curve** — no `async/await` means easier onboarding for non-devs

## When NOT to Migrate
- Team is JS-only, tests are single-tab, running fine, and Cypress Cloud cost is acceptable
- Heavy investment in Cypress component testing that works well
- Small test suite (< 50 tests) where parallel execution savings don't matter
