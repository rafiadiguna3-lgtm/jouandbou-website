import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
for(const phone of [false,true])test(`recognizable lightweight houses load in the visible map without full-detail downloads (${phone?'phone':'desktop'})`,async({browser})=>{
 const context=await browser.newContext({viewport:phone?{width:390,height:844}:{width:1440,height:900},hasTouch:phone,isMobile:phone});
 const page=await context.newPage(),details=new Set(),lightweight=new Set();
 page.on('request',request=>{if(/\/gpu-mobile-.*\.bin\?/.test(request.url()))details.add(request.url());if(/\/map-mobile-.*\.bin\?/.test(request.url()))lightweight.add(request.url());});
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.mapLoadingQA=()=>({scale:camera.scale,loaded:engine.lodMetas.size,visible:[29,0,9,13,44,...glbIds].filter(id=>{const p=project(world.anchors[id],camera,w,h);return p[0]>-w*.1&&p[0]<w*1.1&&p[1]>-h*.1&&p[1]<h*1.1}),lods:[...engine.lodMetas.keys()],details:engine.modelMetas.size,flight:!!cameraFlight});'}));
 await page.goto('/');await page.waitForFunction(()=>window.mapLoadingQA);
 const initialScale=await page.evaluate(()=>window.mapLoadingQA().scale);
 await page.waitForFunction(()=>{const s=window.mapLoadingQA();return s.loaded>0&&s.visible.every(id=>s.lods.includes(id));});
 expect(details.size).toBe(0);expect(lightweight.size).toBeGreaterThan(0);expect((await page.evaluate(()=>window.mapLoadingQA())).scale).toBe(initialScale);
 if(phone){expect(lightweight.size).toBeLessThan(25);await page.locator('#map-reset').click();await page.waitForFunction(()=>!window.mapLoadingQA().flight);await expect.poll(()=>page.evaluate(()=>window.mapLoadingQA().loaded)).toBe(25);}
 else{expect((await page.evaluate(()=>window.mapLoadingQA())).loaded).toBe(25);await page.locator('#labels button').first().focus();await expect(page.locator('#modelStatus')).toBeHidden();expect(details.size).toBe(0);}
 await context.close();
});
test('menu and phone copy paint before any model is available; hidden map defers geometry preparation',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/assets/map-mobile-*.bin?*',async route=>{await gate;await route.continue();});
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.hiddenMapQA=()=>({suspended:engine.suspended,loaded:engine.lodMetas.size});'}));
 try{
  await page.goto('/');await page.waitForFunction(()=>window.hiddenMapQA);
  await expect(page.locator('header .brand')).toBeVisible();await expect(page.locator('#phone-intro')).toHaveCSS('opacity','1');await expect(page.locator('#phone-intro-guide')).toBeVisible();await expect(page.locator('#map-reset')).toBeVisible();
  expect(await page.evaluate(()=>window.hiddenMapQA().loaded)).toBe(0);
  await page.locator('#phone-intro [data-work=bou]').click();await expect(page.locator('body')).toHaveClass(/view-about/);
  await expect.poll(()=>page.evaluate(()=>window.hiddenMapQA().suspended)).toBe(true);
  release();await page.waitForTimeout(600);expect(await page.evaluate(()=>window.hiddenMapQA().loaded)).toBe(0);
  await page.locator('header .brand').click();await expect.poll(()=>page.evaluate(()=>window.hiddenMapQA().loaded),{timeout:15000}).toBeGreaterThanOrEqual(3);
 }finally{release();await context.close();}
});
test('close map views stream detail and distant views return to lightweight rendering',async({page})=>{
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.lodSwitchQA=()=>({details:engine.modelMetas.size,scale:camera.scale,visibleDetails:engine.modelMeshes.filter(mesh=>mesh.visible&&!mesh.userData.lod).length,visibleLightweight:engine.modelMeshes.filter(mesh=>mesh.visible&&mesh.userData.lod).length,flight:!!cameraFlight});'}));
 await page.goto('/');await page.waitForFunction(()=>window.lodSwitchQA&&window.lodSwitchQA().visibleLightweight>0);
 expect(await page.evaluate(()=>window.lodSwitchQA().details)).toBe(0);
 await page.evaluate(()=>{for(let i=0;i<10;i++)document.querySelector('#map-zoom-in').click();});
 await expect.poll(()=>page.evaluate(()=>window.lodSwitchQA().visibleDetails),{timeout:15000}).toBeGreaterThan(0);
 expect(await page.evaluate(()=>window.lodSwitchQA().details)).toBeLessThan(25);
 await page.locator('#map-reset').click();await page.waitForFunction(()=>!window.lodSwitchQA().flight);
 await expect.poll(()=>page.evaluate(()=>window.lodSwitchQA().visibleDetails)).toBe(0);
 expect(await page.evaluate(()=>window.lodSwitchQA().visibleLightweight)).toBeGreaterThan(0);
});
