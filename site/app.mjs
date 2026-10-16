import {createPhoneIntro} from './phone-intro.mjs';
import {cameraFlight as createCameraFlight,sampleCameraFlight} from './camera-flight.mjs?v=143';
import {createTouchOrbit} from './touch-orbit.mjs?v=129';
import {prepareCollection} from './photo-album-cache.mjs?v=129';
import './photo-offline.mjs?v=128';
import {landscapeModelScale} from './landscape-model.mjs?v=124';
import {createHouseCallout} from './house-callout.mjs?v=123';
import {centerOrbitCamera} from './orbit-camera.mjs';
import {wheelIntent,panDelta} from './wheel-input.mjs';
import {glbIds} from './glb-assets.mjs?v=114';
import {canExplore} from './project-access.mjs?v=114';
import './interaction-comfort.mjs';
import {NeighborhoodRenderer} from './renderer.mjs?v=139';
import {SoftwareRenderer} from './software-renderer.mjs?v=139';
import {mapBounds,fitScale,constrain,searchHouses} from './navigation.mjs?v=114';
import {buildWorld,project,names,spacing,position,title,houseNumber,description,orientation} from './models.mjs?v=114';
const $=id=>document.getElementById(id),canvas=$('map'),world=buildWorld(),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let w=innerWidth,h=innerHeight,current=0,front=false,previewId=-1,hover=-1,drag=null,moved=false,raf=0,zoom=1,modelZoom=1;
const compactLandscape=()=>innerWidth>innerHeight&&innerHeight<=540;
const desktopInput=()=>!compactLandscape()&&!matchMedia('(any-pointer: coarse)').matches&&innerWidth>=900&&!(navigator.maxTouchPoints>0)&&matchMedia('(hover: hover) and (pointer: fine)').matches;
const hoverLevels=new Float32Array(names.length);

