import {test,expect} from '@playwright/test';
test('project URLs open correct details, reload, and follow Back/Forward',async({page})=>{
 for(const [slug,id] of [['rumah-anas','rumah-anas'],['rumahsoka','rumasoka'],['jangkrik','jangkrik'],['flute','flute'],['rumah-zubair','zubair'],['rr-house','rr-house'],['marboy','marboy'],['rempoa-padel','rempoa'],['cipete','jh37']]){
  await page.goto('/#project/'+slug);await expect(page.locator('#'+id)).toBeVisible();
  await expect(page).toHaveURL(new RegExp('#project/'+slug+'$'));
 }
 await page.goto('/#projects');await page.reload();await page.locator('#search-toggle').click();await page.locator('#search').fill('Rumah Anas');await page.locator('#results button').first().click();await page.locator('#more').click();
 await expect(page).toHaveURL(/#project\/rumah-anas$/);
 await page.goBack();await expect(page.locator('#rumah-anas')).toBeHidden();
 await page.goForward();await expect(page.locator('#rumah-anas')).toBeVisible();
 await page.reload();await expect(page.locator('#rumah-anas')).toBeVisible();
 await page.locator('#rumah-anas .close').click();await expect(page).toHaveURL(/#projects$/);
});
test('phone multi-photo arrows stay visible and advance photographs',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();await page.goto('/#project/rumah-anas');
 const gallery=page.locator('#rumah-anas .gallery-with-arrows').first();await gallery.scrollIntoViewIfNeeded();
 const next=gallery.locator('.gallery-arrow-next');await expect(next).toHaveCSS('opacity','1');await expect(next).toBeEnabled();
 const track=gallery.locator('.slide-track,.project-ribbon-track');const before=await track.evaluate(el=>el.scrollLeft);await next.click();await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeGreaterThan(before+20);
 await expect(gallery.locator('.gallery-arrow-prev')).toBeEnabled();await context.close();
});
test('desktop multi-photo arrows appear on hover',async({page})=>{
 await page.goto('/#project/rumah-anas');const gallery=page.locator('#rumah-anas .gallery-with-arrows').first();await gallery.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
 await expect(gallery.locator('.gallery-arrow-next')).toHaveCSS('opacity','0');await gallery.hover();await expect(gallery.locator('.gallery-arrow-next')).toHaveCSS('opacity','1');
});
