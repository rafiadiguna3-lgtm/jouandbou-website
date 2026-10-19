import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PNG} from 'pngjs';

test('share and favicon images contain an opaque black logo on white',async()=>{
 for(const [path,size] of [['jou-and-bou-share-solid-v2.png',1200],['jou-and-bou-solid-48-v2.png',48]]){
  const image=PNG.sync.read(await readFile(`site/assets/brand/${path}`));assert.equal(image.width,size);assert.equal(image.height,size);
  let black=0,white=0;
  for(let i=0;i<image.data.length;i+=4){assert.equal(image.data[i+3],255);if(image.data[i]<40&&image.data[i+1]<40&&image.data[i+2]<40)black++;if(image.data[i]>245&&image.data[i+1]>245&&image.data[i+2]>245)white++;}
  assert.ok(black>size*size*.05,`${path} cannot appear blank`);assert.ok(white>size*size*.35,`${path} retains white margins`);
 }
});
test('Cloudflare redirects only www to the canonical apex and preserves paths',async()=>{
 const rules=(await readFile('site/_redirects','utf8')).trim().split('\n').filter(line=>line&&!line.startsWith('#'));
 assert.deepEqual(rules,['https://www.jouandbou.com/* https://jouandbou.com/:splat 301']);
 const html=await readFile('site/index.html','utf8');assert.match(html,/<link rel="canonical" href="https:\/\/jouandbou.com\/"/);
 assert.ok(!rules.some(line=>line.startsWith('https://jouandbou.com/ ')),'canonical domain must not redirect to itself');
});