const camera={x:25,y:2,z:15,yaw:-.57,pitch:.61,scale:10,t:0};let goal={...camera};
const bounds=mapBounds(world.faces);
const modelStatus=document.createElement('p'); modelStatus.id='modelStatus';modelStatus.setAttribute('role','status');modelStatus.hidden=true;document.body.append(modelStatus);
function updateModelStatus(){const id=front?current:hover,hidden=!engine.contextLost&&(!canExplore(id)||engine.modelMetas.has(id)),text=engine.contextLost?'Restoring 3D view…':engine.modelErrors?.has(id)?'The house could not load. Refresh to retry.':'Loading 3D model…';if(modelStatus.hidden!==hidden)modelStatus.hidden=hidden;if(modelStatus.textContent!==text)modelStatus.textContent=text}
const onModelChange=()=>{if(front&&engine.modelMetas.get(current)&&engine.modelMetas.get(current)!==activeModelMeta){activeModelMeta=engine.modelMetas.get(current);setFront();flyCamera()} if(engine.modelMetas){ for(const [id,meta] of engine.modelMetas){world.anchors[id]=[meta.placement.x,meta.bounds.max[1]+.7,meta.placement.z];} } updateModelStatus();start(); };
let activeModelMeta;
let engine;
try{engine=new NeighborhoodRenderer(canvas,world,onModelChange)}catch{engine=new SoftwareRenderer(canvas,world,onModelChange)}
const browseOrder=[0,9,13,29,...glbIds.filter(id=>id!==51)].sort((a,b)=>houseNumber(a)-houseNumber(b)).concat(44,51);
const order=browseOrder;
const baseScale=()=>compactLandscape()?Math.min(w/80,(h-70)/34):w<700?Math.min(w/48,(h-120)/48):Math.min(w/108,(h-250)/45);
// Reference homepage: the whole neighborhood, slightly right and below center.
let homeAnchor=null,phoneHome=null;
function homeCamera(){
 const pose={x:0,y:2,z:0,yaw:-.57,pitch:.61,scale:1,t:0},points=world.faces.flatMap(face=>face.v.map(point=>project(point,pose,0,0)));
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
 if(!desktopInput()){
  const scale=Math.min(w*1.7/(right-left),h*.68/(bottom-top));
  const u=left+(w/2-w*(compactLandscape()?.42:.18))/scale,v=top+(h/2-h*.32)/scale,co=Math.cos(pose.yaw),si=Math.sin(pose.yaw),sp=Math.sin(pose.pitch);
  const x=u*co+v/sp*si,z=-u*si+v/sp*co;homeAnchor=[x,2,z];phoneHome={...pose,x,z,scale};return {...phoneHome};
 }
 phoneHome=null;
 const scale=Math.min(w*.62/(right-left),h*.77/(bottom-top));
 const u=(left+right)/2-w*.026/scale,v=(top+bottom)/2-h*.042/scale,co=Math.cos(pose.yaw),si=Math.sin(pose.yaw),sp=Math.sin(pose.pitch);
 const centerU=(left+right)/2,centerV=(top+bottom)/2;homeAnchor=[centerU*co+centerV/sp*si,2,-centerU*si+centerV/sp*co];
 return {...pose,x:u*co+v/sp*si,z:-u*si+v/sp*co,scale};
}
function limit(){if(!front&&!drag)constrain(goal,bounds,w,h)}
const labels=names.map((name,i)=>{if(i===29)name='Marboy House';const b=document.createElement('button');b.className='house-label';b.disabled=!canExplore(i);b.hidden=!canExplore(i);b.tabIndex=canExplore(i)?0:-1;b.innerHTML=`<strong>${title(i)}</strong><span>${name}</span>`;b.setAttribute('aria-label',`Preview ${name}; activate again to explore in 3D`);b.onfocus=()=>{hover=i;start()};b.onblur=()=>{hover=-1;start()};b.onpointerenter=e=>{if(!desktopInput()||e.pointerType!=='mouse')return;hover=i;start()};b.onpointerleave=()=>{hover=-1;start()};b.onclick=e=>{if(!moved)activateHouse(i,e.pointerType)};$('labels').append(b);return b});
const houseCallout=createHouseCallout(id=>openHouse(id),direction=>browseHouse(direction,{quick:true}));
const phoneIntro=createPhoneIntro();
function resize(){const atPhoneHome=phoneHome&&!front&&Math.abs(camera.scale-phoneHome.scale)<.01&&Math.hypot(camera.x-phoneHome.x,camera.z-phoneHome.z)<.01;cameraFlight=null;w=innerWidth;h=innerHeight;document.body.classList.toggle('touch-layout',!desktopInput());document.body.classList.toggle('landscape-layout',compactLandscape());engine.resize(w,h);if(front){const yaw=goal.yaw,pitch=goal.pitch;setFront();goal.yaw=yaw;goal.pitch=pitch;centerUpdatedModel();}else{const nextHome=!desktopInput()?homeCamera():null;if(atPhoneHome&&nextHome){goal=nextHome;zoom=goal.scale/baseScale();}else goal.scale=baseScale()*zoom;}limit();Object.assign(camera,goal);updateBrowse();start()}
function calloutHouseShape(id){
 const meta=engine.modelMetas.get(id);if(!meta)return null;
 const {min,max}=meta.bounds,points=[];
 for(const x of [min[0],max[0]])for(const y of [min[1],max[1]])for(const z of [min[2],max[2]])points.push(project([meta.placement.x+x,y,meta.placement.z+z],camera,w,h));
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 return {roofTop:Math.min(...ys),span:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
}
function render(){phoneIntro.update({phone:!desktopInput(),front,view:camera,goal,home:phoneHome});houseCallout.update(previewId,previewId===29?'Marboy House':names[previewId],previewId>=0?title(previewId):'',previewId>=0?project(world.anchors[previewId],camera,w,h).slice(0,2):null,w,h,previewId>=0&&!front,camera.scale,previewId>=0?calloutHouseShape(previewId):null);updateModelStatus();engine.render(camera,w,h,current,front,hoverLevels);
if(desktopInput())labels.forEach((b,i)=>{const hidden=front||!canExplore(i);if(b.hidden!==hidden)b.hidden=hidden;if(hidden)return;b.classList.toggle('shown',i===hover);const p=project(world.anchors[i],camera,w,h),left=`${Math.max(12,Math.min(w-160,p[0]))}px`,top=`${Math.max(210,Math.min(h-100,p[1]))}px`;if(b.style.left!==left)b.style.left=left;if(b.style.top!==top)b.style.top=top})
}


let lastFrame=0,cameraFlight=null;
function modelCameraFocus(){const meta=engine.modelMetas.get(current),bounds=modelBounds(),place=meta?.placement,at=place?[place.x,place.z]:position(current);return [at[0]+(bounds.min[0]+bounds.max[0])/2,(bounds.min[1]+bounds.max[1])/2,at[1]+(bounds.min[2]+bounds.max[2])/2];}
function flyCamera(quick=false,focusOverride=null){limit();const focus=focusOverride??modelCameraFocus();cameraFlight=reduce?null:createCameraFlight(camera,goal,performance.now(),{viewportDiagonal:Math.hypot(w,h),focus,durationScale:quick?.6:1});}
function flyHomeCamera(fromSection=false,focus=null){
 if(fromSection){cameraFlight=null;Object.assign(camera,goal);return;}
 flyCamera(false,focus??homeAnchor);
}
function tick(now){raf=0;const dt=Math.min(32,lastFrame?now-lastFrame:16.7);lastFrame=now;const cameraEase=1-Math.exp(-dt/(drag||touchOrbit.active?18:110)),hoverEase=1-Math.exp(-dt/65);let active=false;if(cameraFlight){const sample=sampleCameraFlight(cameraFlight,now);Object.assign(camera,sample.state);if(sample.done){Object.assign(camera,goal);cameraFlight=null;}else active=true;}else for(const key of Object.keys(camera)){const d=goal[key]-camera[key];if(Math.abs(d)>.0005){camera[key]+=d*(reduce?1:cameraEase);active=true}else camera[key]=goal[key]}if(front&&!cameraFlight&&camera.t>.995)centerUpdatedModel(camera);const desktop=desktopInput();for(let i=0;i<hoverLevels.length;i++){const target=canExplore(i)&&((desktop&&i===hover)||i===previewId)&&!front?1:0,d=target-hoverLevels[i];if(Math.abs(d)>.004){hoverLevels[i]+=d*(reduce?1:hoverEase);active=true}else hoverLevels[i]=target}render();raf=active?requestAnimationFrame(tick):0}
function start(){limit();if(document.hidden||document.body.classList.contains('view-about')||document.body.classList.contains('view-contact')||document.querySelector('dialog.project-page[open],dialog#detail[open]'))return;if(!raf){lastFrame=0;raf=requestAnimationFrame(tick)}}
function updateUI(){updateBrowse();$('number').textContent=current===51?'':current===44?'jou.commercial 01':`jou.house ${String(houseNumber(current)).padStart(2,'0')}`;$('name').textContent=current===29?'Marboy House':names[current];$('projectStoryTitle').textContent='About the project';$('projectStory').textContent=description(current);$('projectStory').hidden=!description(current);$('area').textContent=current===38?'Area · 120–180 / 128 sqm':'';$('area').hidden=current!==38;$('more').firstChild.textContent=front?'Project details ':'Explore 3D ';$('more').querySelector('span').innerHTML='<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 10h13m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';$('category').textContent=current===51?'':current===44?'Commercial Project':'Rsdtl Project';$('focus').setAttribute('aria-label',`${names[current]} project information`);$('restore-project').textContent=current===29?'Marboy House':names[current];$('announce').textContent=`${names[current]}, ${front?'front view':'neighborhood view'}`}
let sheetState='peek',sheetDrag=null,sheetSwipe=null;
function setSheet(state){
 if(!front&&state!=='hidden')state='compact';
 sheetState=state;$('focus').dataset.sheet=state;
 const hidden=state==='hidden';$('focus').inert=hidden;$('restore-project').hidden=!hidden;
 $('sheet-handle').setAttribute('aria-expanded',String(state==='expanded'));
 $('sheet-handle').setAttribute('aria-label',front?'Open project details':'Explore 3D model');
 $('focus').style.removeProperty('--sheet-drag');$('focus').style.removeProperty('--sheet-scale');
 $('focus').tabIndex=state==='compact'?0:-1;
 if(state!=='compact'&&document.activeElement===$('focus'))$('focus').blur();
 if(!reduce&&state!=='hidden')$('focus').animate?.([{opacity:.5,translate:'0 10px'},{opacity:1,translate:'0 0'}],{duration:460,easing:'cubic-bezier(.22,1,.36,1)'});
 if(!reduce&&hidden)$('restore-project').animate?.([{opacity:0,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:400,easing:'cubic-bezier(.22,1,.36,1)'});
}
$('sheet-handle').onclick=()=>{if(!front)openHouse(current);};
$('hide-project').hidden=true;
$('focus').addEventListener('keydown',e=>{if(!front&&e.target===$('focus')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openHouse(current);}});
$('restore-project').onclick=()=>setSheet('peek');
for(const el of [$('focus'),$('restore-project')]){
 el.addEventListener('pointerdown',e=>{
  sheetSwipe=null;
  if(e.button!==0||e.target.closest('#more,#hide-project,.project-story')||e.target.closest('button:not(#sheet-handle):not(#restore-project)'))return;
  $('focus').getAnimations?.().forEach(animation=>animation.cancel());
  sheetSwipe=null;sheetDrag={id:e.pointerId,x:e.clientX,y:e.clientY,state:sheetState,dx:0,dy:0};el.setPointerCapture(e.pointerId);
 });
 el.addEventListener('pointermove',e=>{
  if(!sheetDrag||sheetDrag.id!==e.pointerId)return;sheetDrag.dx=e.clientX-sheetDrag.x;sheetDrag.dy=e.clientY-sheetDrag.y;
  if(!front&&el.id==='focus'&&Math.abs(sheetDrag.dx)>Math.abs(sheetDrag.dy)*1.2){el.style.removeProperty('--sheet-drag');el.style.removeProperty('--sheet-scale');return;}
  if(Math.abs(sheetDrag.dy)>4)document.body.classList.add('sheet-dragging');
  if(el.id==='focus'){
   el.style.setProperty('--sheet-drag',`${sheetDrag.dy<0?sheetDrag.dy*.25:Math.min(180,sheetDrag.dy*.8)}px`);
   el.style.setProperty('--sheet-scale',String(Math.max(.92,1-Math.max(0,sheetDrag.dy)/1500)));
  }
 });
 el.addEventListener('pointerup',e=>{
  if(!sheetDrag||sheetDrag.id!==e.pointerId)return;const {dx,dy,state}=sheetDrag;sheetDrag=null;document.body.classList.remove('sheet-dragging');
  if(!front&&el.id==='focus'&&Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){sheetSwipe=el;e.preventDefault();el.style.removeProperty('--sheet-drag');browseHouse(dx<0?1:-1,{quick:true});return;}
  if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)){sheetSwipe=el;el.style.removeProperty('--sheet-drag');el.style.removeProperty('--sheet-scale');return;}
  if(Math.abs(dy)>12){sheetSwipe=el;e.preventDefault();
   if(!front){if(dy<-35)openHouse(current);else setSheet('compact');}
   else if(dy>45)setSheet('hidden');else if(dy<-35)setSheet('peek');else setSheet(state);
  }
  else{$('focus').style.removeProperty('--sheet-drag');$('focus').style.removeProperty('--sheet-scale');}
 });
 el.addEventListener('click',e=>{if(sheetSwipe){const suppress=sheetSwipe===el;sheetSwipe=null;if(suppress){e.preventDefault();e.stopImmediatePropagation();}}},{capture:true});
 el.addEventListener('pointercancel',()=>{sheetDrag=null;document.body.classList.remove('sheet-dragging');$('focus').style.removeProperty('--sheet-drag');$('focus').style.removeProperty('--sheet-scale')});
}
// Reserve a stable viewing area above the phone card and beside desktop copy.
let modelPan={x:0,y:0};
function modelViewport(){
 const mobile=w<700||!desktopInput();
 const header=document.querySelector('header').getBoundingClientRect();
 if(compactLandscape()){const top=Math.max(58,header.bottom+8),bottom=h-126;return {x:w/2,y:(top+bottom)/2,width:w-96,height:Math.max(80,bottom-top)};}
 const top=Math.max(mobile?100:120,header.bottom+24);
 if(mobile){const bottom=h-Math.max(54,Math.min(76,h*.08))-100-28;return {x:w/2,y:(top+bottom)/2,width:w-48,height:Math.max(120,bottom-top)};}
 const bottom=h-200;
 return {x:w/2,y:(top+bottom)/2-24,width:Math.min(w-100,1180),height:Math.max(160,bottom-top)};
}
function modelBounds(){
 const meta=engine.modelMetas.get(current);if(meta)return meta.bounds;
 return {min:[-4,0,-4],max:[4,6,4]};
}
function centerUpdatedModel(state=goal){
 const meta=engine.modelMetas.get(current),place=meta?.placement;
 
 const view=modelViewport();
 view.x+=modelPan.x;view.y+=modelPan.y;
 centerOrbitCamera(state,modelBounds(),place?[place.x,place.z]:position(current),view,w,h);
 return true;
}

