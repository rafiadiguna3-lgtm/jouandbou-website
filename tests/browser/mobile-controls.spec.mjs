import {test,expect,devices} from '@playwright/test';

for(const {name,legacy} of [{name:'iPhone 13',legacy:false},{name:'Pixel 7',legacy:false},{name:'Pixel 7',legacy:true}]){
 test(`${name} ${legacy?'without :has and dvh':'current CSS'} keeps compact search and bottom model info`,async({browser})=>{
  const context=await browser.newContext(devices[name]);
  const page=await context.newPage();
  if(legacy)await page.route('**/*.css*',async route=>{
   if(new URL(route.request().url()).hostname!=='127.0.0.1')return route.continue();
   const response=await route.fetch();
   // Unsupported selectors invalidate their entire rule; unknown units invalidate declarations.
   await route.fulfill({response,body:(await response.text()).replaceAll(':has(',':unsupported-has(').replaceAll('dvh','unsupportedvh')});
  });
  await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
  const width=()=>page.locator('.search-wrap').evaluate(el=>el.getBoundingClientRect().width);
  await expect.poll(width).toBe(46);
  for(const selector of ['#search-toggle','#map-reset','#map-zoom-in','#map-zoom-out']){
   const box=await page.locator(selector).boundingBox();expect(box.width).toBe(46);expect(box.height).toBe(46);
  }
  await page.locator('#search-toggle').click();await expect.poll(width).toBe(240);
  await page.locator('#search').fill('Marboy');await page.locator('#results button').first().click();
  await page.locator('.house-callout-card').click();await expect(page.locator('body')).toHaveClass(/model-view/);
  await expect(page.locator('.search-wrap')).toBeHidden();await expect(page.locator('.map-zoom')).toBeHidden();
  for(const viewport of [devices[name].viewport,{width:844,height:390}]){
   await page.setViewportSize(viewport);
   await expect.poll(async()=>page.locator('#focus').evaluate(el=>{const box=el.getBoundingClientRect();return box.top>innerHeight/2&&box.bottom<=innerHeight-8&&box.left>=0&&box.right<=innerWidth;})).toBe(true);
   await expect(page.locator('#more')).toBeVisible();await expect(page.locator('#back')).toBeVisible();
  }
  await page.locator('#back').click();await expect(page.locator('.map-zoom')).toBeVisible();await expect.poll(width).toBe(46);
  await context.close();
 });
}
