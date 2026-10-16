import test from 'node:test';
import assert from 'node:assert/strict';
import {createModelQueue} from '../site/model-data.mjs';
const flush=()=>new Promise(resolve=>setTimeout(resolve,25));
function controlled(ids,concurrency=2){
 const started=[],finish=new Map();
 const queue=createModelQueue(ids,id=>{started.push(id);return new Promise(resolve=>finish.set(id,resolve));},{concurrency});
 return {queue,started,finish};
}
test('a selected house starts before occupied background lanes complete',async()=>{
 const {queue,started,finish}=controlled([1,2,3,4]);await flush();assert.deepEqual(started,[1,2]);
 queue.prioritize(4);await flush();assert.deepEqual(started,[1,2,4]);
 for(const id of [1,2,4])finish.get(id)();await flush();finish.get(3)();await queue.ready;
});
test('selection can load while background work is paused, without duplicates or unbounded lanes',async()=>{
 const {queue,started,finish}=controlled([1,2,3,4,5]);await flush();queue.setPaused(true);
 queue.prioritize(4);queue.prioritize(4);await flush();queue.prioritize(5);await flush();
 assert.deepEqual(started,[1,2,4]);finish.get(4)();await flush();assert.deepEqual(started,[1,2,4,5]);
 finish.get(1)();finish.get(2)();finish.get(5)();await flush();assert.ok(!started.includes(3));
 queue.setPaused(false);await flush();finish.get(3)();await queue.ready;
});
test('readiness retains all initial critical houses and failures do not stall the queue',async()=>{
 const {queue,started,finish}=controlled([1,2,3,4]);let first=false;queue.firstReady.then(()=>first=true);
 await flush();queue.prioritize(4);await flush();finish.get(4)();await flush();assert.equal(first,false);
 finish.get(1)();finish.get(2)();await flush();finish.get(3)();await queue.firstReady;await queue.ready;assert.equal(first,true);
 const failed=createModelQueue([1,2],async()=>{throw new Error('unavailable');});await failed.ready;await failed.firstReady;
 assert.equal(started.length,4);
});
