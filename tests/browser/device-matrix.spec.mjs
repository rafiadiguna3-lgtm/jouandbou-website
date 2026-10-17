import {test,expect,devices} from '@playwright/test';

const cases=[
 ['small-phone',{viewport:{width:320,height:568},isMobile:true,hasTouch:true},true],
 ['iphone',devices['iPhone 13'],true],
 ['android',devices['Pixel 7'],true],
 ['phone-landscape',{viewport:{width:844,height:390},isMobile:true,hasTouch:true},true],
 ['tablet-portrait',{viewport:{width:768,height:1024},hasTouch:true},true],
 ['tablet-landscape',{viewport:{width:1024,height:768},hasTouch:true},true],
 ['narrow-desktop',{viewport:{width:820,height:900}},true],
 ['short-desktop',{viewport:{width:1024,height:500}},true],
 ['laptop',{viewport:{width:1280,height:720}},false],
 ['retina-desktop',{viewport:{width:1440,height:900},deviceScaleFactor:2},false],
 ['4k-desktop',{viewport:{width:3840,height:2160}},false]
];
for(const [name,options,compact] of cases){
 test(`device baseline: ${name}`,async({browser},testInfo)=>{
  const context=await browser.newContext(options),page=await context.newPage();
  try{
   await page.goto('/');await page.waitForFunction(()=>document.querySelector('header [aria-current]'));
   await expect(page.locator('#phone-intro'))[compact?'toBeVisible':'toBeHidden']();
   await expect(page.locator('.search-wrap'))[compact?'toBeHidden':'toBeVisible']();
   const selectors=['.brand','#home-summary','#map-reset','#map-zoom-in','#map-zoom-out',...(compact?['#phone-intro','#phone-intro-guide']:[])];
   for(const selector of selectors){
    const geometry=await page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return {inside:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,width:r.width,height:r.height,overflow:el.scrollWidth>el.clientWidth+1};});
    expect(geometry.inside,`${selector} stays in viewport`).toBe(true);
    expect(geometry.overflow,`${selector} content fits`).toBe(false);
    if(selector.startsWith('#map-')){expect(geometry.width).toBe(46);expect(geometry.height).toBe(46);}
   }
   if(compact&&options.viewport.height>options.viewport.width){const gap=await page.evaluate(()=>document.querySelector('#phone-intro').getBoundingClientRect().top-document.querySelector('header').getBoundingClientRect().bottom);expect(gap).toBeCloseTo(28,0);}
   await page.screenshot({path:testInfo.outputPath(`${name}-home.png`)});
   await testInfo.attach('home baseline',{path:testInfo.outputPath(`${name}-home.png`),contentType:'image/png'});
   await page.locator('#map-zoom-in').click();
   if(compact)await expect(page.locator('#phone-intro')).toHaveCSS('opacity','0');
   await page.locator('#map-reset').click();
   await expect(page.locator('#map')).toBeVisible();
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }finally{await context.close();}
 });
}
