import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {projects} from '../site/project-catalog.mjs';

test('published projects have unique real URLs, real artwork and no unfinished placeholders',async()=>{
 assert.equal(projects.length,15);assert.equal(new Set(projects.map(p=>p.path)).size,projects.length);assert.equal(new Set(projects.map(p=>p.legacyHash)).size,projects.length);
 const sitemap=await readFile('site/sitemap.xml','utf8');
 for(const p of projects){
  assert.match(p.path,/^\/projects\/(?:bou\/)?[a-z0-9-]+\/$/);assert.ok(p.description.length>60);assert.ok(p.paragraphs.length>0);
  assert.ok(sitemap.includes(`https://jouandbou.com${p.path}`));assert.ok((await readFile('site/'+p.image)).length>0);
  const jpeg=await readFile('site/'+p.shareImage);assert.equal(jpeg.readUInt16BE(0),0xffd8);
  const html=await readFile('dist'+p.path+'index.html','utf8');assert.ok(html.includes('id="project-static-content"'));assert.ok(html.includes('href="https://jouandbou.com'+p.path+'"'));assert.ok(html.includes('max-image-preview:large'));
  assert.ok(!p.paragraphs.some(text=>/^Under construction$/i.test(text)));
 }
 const notFound=await readFile('site/404.html','utf8');assert.ok(notFound.includes('noindex,follow'));
});
