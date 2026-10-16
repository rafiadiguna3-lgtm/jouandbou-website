import {revealPhoneSearch} from './helpers/phone-search.mjs';
import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
test('phone first-stage swipe changes house faster, preserves stage and tap',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.route('**/app.mjs*',async route=>route.fulfill({contentType:'text/javascript',body:await readFile('dist/app.mjs','utf8')+'\nwindow.swipeQA=()=>({current,front,duration:cameraFlight?.duration,goal:{...goal}});'}));
 await page.goto('/');await revealPhoneSearch(page);await page.locator('#search-toggle').click();await page.locator('#search').fill('Rumah Anas');await page.locator('#results button').first().click();
 await page.waitForFunction(()=>window.swipeQA&&!window.swipeQA().duration);
 await page.locator('#house-next').click();const click=await page.evaluate(()=>window.swipeQA());await page.waitForFunction(()=>!window.swipeQA().duration);
 await page.locator('#house-prev').click();await page.waitForFunction(()=>!window.swipeQA().duration);
 const card=page.locator('.house-callout-card');await card.click({trial:true});const box=await card.boundingBox(),cdp=await context.newCDPSession(page),x=box.x+box.width*.8,y=box.y+box.height*.4;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-45,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const swipe=await page.evaluate(()=>window.swipeQA());expect(swipe.current).toBe(click.current);expect(swipe.goal).toEqual(click.goal);expect(swipe.duration).toBeLessThan(click.duration*.7);expect(swipe.front).toBe(false);
 await page.waitForFunction(()=>!window.swipeQA().duration);await card.click();await expect(page.locator('body')).toHaveClass(/model-view/);await context.close();
});
