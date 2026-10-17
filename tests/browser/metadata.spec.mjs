import {test,expect} from '@playwright/test';

test('initial HTML contains the final brand and plain-text search metadata without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 await page.goto('/');await expect(page).toHaveTitle('Jou and Bou | Architecture & Interior Design Studio');
 const description='Jou and Bou is a Jakarta-based architecture and interior design studio creating thoughtful, functional spaces through creative design solutions.';
 await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',description);
 await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content','Jou and Bou is a Jakarta-based architecture and interior design studio creating thoughtful, functional spaces.');
 await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Jou and Bou | Architecture & Interior Design Studio');
 await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content','jou and bou');
 await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://jouandbou.com/assets/brand/jou-and-bou-white-180-v143.png');
 await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content','https://jouandbou.com/assets/brand/jou-and-bou-white-180-v143.png');
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://jouandbou.com/');
 const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
 expect(schema).toEqual({'@context':'https://schema.org','@type':'WebSite',name:'jou and bou',url:'https://jouandbou.com/',image:'https://jouandbou.com/assets/brand/jou-and-bou-white-180-v143.png'});
 await context.close();
});

test('refresh keeps the homepage title while application JavaScript is delayed',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/app.mjs?*',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/#projects',{waitUntil:'commit'});await expect(page).toHaveTitle('Jou and Bou | Architecture & Interior Design Studio');
  await page.reload({waitUntil:'commit'});await expect(page).toHaveTitle('Jou and Bou | Architecture & Interior Design Studio');
 }finally{release();}
 await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
 await expect(page).toHaveTitle('Jou and Bou | Architecture & Interior Design Studio');
 await page.locator('#studio').click();await expect(page).toHaveTitle('jou and bou - about us');
 await page.locator('header .brand').click();await expect(page).toHaveTitle('Jou and Bou | Architecture & Interior Design Studio');
});
