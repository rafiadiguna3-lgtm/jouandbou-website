// Rasterize the site's existing solid brand vector; no redraw or generated artwork.
import {readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const source=await readFile('site/assets/about/header-mark.svg','utf8');
const paths=source.match(/<path\b[^>]*\/>/g).join('');
const svg=viewBox=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><rect x="-100" y="-100" width="400" height="400" fill="white"/>${paths}</svg>`;
const icon=svg('73.2 57.9 32.2 32.2'),share=svg('65.2 50 48 48');
await writeFile('site/assets/brand/jou-and-bou-solid-v2.svg',icon);
await writeFile('site/favicon.svg',icon);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({deviceScaleFactor:1});
 for(const size of [16,32,48,64,180,192,512,1200]){
  await page.setViewportSize({width:size,height:size});
  await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;background:white}svg{display:block;width:100%;height:100%}</style>${size===1200?share:icon}`);
  const path=`site/assets/brand/jou-and-bou-${size===1200?'share-solid':`solid-${size}`}-v2.png`;
  await page.screenshot({path});
 }
}finally{await browser.close();}
// PNG-compressed ICO entries are supported by current desktop browsers.
const sizes=[16,32,48,64],buffers=await Promise.all(sizes.map(size=>readFile(`site/assets/brand/jou-and-bou-solid-${size}-v2.png`)));
const header=Buffer.alloc(6+sizes.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
sizes.forEach((size,i)=>{const start=6+i*16;header[start]=size;header[start+1]=size;header.writeUInt16LE(1,start+4);header.writeUInt16LE(32,start+6);header.writeUInt32LE(buffers[i].length,start+8);header.writeUInt32LE(offset,start+12);offset+=buffers[i].length;});
await writeFile('site/favicon.ico',Buffer.concat([header,...buffers]));
await writeFile('site/favicon.png',await readFile('site/assets/brand/jou-and-bou-solid-512-v2.png'));
console.log('Built solid brand icons and the 1200×1200 share image from the existing vector.');
