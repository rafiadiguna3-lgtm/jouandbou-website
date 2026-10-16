import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
for(const phone of [false,true])test(`all detailed houses load at the initial distant view (${phone?'phone':'desktop'})`,async({browser})=>{
 const context=await browser.newContext({viewport:phone?{width:390,height:844}:{width:1440,height:900},hasTouch:phone,isMobile:phone});
 const page=await context.newPage(),requested=new Set();
 page.on('request',request=>{if(/\/gpu-mobile-.*\.bin\?/.test(request.url()))requested.add(request.url());});
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.mapLoadingQA={ready:engine.ready,state:()=>({scale:camera.scale,loaded:engine.modelMetas.size,models:new Set(engine.modelMeshes.filter(mesh=>mesh.visible).map(mesh=>mesh.userData.id)).size})};'}));
 await page.goto('/');await page.waitForFunction(()=>window.mapLoadingQA);
 const initialScale=await page.evaluate(()=>window.mapLoadingQA.state().scale);
 await page.evaluate(()=>window.mapLoadingQA.ready);
 await expect.poll(()=>page.evaluate(()=>window.mapLoadingQA.state().models)).toBe(25);
 expect(requested.size).toBe(25);expect((await page.evaluate(()=>window.mapLoadingQA.state())).scale).toBe(initialScale);
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
  await page.locator('#projects').click();await expect.poll(()=>page.evaluate(()=>window.hiddenMapQA().loaded),{timeout:15000}).toBeGreaterThanOrEqual(3);
 }finally{release();}
});
