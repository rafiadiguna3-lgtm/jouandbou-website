import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
for(const viewport of [{width:2048,height:1104},{width:390,height:844}])test(`homepage reference framing on entry, reload and home return ${viewport.width}`,async({browser})=>{
 const context=await browser.newContext({viewport,hasTouch:viewport.width<700,isMobile:viewport.width<700});const page=await context.newPage();
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.homeQA=()=>({camera:{...camera},goal:{...goal},expected:homeCamera(),front,previewId,flight:!!cameraFlight});'}));
 await page.goto('/');await page.waitForFunction(()=>window.homeQA);const initial=await page.evaluate(()=>window.homeQA());for(const key of Object.keys(initial.camera))expect(initial.camera[key]).toBeCloseTo(initial.expected[key],7);expect(initial.previewId).toBe(-1);
 if(viewport.width===2048){expect(initial.camera.scale).toBeGreaterThan(3.8);expect(initial.camera.scale).toBeLessThan(4);}
 await page.locator('#map').dispatchEvent('wheel',{deltaY:-200,deltaMode:0});await page.reload();await page.waitForFunction(()=>window.homeQA);expect((await page.evaluate(()=>window.homeQA())).camera).toEqual(initial.camera);
 await page.locator('#search-toggle').click();await page.locator('#search').fill('Rumah Anas');await page.locator('#results button').first().click();await expect(page.locator('.house-callout-card')).toBeVisible();
 await page.evaluate(()=>document.querySelector('#projects').click());await page.waitForFunction(()=>!window.homeQA().flight);const returned=await page.evaluate(()=>window.homeQA());for(const key of Object.keys(initial.camera))expect(returned.camera[key]).toBeCloseTo(initial.camera[key],7);expect(returned.previewId).toBe(-1);expect(returned.front).toBe(false);await context.close();
});
