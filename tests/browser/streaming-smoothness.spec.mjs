import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const probe=`\nwindow.smoothQA={open:openHouse,orbit:orbitTo,zoom:zoomBy,state:()=>({camera:{...camera},goal:{...goal},flight:!!cameraFlight,raf:!!raf,loaded:engine.modelMetas.has(current),lod:engine.lodMetas.has(29),animating:!!engine.animating,visible:engine.modelMeshes.filter(m=>m.visible).map(m=>({id:m.userData.id,lod:m.userData.lod}))})};`;
async function instrument(page){await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+probe}));}
test('late detail arrival preserves the orbit, zoom and completed camera flight',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);await page.route('**/assets/gpu-mobile-jh30.bin?*',async route=>{await gate;await route.continue();});await instrument(page);
 try{
  await page.goto('/');await page.waitForFunction(()=>window.smoothQA?.state().lod);
  await page.evaluate(()=>window.smoothQA.open(29));await page.waitForFunction(()=>!window.smoothQA.state().raf);
  await page.evaluate(()=>{window.smoothQA.orbit(.85,.55);window.smoothQA.zoom(1.15);});await page.waitForFunction(()=>!window.smoothQA.state().raf);
  const pose=(await page.evaluate(()=>window.smoothQA.state())).goal;
  release();await page.waitForFunction(()=>window.smoothQA.state().loaded);
  const after=await page.evaluate(()=>window.smoothQA.state());expect(after.flight).toBe(false);expect(after.goal.yaw).toBeCloseTo(pose.yaw,7);expect(after.goal.pitch).toBeCloseTo(pose.pitch,7);expect(after.goal.scale).toBeCloseTo(pose.scale,7);
 }finally{release();}
});
test('detail arriving during an orbit drag waits for the gesture and camera to settle',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);await page.route('**/assets/gpu-mobile-jh30.bin?*',async route=>{await gate;await route.continue();});await instrument(page);
 try{
  await page.goto('/');await page.waitForFunction(()=>window.smoothQA?.state().lod);
  await page.evaluate(()=>window.smoothQA.open(29));
  await page.mouse.move(600,400);await page.mouse.down();await page.mouse.move(650,430,{steps:4});
  const responsePromise=page.waitForResponse(response=>/gpu-mobile-jh30\.bin/.test(response.url()));release();const response=await responsePromise;await response.finished();await page.waitForTimeout(150);
  expect(await page.evaluate(()=>window.smoothQA.state().loaded)).toBe(false);
  await page.mouse.up();await page.waitForFunction(()=>window.smoothQA.state().loaded);expect(await page.evaluate(()=>window.smoothQA.state().flight)).toBe(false);
 }finally{release();await page.mouse.up();}
});
test('detail quality stays stable during motion and near the zoom boundary',async({page})=>{
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+probe+`\nwindow.checkQualitySequence=()=>{const modes=[];for(const [scale,moving] of [[5,false],[6.4,false],[7,false],[6,false],[5.1,true],[5.1,false]]){engine.setAnimating(moving);engine.render({...camera,scale},w,h,current,false,hoverLevels);modes.push(engine.detailModes.get(current));}return modes;};`}));
 await page.goto('/');await page.waitForFunction(()=>window.smoothQA?.state().lod);await page.evaluate(()=>window.smoothQA.open(29));await page.waitForFunction(()=>window.smoothQA.state().loaded&&!window.smoothQA.state().raf);
 expect(await page.evaluate(()=>window.checkQualitySequence())).toEqual([false,false,true,true,true,false]);
});
test('project details hold pending model work and return without restarting the camera',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);await page.route('**/assets/gpu-mobile-jh30.bin?*',async route=>{await gate;await route.continue();});await instrument(page);
 try{
  await page.goto('/');await page.waitForFunction(()=>window.smoothQA?.state().lod);await page.evaluate(()=>window.smoothQA.open(29));await page.waitForFunction(()=>!window.smoothQA.state().raf);
  await page.locator('#more').click();await expect(page.locator('#marboy')).toBeVisible();
  const responsePromise=page.waitForResponse(response=>/gpu-mobile-jh30\.bin/.test(response.url()));release();await (await responsePromise).finished();await page.waitForTimeout(150);
  expect(await page.evaluate(()=>window.smoothQA.state().loaded)).toBe(false);
  await page.locator('#marboy .close').click();await page.waitForFunction(()=>window.smoothQA.state().loaded&&!window.smoothQA.state().raf);expect(await page.evaluate(()=>window.smoothQA.state().flight)).toBe(false);
 }finally{release();}
});
