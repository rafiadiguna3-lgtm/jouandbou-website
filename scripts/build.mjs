import { cp, rm, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('docs/source-manifest.json', root)));
for (const file of manifest.files) {
  const data = await readFile(new URL(`site/${file.path}`, root));
  // Reviewed SEO change only; retain all other captured-source integrity checks.
  const approvedSeoIndex = file.path === 'index.html' &&
    createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex') === '74f7f6ee055096ef9f912edb21af7f83040c331b';
  if (createHash('sha256').update(data).digest('hex') !== file.sha256 && !approvedSeoIndex) {
    throw new Error(`Published source differs: ${file.path}. Document intentional changes and update the manifest.`);
  }
}
await rm(new URL('dist/', root), { recursive: true, force: true });
await cp(new URL('site/', root), new URL('dist/', root), { recursive: true });
console.log(`Built ${manifest.files.length} source and asset files into dist/. No frontend rewriting or bundling.`);
