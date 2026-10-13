import {OrthographicCamera,Vector3,TOUCH} from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
// OrbitControls owns multi-touch math; the adapter maps its camera to our view.
export function createTouchOrbit(canvas,{eligible,read,change,multi,start,end}){
 const camera=new OrthographicCamera(-1,1,1,-1,.1,3000),pointers=new Set();
 let controls,syncing=false,base=1,pivot=new Vector3(),keepPan=false;
 const setup=event=>{
  if(event.pointerType!=='touch'||!eligible())return;
  if(!pointers.size){keepPan=false;sync();}
  pointers.add(event.pointerId);controls.enabled=true;
  if(pointers.size>1){keepPan=true;multi();}
  controls.touches.ONE=keepPan?TOUCH.PAN:TOUCH.ROTATE;start();
 };
 const release=event=>{
  if(!pointers.has(event.pointerId))return;pointers.delete(event.pointerId);
  controls.touches.ONE=pointers.size&&keepPan?TOUCH.PAN:TOUCH.ROTATE;
  if(!pointers.size){controls.enabled=false;keepPan=false;end();}
 };
 canvas.addEventListener('pointerdown',setup,{capture:true});
 canvas.ownerDocument.addEventListener('pointerup',release,{capture:true});
 canvas.ownerDocument.addEventListener('pointercancel',release,{capture:true});
 controls=new OrbitControls(camera,canvas);controls.enabled=false;controls.enableDamping=false;
 controls.enableZoom=true;controls.enablePan=true;controls.screenSpacePanning=true;
 controls.minZoom=.6;controls.maxZoom=3;controls.minPolarAngle=.12;controls.maxPolarAngle=Math.PI/2+1.2;
 controls.zoomSpeed=.85;controls.touches.TWO=TOUCH.DOLLY_PAN;
 function sync(){
  syncing=true;const s=read(),{w,h,yaw,pitch,scale,zoom,pan,bounds,placement}=s;
  base=scale/zoom;pivot.set(placement[0]+(bounds.min[0]+bounds.max[0])/2,(bounds.min[1]+bounds.max[1])/2,placement[1]+(bounds.min[2]+bounds.max[2])/2);
  const co=Math.cos(yaw),si=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  controls.target.copy(pivot).add(new Vector3(-co*pan.x/scale-si*sp*pan.y/scale,cp*pan.y/scale,si*pan.x/scale-co*sp*pan.y/scale));
  camera.left=-w/base/2;camera.right=w/base/2;camera.top=h/base/2;camera.bottom=-h/base/2;camera.zoom=zoom;camera.up.set(0,1,0);
  camera.position.copy(controls.target).add(new Vector3(si*cp,sp,co*cp).multiplyScalar(1000));camera.updateProjectionMatrix();camera.lookAt(controls.target);camera.updateMatrixWorld();
  controls.rotateSpeed=.008*h/(2*Math.PI);controls.update();syncing=false;
 }
 controls.addEventListener('change',()=>{
  if(syncing||!eligible())return;
  const d=camera.position.clone().sub(controls.target),rawYaw=Math.atan2(d.x,d.z),previousYaw=read().yaw,yaw=previousYaw+Math.atan2(Math.sin(rawYaw-previousYaw),Math.cos(rawYaw-previousYaw)),pitch=Math.asin(d.y/d.length()),scale=base*camera.zoom,t=controls.target.clone().sub(pivot);
  change({yaw,pitch,scale,zoom:camera.zoom,pan:{x:-(t.x*Math.cos(yaw)-t.z*Math.sin(yaw))*scale,y:(t.y*Math.cos(pitch)-(t.x*Math.sin(yaw)+t.z*Math.cos(yaw))*Math.sin(pitch))*scale}});
 });
 return {get active(){return pointers.size>0},get count(){return pointers.size},handles:e=>e.pointerType==='touch'&&eligible(),cancel(){pointers.clear();controls.disconnect();controls.connect(canvas);controls.enabled=false;keepPan=false;controls.touches.ONE=TOUCH.ROTATE;}};
}
