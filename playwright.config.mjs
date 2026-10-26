import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 90000,
  workers: 1,
  forbidOnly: !!process.env.CI,
  use: { trace: process.env.CI ? 'retain-on-failure' : 'off', screenshot: 'only-on-failure', baseURL: 'http://127.0.0.1:4173', launchOptions: {
    executablePath: process.env.CHROMIUM_PATH || (!process.env.CI && existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  } },
  webServer: { command: 'npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
  reporter: [['list'], ['html', { open: 'never' }]]
});
