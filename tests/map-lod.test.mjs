import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {glbIds,mobileAsset} from '../site/glb-assets.mjs';
test('map meshes retain source bounds, placement, colors and valid materials with much less geometry',async()=>{
 let sourceBytes=0,mapBytes=0,sourceTriangles=0,mapTriangles=0;
 for(const id of new Set([29,0,9,13,44,...glbIds])){
  const asset=mobileAsset(id),read=path=>readFile(new URL('../site/assets/'+path,import.meta.url));
  const source=JSON.parse(await read(`gpu-${asset}.json`)),map=JSON.parse(await read(`map-${asset}.json`));
  assert.deepEqual(map.bounds,source.bounds);assert.deepEqual(map.placement,source.placement);
  const sourceRaw=await read(`gpu-${asset}.bin`),raw=await read(`map-${asset}.bin`),decoded=gunzipSync(raw);
  const buffer=decoded.buffer.slice(decoded.byteOffset,decoded.byteOffset+decoded.byteLength),p=new Float32Array(buffer,0,map.vertexCount*3),ix=new Uint32Array(buffer,map.vertexCount*16,map.indexCount);
  assert.equal(decoded.length,map.vertexCount*16+map.indexCount*4);assert.ok(ix.length>0);
  for(const index of ix)assert.ok(index<map.vertexCount);
  for(let i=0;i<p.length;i++)assert.ok(Number.isFinite(p[i])&&p[i]>=source.bounds.min[i%3]-.001&&p[i]<=source.bounds.max[i%3]+.001);
  for(const range of map.ranges){assert.ok(range.count%3===0&&range.start+range.count<=ix.length);assert.ok(source.ranges.some(original=>original.material===range.material&&original.layer===range.layer));}
  const sourceDecoded=source.compressed?gunzipSync(sourceRaw):sourceRaw,sourceColors=sourceDecoded.subarray(source.vertexCount*12,source.vertexCount*16),allowedColors=new Set();
  for(let i=0;i<sourceColors.length;i+=4)allowedColors.add(sourceColors.readUInt32LE(i));
  const mapColors=decoded.subarray(map.vertexCount*12,map.vertexCount*16);for(let i=0;i<mapColors.length;i+=4)assert.ok(allowedColors.has(mapColors.readUInt32LE(i)),'Map colors must come from the original house');
  sourceBytes+=sourceRaw.length;mapBytes+=raw.length;sourceTriangles+=source.indexCount/3;mapTriangles+=map.indexCount/3;
 }
 assert.ok(mapBytes<sourceBytes*.1);assert.ok(mapTriangles<sourceTriangles*.15);
});
