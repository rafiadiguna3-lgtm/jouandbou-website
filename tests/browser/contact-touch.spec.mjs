import {test,expect} from '@playwright/test';
test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
for(const backend of ['vector','raster'])test(`contact ${backend} map lets one finger scroll the page and two fingers zoom`,async({page})=>{
 await page.route('https://tiles.openfreemap.org/**',route=>route.fulfill({json:{version:8,sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#182638'}}]}}));
 await page.route('https://tile.openstreetmap.org/**',route=>route.abort());
 await page.route('**/vendor/maplibre/maplibre-gl.js',async route=>{
  if(backend==='raster'){await route.abort();return;}
  const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nconst BaseMap=window.maplibregl.Map;window.maplibregl.Map=class extends BaseMap{constructor(options){super(options);window.contactTestMap=this;}};'});
 });
 if(backend==='raster')await page.route('**/vendor/leaflet/leaflet.js',async route=>{
  const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nconst baseMap=window.L.map;window.L.map=(...args)=>window.contactTestMap=baseMap(...args);'});
 });
 await page.goto('/#contact');
 await page.waitForFunction(()=>window.contactTestMap);
 await page.locator('#studio-map').scrollIntoViewIfNeeded();
 const bounds=await page.locator('#studio-map').boundingBox();
 const x=bounds.x+bounds.width*.5,y=Math.min(650,bounds.y+bounds.height*.65);
 const before=await page.locator('#contact-page').evaluate(el=>el.scrollTop);
 const center=await page.evaluate(()=>JSON.stringify(window.contactTestMap.getCenter()));
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*18}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(()=>page.locator('#contact-page').evaluate(el=>el.scrollTop)).toBeGreaterThan(before+30);
 expect(await page.evaluate(()=>JSON.stringify(window.contactTestMap.getCenter()))).toBe(center);
 await page.locator('#studio-map').scrollIntoViewIfNeeded();
 const b=await page.locator('#studio-map').boundingBox(),cx=b.x+b.width*.5,cy=Math.max(200,Math.min(600,b.y+b.height*.5));
 const zoom=await page.evaluate(()=>window.contactTestMap.getZoom());
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-30,y:cy,id:0},{x:cx+30,y:cy,id:1}]});
 for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-30-i*7,y:cy,id:0},{x:cx+30+i*7,y:cy,id:1}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(()=>page.evaluate(()=>window.contactTestMap.getZoom())).toBeGreaterThan(zoom+.2);
 await page.waitForFunction(()=>!window.contactTestMap._animatingZoom);
 const beforePan=await page.evaluate(()=>JSON.stringify(window.contactTestMap.getCenter()));
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-40,y:cy,id:0},{x:cx+40,y:cy,id:1}]});
 for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-40+i*5,y:cy,id:0},{x:cx+40+i*5,y:cy,id:1}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(()=>page.evaluate(()=>JSON.stringify(window.contactTestMap.getCenter()))).not.toBe(beforePan);

});
