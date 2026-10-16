import {expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
export const phoneMapProbe=`\nwindow.phoneMapProbe=()=>({flight:!!cameraFlight,first:project(world.anchors[0],camera,w,h).slice(0,2)});`;
export async function installPhoneMapProbe(page){
 await page.route('**/app.mjs?*',async route=>route.fulfill({contentType:'application/javascript',body:await readFile('dist/app.mjs','utf8')+phoneMapProbe}));
}
export async function selectPhoneProject(page,name){
 await page.locator('#map-reset').click();await page.waitForFunction(()=>window.phoneMapProbe&&!window.phoneMapProbe().flight);
 const [x,y]=await page.evaluate(()=>window.phoneMapProbe().first);
 await page.locator('#map').tap({position:{x,y}});
 await expect(page.locator('.house-callout-card')).toBeVisible();
 for(let i=0;i<26&&await page.locator('#house-prev').isEnabled();i++)await page.locator('#house-prev').click({timeout:5000});
 await page.evaluate(()=>new Promise(requestAnimationFrame));
 for(let i=0;i<26;i++){
  if((await page.locator('.house-callout-name').textContent()).includes(name))return;
  await page.locator('#house-next').click({timeout:5000});await page.evaluate(()=>new Promise(requestAnimationFrame));
 }
 throw new Error('Project not found through map browsing: '+name);
}
