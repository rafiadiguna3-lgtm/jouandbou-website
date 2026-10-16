import {test,expect} from '@playwright/test';
test('desktop arrow becomes a circle while clicking or dragging and resets after cancellation',async({page})=>{
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('#labels button'));
 const map=page.locator('#map'),root=page.locator('html');
 await page.mouse.move(400,450);await expect(root).toHaveAttribute('data-desktop-cursor','idle');
 expect(await map.evaluate(el=>getComputedStyle(el).cursor)).toContain('data:image/svg+xml');
 await page.mouse.down();await expect(root).toHaveAttribute('data-desktop-cursor','pressed');
 const circle=await map.evaluate(el=>getComputedStyle(el).cursor);expect(decodeURIComponent(circle)).toContain('<circle');
 await page.mouse.move(470,470,{steps:5});await expect(root).toHaveAttribute('data-desktop-cursor','pressed');
 await page.mouse.up();await expect(root).toHaveAttribute('data-desktop-cursor','idle');
 await page.mouse.down();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await expect(root).toHaveAttribute('data-desktop-cursor','idle');await page.mouse.up();
 await page.mouse.down();await map.dispatchEvent('pointercancel',{pointerType:'mouse'});await expect(root).toHaveAttribute('data-desktop-cursor','idle');await page.mouse.up();
});
test('phone taps do not enable a custom cursor',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();
 await page.goto('/');await page.waitForFunction(()=>document.querySelector('#labels button'));await page.touchscreen.tap(200,450);
 await expect(page.locator('html')).not.toHaveAttribute('data-desktop-cursor',/.+/);await context.close();
});
