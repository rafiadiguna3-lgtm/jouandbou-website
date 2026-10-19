import { test, expect } from '@playwright/test';
for(const hash of ['#projects','#about','#contact','#bou-works','#bou-works/temu']){
 test(`reload preserves ${hash} without showing another section while routing loads`,async({page})=>{
  let unblock;const gate=new Promise(resolve=>unblock=resolve);let delay=false;
  await page.route(/\/about\.mjs(?:\?|$)/,async route=>{if(delay)await gate;await route.continue();});
  await page.goto('/'+hash);
  const expected=hash.startsWith('#bou-works')?'#bou-page':hash==='#about'?'#about-page':hash==='#contact'?'#contact-page':'#viewport';
  await expect(page.locator(expected)).toBeVisible();
  delay=true;
  await page.reload({waitUntil:'commit'});
  try{
   await page.waitForFunction(()=>document.querySelector('#bou-page'));
   if(expected!=='#viewport')await expect(page.locator('#viewport')).toBeHidden();
   for(const selector of ['#about-page','#contact-page','#bou-page'])if(selector!==expected)await expect(page.locator(selector)).toBeHidden();
  }finally{unblock();}
  await expect(page.locator(expected)).toBeVisible();
  await expect(page).toHaveURL(new RegExp((hash==='#bou-works/temu'?'/projects/bou/temu/':hash).replace('/','\\/')+'$'));
  if(hash==='#bou-works/temu')await expect(page.locator('.bou-project')).toBeVisible();
 });
}
