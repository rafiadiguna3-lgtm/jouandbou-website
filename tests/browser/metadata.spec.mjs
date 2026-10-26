import {test,expect} from '@playwright/test';

test('initial HTML contains the final brand and plain-text search metadata without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 await page.goto('/');await expect(page).toHaveTitle('jou and bou studio');
 const description='Jou and Bou is a Jakarta-based architecture and interior design studio creating thoughtful, functional spaces through creative design solutions.';
 await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',description);
 await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content','Jou and Bou is a Jakarta-based architecture and interior design studio creating thoughtful, functional spaces.');
 await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','jou and bou studio');
 await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content','jou and bou studio');
 await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://jouandbou.com/assets/brand/jou-and-bou-share-solid-v3.png');
 await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content','https://jouandbou.com/assets/brand/jou-and-bou-share-solid-v3.png');
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://jouandbou.com/');
 const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
 expect(schema).toEqual({'@context':'https://schema.org','@type':'WebSite',name:'jou and bou studio',url:'https://jouandbou.com/',image:'https://jouandbou.com/assets/brand/jou-and-bou-share-solid-v3.png'});
 const image=await page.request.get('/assets/brand/jou-and-bou-share-solid-v3.png');expect(image.ok()).toBe(true);expect(image.headers()['content-type']).toContain('image/png');const bytes=await image.body();expect(bytes.readUInt32BE(16)).toBe(1200);expect(bytes.readUInt32BE(20)).toBe(1200);
 await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content','1200');
 await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content','1200');
 await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
 const favicon=await page.locator('link[rel="icon"]').first().getAttribute('href');expect(favicon).toBe('/favicon.ico');
 const icon=await page.request.get(favicon);expect(icon.ok()).toBe(true);const iconBytes=await icon.body();expect(iconBytes.readUInt16LE(2)).toBe(1); // Local static server serves the white ICO fallback.
 await context.close();
});

test('refresh keeps the homepage title while application JavaScript is delayed',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/app.mjs?*',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/#projects',{waitUntil:'commit'});await expect(page).toHaveTitle('jou and bou studio');
  await page.reload({waitUntil:'commit'});await expect(page).toHaveTitle('jou and bou studio');
 }finally{release();}
 await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 await expect(page).toHaveTitle('jou and bou studio');
 await page.locator('#studio').click();await expect(page).toHaveTitle('jou and bou - about us');
 await page.locator('header .brand').click();await expect(page).toHaveTitle('jou and bou studio');
});

test('one Worker favicon URL stays stable in both themes without runtime replacement',async({browser})=>{
 for(const colorScheme of ['dark','light']){
  const context=await browser.newContext({colorScheme}),page=await context.newPage();
  await page.goto('/');
  const icon=page.locator('#site-favicon');
  await expect(icon).toHaveAttribute('href','/favicon.ico');
  await expect(icon).toHaveAttribute('sizes','48x48');
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  await expect(page.locator('script[src*="browser-tab-icon"]')).toHaveCount(0);
  await page.mouse.click(710,1200);
  await expect(icon).toHaveAttribute('href','/favicon.ico');
  await context.close();
 }
});

test('Worker favicon URL is available while the 3D application is blocked',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/app.mjs?*',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/',{waitUntil:'commit'});
  await expect(page.locator('#site-favicon')).toHaveAttribute('href','/favicon.ico');
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content','jou and bou studio');
 }finally{release();}
});
