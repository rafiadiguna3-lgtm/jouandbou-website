import {test,expect} from '@playwright/test';
import {projects} from '../../site/project-catalog.mjs';

const homeTitle='Jou and Bou | Architecture & Interior Design Studio';
test('every public project returns its own metadata and readable content without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 for(const p of projects){
  const response=await page.goto(p.path);expect(response.status()).toBe(200);
  await expect(page).toHaveTitle(`${p.name} | Jou and Bou`);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://jouandbou.com'+p.path);
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content',p.description);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://jouandbou.com/'+p.shareImage);
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content','image/jpeg');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
  await expect(page.locator('#project-static-content h1')).toHaveText(p.name);
  await expect(page.locator('#project-static-content')).toContainText(p.description);
  await expect(page.locator('#viewport')).toBeHidden();
  const image=await page.request.get('/'+p.shareImage);expect(image.ok()).toBe(true);expect(image.headers()['content-type']).toContain('image/jpeg');
  expect(await page.locator('script[type="application/ld+json"]').evaluate(el=>JSON.parse(el.textContent)['@graph'][0].name)).toBe(p.name);
 }
 await page.goto('/projects/');await expect(page.locator('.projects a')).toHaveCount(projects.length);
 await context.close();
});

test('clean URLs and legacy links hydrate the same detail UI with working galleries',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const p of projects){
  await page.goto(p.path);await expect(page.locator('#project-static-content')).toHaveCount(0);
  if(p.kind==='jou')await expect(page.locator('#'+p.panel)).toBeVisible();else await expect(page.locator('#bou-content .bou-project h1')).toHaveText(p.name.toLowerCase());
  await expect(page).toHaveURL(new RegExp(p.path+'$'));await expect(page).toHaveTitle(`${p.name} | Jou and Bou`);
 }
 await page.goto('/#project/marboy');await expect(page).toHaveURL(/\/projects\/marboy-house\/$/);await expect(page.locator('#marboy')).toBeVisible();
 await page.locator('#marboy .close').click();await expect(page).toHaveURL(/\/#projects$/);await expect(page).toHaveTitle(homeTitle);
 expect(errors).toEqual([]);
});

test('nested project navigation restores home metadata and preserves Back/Forward',async({page})=>{
 await page.goto('/projects/rumah-anas/');await expect(page.locator('#rumah-anas')).toBeVisible();
 await page.locator('#rumah-anas .close').click();await expect(page).toHaveURL(/\/#projects$/);
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://jouandbou.com/');
 await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://jouandbou.com/assets/brand/jou-and-bou-share-solid-v3.png');
 await page.locator('#back').click();await page.locator('#search-toggle').click();await page.locator('#search').fill('RR House');await page.locator('#results button').first().click();await page.locator('.house-callout-card').click();await page.locator('#more').click();
 await expect(page).toHaveURL(/\/projects\/rr-house\/$/);await expect(page).toHaveTitle('RR House | Jou and Bou');
 await page.goBack();await expect(page).toHaveURL(/\/#projects$/);await expect(page.locator('#rr-house')).toBeHidden();
 await page.goForward();await expect(page.locator('#rr-house')).toBeVisible();await expect(page).toHaveTitle('RR House | Jou and Bou');
 await page.reload();await expect(page.locator('#rr-house')).toBeVisible();await page.locator('.brand').click();await expect(page).toHaveURL(/\/#projects$/);await expect(page).toHaveTitle(homeTitle);
});

test('project content remains readable while application scripts are blocked',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/app.mjs?*',async route=>{await gate;await route.continue();});
 try{await page.goto('/projects/flute-house/',{waitUntil:'commit'});await expect(page.locator('#project-static-content h1')).toHaveText('Flute House');await expect(page).toHaveTitle('Flute House | Jou and Bou');}finally{release();}
 await expect(page.locator('#flute')).toBeVisible();await expect(page.locator('#project-static-content')).toHaveCount(0);
});

test('Bou project and back links keep SPA navigation without losing the root asset base',async({page})=>{
 await page.goto('/#bou-works');await expect(page.locator('.bou-project-picker')).toBeVisible();
 const navigations=[];page.on('request',request=>{if(request.isNavigationRequest()&&request.frame()===page.mainFrame())navigations.push(request.url());});
 const link=page.locator('a[href="/projects/bou/temu/"]');await link.click();
 await expect(page).toHaveURL(/\/projects\/bou\/temu\/$/);await expect(page.locator('.bou-project')).toBeVisible();
 await expect(page.locator('base')).toHaveAttribute('href','/');
 await page.locator('.bou-back').click();await expect(page).toHaveURL(/\/#bou-works$/);await expect(page.locator('.bou-project-picker')).toBeVisible();expect(navigations).toEqual([]);
 await page.goBack();await expect(page).toHaveURL(/\/projects\/bou\/temu\/$/);await expect(page.locator('.bou-project')).toBeVisible();
});
