import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../cloudflare/favicon-worker.mjs';

test('returns exact black/white PNGs without upstream requests and prevents shared caching',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=()=>{throw new Error('Favicon must never fetch an upstream');};
 try{
  for(const [agent,file] of [['Google Favicon','jou-and-bou-solid-48-v5.png'],['Mozilla/5.0 (compatible; Googlebot/2.1)','jou-and-bou-solid-48-v5.png'],['Mozilla/5.0 Chrome/140.0','jou-and-bou-white-48-v143.png']]){
   const response=await worker.fetch(new Request('https://jouandbou.com/favicon.ico',{headers:{'User-Agent':agent}}));
   assert.equal(response.status,200);assert.equal(response.headers.get('Content-Type'),'image/png');
   assert.match(response.headers.get('Cache-Control'),/no-store/);assert.equal(response.headers.get('Vary'),'User-Agent');
   assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('site/assets/brand/'+file));
  }
 }finally{globalThis.fetch=original;}
});

test('HEAD and verified bots obey the same image and header contract',async()=>{
 const request=new Request('https://www.jouandbou.com/favicon.ico',{headers:{'User-Agent':'crawler'}});
 Object.defineProperty(request,'cf',{value:{botManagement:{verifiedBot:true}}});
 const response=await worker.fetch(request);
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('site/assets/brand/jou-and-bou-solid-48-v5.png'));
 const head=await worker.fetch(new Request(request,{method:'HEAD'}));
 assert.equal(head.status,200);assert.equal(await head.text(),'');assert.equal(head.headers.get('Cloudflare-CDN-Cache-Control'),'no-store');
 assert.equal((await worker.fetch(new Request(request,{method:'POST'}))).status,405);
});

test('non-favicon paths pass through and the failure fallback retains white icons',async()=>{
 const original=globalThis.fetch;
 try{globalThis.fetch=async()=>new Response('site HTML');assert.equal(await (await worker.fetch(new Request('https://jouandbou.com/'))).text(),'site HTML');}finally{globalThis.fetch=original;}
 const ico=await readFile('site/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
 for(let i=0;i<3;i++){const start=6+i*16,size=ico[start],length=ico.readUInt32LE(start+8),offset=ico.readUInt32LE(start+12);assert.deepEqual(ico.subarray(offset,offset+length),await readFile(`site/assets/brand/jou-and-bou-white-${size}-v143.png`));}
});
