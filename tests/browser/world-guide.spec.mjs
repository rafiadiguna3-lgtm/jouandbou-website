import {test,expect,devices} from '@playwright/test';
import {readFile} from 'node:fs/promises';
for(const device of ['desktop','iPhone 13'])test(`${device}: jou world guide clears all visual state on drag and returns on refresh`,async({browser})=>{
 const context=await browser.newContext(device==='desktop'?{viewport:{width:1200,height:800}}:devices[device]);const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.guideQA=()=>({levels:[...hoverLevels],previewId,hover});'}));
 await page.goto('/');const guide=page.locator('#phone-map-guide');await expect(guide).toBeVisible();await expect(guide.locator('h1 span')).toHaveText('jou world');
 await expect.poll(()=>page.locator('#viewport').evaluate(e=>getComputedStyle(e).filter)).toMatch(/blur\([23]px\)/);
 await expect.poll(()=>guide.getAttribute('data-house')).toBe('0');
 const canvas=page.locator('#map'),box=await canvas.boundingBox(),x=box.width*.5,y=box.height*.7;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+30,y,{steps:4});await page.mouse.up();
 await expect(guide).toHaveCount(0);await expect(page.locator('body')).not.toHaveClass(/phone-map-guided/);await expect(page.locator('#viewport')).toHaveCSS('filter','none');
 await expect(page.locator('.house-callout')).toHaveAttribute('aria-hidden','true');await expect.poll(()=>page.evaluate(()=>window.guideQA().levels.every(v=>v===0))).toBe(true);
 await page.reload();await expect(guide).toBeVisible();await page.locator('#menu-toggle').dispatchEvent('pointerdown');await expect(guide).toHaveCount(0);expect(errors).toEqual([]);await context.close();
});