function centerUpdatedModelIfFront(){if(front){centerUpdatedModel();start();}}
function orbitTo(yaw,pitch=goal.pitch){if(!front)return;cameraFlight=null;goal.yaw=yaw;goal.pitch=Math.max(-1.2,Math.min(1.45,pitch));centerUpdatedModel();start()}
function setFront(){
 modelPan={x:0,y:0};
 const {min:lo,max:hi}=modelBounds(),view=modelViewport();
 const width=hi[0]-lo[0],height=hi[1]-lo[1],depth=hi[2]-lo[2];
 const fill=!desktopInput()?.76:.98;
 const scale=Math.min(view.width*fill/Math.hypot(width,depth),view.height*fill/Math.hypot(width,height,depth))*modelZoom;
 goal={x:0,y:0,z:0,yaw:orientation(current),pitch:0,scale,t:1};centerUpdatedModel();
}

function showProjectCard(){
 $('focus').hidden=false;document.body.classList.add('has-selection');setSheet('peek');updateUI();
 if(!reduce)$('name').animate?.([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
}
function previewHouse(i,{center=false,quick=false}={}){
 if(!canExplore(i))return;
 cardPress=null;current=i;window.jouPreparePhotos?.get(({0:'rumah-anas',9:'rumasoka',12:'rr-house',18:'jangkrik',19:'zubair',26:'flute',29:'marboy',44:'rempoa'})[i])?.();engine.ensureModel?.(i);previewId=i;hover=-1;
 if(center){zoom=desktopInput()?1.25:.9;goal={x:position(i)[0],y:2,z:position(i)[1],yaw:-.57,pitch:.61,scale:baseScale()*zoom,t:0};flyCamera(quick);}
 showProjectCard();start();
}
function browseNeighbor(direction){
 const index=browseOrder.indexOf(current);
 if(index>=0)return browseOrder[index+direction];
 if(current===44)return direction<0?browseOrder.at(-2):undefined;
 const residential=browseOrder.filter(id=>id!==44);
 return direction>0?residential.find(id=>houseNumber(id)>houseNumber(current))??44:residential.findLast(id=>houseNumber(id)<houseNumber(current));
}
function updateBrowse(){
 $('house-browse').hidden=front||previewId<0;
 for(const [id,direction] of [['house-prev',-1],['house-next',1]]){
  const next=browseNeighbor(direction);$(id).disabled=next===undefined;
  $(id).setAttribute('aria-label',next===undefined?(direction<0?'First project':'Last project'):`${direction<0?'Previous':'Next'} project: ${title(next)} · ${names[next]}`);
 }
}
const browsePressAnimations=new Map();
function browseHouse(direction,{quick=false}={}){
 if(!front&&previewId<0)return;const next=browseNeighbor(direction);if(next===undefined)return;
 if(front){openHouse(next);return;}
 previewHouse(next,{center:true,quick});
 if(!reduce){
  const button=$(direction<0?'house-prev':'house-next'),icon=button.querySelector('svg');
  browsePressAnimations.get(button)?.forEach(animation=>animation.cancel());
  const animations=[];
  const nudge=icon?.animate?.([{transform:`translateX(${-direction*3}px)`,opacity:.55},{transform:'translateX(0)',opacity:1}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'});
  if(nudge)animations.push(nudge);browsePressAnimations.set(button,animations);
 }
 if(!reduce){$('focus').getAnimations().forEach(animation=>animation.cancel());$('focus').animate?.([{opacity:.65,translate:`${direction*6}px 0`},{opacity:1,translate:'0 0'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});}
}
$('house-prev').onclick=()=>browseHouse(-1);$('house-next').onclick=()=>browseHouse(1);
function activateHouse(i,pointerType){if(!canExplore(i))return;if(!front&&previewId===i)openHouse(i);else previewHouse(i,{center:true})}
function clearPreview(){
 if(front)return;previewId=-1;hover=-1;$('focus').hidden=true;$('restore-project').hidden=true;
 document.body.classList.remove('has-selection');updateBrowse();start();
}
function openHouse(i){
 touchOrbit.cancel();
 if(!canExplore(i))return;
 modelZoom=1;current=i;window.jouPreparePhotos?.get(({0:'rumah-anas',9:'rumasoka',12:'rr-house',18:'jangkrik',19:'zubair',26:'flute',29:'marboy',44:'rempoa'})[i])?.();engine.ensureModel?.(i);activeModelMeta=engine.modelMetas.get(i);front=true;previewId=-1;
 document.querySelector('.search-wrap').hidden=true;hover=-1;
 document.body.classList.add('model-view');showProjectCard();setFront();flyCamera();$('back').hidden=false;
 canvas.style.cursor='grab';start();
}
function back(){
 front=false;touchOrbit.cancel();document.body.classList.remove('model-view');document.querySelector('.search-wrap').hidden=false;
 zoom=1.15;goal={x:position(current)[0],y:2,z:position(current)[1],yaw:-.57,pitch:.61,scale:baseScale()*zoom,t:0};
 $('back').hidden=true;previewId=current;hover=desktopInput()?current:-1;
 showProjectCard();flyCamera();
 start();
}
function select(i){if(!canExplore(i))return;const next=Math.max(0,Math.min(names.length-1,i));if(front)openHouse(next);else previewHouse(next,{center:true});}
function zoomBy(amount){cameraFlight=null;if(front){const next=Math.max(.6,Math.min(3,modelZoom*amount));goal.scale*=next/modelZoom;modelZoom=next;centerUpdatedModel();start();return;}const minZoom=fitScale(bounds,w,h)*.9/baseScale();zoom=Math.max(minZoom,Math.min(1.5,zoom*amount));goal.scale=baseScale()*zoom;start()}
$('back').onclick=back;
// A card revealed on pointerup must not consume the same Safari compatibility click.
let cardPress=null;
$('focus').addEventListener('pointerdown',e=>{cardPress={id:current,front};},{capture:true});
$('focus').addEventListener('pointercancel',()=>{cardPress=null;},{capture:true});
function intentionalCardClick(e){return e.detail===0||(cardPress?.id===current&&cardPress.front===front);}
$('focus').addEventListener('click',e=>{
 if(!intentionalCardClick(e)){e.preventDefault();e.stopImmediatePropagation();return;}
 if(!front&&!e.target.closest('button,.project-story'))openHouse(current);
 cardPress=null;
},{capture:true});
function pick(x,y,padding=desktopInput()?6:16){let nearest=-1,dist=Infinity;for(let i=0;i<names.length;i++){
 if(!canExplore(i))continue;
 const meta=engine.modelMetas.get(i);let left,right,top,bottom;
 if(meta){
  const b=meta.bounds,pts=[];for(const xx of [b.min[0],b.max[0]])for(const yy of [b.min[1],b.max[1]])for(const zz of [b.min[2],b.max[2]])pts.push(project([meta.placement.x+xx,yy,meta.placement.z+zz],camera,w,h));
  left=Math.min(...pts.map(p=>p[0]));right=Math.max(...pts.map(p=>p[0]));top=Math.min(...pts.map(p=>p[1]));bottom=Math.max(...pts.map(p=>p[1]));
 }else{const p=project([position(i)[0],2,position(i)[1]],camera,w,h),rx=7*camera.scale,ry=5*camera.scale;left=p[0]-rx;right=p[0]+rx;top=p[1]-ry;bottom=p[1]+ry;}
 const px=Math.max(padding,(44-(right-left))/2),py=Math.max(padding,(44-(bottom-top))/2);
 if(x<left-px||x>right+px||y<top-py||y>bottom+py)continue;
 const edge=Math.hypot(Math.max(left-x,0,x-right),Math.max(top-y,0,y-bottom));
 const d=edge*10+Math.hypot((x-(left+right)/2)/Math.max(22,right-left),(y-(top+bottom)/2)/Math.max(22,bottom-top));
 if(d<dist){nearest=i;dist=d;}
}return nearest}

let lastResetTap=null;
function resetView(){
 if(front){modelZoom=1;setFront();}
 else if(previewId<0&&desktopInput()){goal=homeCamera();zoom=goal.scale/baseScale();}
 else{zoom=previewId>=0?(desktopInput()?1.25:.9):1;goal={x:previewId>=0?position(current)[0]:camera.x,y:2,z:previewId>=0?position(current)[1]:camera.z,yaw:-.57,pitch:.61,scale:baseScale()*zoom,t:0};}
 lastResetTap=null;$('announce').textContent='View reset to normal zoom';flyCamera();start();
}
function resetTap(e){
 const key=front?`model-${current}`:'map',now=e.timeStamp;
 if(lastResetTap&&lastResetTap.key===key&&now-lastResetTap.time<320&&Math.hypot(e.clientX-lastResetTap.x,e.clientY-lastResetTap.y)<28){e.preventDefault();resetView();return true;}
 lastResetTap={key,time:now,x:e.clientX,y:e.clientY};return false;
}
canvas.addEventListener('dblclick',e=>{e.preventDefault();if(front||pick(e.clientX,e.clientY)<0)resetView();});
const touches=new Map();let pinchDistance=0,pinchCenter=null,twoGesture=null,continuedPan=null;
const touchOrbit=createTouchOrbit(canvas,{
 eligible:()=>front&&!desktopInput()&&!document.querySelector('dialog[open]'),
 read:()=>({w,h,yaw:goal.yaw,pitch:goal.pitch,scale:goal.scale,zoom:modelZoom,pan:modelPan,bounds:modelBounds(),placement:engine.modelMetas.get(current)?.placement?[engine.modelMetas.get(current).placement.x,engine.modelMetas.get(current).placement.z]:position(current)}),
 change:state=>{cameraFlight=null;moved=true;goal.yaw=state.yaw;goal.pitch=state.pitch;goal.scale=state.scale;modelZoom=state.zoom;modelPan=state.pan;centerUpdatedModel();start();},
 multi:()=>{drag=null;moved=true;},start:()=>engine.setInteracting?.(true),end:()=>engine.setInteracting?.(false)
});
// Map gestures retain ordinary pinch zoom; model gestures belong to OrbitControls.
canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||front)return;touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===2){const [a,b]=[...touches.values()];pinchDistance=Math.hypot(a[0]-b[0],a[1]-b[1]);drag=null;moved=true;}});
canvas.addEventListener('pointermove',e=>{if(front||!touches.has(e.pointerId))return;touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===2){const [a,b]=[...touches.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinchDistance>0)zoomBy(d/pinchDistance);pinchDistance=d;moved=true;}});
for(const event of ['pointerup','pointercancel'])canvas.addEventListener(event,e=>{touches.delete(e.pointerId);if(pinchDistance){drag=null;moved=true;pinchDistance=0;}});
canvas.addEventListener('pointerdown',e=>{cameraFlight=null;if(e.button!==0||touches.size>1||touchOrbit.count>1)return;engine.setInteracting?.(true);if(!front){goal.x=camera.x;goal.z=camera.z;}drag={modelHit:front&&engine.hitsModel(current,e.clientX,e.clientY,camera,w,h),hit:front?-1:pick(e.clientX,e.clientY),touch:e.pointerType==='touch',x:e.clientX,y:e.clientY,camera:{...camera},lastX:e.clientX,lastY:e.clientY,lastTime:e.timeStamp,vx:0,vz:0};moved=false;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(touches.size>1||continuedPan)return;if(touchOrbit.handles(e)){if(drag&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7)moved=true;return;}if(front){if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>(drag.touch?7:4)){moved=true;$('viewport').classList.add('dragging');orbitTo(drag.camera.yaw-dx*.008,drag.camera.pitch+dy*.006)}}return;}if(!drag){if(!desktopInput()||e.pointerType!=='mouse')return;const p=pick(e.clientX,e.clientY,0);if(p!==hover){hover=p;canvas.style.cursor=p<0?'grab':'pointer';if(previewId<0){if(p>=0){current=p;showProjectCard();}else{$('focus').hidden=true;document.body.classList.remove('has-selection');}}start()}return}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>(drag.touch?8:5)){if(!moved)clearPreview();moved=true;$('viewport').classList.add('dragging');const co=Math.cos(drag.camera.yaw),si=Math.sin(drag.camera.yaw),s=drag.camera.scale,sp=Math.sin(drag.camera.pitch);const elapsed=Math.max(8,e.timeStamp-drag.lastTime),mx=e.clientX-drag.lastX,my=e.clientY-drag.lastY;drag.vx=(-mx/s*co-my/s/sp*si)/elapsed;drag.vz=(mx/s*si-my/s/sp*co)/elapsed;drag.lastX=e.clientX;drag.lastY=e.clientY;drag.lastTime=e.timeStamp;goal.x=drag.camera.x-dx/s*co-dy/s/sp*si;goal.z=drag.camera.z+dx/s*si-dy/s/sp*co;constrain(goal,bounds,w,h,true);start()}});
canvas.addEventListener('pointerup',e=>{engine.setInteracting?.(touches.size>0||touchOrbit.active);if(!drag)return;const released=drag;drag=null;$('viewport').classList.remove('dragging');if(front){if(!moved&&released.modelHit&&engine.hitsModel(current,e.clientX,e.clientY,camera,w,h)){lastResetTap=null;openProjectDetails();}else if(!moved&&!desktopInput()&&!engine.hitsModel(current,e.clientX,e.clientY,camera,w,h)){lastResetTap=null;back();}else if(moved)lastResetTap=null;return;}if(moved&&!reduce&&e.timeStamp-released.lastTime<90){goal.x+=Math.max(-5,Math.min(5,released.vx*60));goal.z+=Math.max(-5,Math.min(5,released.vz*60));}if(!moved){const i=released.hit>=0?released.hit:pick(e.clientX,e.clientY);if(i>=0){lastResetTap=null;activateHouse(i,e.pointerType);}else{if(e.pointerType==='touch')resetTap(e);clearPreview();}}else{lastResetTap=null;hover=-1;updateUI();start();deferModelLoading()}setTimeout(()=>moved=false,0)});
canvas.addEventListener('pointercancel',()=>{lastResetTap=null;engine.setInteracting?.(touchOrbit.active);drag=null;$('viewport').classList.remove('dragging')});canvas.addEventListener('pointerleave',()=>{if(!drag){hover=-1;start()}});
let wheelGesture=null,modelResumeTimer=0;
function deferModelLoading(){clearTimeout(modelResumeTimer);engine.setInteracting?.(true);modelResumeTimer=setTimeout(()=>{if(drag||touchOrbit.active||raf)deferModelLoading();else engine.setInteracting?.(false);},120);}
canvas.addEventListener('wheel',e=>{
 deferModelLoading();cameraFlight=null;
 e.preventDefault();const unit=e.deltaMode===1?16:e.deltaMode===2?h:1;
 wheelGesture=wheelIntent(e,wheelGesture);
 if(wheelGesture.kind==='pan'&&front){modelPan.x=Math.max(-w*.35,Math.min(w*.35,modelPan.x-e.deltaX*unit));modelPan.y=Math.max(-h*.3,Math.min(h*.3,modelPan.y-e.deltaY*unit));centerUpdatedModel();start();return;}
 if(desktopInput()&&wheelGesture.kind==='pan'&&!front){
  const delta=panDelta(e.deltaX*unit,e.deltaY*unit,goal);
  goal.x+=delta.x;goal.z+=delta.z;hover=-1;start();return;
 }
 zoomBy(Math.exp(-Math.max(-120,Math.min(120,e.deltaY*unit))*(e.ctrlKey?.008:.002)));
},{passive:false});
function openProjectDetailsContent(){if(front&&[36,38,40,41,42,43,45,46,47].includes(current)){const panel=$('jh37');panel.dataset.house=String(({36:37,38:39,40:41,41:42,42:43,43:44,45:49,46:50,47:46})[current]);panel.setAttribute('aria-label',title(current)+' — under construction');panel.showModal();panel.querySelector('.project-scroll').scrollTop=0;return;}if(!front){openHouse(current);return;}if(current===19||current===12){const panel=$(current===19?'zubair':'rr-house');panel.showModal();panel.querySelector('.project-scroll').scrollTop=0;return;}if(current===18||current===26){const panel=$(current===18?'jangkrik':'flute');panel.showModal();panel.querySelector('.project-scroll').scrollTop=0;return;}if(current===0||current===9){const panel=$(current===0?'rumah-anas':'rumasoka');panel.showModal();panel.querySelector('.project-scroll').scrollTop=0;return;}if(current===44){$('rempoa').showModal();$('rempoa').querySelector('.project-scroll').scrollTop=0;window.resetRempoaStage?.();return;}if(current===29){$('marboy').showModal();$('marboy').querySelector('.project-scroll').scrollTop=0;window.resetProjectStage?.();return;}$('detailNumber').textContent=title(current);$('detailName').textContent=names[current];$('description').textContent=description(current);$('detail').querySelector('.intro').textContent=current===51?'':current===44?'Commercial / Padel':'Residential';$('detail').showModal()}
const projectSlugs=new Map([...new Set([29,0,9,13,44,...glbIds])].map(id=>[id,({29:'marboy',18:'jangkrik',26:'flute'})[id]||names[id].toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')]));
const projectPanels=[...document.querySelectorAll('dialog.project-page,dialog#detail')];
function markProjectPanel(slug){const panel=projectPanels.find(panel=>panel.open);if(panel)panel.dataset.projectRoute=slug;}
function openProjectDetails(){const wasFront=front;openProjectDetailsContent();if(!wasFront||!front)return;const slug=projectSlugs.get(current);if(!slug)return;markProjectPanel(slug);if(location.hash!==`#project/${slug}`)history.pushState(null,'',`#project/${slug}`);}
function syncProjectRoute(){
 document.querySelectorAll('dialog.photo-viewer[open]').forEach(panel=>panel.close());
 if(!location.hash.startsWith('#project/')){for(const panel of projectPanels)if(panel.open)panel.close();return;}
 let slug;try{slug=decodeURIComponent(location.hash.slice(9)).toLowerCase().replace(/\s+/g,'-');}catch{slug='';}
 const entry=[...projectSlugs].find(([,value])=>value===slug);
 if(!entry){for(const panel of projectPanels)if(panel.open)panel.close();history.replaceState(null,'','#projects');document.documentElement.removeAttribute('data-route-pending');return;}
 if(!projectPanels.some(panel=>panel.open&&panel.dataset.projectRoute===slug)){
  for(const panel of projectPanels)if(panel.open)panel.close();openHouse(entry[0]);openProjectDetailsContent();markProjectPanel(slug);
 }
 history.replaceState(null,'',`#project/${slug}`);document.documentElement.removeAttribute('data-route-pending');
}
for(const panel of projectPanels)panel.addEventListener('close',()=>{if(!panel.open&&location.hash===`#project/${panel.dataset.projectRoute}`)history.replaceState(null,'','#projects');});
addEventListener('hashchange',syncProjectRoute);addEventListener('popstate',syncProjectRoute);
$('more').onclick=openProjectDetails;
function returnHome({fromSection=false}={}){
 const focus=front||previewId>=0?modelCameraFocus():null;
 document.querySelectorAll('dialog').forEach(d=>d.close());if(front)back();clearPreview();
 goal=homeCamera();zoom=goal.scale/baseScale();current=0;updateUI();flyHomeCamera(fromSection,focus);start();
}
$('projects').onclick=returnHome;

function info(title,text){$('infoTitle').textContent=title;$('infoText').textContent=text;$('info').showModal()}
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
window.addEventListener('keydown',e=>{if(document.body.classList.contains('view-about')||document.body.classList.contains('view-contact')||document.querySelector('dialog[open]')||e.target.closest('input, .search-wrap'))return;if(e.key==='Escape'){if(front)back();else clearPreview();}if(['+','=','-'].includes(e.key)){e.preventDefault();zoomBy(e.key==='-'?1/1.12:1.12);}if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();if(front)orbitTo(goal.yaw+(e.key==='ArrowRight'?1:-1)*Math.PI/8);else select(order[Math.max(0,Math.min(order.length-1,order.indexOf(current)+(e.key==='ArrowRight'?1:-1)))])}});window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);goal=homeCamera();zoom=goal.scale/baseScale();Object.assign(camera,goal);resize();updateUI();

const search=$('search'),results=$('results');
const searchNames=names.map((name,i)=>{if(i===29)return 'Marboy House';return /^(?:jh\d+|jou\s*house\s*\d+)$/i.test(name)?title(i):name;});
function closeResults(){results.hidden=true;search.setAttribute('aria-expanded','false')}
function showResults(){$('search-clear').hidden=!search.value.length;const matches=searchHouses(searchNames,search.value).filter(({i})=>canExplore(i));results.replaceChildren();if(!search.value.trim()){closeResults();return}results.hidden=false;search.setAttribute('aria-expanded','true');if(!matches.length){const p=document.createElement('p');p.textContent='No projects found';results.append(p)}for(const {name,i} of matches){const b=document.createElement('button');b.textContent=name;b.onclick=()=>{closeResults();search.blur();if(front){front=false;touchOrbit.cancel();document.body.classList.remove('model-view');document.querySelector('.search-wrap').hidden=false;$('back').hidden=true;}previewHouse(i,{center:true})};results.append(b)}}
$('search-clear').onclick=()=>{search.value='';$('search-clear').hidden=true;closeResults();search.focus();};
search.addEventListener('input',showResults);search.addEventListener('focus',()=>{if(search.value)showResults()});search.addEventListener('keydown',e=>{if(e.key==='Escape'){closeResults();search.blur()}if(e.key==='ArrowDown'){e.preventDefault();results.querySelector('button')?.focus()}if(e.key==='Enter'){e.preventDefault();results.querySelector('button')?.click()}});results.addEventListener('keydown',e=>{const buttons=[...results.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();buttons[(i+(e.key==='ArrowDown'?1:buttons.length-1))%buttons.length]?.focus()}if(e.key==='Escape'){closeResults();search.focus()}});document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search-wrap'))closeResults()});

const projectPanel=$('marboy');let backdropPress=false;
projectPanel.addEventListener('pointerdown',e=>{const r=projectPanel.getBoundingClientRect();backdropPress=e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;});
projectPanel.addEventListener('click',e=>{const r=projectPanel.getBoundingClientRect();if(backdropPress&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))projectPanel.close();backdropPress=false;});

