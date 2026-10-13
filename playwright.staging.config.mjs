import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const value = process.env.STAGING_URL;
if (!value) throw new Error('Set STAGING_URL to the actual Vercel Preview URL. Hosted staging checks have not run without it.');
const url = new URL(value);
if (url.protocol !== 'https:' || !url.hostname.endsWith('.vercel.app') || url.username || url.password || url.search || url.hash) {
  throw new Error('STAGING_URL must be an HTTPS *.vercel.app Preview URL without credentials or query tokens. Custom domains and the existing sites are out of scope.');
}
export default defineConfig({
  testDir: './tests/staging',
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: url.origin,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
      args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
    }
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/staging', open: 'never' }]]
});
