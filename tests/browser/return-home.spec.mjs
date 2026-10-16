import {phoneMapProbe,selectPhoneProject} from './helpers/phone-map.mjs';
import {test,expect,devices} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {cameraFlight} from '../../site/camera-flight.mjs';

for(const mobile of [false,true])test(`home controls animate around the selected house (${mobile?'phone':'desktop'})`,async({browser})=>{
 const context=await browser.newContext(mobile?devices['iPhone 13']:{viewport:{width:1280,height:800}});
 const page=await context.newPage();
 await page.route('**/app.mjs?*',async route=>route.fulfill({contentType:'application/javascript',body:await readFile(new URL('../../dist/app.mjs',import.meta.url),'utf8')+'\nwindow.cameraQA=()=>({camera:{...camera},goal:{...goal},front,current,flight:cameraFlight,focus:modelCameraFocus(),homeAnchor,overview:homeCamera(true)});'+phoneMapProbe}));
 await page.goto('/');
 await page.waitForFunction(()=>window.cameraQA&&document.querySelector('header [aria-current]'));
 const sample=()=>page.evaluate(()=>window.cameraQA());
 async function settled(){await page.waitForFunction(()=>{const s=window.cameraQA();return !s.flight&&Object.keys(s.camera).every(k=>Math.abs(s.camera[k]-s.goal[k])<1e-7);});return sample();}
 const home=(await settled()).goal;
 await page.locator('#map-zoom-in').click();await page.locator('#map-zoom-in').click();await settled();
 const reset=await page.evaluate(()=>{const before=window.cameraQA();document.querySelector('#map-reset').click();return {before,after:window.cameraQA()};});
 expect(reset.after.flight).toBeTruthy();expect(reset.after.flight.focus).toEqual(reset.after.homeAnchor);expect(reset.after.camera).toEqual(reset.before.camera);
 {const returned=(await settled()).goal,expected=mobile?reset.after.overview:home;for(const key of Object.keys(expected))expect(returned[key]).toBeCloseTo(expected[key],7);}
 if(mobile)await selectPhoneProject(page,'Rumah Anas');
 else{await page.locator('#search-toggle').click();await page.locator('#search').fill('Marboy');await page.locator('#results button').first().click();}
 await page.locator('.house-callout-card').click();await expect(page.locator('#modelStatus')).toBeHidden({timeout:30000});await settled();
 const exit=await page.evaluate(()=>{const before=window.cameraQA();document.querySelector('header .brand span').click();return {before,after:window.cameraQA(),diagonal:Math.hypot(innerWidth,innerHeight)};});
 expect(exit.after.front).toBe(false);expect(exit.after.flight.focus).toEqual(exit.before.focus);
 expect(exit.after.camera).toEqual(exit.before.camera);
 const expected=cameraFlight(exit.before.camera,exit.after.goal,0,{focus:exit.before.focus,viewportDiagonal:exit.diagonal});
 expect(exit.after.flight.duration).toBeCloseTo(expected.duration,7);
 {const returned=(await settled()).goal;for(const key of Object.keys(home))expect(returned[key]).toBeCloseTo(home[key],7);}
 await expect(page.locator('#back')).toBeHidden();await expect(page.locator('#focus')).toBeHidden();
 await context.close();
});
