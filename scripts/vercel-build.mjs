// Staging preparation only. Reject Vercel Production builds before copying files.
import { spawnSync } from 'node:child_process';
if (process.env.VERCEL_ENV === 'production') {
  console.error('Production deployment blocked: this migration is approved for Vercel Preview staging only. Use a Preview deployment; do not use --prod or Promote to Production.');
  process.exit(1);
}
const result = spawnSync(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
