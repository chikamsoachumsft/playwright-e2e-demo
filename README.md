# Playwright Enterprise E2E Testing Research

## Context
A customer is evaluating **Playwright** as their enterprise end-to-end testing and automation tool. This workspace consolidates research, comparisons, pipeline examples, and demo code to support that conversation.

## What Is Playwright?
[Playwright](https://playwright.dev) is an open-source, Microsoft-backed browser automation framework that controls **Chromium, Firefox, and WebKit** via a single API. It supports TypeScript, JavaScript, Python, .NET, and Java.

### Why Enterprises Are Adopting It (2025–2026)
- **Auto-waiting** eliminates flaky `sleep()` calls — the #1 pain point in Selenium
- **Trace Viewer** provides post-mortem debugging with DOM snapshots, network logs, and screenshots at every step
- **Free parallel execution** via native sharding (no paid cloud tier like Cypress)
- **Codegen** (`npx playwright codegen`) records user actions → test code, lowering the bar for manual QA testers
- **Built-in visual regression**, API testing, network mocking, and accessibility testing
- **First-class CI support** — official Docker images, GitHub Actions examples, Azure DevOps tasks

## Workspace Structure

```
playwright-research/
├── README.md                          ← You are here
├── comparison/
│   ├── playwright-vs-selenium.md      ← Migration path from Selenium
│   ├── playwright-vs-cypress.md       ← Migration path from Cypress
│   └── playwright-vs-commercial.md    ← UFT, TestComplete, Tosca, etc.
├── ci-cd/
│   ├── github-actions-basic.yml       ← Simple single-runner pipeline
│   ├── github-actions-sharded.yml     ← Enterprise sharded pipeline
│   └── azure-devops-pipeline.yml      ← ADO pipeline equivalent
├── enterprise-patterns/
│   ├── auth-state-reuse.md            ← Login once, reuse across tests
│   ├── page-object-model.md           ← Scalable test architecture
│   ├── visual-regression.md           ← Screenshot comparison
│   └── accessibility-testing.md       ← axe-core integration
├── demo/
│   ├── package.json                   ← Working demo project
│   ├── playwright.config.ts           ← Multi-browser config
│   └── tests/
│       └── example.spec.ts            ← Sample test
└── customer-deck/
    └── talking-points.md              ← Key points for customer meeting
```

## Quick Start (Demo)
```bash
cd demo
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Key Links
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright Docker Images](https://mcr.microsoft.com/en-us/artifact/mar/playwright)
- [Playwright VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [Playwright Trace Viewer](https://trace.playwright.dev)
