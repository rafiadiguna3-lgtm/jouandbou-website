// Only photo assets are cached. HTML, code, models and video remain live.
// Bump this cache version when replacing an existing photograph.
const CACHE='jnb-photos-128',LIMIT=220;
const photo=url=>url.origin===self.location.origin&&/\/assets\/(marboy|rempoa|rumah-anas|rumasoka|jangkrik|flute|zubair|rr-house)\//.test(url.pathname)&&/\.(webp|png|jpe?g)$/.test(url.pathname);
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('jnb-photos-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
const pending=new Map();
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!photo(new URL(event.request.url)))return;
 event.respondWith((async()=>{
  let cache;try{cache=await caches.open(CACHE);const hit=await cache.match(event.request);if(hit)return hit;}catch{}
  const key=event.request.url;
  if(!pending.has(key))pending.set(key,fetch(event.request).finally(()=>pending.delete(key)));
  const response=(await pending.get(key)).clone();
  if(cache&&response.ok){try{await cache.put(event.request,response.clone());const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-LIMIT)))await cache.delete(key);}catch{}}
  return response;
 })());
});
