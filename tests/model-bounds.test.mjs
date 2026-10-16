import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import * as THREE from '../site/vendor/three.module.js';
test('authored bounds used for opaque model culling contain every GPU vertex',async()=>{
 const root=new URL('../site/assets/',import.meta.url);
 const files=(await readdir(root)).filter(name=>/^gpu-.*\.json$/.test(name));assert.equal(files.length,25);
 for(const name of files){
  const meta=JSON.parse(await readFile(new URL(name,root))),bytes=await readFile(new URL(name.replace('.json','.bin'),root));
  const raw=meta.compressed?gunzipSync(bytes):bytes,positions=new Float32Array(raw.buffer,raw.byteOffset,meta.vertexCount*3);
  const sphere=new THREE.Box3(new THREE.Vector3(...meta.bounds.min),new THREE.Vector3(...meta.bounds.max)).getBoundingSphere(new THREE.Sphere());
  const p=new THREE.Vector3();for(let i=0;i<meta.vertexCount;i++)assert.ok(p.fromArray(positions,i*3).distanceTo(sphere.center)<=sphere.radius+1e-4,name);
 }
});
