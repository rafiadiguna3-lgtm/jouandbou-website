import {test,expect} from '@playwright/test';
test('drag settling and wheel zoom defer background loading, then resume it',async({page})=>{
 await page.goto('/');
 await page.waitForFunction(()=>document.querySelector('#labels button')&&document.querySelector('header [aria-current]'));
 await page.evaluate(async()=>{
  const {NeighborhoodRenderer}=await import('/renderer.mjs?v=139');
  const original=NeighborhoodRenderer.prototype.setInteracting;
  window.modelLoadingPauses=[];
  NeighborhoodRenderer.prototype.setInteracting=function(value){window.modelLoadingPauses.push(Boolean(value));return original.call(this,value);};
 });
 const box=await page.locator('#map').boundingBox();
 await page.mouse.move(box.x+box.width*.5,box.y+box.height*.75);
 await page.mouse.wheel(0,-80);
 await expect.poll(()=>page.evaluate(()=>window.modelLoadingPauses.includes(true))).toBe(true);
 await expect.poll(()=>page.evaluate(()=>window.modelLoadingPauses.at(-1)),{timeout:15000}).toBe(false);
 await page.evaluate(()=>window.modelLoadingPauses=[]);
 await page.mouse.down();
 await page.mouse.move(box.x+box.width*.6,box.y+box.height*.7,{steps:10});
 await page.mouse.up();
 await expect.poll(()=>page.evaluate(()=>window.modelLoadingPauses.includes(true))).toBe(true);
 await expect.poll(()=>page.evaluate(()=>window.modelLoadingPauses.at(-1)),{timeout:15000}).toBe(false);
 await page.locator('#search-toggle').click();await page.locator('#search').fill('Marboy');await page.locator('#results button').first().click();
 await expect(page.locator('#focus')).toBeVisible();await expect(page.locator('#modelStatus')).toBeHidden({timeout:30000});
});
