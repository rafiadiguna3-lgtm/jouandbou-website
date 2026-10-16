import {readModelData,createModelQueue} from './model-data.mjs?v=139';
import {glbIds,mobileAsset} from './glb-assets.mjs?v=114';
import {project} from './models.mjs?v=114';

// A depth-buffered fallback for browsers without WebGL. It renders the same
// imported triangles and materials, rather than substituting a screenshot.
export class SoftwareRenderer {
 constructor(canvas,world,onChange){
  this.ctx=canvas.getContext('2d');this.canvas=canvas;this.world=world;this.onChange=onChange;this.modelState='loading';
  this.models=new Map();this.modelMetas=new Map();this.modelErrors=new Map();this.pendingModels=new Map();this.loadingModels=new Set();this.interacting=false;this.neighborhoodTimer=0;this.neighborhoodView=null;this.modelQueue=createModelQueue([29,0,9,13,44,...glbIds],async id=>{try{await this.load(id,mobileAsset(id))}catch(error){this.modelErrors.set(id,error);console.error('House model unavailable',id,error)}},{concurrency:1});this.firstReady=this.modelQueue.firstReady;this.ready=this.modelQueue.ready.then(()=>{this.modelState='ready';this.onChange()});
 }
 hitsModel(id,x,y,view,w,h){
  const model=this.models.get(id);if(!model)return false;
  const p=model.positions,place=model.modelMeta.placement;
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  for(let i=0;i<p.length;i+=9){const points=[];for(let j=0;j<9;j+=3)points.push(project([p[i+j]+place.x,p[i+j+1],p[i+j+2]+place.z],view,w,h));
   const [a,b,c]=points,area=cross(a,b,c);if(Math.abs(area)<.01)continue;
   const point=[x,y],u=cross(a,b,point),v=cross(b,c,point),q=cross(c,a,point);
   if(area>0?u>=0&&v>=0&&q>=0:u<=0&&v<=0&&q<=0)return true;
  }return false;
 }
 setVisible(value){this.suspended=!value;this.modelQueue.setPaused(this.suspended);}
 ensureModel(id){this.modelQueue?.prioritize(id)}
 async load(id,asset){
  const model={};
  const {meta,buffer:data}=await readModelData(asset);while(this.suspended||document.hidden)await new Promise(resolve=>setTimeout(resolve,120));model.modelMeta=meta;const n=meta.vertexCount;
  model.positions=new Float32Array(data,0,n*3);model.colors=new Uint8Array(data,n*12,n*4);
  model.priorities=new Float32Array(n/3);
  model.triangleShade=new Float32Array(n/3);
  for(let i=0;i<n;i+=3){const o=i*3,p=model.positions;const ax=p[o+3]-p[o],ay=p[o+4]-p[o+1],az=p[o+5]-p[o+2],bx=p[o+6]-p[o],by=p[o+7]-p[o+1],bz=p[o+8]-p[o+2];const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;model.triangleShade[i/3]=.78+.22*Math.abs((nx*-.359+ny*.798+nz*.479)/(Math.hypot(nx,ny,nz)||1));}
  for(const r of model.modelMeta.ranges)model.priorities.fill((r.material+1)*.00015,r.start/3,(r.start+r.count)/3);
  this.models.set(id,model);this.modelMetas.set(id,model.modelMeta);if(id===29)this.modelMeta=model.modelMeta;this.offscreen=document.createElement('canvas');this.offctx=this.offscreen.getContext('2d');
  this.onChange();
 }
 resize(w,h){this.dpr=w<700?1.25:2;this.canvas.width=Math.round(w*this.dpr);this.canvas.height=Math.round(h*this.dpr);this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);this.ctx.imageSmoothingEnabled=true;this.ctx.imageSmoothingQuality='high'}
 render(camera,w,h,current,front,hoverLevels){
  if(front)this.ensureModel(current);
  const ctx=this.ctx;ctx.fillStyle='#fafafa';ctx.fillRect(0,0,w,h);const list=[];
  for(const f of this.world.faces){
   if(this.models.has(f.id)&&!f.ground)continue;
   const opacity=f.id===current?1:1-camera.t;if(opacity<.01)continue;
   const lift=f.id>=0&&!front?(hoverLevels[f.id]||0)*.22:0;
   const pts=f.v.map(p=>project([p[0],p[1]+lift,p[2]],camera,w,h));
   if(pts.every(p=>p[0]<-60)||pts.every(p=>p[0]>w+60)||pts.every(p=>p[1]<-60)||pts.every(p=>p[1]>h+60))continue;
   const shade=f.color,mix=f.id>=0?Math.max(hoverLevels[f.id]||0,f.id===current?camera.t:0):0;
   const rgb=f.ground?[shade,shade,shade]:shade<170?[125,105,83]:shade<191?[103,158,170]:shade<213?[137,161,119]:shade<231?[183,164,138]:[239,229,211];
   list.push({pts,ground:f.ground,order:list.length,opacity,rgb:rgb.map(v=>Math.round(shade+(v-shade)*mix)),depth:pts.reduce((s,p)=>s+p[2],0)/pts.length});
  }
  list.sort((a,b)=>a.ground&&b.ground?a.order-b.order:a.ground?-1:b.ground?1:a.depth-b.depth);
  for(const f of list){ctx.globalAlpha=f.opacity;ctx.fillStyle=`rgb(${f.rgb.join(',')})`;ctx.beginPath();f.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.strokeStyle=f.ground?ctx.fillStyle:'rgba(90,90,90,.1)';ctx.lineWidth=.45;ctx.stroke()}
  ctx.globalAlpha=1;
  for(const [id,model] of this.models)if(current===id||camera.t<.99)this.drawHouse(camera,w,h,current,front,hoverLevels,id,model);
 }
 drawHouse(camera,w,h,current,front,hoverLevels,id,model){
  const p=model.positions,c=model.colors,n=p.length/3,place=model.modelMeta.placement;
  const bounds=model.modelMeta.bounds,corners=[];
  for(const x of [bounds.min[0],bounds.max[0]])for(const y of [bounds.min[1],bounds.max[1]])for(const z of [bounds.min[2],bounds.max[2]])corners.push(project([x+place.x,y,z+place.z],camera,w,h));
  if(corners.every(p=>p[0]<0)||corners.every(p=>p[0]>w)||corners.every(p=>p[1]<0)||corners.every(p=>p[1]>h))return;
  const mix=Math.max(hoverLevels[id]||0,front&&current===id?camera.t:0),lift=0;
  const projected=new Float32Array(n*3);let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  const cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
  for(let i=0;i<n;i++){
   const x=p[i*3]+place.x-camera.x,y=p[i*3+1]+lift-camera.y,z=p[i*3+2]+place.z-camera.z;
   const sx=w/2+(x*cy-z*sy)*camera.scale,screenY=h/2-(y*cp-(x*sy+z*cy)*sp)*camera.scale;
   projected[i*3]=sx;projected[i*3+1]=screenY;projected[i*3+2]=x*sy*cp+y*sp+z*cy*cp;
   minX=Math.min(minX,sx);maxX=Math.max(maxX,sx);minY=Math.min(minY,screenY);maxY=Math.max(maxY,screenY);
  }
  if(maxX<0||minX>w||maxY<0||minY>h)return;
  minX=Math.max(-1,Math.floor(minX));minY=Math.max(-1,Math.floor(minY));maxX=Math.min(w+1,Math.ceil(maxX));maxY=Math.min(h+1,Math.ceil(maxY));
  const scale=Math.min(1.25,1000/Math.max(maxX-minX,maxY-minY));
  const iw=Math.max(1,Math.ceil((maxX-minX)*scale)),ih=Math.max(1,Math.ceil((maxY-minY)*scale));
  const depth=new Float32Array(iw*ih).fill(-Infinity),rgba=new Uint8ClampedArray(iw*ih*4);
  for(let i=0;i<n;i++){projected[i*3]=(projected[i*3]-minX)*scale;projected[i*3+1]=(projected[i*3+1]-minY)*scale}
  const towards=[sy*cp,sp,cy*cp],light=[-.359, .798,.479];
  const cut=front&&current===id?Math.max(0,Math.min(1,(camera.pitch-1.05)/.35)):0;
  const solid=[],translucent=[];
  for(let i=0;i<n;i+=3)(c[i*4+3]===255?solid:translucent).push(i);
  translucent.sort((a,b)=>(projected[a*3+2]+projected[a*3+5]+projected[a*3+8])-(projected[b*3+2]+projected[b*3+5]+projected[b*3+8]));
  for(const opaque of [true,false])for(const i of opaque?solid:translucent){
   const alpha=c[i*4+3]/255;if(alpha<=0)continue;
   const o=i*3,x0=projected[o],y0=projected[o+1],z0=projected[o+2],x1=projected[o+3],y1=projected[o+4],z1=projected[o+5],x2=projected[o+6],y2=projected[o+7],z2=projected[o+8];
   const den=(y1-y2)*(x0-x2)+(x2-x1)*(y0-y2);if(Math.abs(den)<.08)continue;
   const loX=Math.max(0,Math.floor(Math.min(x0,x1,x2))),hiX=Math.min(iw-1,Math.ceil(Math.max(x0,x1,x2))),loY=Math.max(0,Math.floor(Math.min(y0,y1,y2))),hiY=Math.min(ih-1,Math.ceil(Math.max(y0,y1,y2)));
   const shade=model.triangleShade[i/3],mi=model.triangleMaterial?.[i/3],mat=mi===undefined?null:model.modelMeta.materials[mi],tex=mi===undefined?null:model.textures[mi];
   const r=c[i*4],g=c[i*4+1],b=c[i*4+2],gray=240;
   const red=(gray+(r-gray)*mix)*shade,green=(gray+(g-gray)*mix)*shade,blue=(gray+(b-gray)*mix)*shade;
   for(let yy=loY;yy<=hiY;yy++)for(let xx=loX;xx<=hiX;xx++){
    const a=((y1-y2)*(xx+.5-x2)+(x2-x1)*(yy+.5-y2))/den,bb=((y2-y0)*(xx+.5-x2)+(x0-x2)*(yy+.5-y2))/den,cc=1-a-bb;
    if(a<-.00001||bb<-.00001||cc<-.00001)continue;
    const z=a*z0+bb*z1+cc*z2+model.priorities[i/3],index=yy*iw+xx;if(z<=depth[index])continue;
    let rr=red,gg=green,bl=blue;
    if(tex){const uv=model.uvs;let u=a*uv[i*2]+bb*uv[i*2+2]+cc*uv[i*2+4],v=a*uv[i*2+1]+bb*uv[i*2+3]+cc*uv[i*2+5];const wrap=(t,mode)=>mode===33071?Math.max(0,Math.min(.999999,t)):mode===33648?1-Math.abs(((t%2)+2)%2-1):((t%1)+1)%1;u=wrap(u,tex.wrapS);v=wrap(v,tex.wrapT);const ti=(Math.min(tex.h-1,Math.floor(v*tex.h))*tex.w+Math.min(tex.w-1,Math.floor(u*tex.w)))*4;if(mat.alphaMode==='MASK'&&tex.data[ti+3]/255<mat.alphaCutoff)continue;rr=(gray+(r*tex.data[ti]/255-gray)*mix)*shade;gg=(gray+(g*tex.data[ti+1]/255-gray)*mix)*shade;bl=(gray+(b*tex.data[ti+2]/255-gray)*mix)*shade;}
    const out=index*4,priorAlpha=rgba[out+3]/255,total=alpha+priorAlpha*(1-alpha);
    rgba[out]=(rr*alpha+rgba[out]*priorAlpha*(1-alpha))/total;rgba[out+1]=(gg*alpha+rgba[out+1]*priorAlpha*(1-alpha))/total;rgba[out+2]=(bl*alpha+rgba[out+2]*priorAlpha*(1-alpha))/total;rgba[out+3]=total*255;
    if(opaque)depth[index]=z;
   }
  }
  this.offscreen.width=iw;this.offscreen.height=ih;this.offctx.putImageData(new ImageData(rgba,iw,ih),0,0);
  this.ctx.globalAlpha=current===id?1:1-camera.t;this.ctx.drawImage(this.offscreen,minX,minY,iw/scale,ih/scale);this.ctx.globalAlpha=1;
 }
}
