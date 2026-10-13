import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)));
test('Vercel serves the static build and disables automatic deployments', () => {
  assert.equal(config.framework, null);
  assert.equal(config.installCommand, 'npm ci');
  assert.equal(config.buildCommand, 'npm run build:vercel');
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.git.deploymentEnabled, false);
  assert.ok(config.headers.some(rule => rule.headers.some(header => header.key === 'X-Robots-Tag' && header.value.includes('noindex'))));
});
test('a Vercel Production build exits with an explicit staging-only error', () => {
  const result = spawnSync(process.execPath, ['scripts/vercel-build.mjs'], {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, VERCEL_ENV: 'production' }, encoding: 'utf8'
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Production deployment blocked/);
});
