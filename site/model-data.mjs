// Cache decoded, versioned geometry. A cache failure always falls back to the network.
const revision='130',dbName='jou-model-geometry-v1';let database;
const timeout=(promise,ms)=>Promise.race([promise,new Promise(resolve=>setTimeout(()=>resolve(null),ms))]);
function db(){if(!database)database=new Promise(resolve=>{try{const request=indexedDB.open(dbName,1);request.onupgradeneeded=()=>request.result.createObjectStore('models');request.onsuccess=()=>resolve(request.result);request.onerror=()=>resolve(null);request.onblocked=()=>resolve(null);}catch{resolve(null);}});return timeout(database,300);}
async function cached(key){try{const store=await db();if(!store)return null;return await timeout(new Promise(resolve=>{const req=store.transaction('models','readonly').objectStore('models').get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null);}),350);}catch{return null;}}
async function save(key,data){try{const store=await db();if(store)store.transaction('models','readwrite').objectStore('models').put(data,key);}catch{}}
export async function readModelData(asset){
 const assetRevision=/mobile-jh(?:34|39)$/.test(asset)?'139':asset.endsWith('mobile-jh30')?'137':/mobile-jh(?:19|20|34)$/.test(asset)?'136':/mobile-jh(?:13|30)$/.test(asset)?'135':/mobile-jh(?:01|37|44)$/.test(asset)?'133':asset.endsWith('mobile-jh53')?'132':/mobile-jh(?:12|45|50)$/.test(asset)?'131':revision;
 const key=`${assetRevision}:${asset}`,previous=await cached(key);
 if(previous?.meta&&previous.buffer?.byteLength===previous.meta.vertexCount*16+(previous.meta.indexCount||0)*4)return previous;
 const controller=new AbortController(),deadline=setTimeout(()=>controller.abort(),15000);
 let meta,buffer;
 try{
 const [m,b]=await Promise.all([fetch(`./assets/${asset}.json?v=${assetRevision}`,{signal:controller.signal}),fetch(`./assets/${asset}.bin?v=${assetRevision}`,{signal:controller.signal})]);
 if(!m.ok||!b.ok)throw new Error('Model asset unavailable');
 meta=await m.json();buffer=meta.compressed?await new Response(b.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():await b.arrayBuffer();
 if(buffer.byteLength!==meta.vertexCount*16+(meta.indexCount||0)*4)throw new Error('Incomplete model asset');
 }finally{clearTimeout(deadline);controller.abort();}
 const data={meta,buffer};void save(key,data);return data;
}
export async function loadModelBatch(ids,load){let cursor=0;await Promise.all(Array.from({length:4},async()=>{while(cursor<ids.length){const id=ids[cursor++];await load(id);await new Promise(resolve=>setTimeout(resolve,0));}}));}

// Two uploads at a time; selecting a house moves it ahead of background work.
export function createModelQueue(ids,load,options={}){
 const queue=[...new Set(ids)],critical=new Set(queue.slice(0,3));let active=0,firstDone,allDone,paused=false;const concurrency=options.concurrency||2;
 const firstReady=new Promise(resolve=>firstDone=resolve),ready=new Promise(resolve=>allDone=resolve);
 function pump(){while(!paused&&active<concurrency&&queue.length){const id=queue.shift();active++;Promise.resolve().then(()=>load(id)).catch(()=>{}).finally(()=>{active--;critical.delete(id);if(!critical.size)firstDone();if(!queue.length&&!active)allDone();else setTimeout(pump,16);});}}
 const prioritize=id=>{const index=queue.indexOf(id);if(index>0){queue.splice(index,1);queue.unshift(id);}pump();};
 if(queue.length)pump();else{firstDone();allDone();}
 return{ready,firstReady,prioritize,setPaused(value){paused=value;if(!paused)pump();}};
}
