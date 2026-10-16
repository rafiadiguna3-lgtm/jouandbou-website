import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
for(const phone of [false,true])test(`initial geometry is bounded and zoom admits visible models (${phone?'phone':'desktop'})`,async({browser})=>{
 const context=await browser.newContext({viewport:phone?{width:390,height:844}:{width:1440,height:900},hasTouch:phone,isMobile:phone});
 const page=await context.newPage(),requested=new Set();
 page.on('request',request=>{if(/\/gpu-mobile-.*\.bin\?/.test(request.url()))requested.add(request.url());});
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.demandQA={ready:engine.firstReady,state:()=>({scale:camera.scale,loaded:[...engine.modelMetas.keys()]})};'}));
 await page.goto('/');await page.waitForFunction(()=>window.demandQA);await page.evaluate(()=>window.demandQA.ready);
 await page.waitForTimeout(600); // The old queue would continue admitting houses after firstReady.
 expect(requested.size).toBe(3);expect((await page.evaluate(()=>window.demandQA.state())).loaded.sort((a,b)=>a-b)).toEqual([0,9,29]);
 for(let i=0;i<9;i++)await page.locator('#map-zoom-in').click();
 await expect.poll(()=>page.evaluate(()=>window.demandQA.state().scale)).toBeGreaterThan(6);
 await expect.poll(()=>requested.size,{timeout:15000}).toBeGreaterThan(3);
 expect(requested.size).toBeLessThan(25);
 await context.close();
});
test('hidden map defers geometry preparation until returning to projects',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/assets/gpu-mobile-*.bin?*',async route=>{await gate;await route.continue();});
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.hiddenMapQA=()=>({suspended:engine.suspended,loaded:engine.modelMetas.size});'}));
 try{
  await page.goto('/');await page.waitForFunction(()=>window.hiddenMapQA);
  await page.locator('#studio').click();await expect(page.locator('body')).toHaveClass(/view-about/);
  await expect.poll(()=>page.evaluate(()=>window.hiddenMapQA().suspended)).toBe(true);
  release();await page.waitForTimeout(600);expect(await page.evaluate(()=>window.hiddenMapQA().loaded)).toBe(0);
  await page.locator('#projects').click();await expect.poll(()=>page.evaluate(()=>window.hiddenMapQA().loaded),{timeout:15000}).toBe(3);
 }finally{release();}
});
