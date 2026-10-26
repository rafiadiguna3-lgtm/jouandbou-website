// Resize the prepared rendition of the user's supplied image, preserving its pixels and proportions.
import {readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
const source=await readFile('site/assets/brand/jou-and-bou-upload-solid-v3.png');
const png=PNG.sync.read(source);
const tabSource=await readFile('site/assets/brand/jou-and-bou-white-48-v143.png');
let left=png.width,top=png.height,right=0,bottom=0;
for(let y=0;y<png.height;y++)for(let x=0;x<png.width;x++){
 const i=(y*png.width+x)*4;
 if(png.data[i]<96&&png.data[i+1]<96&&png.data[i+2]<96){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
}
if(right<=left||bottom<=top)throw new Error('The source does not contain a visible dark logo.');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({deviceScaleFactor:1});
 for(const size of [16,32,48,64,96,180,192,512,1200]){
  const scale=size*(size===1200?.60:.72)/(bottom-top+1),x=(size-(right-left+1)*scale)/2-left*scale,y=(size-(bottom-top+1)*scale)/2-top*scale;
  await page.setViewportSize({width:size,height:size});
  const image=size===1200?{data:source,width:png.width*scale,height:png.height*scale,x,y,filter:'none'}:{data:tabSource,width:size,height:size,x:0,y:0,filter:'brightness(0)'};
  await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:white}img{position:absolute;width:${image.width}px;height:${image.height}px;left:${image.x}px;top:${image.y}px;filter:${image.filter}}</style><img src="data:image/png;base64,${image.data.toString('base64')}"/>`);
  await page.locator('img').evaluate(image=>image.decode());
  const path=`site/assets/brand/jou-and-bou-${size===1200?'share-solid':`solid-${size}`}-${size===1200?'v3':'v5'}.png`;
  await page.screenshot({path});
 }
}finally{await browser.close();}
// PNG-compressed ICO entries are supported by current desktop browsers.
const sizes=[16,32,48,64],buffers=await Promise.all(sizes.map(size=>readFile(`site/assets/brand/jou-and-bou-solid-${size}-v5.png`)));
const header=Buffer.alloc(6+sizes.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
sizes.forEach((size,i)=>{const start=6+i*16;header[start]=size;header[start+1]=size;header.writeUInt16LE(1,start+4);header.writeUInt16LE(32,start+6);header.writeUInt32LE(buffers[i].length,start+8);header.writeUInt32LE(offset,start+12);offset+=buffers[i].length;});
await writeFile('site/favicon.ico',Buffer.concat([header,...buffers]));
await writeFile('site/favicon.png',await readFile('site/assets/brand/jou-and-bou-solid-512-v5.png'));
const iconData=await readFile('site/assets/brand/jou-and-bou-solid-96-v5.png');
const iconSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><image width="96" height="96" href="data:image/png;base64,${iconData.toString('base64')}"/></svg>`;
await writeFile('site/assets/brand/jou-and-bou-solid-v5.svg',iconSvg);
await writeFile('site/favicon.svg',iconSvg);
console.log('Built 1200×1200 share preview and favicon sizes from the prepared user-image rendition.');
