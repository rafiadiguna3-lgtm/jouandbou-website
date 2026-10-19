// Export existing project photographs to interoperable share-card JPEGs.
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {projects} from '../site/project-catalog.mjs';
await mkdir('site/assets/share/projects',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 for(const p of projects){
  const bytes=await readFile('site/'+p.image),mime=p.image.endsWith('.webp')?'image/webp':'image/jpeg';
  await page.setContent(`<style>html,body{margin:0;background:#fafafa;width:1200px;height:630px}img{display:block;width:1200px;height:630px;object-fit:contain}</style><img src="data:${mime};base64,${bytes.toString('base64')}"/>`);
  await page.locator('img').evaluate(img=>img.decode());
  await page.screenshot({path:'site/'+p.shareImage,type:'jpeg',quality:90});
 }
}finally{await browser.close();}
console.log(`Exported ${projects.length} project share photographs.`);
