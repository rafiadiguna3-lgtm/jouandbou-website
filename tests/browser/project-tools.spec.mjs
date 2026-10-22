import {test,expect,devices} from '@playwright/test';
for(const phone of [false,true])test(`unified Jou and Bou search (${phone?'phone':'desktop'})`,async({browser})=>{
 const c=await browser.newContext(phone?devices['iPhone 13']:{viewport:{width:1280,height:800}}),p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('/');
 const open=async()=>{if(phone){await p.locator('#menu-toggle').click();await p.locator('#phone-search-action').click();}else await p.locator('#search-toggle').click();};
 await open();for(const name of ['Diantara','Temu','Koru','Selebu','Sabang','Ikat','Raindeer']){await p.locator('#search').fill(name);await expect(p.locator('#results button').first()).toContainText(new RegExp(name,'i'));}await p.locator('#search').fill('Temu');await expect(p.locator('#results button')).toContainText('Temu');await p.locator('#search').press('Enter');await expect(p).toHaveURL(/\/projects\/bou\/temu\/$/);await expect(p.locator('.bou-project h1')).toHaveText('temu');await expect(p.locator('body')).not.toHaveClass(/search-open/);
 await p.goto('/');await open();await p.locator('#search').fill('rumah anass');await expect(p.locator('#results')).toContainText('Did you mean?');await p.locator('#results button').click();await expect(p.locator('.house-callout-name')).toHaveText('Rumah Anas');
 expect(errors).toEqual([]);await expect(p.locator('.house-callout-status')).toHaveCount(0);await c.close();
});
test('homepage fallback works with JavaScript disabled and links to existing project pages',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:568}}),p=await c.newPage();await p.goto('/');await expect(p.locator('#site-fallback')).toBeVisible();await expect(p.locator('#site-fallback nav a')).toHaveCount(15);await p.locator('#site-fallback a[href="/projects/rumah-anas/"]').click();await expect(p.locator('#project-static-content h1')).toHaveText('Rumah Anas');await expect(p.locator('#site-fallback')).toBeHidden();await c.close();
});
test('failed app loading reveals fallback and healthy loading keeps it hidden',async({browser})=>{
 const c=await browser.newContext(),p=await c.newPage();await p.route('**/app.mjs*',r=>r.abort());for(const url of ['/', '/#about', '/#project/rumah-anas']){await p.goto(url);await expect(p.locator('#site-fallback')).toBeVisible({timeout:15000});await expect(p.locator('#site-fallback a[href^="https://wa.me/"]')).toBeVisible();}await c.close();
 const healthy=await browser.newContext(),q=await healthy.newPage();await q.goto('/');await expect(q.locator('#phone-map-guide')).toBeVisible();await expect(q.locator('#site-fallback')).toBeHidden();await healthy.close();
});
test('healthy About entry never becomes a map-failure screen',async({page})=>{
 await page.clock.install();await page.goto('/#about');await expect(page.locator('#about-page')).toBeVisible();await page.clock.fastForward(13000);await expect(page.locator('#site-fallback')).toBeHidden();await expect(page.locator('#about-page')).toBeVisible();
});
test('silent startup failure triggers the timed fallback',async({page})=>{
 await page.clock.install();await page.route('**/app.mjs*',r=>r.fulfill({contentType:'text/javascript',body:''}));await page.goto('/');await expect(page.locator('#site-fallback')).toBeHidden();await page.clock.fastForward(13000);await expect(page.locator('#site-fallback')).toBeVisible();await expect(page.locator('html')).not.toHaveClass(/world-intro-pending/);
});

test('detail appearance retains the original controls without new share or status labels',async({page})=>{await page.goto('/projects/rumah-anas/');await expect(page.locator('#rumah-anas')).toBeVisible();await expect(page.locator('#rumah-anas .project-inquiry a')).toHaveText('lets talk~');await expect(page.locator('.project-share,.house-callout-status')).toHaveCount(0);});
