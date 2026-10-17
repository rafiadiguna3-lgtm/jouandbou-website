import {test,expect,devices} from '@playwright/test';
import {readFile} from 'node:fs/promises';
for(const name of ['iPhone 13','Pixel 7'])test(`${name} intro returns at distant zoom and work links navigate`,async({browser})=>{
 const context=await browser.newContext(devices[name]),page=await context.newPage();
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 const intro=page.locator('#phone-intro'),search=page.locator('#search-toggle'),toggle=page.locator('#phone-intro-toggle');
 await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();await expect(toggle).toHaveCount(0);
 await expect(page.locator('#phone-jou-works')).toHaveCSS('text-decoration-line','none');
 await expect(page.locator('[data-service=full-package]')).toHaveCSS('text-decoration-line','none');
 await page.locator('[data-service=interior-design]').click();await expect(page.locator('[data-service=interior-design]')).toHaveCSS('text-decoration-line','underline');
 await page.locator('#phone-jou-works').click();await expect(intro).toHaveCSS('opacity','0');await expect(page).toHaveURL(/#projects$/);await expect(toggle).toHaveCount(0);
 await page.locator('#map-reset').click();await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();await expect(toggle).toHaveCount(0);
 for(let i=0;i<10;i++)await page.locator('#map-zoom-in').click();
 await expect(intro).toHaveCSS('opacity','0');await expect(search).toBeHidden();
 for(let i=0;i<10;i++)await page.locator('#map-zoom-out').click();
 await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();await expect(toggle).toHaveCount(0);
 await expect(toggle).toHaveCount(0);await page.locator('[data-work=bou]').click();
 await expect(page.locator('.bou-index')).toBeVisible();await expect(page).toHaveURL(/#bou-works$/);
 await page.locator('header .brand').click();await expect(intro).toHaveCSS('opacity','0');
 await page.reload();await expect(intro).toHaveCSS('opacity','1');await expect(search).toBeHidden();await expect(toggle).toHaveCount(0);
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
test('phone copy hides after a tiny pan and returns only on an explicit zoom-out to 85 percent',async({browser})=>{
 const context=await browser.newContext({...devices['iPhone 13'],reducedMotion:'reduce'}),page=await context.newPage();
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.createSensitivityQA=()=>{phoneIntro.update=()=>{};return createPhoneIntro();};'}));
 await page.goto('/');await page.waitForFunction(()=>window.createSensitivityQA);
 await page.evaluate(()=>{window.introSensitivity=window.createSensitivityQA();});
 const apply=async(scale,x=0)=>page.evaluate(({scale,x})=>{const view={scale,x,y:2,z:0},home={scale:10,x:0,y:2,z:0};window.introSensitivity.update({phone:true,front:false,view,goal:view,home});},{scale,x});
 const intro=page.locator('#phone-intro'),summary=page.locator('#home-summary');
 await apply(10);await expect(intro).toHaveCSS('opacity','1');
 await apply(10,.31);await expect(intro).toHaveCSS('opacity','0');await expect(summary).toHaveCSS('opacity','0');
 await apply(8.6,.31);await expect(intro).toHaveCSS('opacity','0');
 await apply(8.5,.31);await expect(intro).toHaveCSS('opacity','1');
 await apply(8.5,.7);await expect(intro).toHaveCSS('opacity','0');
 await apply(8.5,.7);await expect(intro).toHaveCSS('opacity','0');
 await apply(8.4,.7);await expect(intro).toHaveCSS('opacity','1');
 await apply(8.5,.7);await expect(intro).toHaveCSS('opacity','0');
 await context.close();
});
