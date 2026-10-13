// Record intentional edits without erasing the original published hashes.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const path = new URL('../docs/source-manifest.json', import.meta.url);
const manifest = JSON.parse(await readFile(path));
const changes = [];
for (const file of manifest.files) {
  const bytes = await readFile(new URL(`../site/${file.path}`, import.meta.url));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== file.sha256) {
    file.published_sha256 ??= file.sha256;
    file.published_bytes ??= file.bytes;
    file.sha256 = hash; file.bytes = bytes.length;
    file.modified_locally = true;
    changes.push(file.path);
  }
}
await writeFile(path, JSON.stringify(manifest, null, 2)+'\n');
console.log('Document the reason for each intentional change in docs/migration-status.md:', changes);
