import {test,expect,devices} from '@playwright/test';
for(const phone of [false,true])test(`unified search and preview status (${phone?'phone':'desktop'})`,async({browser})=>{
 const c=await browser.newContext(phone?devices['iPhone 13']:{viewport:{width:1280,height:800}}),p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('/');
 const open=async()=>{if(phone){await p.locator('#menu-toggle').click();await p.locator('#phone-search-action').click();}else await p.locator('#search-toggle').click();};
 await open();for(const name of ['Diantara','Temu','Koru','Selebu','Sabang','Ikat','Raindeer']){await p.locator('#search').fill(name);await expect(p.locator('#results button').first()).toContainText(new RegExp(name,'i'));}await p.locator('#search').fill('Temu');await expect(p.locator('#results button')).toContainText('Temu');await p.locator('#search').press('Enter');await expect(p).toHaveURL(/\/projects\/bou\/temu\/$/);await expect(p.locator('.bou-project h1')).toHaveText('temu');await expect(p.locator('body')).not.toHaveClass(/search-open/);
 await p.goto('/');await open();await p.locator('#search').fill('rumah anass');await expect(p.locator('#results')).toContainText('Did you mean?');await p.locator('#results button').click();await expect(p.locator('.house-callout-name')).toHaveText('Rumah Anas');
 await open();await p.locator('#search').fill('37');await expect(p.locator('#results button')).toContainText('Under construction');await p.locator('#results button').click();await expect(p.locator('.house-callout-status')).toHaveText('Under construction');await p.locator('.house-callout-card').click();await expect(p.locator('#more')).toContainText('Progress update');await expect(p.locator('#category')).toHaveText('Under construction');await p.locator('#back').click();await open();await p.locator('#search').fill('53');await expect(p.locator('#results button')).toContainText('3D preview · details coming soon');await p.locator('#results button').click();await expect(p.locator('.house-callout-status')).toHaveText('3D preview');expect(errors).toEqual([]);await c.close();
});
test('share copies the canonical link, handles cancel, and provides a manual fallback',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.copied=text}});});
 await page.goto('/projects/rumah-anas/');const root=page.locator('#rumah-anas .project-share');await root.locator('button').click();await expect(root).toContainText('Link copied');expect(await page.evaluate(()=>window.copied)).toBe('https://jouandbou.com/projects/rumah-anas/');
 await page.evaluate(()=>{window.copied=null;Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Cancelled','AbortError')}});});await root.locator('button').click();expect(await page.evaluate(()=>window.copied)).toBe(null);await expect(root.locator('input')).toHaveCount(0);
 await page.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});});await root.locator('button').click();await expect(root.locator('input')).toHaveValue('https://jouandbou.com/projects/rumah-anas/');
 await page.goto('/projects/bou/temu/');await expect(page.locator('.bou-project button[data-share-url]')).toHaveAttribute('data-share-url','https://jouandbou.com/projects/bou/temu/');
});
test('homepage fallback works with JavaScript disabled and links to existing project pages',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:568}}),p=await c.newPage();await p.goto('/');await expect(p.locator('#site-fallback')).toBeVisible();await expect(p.locator('#site-fallback nav a')).toHaveCount(15);await p.locator('#site-fallback a[href="/projects/rumah-anas/"]').click();await expect(p.locator('#project-static-content h1')).toHaveText('Rumah Anas');await expect(p.locator('#site-fallback')).toBeHidden();await c.close();
});
test('failed app loading reveals fallback and healthy loading keeps it hidden',async({browser})=>{
 const c=await browser.newContext(),p=await c.newPage();await p.route('**/app.mjs*',r=>r.abort());await p.goto('/');await expect(p.locator('#site-fallback')).toBeVisible({timeout:15000});await expect(p.locator('#site-fallback a[href^="https://wa.me/"]')).toBeVisible();await c.close();
 const healthy=await browser.newContext(),q=await healthy.newPage();await q.goto('/');await expect(q.locator('#phone-map-guide')).toBeVisible();await expect(q.locator('#site-fallback')).toBeHidden();await healthy.close();
});
test('healthy About entry never becomes a map-failure screen',async({page})=>{
 await page.clock.install();await page.goto('/#about');await expect(page.locator('#about-page')).toBeVisible();await page.clock.fastForward(13000);await expect(page.locator('#site-fallback')).toBeHidden();await expect(page.locator('#about-page')).toBeVisible();
});
test('silent startup failure triggers the timed fallback',async({page})=>{
 await page.clock.install();await page.route('**/app.mjs*',r=>r.fulfill({contentType:'text/javascript',body:''}));await page.goto('/');await expect(page.locator('#site-fallback')).toBeHidden();await page.clock.fastForward(13000);await expect(page.locator('#site-fallback')).toBeVisible();await expect(page.locator('html')).not.toHaveClass(/world-intro-pending/);
});
