# Playwright vs Selenium — Migration Guide

## Why Teams Migrate

| Pain Point in Selenium | How Playwright Solves It |
|---|---|
| **Flaky waits** — explicit/implicit waits, `Thread.sleep()` | Auto-wait built into every action; waits for element to be visible, enabled, stable |
| **Browser driver management** — ChromeDriver version mismatches | `npx playwright install` handles everything; no driver binaries to manage |
| **Slow execution** — WebDriver protocol overhead | Uses CDP (Chromium) and native protocols (Firefox/WebKit); significantly faster |
| **No built-in parallel** — need Selenium Grid or TestNG threading | Native `--workers` flag and `--shard` for CI distribution |
| **Limited debugging** — screenshots + logs only | Trace Viewer with DOM snapshots, network waterfall, action timeline |
| **No network mocking** — need proxy tools like BrowserMob | `page.route()` intercepts and mocks any request |
| **Complex setup** — Grid, Hub, Nodes, Docker Compose | Single `npm install` + `npx playwright install` |

## Feature Comparison

| Feature | Selenium 4 | Playwright |
|---|---|---|
| Protocol | WebDriver BiDi (new) / W3C WebDriver | CDP + native per-browser |
| Browsers | Chrome, Firefox, Edge, Safari (limited) | Chromium, Firefox, WebKit |
| Languages | Java, Python, C#, Ruby, JS | TS/JS, Python, .NET, Java |
| Auto-wait | No (manual waits) | Yes (every action) |
| Network interception | BiDi (experimental) | Stable, full API |
| Parallel execution | Grid / TestNG / pytest-xdist | Built-in workers + sharding |
| iframes | `switchTo().frame()` | `frameLocator()` — no context switching |
| Multiple tabs | `switchTo().window()` | First-class multi-page support |
| Shadow DOM | Complex JS execution | `locator()` pierces shadow DOM by default |
| Mobile testing | Appium (separate tool) | Device emulation (not native apps) |
| Visual testing | Third-party (Percy, Applitools) | Built-in `toHaveScreenshot()` |
| API testing | Not included | Built-in `request` context |
| Trace/debug | Screenshots, logs | Trace Viewer (DOM + network + actions) |
| Community | Massive (20+ years) | Growing fast (Microsoft-backed) |
| Grid/infra | Selenium Grid 4 | None needed (or use sharding in CI) |

## Migration Path

### 1. Gradual adoption (recommended)
Run Playwright tests alongside Selenium. No need to rewrite everything at once.

### 2. Locator mapping

| Selenium | Playwright |
|---|---|
| `driver.findElement(By.id("x"))` | `page.locator('#x')` |
| `driver.findElement(By.css(".btn"))` | `page.locator('.btn')` |
| `driver.findElement(By.xpath("//div"))` | `page.locator('//div')` |
| `driver.findElement(By.linkText("Click"))` | `page.getByRole('link', { name: 'Click' })` |
| `element.click()` | `locator.click()` — auto-waits |
| `element.sendKeys("text")` | `locator.fill('text')` — clears first |
| `WebDriverWait(...).until(...)` | Not needed — auto-wait |
| `driver.switchTo().frame(0)` | `page.frameLocator('iframe').locator(...)` |
| `driver.get("url")` | `page.goto('url')` |
| `driver.getTitle()` | `await page.title()` |

### 3. What to keep in Selenium
- **Native mobile app testing** — Playwright doesn't do native apps; keep Appium
- **Niche browsers** — If you need IE11 or Opera specifically
- **Existing large stable suites** — If it's not broken, don't migrate it

## Effort Estimate
- Simple page tests: ~30 min per test to convert
- Complex multi-frame/tab flows: ~1-2 hours per test
- Page Object Models: rewrite locators, keep business logic
- Typical 500-test suite: 3-6 weeks with a 2-person team (parallel with Selenium)

## When NOT to Migrate
- Team is deeply invested in Java/Selenium Grid ecosystem and has low flakiness
- Native mobile testing is primary use case
- Tests are stable and well-maintained (cost of migration > benefit)
