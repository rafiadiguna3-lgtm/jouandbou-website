import {readModelData,createModelQueue} from './model-data.mjs?v=139';
import {glbIds,mobileAsset} from './glb-assets.mjs?v=114';
import * as THREE from './vendor/three.module.js';

const vertexShader=`
attribute vec4 surfaceColor;
varying vec4 vColor;
varying vec3 vWorld;
void main(){
 vColor=surfaceColor;
 vWorld=position;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
}`;
const fragmentShader=`
uniform float colorAmount;
uniform float opacity;
uniform float modelSurface;
uniform float glassSurface;
varying vec4 vColor;
varying vec3 vWorld;
void main(){
 vec3 color=vColor.rgb;
 float luminance=dot(color,vec3(.2126,.7152,.0722));
 color=mix(modelSurface>.5&&glassSurface<.5?vec3(.94):vec3(luminance),color,colorAmount);
 if(modelSurface>.5){
  vec3 surfaceNormal=cross(dFdx(vWorld),dFdy(vWorld));
  vec3 n=surfaceNormal/max(length(surfaceNormal),.000001);
  float illumination=.78+.22*abs(dot(n,normalize(vec3(-.45,1.0,.6))));
  color*=illumination;
 }
 gl_FragColor=vec4(color,vColor.a*opacity);
}`;

function material(modelSurface=0,glassSurface=0){return new THREE.ShaderMaterial({
 vertexShader,fragmentShader,side:THREE.DoubleSide,
 uniforms:{colorAmount:{value:0},opacity:{value:1},modelSurface:{value:modelSurface},glassSurface:{value:glassSurface}},
 transparent:true,depthWrite:true
})}
function tint(shade,ground){
 if(ground)return [shade,shade,shade];
 if(shade<170)return [125,105,83];
 if(shade<191)return [103,158,170];
 if(shade<213)return [137,161,119];
 if(shade<231)return [183,164,138];
 return [239,229,211];
}

// Bound Retina/4K fill cost while keeping standard-density screens and phone policy intact.
export function renderPixelRatio(width,height,dpr=1,touch=false){
 return Math.min(dpr||1,touch?1.2:2,touch?Infinity:Math.max(.75,Math.sqrt(4_000_000/Math.max(1,width*height))));
}

