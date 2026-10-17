// Offline vertex clustering: preserve source placements, materials and colors.
// At the distant map scale a 0.22-unit cell is less than one CSS pixel.
import {readFile,writeFile} from 'node:fs/promises';
import {gunzipSync,gzipSync} from 'node:zlib';
import {glbIds,mobileAsset} from '../site/glb-assets.mjs';
const ids=[...new Set([29,0,9,13,44,...glbIds])],root=new URL('../site/assets/',import.meta.url),cell=.22;
const report=[];
for(const id of ids){
 const source=`gpu-${mobileAsset(id)}`,meta=JSON.parse(await readFile(new URL(`${source}.json`,root))),raw=await readFile(new URL(`${source}.bin`,root));
 const decoded=meta.compressed?gunzipSync(raw):raw;
 const buffer=decoded.buffer.slice(decoded.byteOffset,decoded.byteOffset+decoded.byteLength);
 const positions=new Float32Array(buffer,0,meta.vertexCount*3),colors=new Uint8Array(buffer,meta.vertexCount*12,meta.vertexCount*4),indices=meta.indexCount?new Uint32Array(buffer,meta.vertexCount*16,meta.indexCount):null;
 const outPositions=[],outColors=[],outIndices=[],ranges=[];
 for(const range of meta.ranges){
  const clusters=new Map(),mapped=new Map(),faces=new Set(),start=outIndices.length;
  const vertex=index=>{
   if(mapped.has(index))return mapped.get(index);
   const p=index*3,c=index*4,key=`${Math.round(positions[p]/cell)},${Math.round(positions[p+1]/cell)},${Math.round(positions[p+2]/cell)}:${colors.slice(c,c+4).join(',')}`;
   if(!clusters.has(key)){clusters.set(key,outPositions.length/3);outPositions.push(...positions.subarray(p,p+3));outColors.push(...colors.subarray(c,c+4));}
   const result=clusters.get(key);mapped.set(index,result);return result;
  };
  for(let offset=range.start;offset<range.start+range.count;offset+=3){
   const a=vertex(indices?indices[offset]:offset),b=vertex(indices?indices[offset+1]:offset+1),c=vertex(indices?indices[offset+2]:offset+2);
   if(a===b||b===c||a===c)continue;
   const key=[a,b,c].sort((x,y)=>x-y).join(',');if(faces.has(key))continue;faces.add(key);outIndices.push(a,b,c);
  }
  if(outIndices.length>start)ranges.push({...range,start,count:outIndices.length-start});
 }
 // Glass shares one shader and vertex colors, so distant windows can share a draw call.
 const grouped=new Map();for(const range of ranges){const key=range.transparent?`glass:${range.layer}`:`opaque:${range.material}`;if(!grouped.has(key))grouped.set(key,{range,indices:[]});grouped.get(key).indices.push(...outIndices.slice(range.start,range.start+range.count));}
 outIndices.length=0;ranges.length=0;for(const {range,indices:groupIndices} of grouped.values()){const start=outIndices.length;for(const index of groupIndices)outIndices.push(index);ranges.push({...range,start,count:groupIndices.length});}
 // Compact away vertices belonging only to collapsed faces.
 const compact=new Map(),p=[],c=[],ix=outIndices.map(index=>{if(!compact.has(index)){compact.set(index,p.length/3);p.push(...outPositions.slice(index*3,index*3+3));c.push(...outColors.slice(index*4,index*4+4));}return compact.get(index);});
 const bytes=Buffer.concat([Buffer.from(new Float32Array(p).buffer),Buffer.from(new Uint8Array(c)),Buffer.from(new Uint32Array(ix).buffer)]),compressed=gzipSync(bytes,{level:9});
 const lod={...meta,vertexCount:p.length/3,indexCount:ix.length,triangleCount:ix.length/3,ranges,compressed:true,lod:{source,cell,revision:1}};
 await writeFile(new URL(`map-${mobileAsset(id)}.json`,root),JSON.stringify(lod));await writeFile(new URL(`map-${mobileAsset(id)}.bin`,root),compressed);
 report.push({id,sourceBytes:raw.length,mapBytes:compressed.length,sourceTriangles:(meta.indexCount||meta.vertexCount)/3,mapTriangles:ix.length/3});
}
await writeFile(new URL('../docs/map-lod-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(report.reduce((s,r)=>({sourceBytes:s.sourceBytes+r.sourceBytes,mapBytes:s.mapBytes+r.mapBytes,sourceTriangles:s.sourceTriangles+r.sourceTriangles,mapTriangles:s.mapTriangles+r.mapTriangles}),{sourceBytes:0,mapBytes:0,sourceTriangles:0,mapTriangles:0}));
