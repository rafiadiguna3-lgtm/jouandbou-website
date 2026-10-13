import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { glbIds, mobileAsset } from '../site/glb-assets.mjs';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root));
const manifest = JSON.parse(await read('docs/source-manifest.json'));
test('published frontend and asset bytes match recorded source', async () => {
  assert.ok(manifest.files.length > 800);
  for (const file of manifest.files) {
    const bytes = await read(`site/${file.path}`);
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, file.path);
    assert.ok(file.source_urls.length, `No provenance: ${file.path}`);
  }
});
test('all 25 interactive houses have complete GPU and software-fallback geometry', async () => {
  const ids = [...new Set([29, 0, 9, 13, 44, ...glbIds])];
  assert.equal(ids.length, 25);
  for (const id of ids) for (const asset of [mobileAsset(id), `gpu-${mobileAsset(id)}`]) {
    const meta = JSON.parse(await read(`site/assets/${asset}.json`));
    const raw = await read(`site/assets/${asset}.bin`);
    const buffer = meta.compressed ? gunzipSync(raw) : raw;
    assert.equal(buffer.length, meta.vertexCount * 16 + (meta.indexCount || 0) * 4, asset);
    assert.ok(meta.ranges.length > 0, asset);
    for (const range of meta.ranges) assert.ok(range.start + range.count <= (meta.indexCount || meta.vertexCount), asset);
  }
});
test('each published film manifest has every nonempty media fragment', async () => {
  const films = manifest.files.filter(f => f.path.endsWith('/film-hq/manifest.json'));
  assert.ok(films.length >= 2);
  for (const film of films) {
    const meta = JSON.parse(await read(`site/${film.path}`));
    assert.ok(meta.mime.startsWith('video/mp4'));
    assert.ok(meta.parts.length > 0);
    for (const part of meta.parts) {
      assert.ok((await read(`site/${film.path.replace('manifest.json', part)}`)).length > 0, `${film.path}/${part}`);
    }
  }
});
test('all responsive photograph variants and construction progress photos exist', async () => {
  const { photoVariants } = await import('../site/photo-variants.mjs');
  const empty = [];
  for (const [source, variants] of Object.entries(photoVariants)) {
    for (const path of [source, ...Object.values(variants)]) if (!(await read(`site/${path}`)).length) empty.push(path);
  }
  assert.deepEqual([...new Set(empty)], [], 'Empty photographs in the published source; supply originals.');
  const progress = JSON.parse(await read('site/assets/jh39/progress/manifest.json'));
  for (const item of progress.items) assert.ok((await read(`site/${item.src}`)).length > 0, item.src);
});
