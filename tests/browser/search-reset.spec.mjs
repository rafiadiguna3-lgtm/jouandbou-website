import {revealPhoneSearch} from './helpers/phone-search.mjs';
import {test,expect} from '@playwright/test';
for(const phone of [false,true])test(`search starts at first-click stage and clears after selection/cancel (${phone?'phone':'desktop'})`,async({browser})=>{
 const context=await browser.newContext({viewport:phone?{width:390,height:844}:{width:1280,height:800},isMobile:phone,hasTouch:phone});const page=await context.newPage();await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 if(phone)await revealPhoneSearch(page);
 const toggle=page.locator('#search-toggle'),input=page.locator('#search');
 await test.step('opening and canceling clears search',async()=>{await toggle.click({timeout:5000});await input.fill('51');await toggle.click({timeout:5000});await toggle.click({timeout:5000});await expect(input).toHaveValue('');await expect(page.locator('#results')).toBeHidden();});
 await test.step('keyboard selection returns to the first stage',async()=>{await input.fill('Rumah Anas');await input.press('Enter');await expect(page.locator('.house-callout-card')).toBeVisible();await expect(page.locator('body')).not.toHaveClass(/model-view/);await expect(input).toHaveValue('');await expect(toggle).toHaveAttribute('aria-expanded','false');if(phone){const a=await toggle.boundingBox(),b=await page.locator('#phone-intro-toggle').boundingBox();expect(b.y).toBeGreaterThan(a.y+a.height);}});
 await test.step('reopening permits a different project',async()=>{await toggle.click({timeout:5000});await expect(input).toHaveValue('');await input.fill('Marboy',{timeout:5000});await page.locator('#results button').first().click({timeout:5000});await expect(page.locator('body')).not.toHaveClass(/model-view/);await expect(input).toHaveValue('');});
 await test.step('Escape clears the query',async()=>{await toggle.click({timeout:5000});await input.fill('51');await input.press('Escape');await toggle.click({timeout:5000});await expect(input).toHaveValue('');});
 await test.step('selected project enters 3D',async()=>{await input.fill('Rumah Anas');await page.locator('#results button').first().click({timeout:5000});await page.locator('.house-callout-card').click();await expect(page.locator('body')).toHaveClass(/model-view/);});
 await context.close();
});
test('search and clear controls do not rotate or change hover background',async({page})=>{
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));const toggle=page.locator('#search-toggle');
 const before=await toggle.evaluate(el=>({background:getComputedStyle(el).backgroundColor,transform:getComputedStyle(el.querySelector('svg')).transform}));await toggle.hover();await expect(toggle).toHaveCSS('background-color',before.background);await expect(toggle.locator('svg')).toHaveCSS('transform',before.transform);
 await test.step('search interaction 6',async()=>{await toggle.click({timeout:5000});await page.locator('#search').fill('51');const clear=page.locator('#search-clear');await page.mouse.move(0,0);const state=await clear.evaluate(el=>({background:getComputedStyle(el).backgroundColor,transform:getComputedStyle(el.querySelector('svg')).transform}));await clear.hover();await expect(clear).toHaveCSS('background-color',state.background);await expect(clear.locator('svg')).toHaveCSS('transform',state.transform);});
});
