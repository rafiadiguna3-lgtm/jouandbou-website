import {test,expect,devices} from '@playwright/test';
for(const name of ['iPhone 13','Pixel 7'])test(`${name} intro dismisses once and work links navigate`,async({browser})=>{
 const context=await browser.newContext(devices[name]),page=await context.newPage();
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 const intro=page.locator('#phone-intro'),search=page.locator('#search-toggle'),toggle=page.locator('#phone-intro-toggle');
 await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();
 await expect(page.locator('#phone-jou-works')).toHaveCSS('text-decoration-line','none');
 await expect(page.locator('[data-service=full-package]')).toHaveCSS('text-decoration-line','none');
 await page.locator('[data-service=interior-design]').click();await expect(page.locator('[data-service=interior-design]')).toHaveCSS('text-decoration-line','underline');
 await page.locator('#phone-jou-works').click();await expect(intro).toHaveCSS('opacity','0');await expect(page).toHaveURL(/#projects$/);await expect(toggle).toBeVisible();
 await page.locator('#map-reset').click();await expect(intro).toHaveCSS('opacity','0');
 for(let i=0;i<4;i++)await page.locator('#map-zoom-out').click();
 for(let i=0;i<3;i++)await page.locator('#map-zoom-in').click();
 await expect(intro).toHaveCSS('opacity','0');await expect(search).toBeHidden();
 await toggle.click();await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();
 await page.locator('#map-zoom-in').click();await expect(intro).toHaveCSS('opacity','0');
 await toggle.click();await expect(intro).toHaveCSS('opacity','1');await page.locator('[data-work=bou]').click();
 await expect(page.locator('.bou-index')).toBeVisible();await expect(page).toHaveURL(/#bou-works$/);
 await page.locator('header .brand').click();await expect(intro).toHaveCSS('opacity','0');
 await page.reload();await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();
 await page.locator('#map-zoom-in').click();await expect(intro).toHaveCSS('opacity','0');
 await context.close();
});
test('desktop retains search without a phone overlay',async({page})=>{
 await page.goto('/');await expect(page.locator('#search-toggle')).toBeVisible();await expect(page.locator('#phone-intro')).toBeHidden();
});
test('phone fade respects reduced motion',async({browser})=>{
 const context=await browser.newContext({...devices['iPhone 13'],reducedMotion:'reduce'}),page=await context.newPage();
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 await expect(page.locator('#phone-intro')).toHaveCSS('transition-duration','0s');await page.locator('#phone-jou-works').click();await expect(page.locator('#phone-intro')).toHaveCSS('opacity','0');await context.close();
});
