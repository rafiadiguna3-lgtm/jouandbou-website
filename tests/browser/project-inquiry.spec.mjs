import {test,expect,devices} from '@playwright/test';
import {projects} from '../../site/project-catalog.mjs';
for(const phone of [false,true])test(`project inquiries preserve the project and studio contact (${phone?'phone':'desktop'})`,async({browser})=>{
 const context=await browser.newContext(phone?devices['iPhone 13']:{viewport:{width:1280,height:800}}),page=await context.newPage();
 for(const project of projects){
  await page.goto(project.path);
  const panel=page.locator(project.kind==='jou'?`#${project.panel}`:'#bou-content .bou-project');
  await expect(panel).toBeVisible();
  const link=panel.locator('.project-inquiry a');await expect(link).toHaveCount(1);await link.scrollIntoViewIfNeeded();await expect(link).toBeVisible();
  const url=new URL(await link.getAttribute('href'));
  expect(url.origin+url.pathname).toBe('https://wa.me/628118111439');
  await expect(link).toHaveText('lets talk~');
  expect(url.searchParams.get('text')).toBe(`Halo Jou and Bou, saya tertarik dengan proyek ${project.name}. Boleh ngobrol lebih lanjut?\n\nhttps://jouandbou.com${project.path}`);
  expect(url.searchParams.get('text')).toContain('https://jouandbou.com'+project.path);
  await expect(link).toHaveAttribute('target','_blank');
  const before=await link.boundingBox();
  const share=panel.locator('button[data-share-url]');await expect(share).toBeVisible();await expect(share).toHaveAttribute('data-share-url','https://jouandbou.com'+project.path);const shareRect=await share.boundingBox();expect(shareRect.x).toBeGreaterThanOrEqual(0);expect(shareRect.x+shareRect.width).toBeLessThan(before.x);expect(shareRect.y+shareRect.height).toBeLessThanOrEqual(page.viewportSize().height);
  await page.locator(project.kind==='jou'?`#${project.panel} .project-scroll`:'#bou-page').evaluate(el=>{el.scrollTop=el.scrollHeight;});
  const after=await link.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  expect(after.y+after.height).toBeLessThanOrEqual((await page.viewportSize()).height);
  const rect=await link.boundingBox();expect(rect.width).toBeGreaterThan(100);expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.x+rect.width).toBeLessThanOrEqual((await page.viewportSize()).width);
 }
 await context.close();
});
test('inquiries remain usable without application JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 for(const project of projects){await page.goto(project.path);await expect(page.locator('#project-static-content .project-inquiry a')).toHaveAttribute('href',new RegExp('^https://wa.me/628118111439\\?text='));}
 await context.close();
});

test('inquiry appears when entering details from the map even with old inquiry assets cached',async({page})=>{
 await page.route('**/project-inquiry-init.mjs?v=1',route=>route.fulfill({contentType:'text/javascript',body:''}));
 await page.route('**/project-inquiry.css?v=1',route=>route.fulfill({contentType:'text/css',body:'.project-inquiry{display:none}'}));
 await page.goto('/#projects');
 await page.locator('#search-toggle').click();await page.locator('#search').fill('Rumah Anas');
 await page.locator('#results button').first().click();await page.locator('.house-callout-card').click();await page.locator('#more').click();
 await expect(page.locator('#rumah-anas')).toBeVisible();
 const link=page.locator('#rumah-anas .project-inquiry a');await expect(link).toBeVisible();await expect(link).toHaveText('lets talk~');
 await expect(page.locator('#rumah-anas .project-inquiry')).toHaveCSS('position','fixed');
 await page.locator('#rumah-anas .close').click();await expect(link).toBeHidden();
});