import "./project-gallery.mjs?v=96";
import "./residential-projects.mjs?v=72";
import "./project-photo-gallery.mjs?v=96";
import "./project-social-films.mjs?v=85";
import "./project-motion.mjs?v=126";

const rempoaPanel=$('rempoa');let rempoaBackdrop=false;
rempoaPanel.addEventListener('pointerdown',e=>{const r=rempoaPanel.getBoundingClientRect();rempoaBackdrop=e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;});
rempoaPanel.addEventListener('click',e=>{const r=rempoaPanel.getBoundingClientRect();if(rempoaBackdrop&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))rempoaPanel.close();rempoaBackdrop=false;});

// Compact navigation and explicit zoom controls also work without gestures.
const menu=document.getElementById('menu-toggle'),navigation=document.querySelector('header nav');
menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('menu-open',open);};
function closeMenu(){if(menu.closest('header')?.classList.contains('detail-header-context'))return;menu.setAttribute('aria-expanded','false');navigation.classList.remove('menu-open');}
navigation.addEventListener('click',closeMenu);
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#menu-toggle,header nav'))closeMenu();},{capture:true,passive:true});
document.addEventListener('wheel',closeMenu,{capture:true,passive:true});
document.addEventListener('touchmove',closeMenu,{capture:true,passive:true});
document.addEventListener('scroll',closeMenu,{capture:true,passive:true});
addEventListener('hashchange',closeMenu);
$('map-reset').onclick=()=>returnHome();
document.getElementById('map-zoom-in').onclick=()=>zoomBy(1.15);
document.getElementById('map-zoom-out').onclick=()=>zoomBy(1/1.15);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');navigation.classList.remove('menu-open')}});

