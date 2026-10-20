import { cp, rm, readFile } from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {assertPublicFiles} from './public-files.mjs';
import { createHash } from 'node:crypto';
import {buildProjectPages} from './build-project-pages.mjs';
const root = new URL('../', import.meta.url);
await assertPublicFiles(fileURLToPath(new URL('site/',root)));
const manifest = JSON.parse(await readFile(new URL('docs/source-manifest.json', root)));
for (const file of manifest.files) {
  const data = await readFile(new URL(`site/${file.path}`, root));
  if (createHash('sha256').update(data).digest('hex') !== file.sha256) {
    throw new Error(`Published source differs: ${file.path}. Document intentional changes and update the manifest.`);
  }
}
await rm(new URL('dist/', root), { recursive: true, force: true });
await cp(new URL('site/', root), new URL('dist/', root), { recursive: true });
await buildProjectPages(new URL('dist/',root));
await assertPublicFiles(fileURLToPath(new URL('dist/',root)));
console.log(`Copied ${manifest.files.length} verified source/assets to dist/ and generated project pages.`);
