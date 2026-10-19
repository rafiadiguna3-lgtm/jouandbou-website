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
  expect(url.searchParams.get('text')).toContain(project.name);
  expect(url.searchParams.get('text')).toContain('https://jouandbou.com'+project.path);
  await expect(link).toHaveAttribute('target','_blank');
  const rect=await link.boundingBox();expect(rect.width).toBeGreaterThan(100);expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.x+rect.width).toBeLessThanOrEqual((await page.viewportSize()).width);
 }
 await context.close();
});
test('inquiries remain usable without application JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 for(const project of projects){await page.goto(project.path);await expect(page.locator('#project-static-content .project-inquiry a')).toHaveAttribute('href',new RegExp('^https://wa.me/628118111439\\?text='));}
 await context.close();
});
