import {test,expect,devices} from '@playwright/test';
for(const name of ['iPhone 13','Pixel 7'])test(`${name}: first-use icons, menu search and direct Anas 3D`,async({browser})=>{
 const context=await browser.newContext(devices[name]),page=await context.newPage();
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');await expect(page.locator('#phone-map-guide')).toBeVisible();await expect(page.locator('#phone-intro-guide')).toBeHidden();
 await expect(page.locator('body')).toHaveClass(/phone-map-guided/);
 await page.locator('#menu-toggle').click();await expect(page.locator('#phone-map-guide')).toHaveCount(0);
 await page.locator('#phone-search-action').click();
 await expect(page.locator('#search')).toBeVisible();await expect(page.locator('#search')).toBeFocused();await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded','false');
 await page.locator('#search').fill('RR House');await page.locator('#results button').first().click();await expect(page.locator('.house-callout-card')).toBeVisible();await expect(page.locator('#search')).toBeHidden();
 await page.locator('#menu-toggle').click();await page.locator('#projects').click();await expect(page.locator('body')).toHaveClass(/model-view/);await expect(page.locator('#name')).toHaveText('Rumah Anas');
 await page.locator('#menu-toggle').click();await page.locator('#phone-search-action').click();await expect(page.locator('body')).not.toHaveClass(/model-view/);await expect(page.locator('#search')).toBeVisible();
 await page.locator('#phone-search-close').click();await expect(page.locator('#search')).toBeHidden();
 await page.reload();await expect(page.locator('#menu-toggle')).toBeVisible();await expect(page.locator('#phone-map-guide')).toBeVisible();
 await page.locator('#menu-toggle').click();await page.locator('#studio').click();await expect(page.locator('#about-page')).toBeVisible();
 await page.locator('#menu-toggle').click();await page.locator('#phone-search-action').click();await expect(page.locator('#about-page')).toBeHidden();await expect(page.locator('#search')).toBeVisible();
 expect(errors).toEqual([]);await context.close();
});

test('desktop: guide returns on refresh and dismisses on map interaction',async({page})=>{
 await page.goto('/');await expect(page.locator('#phone-map-guide')).toBeVisible();
 await page.mouse.wheel(0,80);await expect(page.locator('#phone-map-guide')).toHaveCount(0);
 await expect(page.locator('body')).not.toHaveClass(/phone-map-guided/);
 await page.reload();await expect(page.locator('#phone-map-guide')).toBeVisible();
 await page.locator('#map').click({position:{x:150,y:200}});await expect(page.locator('#phone-map-guide')).toHaveCount(0);
});
