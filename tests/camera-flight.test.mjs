import test from 'node:test';
import assert from 'node:assert/strict';
import {cameraFlight,sampleCameraFlight} from '../site/camera-flight.mjs';
const from={x:0,y:2,z:0,yaw:3.1,pitch:.61,scale:5,t:0};
for(const scale of [5,15,60])test(`camera transition at scale ${scale} stays bounded with soft endpoints`,()=>{
 const flight=cameraFlight({...from,scale},{...from,x:50,z:30,yaw:-3.1,pitch:.7,scale:12,t:1});
 assert.ok(flight.duration>=380&&flight.duration<=680);
 assert.ok(Math.abs(flight.to.yaw-flight.from.yaw)<.1,'rotation takes the shortest path');
 let previous=0;
 for(let i=0;i<=100;i++){
  const {state,done}=sampleCameraFlight(flight,flight.duration*i/100);
  assert.ok(state.x>=previous-1e-8&&state.x<=50+1e-8,'no overshoot or reversal');previous=state.x;
  assert.ok(state.scale>=Math.min(scale,12)-1e-8&&state.scale<=Math.max(scale,12)+1e-8);
  assert.equal(done,i===100);
 }
 const early=sampleCameraFlight(flight,flight.duration*.01).state.x;
 const late=50-sampleCameraFlight(flight,flight.duration*.99).state.x;
 assert.ok(early<.001&&late<.001,'slow departure and soft landing');
});
test('retargeting an interrupted camera flight starts at the displayed position',()=>{
 const first=cameraFlight(from,{...from,x:40,scale:20});const current=sampleCameraFlight(first,first.duration*.45).state;
 const next=cameraFlight(current,{...from,x:-20,scale:8},500);
 const start=sampleCameraFlight(next,500).state;
 for(const key of Object.keys(current))assert.ok(Math.abs(start[key]-current[key])<1e-10);
});
