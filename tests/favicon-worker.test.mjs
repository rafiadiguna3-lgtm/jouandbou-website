import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare/favicon-worker.mjs';

test('chooses black for Google crawlers and white for browsers without shared response caching',async()=>{
 const original=globalThis.fetch;
 try{
  for(const [agent,expected] of [['Google Favicon','solid-48-v5'],['Mozilla/5.0 (compatible; Googlebot/2.1)','solid-48-v5'],['Mozilla/5.0 Chrome/140.0','white-48-v143']]){
   let target;
   globalThis.fetch=async(input)=>{target=String(input);return new Response(new Uint8Array([137,80,78,71]));};
   const response=await worker.fetch(new Request('https://jouandbou.com/favicon.ico',{headers:{'User-Agent':agent}}));
   assert.ok(target.startsWith('https://jouandbou-test.pages.dev/assets/brand/'));assert.ok(target.includes(expected));
   assert.equal(response.status,200);assert.equal(response.headers.get('Content-Type'),'image/png');assert.match(response.headers.get('Cache-Control'),/no-store/);assert.equal(response.headers.get('Vary'),'User-Agent');
  }
 }finally{globalThis.fetch=original;}
});
test('does not replace site HTML and returns real errors instead of a blank successful image',async()=>{
 const original=globalThis.fetch;
 try{
  globalThis.fetch=async()=>new Response('site HTML');
  assert.equal(await (await worker.fetch(new Request('https://jouandbou.com/'))).text(),'site HTML');
  globalThis.fetch=async()=>new Response(null,{status:404});
  assert.equal((await worker.fetch(new Request('https://jouandbou.com/favicon.ico'))).status,502);
  assert.equal((await worker.fetch(new Request('https://jouandbou.com/favicon.ico',{method:'POST'}))).status,405);
 }finally{globalThis.fetch=original;}
});

test('HEAD and verified bot paths use the same endpoint contract',async()=>{
 const original=globalThis.fetch;
 try{
  let target,method;
  globalThis.fetch=async(input,options)=>{target=String(input);method=options.method;return new Response(null);};
  const request=new Request('https://www.jouandbou.com/favicon.ico',{method:'HEAD',headers:{'User-Agent':'crawler'}});
  Object.defineProperty(request,'cf',{value:{botManagement:{verifiedBot:true}}});
  const response=await worker.fetch(request);
  assert.ok(target.includes('solid-48-v5'));assert.equal(method,'HEAD');assert.equal(await response.text(),'');assert.equal(response.headers.get('Cloudflare-CDN-Cache-Control'),'no-store');
 }finally{globalThis.fetch=original;}
});

test('static failure fallback contains the same white tab icons',async()=>{
 const {readFile}=await import('node:fs/promises');
 const ico=await readFile('site/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
 for(let i=0;i<3;i++){
  const start=6+i*16,size=ico[start],length=ico.readUInt32LE(start+8),offset=ico.readUInt32LE(start+12);
  assert.deepEqual(ico.subarray(offset,offset+length),await readFile(`site/assets/brand/jou-and-bou-white-${size}-v143.png`));
 }
});
