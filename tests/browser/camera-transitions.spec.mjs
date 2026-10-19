import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
test('keyboard, next-house browsing and exit reach the original prescribed distances',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/app.mjs?*',async route=>{await route.fulfill({status:200,contentType:'application/javascript',body:(await readFile(new URL('../../dist/app.mjs',import.meta.url),'utf8'))+'\nwindow.cameraQA=()=>({camera:{...camera},goal:{...goal},front,current,flight:!!cameraFlight});'});});
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.cameraQA,null,{timeout:10000});
 async function settled(){try{await page.waitForFunction(()=>{const sample=window.cameraQA();return !sample.flight&&Object.keys(sample.camera).every(key=>Math.abs(sample.camera[key]-sample.goal[key])<.0000001);},null,{timeout:12000});}catch(error){console.log(await page.evaluate(()=>window.cameraQA()));throw error;}return page.evaluate(()=>({...window.cameraQA().camera,time:performance.now()}));}
 await page.locator('#search-toggle').click();await page.locator('#search').fill('Rumah Anas');await page.locator('#results button').first().click();await page.locator('.house-callout-card').click();await expect(page.locator('#modelStatus')).toBeHidden({timeout:30000});
 let sample=await settled();await page.locator('#back').click();sample=await settled();
 for(const controls of [['map-zoom-out','map-zoom-out'],['map-zoom-in','map-zoom-in'],['map-zoom-in','map-zoom-in']]){
  for(const id of controls)await page.locator('#map').dispatchEvent('wheel',{deltaY:id==='map-zoom-out'?120:-120,deltaMode:0,bubbles:true,cancelable:true});
  const before=await settled();
  const previousHouse=await page.evaluate(()=>window.cameraQA().current);
  await page.locator('#house-next').focus();await page.keyboard.press('ArrowRight');const keyboard=await settled();
  const expectedScale=await page.evaluate(()=>Math.min(innerWidth/108,(innerHeight-250)/45)*1.25);expect(keyboard.scale).toBeCloseTo(expectedScale,5);
  expect(await page.evaluate(()=>window.cameraQA().current)).not.toBe(previousHouse);
  await page.keyboard.press('ArrowLeft');await settled();expect(await page.evaluate(()=>window.cameraQA().current)).toBe(previousHouse);
  await page.locator('#house-next').click();const after=await settled();const baseScale=await page.evaluate(()=>Math.min(innerWidth/108,(innerHeight-250)/45));expect(after.scale).toBeCloseTo(baseScale*1.25,5);
  await page.locator('.house-callout-card').click();await expect(page.locator('body')).toHaveClass(/model-view/);await expect(page).not.toHaveURL(/\/projects\/|#project\//);
  await expect(page.locator('#modelStatus')).toBeHidden({timeout:30000});sample=await settled();
  await page.locator('#back').click();sample=await settled();expect(sample.scale).toBeCloseTo(baseScale*1.15,5);
 }
 expect(errors).toEqual([]);
});
