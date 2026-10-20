import {test,expect,devices} from '@playwright/test';
const cases=[['small-phone',{viewport:{width:320,height:568},isMobile:true,hasTouch:true}],['iphone',devices['iPhone 13']],['android',devices['Pixel 7']],['phone-landscape',{viewport:{width:844,height:390},isMobile:true,hasTouch:true}],['tablet-portrait',{viewport:{width:768,height:1024},hasTouch:true}],['tablet-landscape',{viewport:{width:1024,height:768},hasTouch:true}],['narrow-desktop',{viewport:{width:820,height:900}}],['short-desktop',{viewport:{width:1024,height:500}}],['laptop',{viewport:{width:1280,height:720}}],['retina-desktop',{viewport:{width:1440,height:900},deviceScaleFactor:2}],['4k-desktop',{viewport:{width:3840,height:2160}}]];
for(const [name,options] of cases)test(`responsive audit: ${name}`,async({browser},info)=>{
 const context=await browser.newContext(options),page=await context.newPage(),errors=[],bad=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:4173/'))bad.push(`${r.status()} ${r.url()}`)});
 const snap=async(label)=>{await page.screenshot({path:info.outputPath(`${name}-${label}.png`)});};
 const fits=async(selector)=>{const r=await page.locator(selector).boundingBox();expect(r,selector).not.toBeNull();const {width,height}=page.viewportSize();expect(r.x,selector).toBeGreaterThanOrEqual(-1);expect(r.y,selector).toBeGreaterThanOrEqual(-1);expect(r.x+r.width,selector).toBeLessThanOrEqual(width+1);expect(r.y+r.height,selector).toBeLessThanOrEqual(height+1)};
 try{
 await page.goto('/');await expect(page.locator('#phone-map-guide h1 span')).toHaveText('jou world');await expect(page.locator('.world-info')).toHaveCSS('opacity','1');
 await fits('.world-guidance');await fits('header .brand');await snap('intro');
 await page.mouse.move(100,150);await page.mouse.down();await page.mouse.move(135,150,{steps:4});await page.mouse.up();await expect(page.locator('#phone-map-guide')).toHaveCount(0);await expect(page.locator('#viewport')).toHaveCSS('filter','none');await expect(page.locator('.house-callout')).toHaveAttribute('aria-hidden','true');
 for(const s of ['#map-reset','#map-zoom-in','#map-zoom-out'])await fits(s);await snap('home');
 const menu=page.locator('#menu-toggle'),compact=await menu.isVisible();
 if(compact){await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true');await fits('#main-nav');await snap('menu');await page.locator('#phone-search-action').click();}else await page.locator('#search-toggle').click();
 await expect(page.locator('#search')).toBeVisible();await page.locator('#search').fill('Rumah Anas');await expect(page.locator('#results button').first()).toBeVisible();await fits('#results');await snap('search');await page.locator('#results button').first().click();await expect(page.locator('.house-callout-card')).toBeVisible();await snap('selection');
 await expect.poll(async()=>{const r=await page.locator('.house-callout-card').boundingBox();return r?.y||0}).toBeGreaterThan(56);await page.locator('.house-callout-card').click();await expect(page.locator('body')).toHaveClass(/model-view/);await expect(page.locator('#more')).toBeVisible();await fits('#more');await snap('3d');await page.locator('#more').click();await expect(page.locator('#rumah-anas')).toBeVisible();
 const wa=page.locator('#rumah-anas .project-inquiry a');await expect(wa).toBeVisible();await fits('#rumah-anas .project-inquiry a');expect(new URL(await wa.getAttribute('href')).searchParams.get('text')).toContain('Boleh ngobrol lebih lanjut?');await fits(compact?'#menu-toggle':'#rumah-anas .close');await snap('details');await page.locator(compact?'#menu-toggle':'#rumah-anas .close').click();
 if(compact)await menu.click();await page.locator('#studio').click();await expect(page.locator('#about-page')).toBeVisible();await snap('about');
 if(compact)await menu.click();await page.locator('#contact').click();await expect(page.locator('body')).toHaveClass(/view-contact/);await snap('contact');
 await page.locator('header .brand').click();await expect(page.locator('body')).not.toHaveClass(/view-contact|view-about|model-view/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);expect(errors).toEqual([]);expect([...new Set(bad)]).toEqual([]);
 }finally{await context.close();}
});
