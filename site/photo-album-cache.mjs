import {photoVariants} from './photo-variants.mjs?v=126';
const CACHE='jnb-photos-128',queue=[],queued=new Set(),done=new Set();let running=false;
const phone=matchMedia('(any-pointer: coarse)').matches&&Math.min(innerWidth,innerHeight)<700;
const variant=source=>photoVariants[source]?.[phone?'800':'1280']||source;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export function prepareAlbum(sources){
 const wanted=[...new Set(sources.map(variant))].filter(src=>/\.(webp|jpe?g|png)(?:\?|$)/i.test(src));
 for(const src of wanted.reverse()){if(done.has(src))continue;const index=queue.indexOf(src);if(index>=0)queue.splice(index,1);else queued.add(src);queue.unshift(src);}
 void pump();
}
async function pump(){
 if(running||!('caches' in window))return;running=true;
 try{
  const cache=await caches.open(CACHE);
  while(queue.length){
   while(document.hidden||window.jouPhotoBusy?.())await delay(180);
   const src=queue.shift();queued.delete(src);const url=new URL(src,location.href).href;
   try{if(!await cache.match(url)){const response=await fetch(url,{priority:'low'});if(response.ok)await cache.put(url,response);else continue;}done.add(src);}catch{}
   await delay(60);
  }
 }catch{}finally{running=false;}
}
export function prepareCollection(){
 if(navigator.connection?.saveData)return;
 for(const variants of Object.values(photoVariants)){const src=variants[phone?'800':'1280'];if(!done.has(src)&&!queued.has(src)){queue.push(src);queued.add(src);}}
 void pump();
}
