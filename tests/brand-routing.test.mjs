import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PNG} from 'pngjs';

test('share and favicon images contain an opaque black logo on white',async()=>{
 for(const [path,size] of [['jou-and-bou-share-solid-v3.png',1200],['jou-and-bou-solid-96-v4.png',96]]){
  const image=PNG.sync.read(await readFile(`site/assets/brand/${path}`));assert.equal(image.width,size);assert.equal(image.height,size);
  let black=0,white=0;
  for(let i=0;i<image.data.length;i+=4){assert.equal(image.data[i+3],255);if(image.data[i]<40&&image.data[i+1]<40&&image.data[i+2]<40)black++;if(image.data[i]>245&&image.data[i+1]>245&&image.data[i+2]>245)white++;}
  assert.ok(black>size*size*.05,`${path} cannot appear blank`);assert.ok(white>size*size*.35,`${path} retains white margins`);
 }
});
test('Cloudflare preserves canonical host paths and redirects known legacy pages',async()=>{
 const rules=(await readFile('site/_redirects','utf8')).trim().split('\n').filter(line=>line&&!line.startsWith('#'));
 assert.ok(rules.includes('https://www.jouandbou.com/* https://jouandbou.com/:splat 301'));
 for(const path of ['/jou-works/rumasoka','/jou-works/rumasoka/','https://www.jouandbou.com/jou-works/rumasoka'])assert.ok(rules.includes(`${path} https://jouandbou.com/projects/rumasoka/ 301`));
 assert.ok(rules.includes('/about-us/ https://jouandbou.com/#about 301'));
 assert.ok(!rules.some(line=>line.startsWith('/jou-works/*')),'unknown project URLs must not be redirected to arbitrary content');
 const html=await readFile('site/index.html','utf8');assert.match(html,/<link rel="canonical" href="https:\/\/jouandbou.com\/"/);
 assert.ok(!rules.some(line=>line.startsWith('https://jouandbou.com/ ')),'canonical domain must not redirect to itself');
});

test('the restored white tab PNG retains transparent surroundings',async()=>{
 const image=PNG.sync.read(await readFile('site/assets/brand/jou-and-bou-white-48-v143.png'));
 let transparent=0,white=0;
 for(let i=0;i<image.data.length;i+=4){if(image.data[i+3]===0)transparent++;if(image.data[i+3]===255&&image.data[i]>240&&image.data[i+1]>240&&image.data[i+2]>240)white++;}
 assert.ok(transparent>image.width*image.height*.3);assert.ok(white>image.width*image.height*.1);
});

test('new favicon has balanced margins and a smaller centered mark',async()=>{
 const p=PNG.sync.read(await readFile('site/assets/brand/jou-and-bou-solid-96-v4.png'));let l=96,r=0,t=96,b=0;
 for(let y=0;y<96;y++)for(let x=0;x<96;x++){const i=(y*96+x)*4;if(p.data[i]<128){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}}
 assert.ok(b-t+1<=72);assert.ok(b-t+1>=66);assert.ok(Math.abs(l-(95-r))<=1);assert.ok(Math.abs(t-(95-b))<=1);
});
