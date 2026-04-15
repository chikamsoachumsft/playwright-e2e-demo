import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests (more retries in CI)
  retries: process.env.CI ? 2 : 0,
  
  // Parallel workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['junit', { outputFile: 'results.xml' }]]
    : [['html', { open: 'on-failure' }]],

  // Shared settings for all projects
  use: {
    // Base URL for relative navigations
    baseURL: process.env.BASE_URL || 'https://todomvc.com/examples/react/dist/',

    // Collect trace on first retry (great for debugging CI failures)
    trace: 'on-first-retry',

    // Always capture screenshots (used for PR comments)
    screenshot: 'on',

    // Video on first retry
    video: 'on-first-retry',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
});
