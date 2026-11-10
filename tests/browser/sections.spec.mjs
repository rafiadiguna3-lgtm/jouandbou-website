import {test,expect,devices} from '@playwright/test';
const entries=[['about-us','about us','#about-page'],['jou-works','jou works','#viewport'],['bou-works','bou works','.bou-index']];
test('each primary section serves real lowercase metadata and readable content without JavaScript',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false}),p=await c.newPage();
 for(const [slug,name] of entries){
  const response=await p.goto('/'+slug+'/');expect(response.status()).toBe(200);
  await expect(p).toHaveTitle(`${name} | jou and bou studio`);
  await expect(p.locator('link[rel=canonical]')).toHaveAttribute('href',`https://jouandbou.com/${slug}/`);
  await expect(p.locator('meta[property="og:url"]')).toHaveAttribute('content',`https://jouandbou.com/${slug}/`);
  await expect(p.locator('meta[property="og:title"]')).toHaveAttribute('content',`${name} | jou and bou studio`);
  await expect(p.locator('#section-static-content')).toBeVisible();
  await expect(p.locator('#site-fallback')).toBeHidden();
  await expect(p.locator('#section-static-content h1').first()).toHaveText(name);
  expect((await p.locator('#section-static-content').innerText()).length).toBeGreaterThan(100);
  if(slug!=='about-us')await expect(p.locator('#section-static-content .section-projects article')).toHaveCount(slug==='jou-works'?8:7);
  const schema=await p.locator('script[type="application/ld+json"]').evaluate(e=>JSON.parse(e.textContent));expect(schema.url).toBe(`https://jouandbou.com/${slug}/`);expect(schema.name).toBe(name);
 }
 await c.close();
});
for(const phone of [false,true])test(`clean section URLs hydrate existing UI, preserve history and shareable projects (${phone?'phone':'desktop'})`,async({browser})=>{
 const c=await browser.newContext(phone?devices['iPhone 13']:{viewport:{width:1440,height:900}}),p=await c.newPage();const errors=[],bad=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:4173'))bad.push(r.url());});
 for(const [slug,name,selector] of entries){
  await p.goto('/'+slug+'/');await expect(p.locator('#section-static-content')).toHaveCount(0);await expect(p.locator(selector)).toBeVisible();
  await expect(p).toHaveURL(new RegExp('/'+slug+'/$'));await expect(p).toHaveTitle(`${name} | jou and bou studio`);
  await expect(p.locator('link[rel=canonical]')).toHaveAttribute('href',`https://jouandbou.com/${slug}/`);
  expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 await p.locator('#bou-page a[href="/projects/bou/temu/"]').click();await expect(p).toHaveURL(/\/projects\/bou\/temu\/$/);await expect(p.locator('.bou-project')).toBeVisible();
 await p.locator('.bou-back').click();await expect(p).toHaveURL(/\/bou-works\/$/);await expect(p.locator('.bou-index')).toBeVisible();
 await p.goBack();await expect(p.locator('.bou-project')).toBeVisible();await p.goBack();await expect(p.locator('.bou-index')).toBeVisible();
 await p.goto('/about-us/');await expect(p.locator('#about-page')).toBeVisible();await p.locator('.about-work[href="/jou-works/"]').click();await expect(p).toHaveURL(/\/jou-works\/$/);await expect(p.locator('#map')).toBeVisible();
 await p.locator('header .brand').click();await expect(p).toHaveURL(/\/#projects$/);await expect(p).toHaveTitle('jou and bou studio');
 expect(errors).toEqual([]);expect([...new Set(bad)]).toEqual([]);await c.close();
});
test('blocked application keeps each section readable instead of leaving an empty screen',async({page})=>{
 await page.route('**/app.mjs*',r=>r.abort());
 for(const [slug,name] of entries){await page.goto('/'+slug+'/');await expect(page.locator('#section-static-content')).toBeVisible();await expect(page.locator('#section-static-content h1').first()).toHaveText(name);}
});

test('before the interactive UI is ready a section project link performs a real navigation',async({page})=>{
 let release,arrived;const gate=new Promise(r=>release=r),requested=new Promise(r=>arrived=r);
 await page.route('**/about.mjs?*',async route=>{arrived();await gate;try{await route.continue();}catch{}});
 try{
  await page.goto('/jou-works/',{waitUntil:'commit'});await requested;
  await expect(page.locator('#section-static-content')).toBeVisible();
  const navigation=page.waitForRequest(r=>r.isNavigationRequest()&&r.url().endsWith('/projects/rumah-anas/'));
  await page.locator('#section-static-content a[href="/projects/rumah-anas/"]').click({noWaitAfter:true});await navigation;
  await expect(page.locator('#project-static-content h1')).toHaveText('Rumah Anas');
 }finally{release();}
});