await import("./about.mjs?v=147");
syncProjectRoute();

// Wait for the imported models and a painted scene, rather than a fake progress percentage.
Promise.resolve(engine.firstReady||engine.ready).then(()=>requestAnimationFrame(()=>{render();requestAnimationFrame(()=>document.dispatchEvent(new Event('jou:scene-ready')));})).catch(()=>document.dispatchEvent(new Event('jou:scene-ready')));

import "./construction-animation.mjs?v=88";

import "./construction-progress.mjs?v=90";

import "./project-ribbon.mjs?v=105";
import "./project-photo-viewer.mjs?v=128";
import "./project-image-memory.mjs?v=129";

// Project pages use the existing canvas bitmap; no 3D work runs behind a gallery.
for(const panel of document.querySelectorAll('dialog.project-page,dialog#detail')){
 const pauseMap=()=>{touchOrbit.cancel();cancelAnimationFrame(raf);raf=0;lastFrame=0;drag=null;touches.clear();pinchDistance=0;continuedPan=null;pinchCenter=null;twoGesture=null;engine.setInteracting?.(panel.open);$('viewport').classList.remove('dragging');};
 new MutationObserver(()=>{if(panel.open)pauseMap();else start();}).observe(panel,{attributes:true,attributeFilter:['open']});
 panel.addEventListener('close',()=>{pauseMap();start();});
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;lastFrame=0;}else start();});

addEventListener('hashchange',()=>{if(document.body.classList.contains('view-about')||document.body.classList.contains('view-contact')){cancelAnimationFrame(raf);raf=0;lastFrame=0;}else start();});

import "./project-header-motion.mjs?v=115";



import "./zubair-carousel.mjs?v=113";

window.jouPhotoBusy=()=>engine.interacting&&!document.querySelector('dialog.project-page[open],dialog#detail[open]');
Promise.resolve(engine.ready).then(()=>setTimeout(prepareCollection,1200));
