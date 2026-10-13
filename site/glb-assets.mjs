export const mobileAsset=id=>id===51?'mobile-pdg-mosque':`mobile-jh${String(id===45?49:id===46?50:id===47?46:id>=48?id+3:id+1).padStart(2,'0')}`;
export const glbModels=[[5,'jh06-glb'],[11,'jh12-glb'],[12,'jh13-glb'],[18,'jh19-glb'],[19,'jh20-glb'],[26,'jh27-glb'],[33,'jh34-glb'],[36,'jh37-glb'],[38,'jh39-glb'],[40,'jh41-glb'],[41,'jh42-glb'],[42,'jh43-glb'],[43,'jh44-glb'],[45,'jh49-glb'],[46,'jh50-glb'],[47,'jh46-glb'],[48,'jh51-glb'],[49,'jh52-glb'],[50,'jh53-glb'],[51,'pdg-mosque']];
export const glbIds=glbModels.map(([id])=>id);
export async function readGLBAsset(asset){
 const r=await fetch(`./assets/${asset}.json`);if(!r.ok)throw new Error(`Missing ${asset}`);const meta=await r.json();
 const chunks=await Promise.all(meta.chunks.map(async name=>{const q=await fetch(`./assets/${name}`);if(!q.ok)throw new Error(`Missing ${name}`);return q.arrayBuffer()}));
 if(chunks.reduce((n,c)=>n+c.byteLength,0)!==meta.compressedBytes)throw new Error(`Incomplete ${asset}`);
 const buffer=await new Response(new Blob(chunks).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();const n=meta.vertexCount;
 if(buffer.byteLength!==n*20+meta.indexCount*4)throw new Error(`Corrupt ${asset}`);
 return {meta,positions:new Float32Array(buffer,0,n*3),uvs:new Float32Array(buffer,n*12,n*2),indices:new Uint32Array(buffer,n*20,meta.indexCount)};
}
const images=new Map(),pending=[];let active=0;
function pump(){while(active<8&&pending.length){active++;pending.shift()()}}
export function materialImage(path){
 if(!images.has(path))images.set(path,new Promise((resolve,reject)=>{pending.push(()=>{const img=new Image();const done=()=>{active--;pump()};img.onload=()=>{done();resolve(img)};img.onerror=()=>{done();reject(new Error(`Missing texture ${path}`))};img.src=`./assets/${path}`});pump()}));
 return images.get(path);
}
