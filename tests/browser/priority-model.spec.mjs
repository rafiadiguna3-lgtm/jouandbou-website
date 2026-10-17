import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
for(const switchEarly of [false,true])test(`selected desktop model renders with blocked backgrounds${switchEarly?' after a rapid selection change':''}`,async({page})=>{
 let release,releaseSelected,selectedStarted=false;const gate=new Promise(resolve=>release=resolve),selectedGate=new Promise(resolve=>releaseSelected=resolve),blocked=new Set();
 await page.route('**/assets/*mobile-*.bin?*',async route=>{
  if(/map-mobile-jh(?:30|01)\.bin/.test(route.request().url())){blocked.add(route.request().url());await gate;}
  if(switchEarly&&/gpu-mobile-jh27\.bin/.test(route.request().url())){selectedStarted=true;await selectedGate;}
  await route.continue();
 });
 await page.route('**/app.mjs?*',async route=>route.fulfill({contentType:'application/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.modelQA=()=>({loaded:engine.modelMetas.has(current),current,focused:engine.focusedModel});window.selectModelQA=id=>openHouse(id);'}));
 try{
  await page.goto('/');await page.waitForFunction(()=>window.modelQA&&document.querySelector('header [aria-current]'));
  await expect.poll(()=>blocked.size).toBe(2);
  await page.locator('#search-toggle').click();await page.locator('#search').fill('Flute');await page.locator('#results button').first().click();await page.locator('.house-callout-card').click();
  if(switchEarly){await expect.poll(()=>selectedStarted).toBe(true);await page.evaluate(()=>window.selectModelQA(33));releaseSelected();}
  await page.waitForFunction(()=>{const state=window.modelQA();return state.loaded&&state.focused===state.current;},null,{timeout:10000});
  expect(await page.evaluate(()=>window.modelQA())).toEqual({loaded:true,current:switchEarly?33:26,focused:switchEarly?33:26});
  await expect(page.locator('#modelStatus')).toBeHidden();
 }finally{release();releaseSelected();}
});
