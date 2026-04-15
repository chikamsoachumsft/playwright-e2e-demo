# Playwright vs Commercial Testing Tools

## Tools Covered
- **Micro Focus UFT (Unified Functional Testing)** — formerly HP QTP
- **SmartBear TestComplete**
- **Tricentis Tosca**
- **Ranorex**
- **Katalon Studio**

## Why Enterprises Leave Commercial Tools

| Reason | Detail |
|---|---|
| **License cost** | UFT: ~$3,500/user/year. Tosca: $15k-80k+/year depending on modules. TestComplete: ~$5,500/node-locked |
| **Vendor lock-in** | Proprietary scripting (VBScript in UFT, Tosca modules), hard to port tests |
| **Limited CI integration** | Designed for GUI execution, bolted-on CLI/CI support |
| **Slow innovation** | Release cycles measured in months/years vs Playwright's monthly releases |
| **Heavy infrastructure** | UFT requires Windows + ALM/QC server. Tosca needs Tosca Server + DB |
| **Recruitment** | Hard to hire for VBScript/Tosca; easy to hire for TypeScript/Playwright |

## Comparison Matrix

| Feature | UFT | TestComplete | Tosca | Playwright |
|---|---|---|---|---|
| **Cost** | ~$3.5k/user/yr | ~$5.5k/node/yr | $15k-80k+/yr | Free (OSS) |
| **Languages** | VBScript | JS, Python, VBScript | Model-based (no code) | TS/JS, Python, .NET, Java |
| **Browsers** | Chrome, Firefox, Edge, IE | Chrome, Firefox, Edge | Chrome, Firefox, Edge | Chromium, Firefox, WebKit |
| **Mobile** | UFT Mobile (extra cost) | Plugin | Tosca Mobile | Device emulation only |
| **Desktop apps** | Yes (core strength) | Yes | Yes | No (web only) |
| **API testing** | UFT API (separate) | Partial | Tosca API Scan | Built-in `request` context |
| **CI/CD** | ALM integration, limited CLI | CLI available | Tosca CI, Jenkins plugin | First-class CLI, any CI |
| **Parallel exec** | ALM Lab Management | TestExecute ($$$) | Tosca Distributed Exec | Free `--shard` |
| **Containerized** | No | No | No | Official Docker images |
| **Codegen** | Record & playback | Record & playback | Model-based scan | `npx playwright codegen` |
| **Maintenance** | Object Repository | Name Mapping | Model-based (self-healing) | Locator auto-retries, codegen |
| **Reporting** | ALM reports | Built-in | Tosca dashboards | HTML report, Trace Viewer |

## What Commercial Tools Do That Playwright Doesn't

1. **Desktop application testing** — UFT, TestComplete, Tosca can all automate Win32/WPF/Java desktop apps. Playwright is web-only. For desktop, consider **WinAppDriver** or **Appium Windows**.

2. **SAP/Oracle/Mainframe testing** — UFT and Tosca have native add-ins for SAP GUI, Oracle Forms, terminal emulators. Playwright cannot test these.

3. **Codeless/model-based testing** — Tosca's model-based approach lets non-technical testers create tests. Playwright requires code (though codegen helps).

4. **Test management/ALM integration** — Commercial tools bundle test management. With Playwright, you'd need a separate tool (Azure Test Plans, Xray, TestRail).

5. **Self-healing locators** — Tosca and some tools auto-adapt when UI changes. Playwright's locators are resilient (role-based, text-based) but don't auto-heal.

## Migration Strategy

### Phase 1: New Tests in Playwright (Week 1-4)
- Install Playwright alongside existing tool
- Write all *new* tests in Playwright
- Set up CI pipeline for Playwright tests

### Phase 2: Critical Path Migration (Month 2-3)
- Identify top 50 most-run tests
- Convert to Playwright using codegen as starting point
- Validate results match commercial tool

### Phase 3: Gradual Sunset (Month 4-6)
- Convert remaining tests in priority order
- Reduce commercial licenses as tests migrate
- Keep commercial tool only for desktop/SAP if needed

### Phase 4: Full Transition (Month 6-12)
- Decommission commercial tool infrastructure
- Reinvest license savings into CI runners / team training

## ROI Calculation Template

| Item | Commercial Tool | Playwright |
|---|---|---|
| Licenses (10 users × $5k) | $50,000/yr | $0 |
| Infrastructure (servers) | $15,000/yr | $0 (runs in CI) |
| CI runners (GitHub Actions) | N/A | ~$2,000/yr (minutes) |
| Training | $5,000 (vendor training) | $2,000 (self-paced, docs are excellent) |
| Migration effort (one-time) | N/A | $30,000 (3 months × 1 engineer) |
| **Year 1 Total** | **$70,000** | **$34,000** |
| **Year 2+ Total** | **$65,000/yr** | **$2,000/yr** |

*Adjust numbers to customer's scale. Savings compound after Year 1.*
