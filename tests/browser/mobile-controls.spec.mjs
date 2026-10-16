import {installPhoneMapProbe,selectPhoneProject} from './helpers/phone-map.mjs';
import {test,expect,devices} from '@playwright/test';

for(const {name,legacy} of [{name:'iPhone 13',legacy:false},{name:'Pixel 7',legacy:false},{name:'Pixel 7',legacy:true}]){
 test(`${name} ${legacy?'without :has and dvh':'current CSS'} keeps search hidden and model info at the bottom`,async({browser})=>{
  const context=await browser.newContext(devices[name]);
  const page=await context.newPage();await installPhoneMapProbe(page);
  if(legacy)await page.route('**/*.css*',async route=>{
   if(new URL(route.request().url()).hostname!=='127.0.0.1')return route.continue();
   const response=await route.fetch();
   // Unsupported selectors invalidate their entire rule; unknown units invalidate declarations.
   await route.fulfill({response,body:(await response.text()).replaceAll(':has(',':unsupported-has(').replaceAll('dvh','unsupportedvh')});
  });
  await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
  await expect(page.locator('#search-toggle')).toBeHidden();
  for(const selector of ['#map-reset','#map-zoom-in','#map-zoom-out']){const box=await page.locator(selector).boundingBox();expect(box.width).toBe(46);expect(box.height).toBe(46);}
  await selectPhoneProject(page,'Rumah Anas');
  await page.locator('.house-callout-card').click();await expect(page.locator('body')).toHaveClass(/model-view/);
  await expect(page.locator('.search-wrap')).toBeHidden();await expect(page.locator('.map-zoom')).toBeHidden();
  for(const viewport of [devices[name].viewport,{width:844,height:390}]){
   await page.setViewportSize(viewport);
   await expect.poll(async()=>page.locator('#focus').evaluate(el=>{const box=el.getBoundingClientRect();return box.top>innerHeight/2&&box.bottom<=innerHeight-8&&box.left>=0&&box.right<=innerWidth;})).toBe(true);
   await expect(page.locator('#more')).toBeVisible();await expect(page.locator('#back')).toBeVisible();
  }
  await page.locator('#back').click();await expect(page.locator('.map-zoom')).toBeVisible();await expect(page.locator('#search-toggle')).toBeHidden();
  await context.close();
 });
}
