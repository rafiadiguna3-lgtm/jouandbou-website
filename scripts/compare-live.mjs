// Optional reference audit. curl keeps TLS verification enabled for the cloud proxy.
import { chromium } from '@playwright/test';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
const exec = promisify(execFile), cache = new Map(), blocked = new Set();
const source = 'https://jouandbou.rafiadiguna3.chatgpt.site/';
const output = new URL('../test-results/reference/', import.meta.url);
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['node_modules/http-server/bin/http-server','dist','-p','4273','-a','127.0.0.1','-c-1'], { stdio:'ignore' });
let browser;
const result = { source, limitations: [], comparisons: [] };
try {
  for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:4273/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser = await chromium.launch({ executablePath:process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  async function verified(url) {
    if(!cache.has(url))cache.set(url,(async()=>{
      const headersPath = new URL(randomUUID()+'.headers',output);
      try {
        const { stdout } = await exec('curl',['--silent','--show-error','--fail','--location','--max-time','45','-D',headersPath.pathname,url], { encoding:'buffer',maxBuffer:100*1024*1024 });
        const headers=await readFile(headersPath,'utf8');
        return { body:stdout,contentType:[...headers.matchAll(/content-type:\s*([^\r\n]+)/ig)].at(-1)?.[1] || 'application/octet-stream' };
      } finally {await rm(headersPath,{force:true});}
    })());
    return cache.get(url);
  }
  async function pageFor(base,mobile) {
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce',serviceWorkers:'block'});
    const page=await context.newPage();
    await page.route('https://**/*',async route=>{try{await route.fulfill({status:200,...await verified(route.request().url())});}catch{blocked.add(new URL(route.request().url()).hostname);await route.abort();}});
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>performance.getEntriesByType('resource').filter(r=>/gpu-mobile-.*\.bin/.test(r.name)).length>=25,{},{timeout:60000});
    await page.waitForTimeout(1800);
    return {context,page};
  }
  for(const mobile of [false,true]) {
    const live=await pageFor(source,mobile),local=await pageFor('http://127.0.0.1:4273/',mobile);
    for(const state of ['home','about','project']) {
      for(const {page} of [live,local]) {
        if(state==='about'){await page.evaluate(()=>{location.hash='#about';});await page.waitForSelector('#about-page:not([hidden])');}
        if(state==='project') {
          await page.evaluate(()=>{location.hash='';});await page.waitForSelector('#about-page[hidden]',{state:'attached'});
          await page.locator('#search-toggle').click();await page.locator('#search').fill('Marboy');await page.locator('#results button').first().click();
          if(mobile)await page.locator('.house-callout-card').click();
          await page.waitForFunction(()=>document.querySelector('#more').textContent.includes('Project details'));
          await page.waitForSelector('#modelStatus[hidden]',{state:'attached'});
          await page.locator('#more').click();await page.waitForSelector('#marboy[open]');
        }
        await page.waitForTimeout(1500);
      }
      const name=`${mobile?'phone':'desktop'}-${state}`;
      const a=PNG.sync.read(await live.page.screenshot({path:new URL(name+'-live.png',output).pathname}));
      const b=PNG.sync.read(await local.page.screenshot({path:new URL(name+'-local.png',output).pathname}));
      const diff=new PNG({width:a.width,height:a.height});
      const count=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:.1});
      await writeFile(new URL(name+'-diff.png',output),PNG.sync.write(diff));
      const fraction=count/(a.width*a.height);result.comparisons.push({name,differentPixels:count,fraction,passed:fraction<.005});
      console.log(name,`${(fraction*100).toFixed(3)}% pixels differ`);
    }
    await live.context.close();await local.context.close();
  }
  result.limitations=[...blocked].map(host=>`HTTPS resource unavailable in this environment: ${host}`);
  await writeFile(new URL('results.json',output),JSON.stringify(result,null,2)+'\n');
  if(result.comparisons.some(c=>!c.passed))process.exitCode=1;
  console.log(JSON.stringify(result,null,2));
} finally { await browser?.close();server.kill(); }