export class NeighborhoodRenderer{
 constructor(canvas,world,onChange){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  this.renderer.setClearColor(0xfafafa,1);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.contextLost=true;this.onChange?.();});
  canvas.addEventListener('webglcontextrestored',()=>{this.contextLost=false;this.onChange?.();});
  this.touchDevice=matchMedia("(any-pointer: coarse)").matches||navigator.maxTouchPoints>0;
  this.pixelRatio=renderPixelRatio(innerWidth,innerHeight,devicePixelRatio||1,this.touchDevice);
  this.renderer.setPixelRatio(this.pixelRatio);
  this.camera=new THREE.OrthographicCamera(-1,1,1,-1,500,1500);
  this.world=world;this.scene=new THREE.Scene();this.scene.add(new THREE.HemisphereLight(0xffffff,0xb7b8b5,2.1));const sun=new THREE.DirectionalLight(0xffffff,1.6);sun.position.set(-30,70,40);this.scene.add(sun);this.textureCache=new Map();this.groups=new Map();this.onChange=onChange;
  // Keep the established massing and road geometry exactly as authored.
  const batches=new Map();
  for(const face of world.faces){
   const key=`${face.id}:${face.ground?1:0}`;
   if(!batches.has(key))batches.set(key,{id:face.id,ground:face.ground,positions:[],colors:[],grays:[]});
   const b=batches.get(key),rgb=tint(face.color,face.ground);
   for(let i=1;i<face.v.length-1;i++)for(const p of [face.v[0],face.v[i],face.v[i+1]]){
    b.positions.push(...p);b.colors.push(...rgb.map(v=>v/255),1);b.grays.push(face.color/255);
   }
  }
  for(const b of batches.values()){
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.positions,3));
   g.setAttribute('surfaceColor',new THREE.Float32BufferAttribute(b.colors,4));
   g.setAttribute('gray',new THREE.Float32BufferAttribute(b.grays,1));
   const m=material();
   // Stored face shades preserve the original monochrome neighborhood.
   m.vertexShader=m.vertexShader.replace('varying vec4 vColor;','attribute float gray; varying float vGray; varying vec4 vColor;').replace('vColor=surfaceColor;','vColor=surfaceColor; vGray=gray;');
   m.fragmentShader=m.fragmentShader.replace('varying vec4 vColor;','varying float vGray; varying vec4 vColor;').replace('vec3(luminance)','vec3(vGray)');
   m.transparent=false;
   if(b.ground){m.depthWrite=false;}
   const mesh=new THREE.Mesh(g,m);mesh.renderOrder=b.ground?-100:0;
   mesh.userData={id:b.id,ground:b.ground};this.scene.add(mesh);
   if(!this.groups.has(b.id))this.groups.set(b.id,[]);this.groups.get(b.id).push(mesh);
  }
  this.detailModes=new Map();this.modelMeshes=[];this.modelState='loading';
  this.modelMetas=new Map();this.modelErrors=new Map();this.pendingModels=new Map();this.loadingModels=new Set();this.interacting=false;this.focusedModel=null;this.priorityModel=null;this.neighborhoodTimer=0;this.neighborhoodView=null;this.modelQueue=createModelQueue([29,0,9,13,44,...glbIds],async (id,{foreground}={})=>{try{await this.loadHouse(id,mobileAsset(id),foreground)}catch(error){this.modelErrors.set(id,error);console.error('House model unavailable',id,error)}},{concurrency:1,demand:true,initialCount:0});
  this.lodMetas=new Map();this.lodErrors=new Map();
  this.lodQueue=createModelQueue([29,0,9,13,44,...glbIds],async id=>{try{await this.loadHouse(id,mobileAsset(id),false,true)}catch(error){this.lodErrors.set(id,error);console.error('Map model unavailable',id,error)}},{concurrency:this.touchDevice?1:2,demand:true,initialCount:0});
  this.firstReady=Promise.resolve();this.ready=this.lodQueue.ready;

 }
 hitsModel(id,x,y){
  const rect=this.renderer.domElement.getBoundingClientRect();
  const ray=this.modelRay||(this.modelRay=new THREE.Raycaster());
  this.scene.updateMatrixWorld(true);this.camera.updateMatrixWorld(true);
  ray.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2),this.camera);
  return ray.intersectObjects(this.modelMeshes.filter(mesh=>mesh.visible&&mesh.userData.id===id),false).length>0;
 }
 syncQueues(){const paused=this.suspended||this.interacting||this.animating||this.focusedModel!==null;this.modelQueue?.setPaused(paused);this.lodQueue?.setPaused(paused);}
 setInteracting(value){const changed=this.interacting!==value;this.interacting=value;this.syncQueues();if(!value){this.scheduleNeighborhood();if(changed)this.onChange();}}
 setAnimating(value){if(this.animating===value)return;this.animating=value;this.syncQueues();if(value)clearTimeout(this.neighborhoodTimer);else this.scheduleNeighborhood();}
 setVisible(value){this.suspended=!value;if(!value)this.animating=false;this.syncQueues();if(!value)clearTimeout(this.neighborhoodTimer);}
 scheduleNeighborhood(){
  clearTimeout(this.neighborhoodTimer);
  if(this.suspended||this.interacting||this.animating||this.focusedModel!==null||document.hidden||!this.neighborhoodView)return;
  this.neighborhoodTimer=setTimeout(()=>{
   if(this.suspended||this.interacting||this.animating||this.focusedModel!==null||document.hidden)return;
   const point=new THREE.Vector3(),visible=[];
   for(const id of [29,0,9,13,44,...glbIds]){point.fromArray(this.world.anchors[id]).project(this.camera);if(Math.abs(point.x)<1.35&&Math.abs(point.y)<1.35)visible.push({id,distance:point.x*point.x+point.y*point.y});}
   visible.sort((a,b)=>a.distance-b.distance);
   this.lodQueue.request(visible.map(item=>item.id));
   if(this.neighborhoodView.view.scale>=6)this.modelQueue.request(visible.filter(item=>item.distance<1.5).map(item=>item.id));
  },100);
 }
 ensureModel(id){this.priorityModel=id;this.modelQueue?.prioritize(id)}
 async loadHouse(id,asset,foreground=false,lod=false){
  const {meta,buffer}=await readModelData(`${lod?'map':'gpu'}-${asset}`,{priority:id===this.priorityModel?'high':'low'});
  const waitForIdle=async()=>{while(this.suspended||document.hidden||this.interacting||this.animating||(this.focusedModel!==null&&id!==this.priorityModel&&!foreground))await new Promise(resolve=>setTimeout(resolve,60));};
  await waitForIdle();
  const positions=new Float32Array(buffer,0,meta.vertexCount*3);
  const colors=new Uint8Array(buffer,meta.vertexCount*12,meta.vertexCount*4);
  const sharedPosition=new THREE.BufferAttribute(positions,3),sharedColor=new THREE.BufferAttribute(colors,4,true);
  // Opaque ranges can reuse the authored whole-model bounds without scanning vertices.
  const opaqueSphere=new THREE.Box3(new THREE.Vector3(...meta.bounds.min),new THREE.Vector3(...meta.bounds.max)).getBoundingSphere(new THREE.Sphere());
  const meshes=[];let budget=performance.now();
  for(const range of meta.ranges){
   if(performance.now()-budget>6){await new Promise(resolve=>setTimeout(resolve,0));await waitForIdle();budget=performance.now();}
   const geometry=new THREE.BufferGeometry();
   geometry.setAttribute('position',meta.indexCount?sharedPosition:new THREE.BufferAttribute(positions.subarray(range.start*3,(range.start+range.count)*3),3));
   geometry.setAttribute('surfaceColor',meta.indexCount?sharedColor:new THREE.BufferAttribute(colors.subarray(range.start*4,(range.start+range.count)*4),4,true));
   if(meta.indexCount){const indices=new Uint32Array(buffer,meta.vertexCount*16,meta.indexCount);geometry.setIndex(new THREE.BufferAttribute(indices.subarray(range.start,range.start+range.count),1));}
   if(meta.indexCount&&range.transparent){
    const box=new THREE.Box3(),point=new THREE.Vector3(),indices=geometry.index.array;
    for(let offset=0;offset<indices.length;offset++){box.expandByPoint(point.fromArray(positions,indices[offset]*3));if(offset%8192===0&&performance.now()-budget>6){await new Promise(resolve=>setTimeout(resolve,0));await waitForIdle();budget=performance.now();}}
    geometry.boundingSphere=box.getBoundingSphere(new THREE.Sphere());
   }else if(meta.indexCount)geometry.boundingSphere=opaqueSphere;else geometry.computeBoundingSphere();
   const m=material(1,range.layer==='glass'?1:0);
   // Keep opaque architecture out of Three's camera-dependent alpha sorting.
   // Fixed depth priority resolves nearly coplanar material overlays from DAE.
   m.transparent=!!range.transparent;m.depthWrite=!range.transparent;m.forceSinglePass=true;
   m.polygonOffset=!range.transparent;m.polygonOffsetFactor=0;
   m.polygonOffsetUnits=-(range.material+1)*2;
   if(!range.transparent)m.fragmentShader=m.fragmentShader.replace('vColor.a*opacity','opacity');
   const mesh=new THREE.Mesh(geometry,m);mesh.position.set(meta.placement.x,0,meta.placement.z);
   mesh.userData={id,lod,sourceModel:true,layer:range.layer,sourceTransparent:!!range.transparent};mesh.renderOrder=range.transparent?100:10+range.material;
   meshes.push(mesh);
  }
  await waitForIdle();
  for(const mesh of meshes){this.scene.add(mesh);this.modelMeshes.push(mesh);}
  (lod?this.lodMetas:this.modelMetas).set(id,meta);if(!lod&&id===29)this.modelMeta=meta;
  for(const mesh of this.groups.get(id)||[])mesh.visible=mesh.userData.ground;
  this.onChange();
 }
 resize(width,height){this.pixelRatio=renderPixelRatio(width,height,devicePixelRatio||1,this.touchDevice);this.renderer.setPixelRatio(this.pixelRatio);this.renderer.setSize(width,height,false)}
 render(view,width,height,current,front,hoverLevels){
  const focused=front?current:null;
  if(this.focusedModel!==focused){this.focusedModel=focused;this.syncQueues();}
  if(front){clearTimeout(this.neighborhoodTimer);this.neighborhoodTimer=0;this.neighborhoodView=null;this.ensureModel(current)}
  else{this.neighborhoodView={view:{...view},width,height};this.scheduleNeighborhood()}
  const cameraKey=[width,height,view.x,view.y,view.z,view.yaw,view.pitch,view.scale].join(':');
  if(cameraKey!==this.cameraKey){this.cameraKey=cameraKey;
   const c=this.camera,halfW=width/view.scale/2,halfH=height/view.scale/2;
  c.left=-halfW;c.right=halfW;c.top=halfH;c.bottom=-halfH;c.updateProjectionMatrix();
  const direction=new THREE.Vector3(Math.sin(view.yaw)*Math.cos(view.pitch),Math.sin(view.pitch),Math.cos(view.yaw)*Math.cos(view.pitch));
  c.position.set(view.x,view.y,view.z).addScaledVector(direction,1000);
  c.up.set(-Math.sin(view.yaw)*Math.sin(view.pitch),Math.cos(view.pitch),-Math.cos(view.yaw)*Math.sin(view.pitch));
  c.lookAt(view.x,view.y,view.z);c.updateMatrixWorld();
  }
  for(const [id,meshes] of this.groups){
   const opacity=id===current||!front?1:1-view.t;
   for(const mesh of meshes){
    mesh.visible=opacity>.005&&!((this.modelMetas.has(id)||this.lodMetas.has(id))&&(!mesh.userData.ground||(front&&id===current)));
    mesh.material.uniforms.opacity.value=opacity;
    const fading=opacity<.999;if(mesh.material.transparent!==fading){mesh.material.transparent=fading;mesh.material.needsUpdate=true;}
    mesh.material.uniforms.colorAmount.value=id>=0?Math.max(hoverLevels[id]||0,id===current?view.t:0):0;
    mesh.position.y=id>=0&&!front?(hoverLevels[id]||0)*.22:0;
   }
  }
  for(const mesh of this.modelMeshes){
   const id=mesh.userData.id;
   if(mesh.userData.glb){const fade=current===id?1:1-view.t;mesh.visible=fade>.005;mesh.material.opacity=mesh.userData.baseOpacity*fade;mesh.material.userData.colorAmount.value=Math.max(hoverLevels[id]||0,front&&current===id?view.t:0);const transparent=mesh.userData.baseTransparent||fade<.999;if(mesh.material.transparent!==transparent){mesh.material.transparent=transparent;mesh.material.needsUpdate=true;}continue;}
   let detail=this.detailModes.get(id)||false;
   if(!this.animating&&!this.interacting||(front&&current===id)||!this.lodMetas.has(id)){
    detail=this.modelMetas.has(id)&&((front&&current===id)||!this.lodMetas.has(id)||view.scale>=(detail?5.2:6.8));
    this.detailModes.set(id,detail);
   }
   mesh.visible=(mesh.userData.lod?!detail:detail)&&(current===id||!front||view.t<.995);
   mesh.material.uniforms.opacity.value=current===id||!front?1:1-view.t;
   mesh.material.uniforms.colorAmount.value=Math.max(hoverLevels[id]||0,front&&current===id?view.t:0);
   mesh.position.y=0;
   // Exterior models stay intact at every orbit angle.
   mesh.material.depthWrite=!mesh.userData.sourceTransparent;
  }
  // Ground precedes the architecture even when the latter is opaque.
  // A single alpha pass is used only during the whole-house fade.
  for(const mesh of this.modelMeshes){
   if(mesh.userData.glb)continue;
   const fading=mesh.userData.sourceTransparent||mesh.material.uniforms.opacity.value<.999;
   if(mesh.material.transparent!==fading){mesh.material.transparent=fading;mesh.material.needsUpdate=true;}
  }
  this.renderer.render(this.scene,this.camera);
 }
}
