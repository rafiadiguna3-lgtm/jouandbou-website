import {test,expect,devices} from '@playwright/test';
import {revealPhoneSearch} from './helpers/phone-search.mjs';
for(const name of ['iPhone 13','Pixel 7'])test(`${name} landing choices, camera fade and introduction toggle`,async({browser})=>{
 const context=await browser.newContext(devices[name]);const page=await context.newPage();
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 const intro=page.locator('#phone-intro'),guide=page.locator('#phone-intro-guide'),search=page.locator('#search-toggle'),toggle=page.locator('#phone-intro-toggle');
 await expect(intro).toHaveCSS('opacity','1');await expect(guide).toHaveCSS('opacity','1');await expect(search).toBeHidden();
 await expect(page.locator('#phone-jou-works')).toHaveAttribute('aria-current','page');
 await page.locator('[data-work=bou]').click();await expect(page.locator('[data-work=bou]')).toHaveAttribute('aria-current','page');expect(new URL(page.url()).hash).toBe('');
 await page.locator('[data-service=interior-design]').click();await expect(page.locator('[data-service=interior-design]')).toHaveAttribute('aria-pressed','true');
 await page.locator('#map-zoom-in').click();await expect.poll(()=>intro.evaluate(e=>Number(e.style.getPropertyValue('--intro-opacity')))).toBeLessThan(1);
 await revealPhoneSearch(page);await expect(intro).toHaveCSS('opacity','0');await expect(toggle).toBeVisible();
 await toggle.click();await expect(intro).toHaveCSS('opacity','1');await expect(toggle).toHaveAttribute('aria-expanded','true');
 await toggle.click();await expect(intro).toHaveCSS('opacity','0');await expect(toggle).toHaveAttribute('aria-expanded','false');
 await search.click();await page.locator('#search').fill('Marboy');
 await page.setViewportSize({width:devices[name].viewport.width,height:550});await expect(page.locator('#search')).toBeVisible();
 await page.locator('#search').press('Escape');await page.setViewportSize(devices[name].viewport);
 await page.locator('#map-reset').click();await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();await expect(toggle).toBeHidden();
 const map=page.locator('#map'),box=await map.boundingBox();
 await page.mouse.move(box.width*.55,box.height*.55);await page.mouse.down();await page.mouse.move(box.width*.55+85,box.height*.55+45,{steps:10});await page.mouse.up();
 await expect.poll(()=>intro.evaluate(e=>Number(e.style.getPropertyValue('--intro-opacity')))).toBeLessThan(.9);
 await context.close();
});
test('desktop keeps its existing search and has no phone landing overlay',async({page})=>{
 await page.goto('/');await expect(page.locator('#search-toggle')).toBeVisible();await expect(page.locator('#phone-intro')).toBeHidden();await expect(page.locator('#phone-intro-toggle')).toBeHidden();
});

test('phone introduction respects reduced motion',async({browser})=>{
 const context=await browser.newContext({...devices['iPhone 13'],reducedMotion:'reduce'}),page=await context.newPage();
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 await expect(page.locator('#phone-intro')).toHaveCSS('transition-duration','0s');
 await revealPhoneSearch(page);await expect(page.locator('#phone-intro')).toHaveCSS('opacity','0');
 await page.locator('#phone-intro-toggle').click();await expect(page.locator('#phone-intro')).toHaveCSS('opacity','1');
 await context.close();
});
