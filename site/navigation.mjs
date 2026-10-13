import {houseNumber} from './models.mjs?v=114';
export function mapBounds(faces,yaw=-.57,pitch=.61){
 const co=Math.cos(yaw),si=Math.sin(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch);
 const b={minU:Infinity,maxU:-Infinity,minV:Infinity,maxV:-Infinity};
 // Scenic approach roads never expand the navigable project area.
 for(const f of faces){if(f.id<0)continue;for(const [x,y,z] of f.v){const u=x*co-z*si,v=(x*si+z*co)*sp-(y-2)*cp;b.minU=Math.min(b.minU,u);b.maxU=Math.max(b.maxU,u);b.minV=Math.min(b.minV,v);b.maxV=Math.max(b.maxV,v);}}
 b.minU-=32;b.maxU+=32;b.minV-=24;b.maxV+=24;return b;
}
export function fitScale(b,w,h){return Math.min((w-48)/(b.maxU-b.minU),(h-230)/(b.maxV-b.minV))}
export function constrain(c,b,w,h,soft=false){
 const co=Math.cos(c.yaw),si=Math.sin(c.yaw),sp=Math.sin(c.pitch),s=c.scale;
 const clamp=(v,lo,hi)=>{if(lo>hi)return (lo+hi)/2;const edge=Math.max(lo,Math.min(hi,v));return soft?edge+28*Math.tanh((v-edge)/65):edge;};
 // Keep a small outer margin while allowing the viewport to travel inside the world.
 const halfU=0,halfV=0; // Let edge projects reach the viewport centre in every direction.
 const u=clamp(c.x*co-c.z*si,b.minU+halfU,b.maxU-halfU);
 const v=clamp((c.x*si+c.z*co)*sp,b.minV+halfV,b.maxV-halfV);
 c.x=u*co+v/sp*si;c.z=-u*si+v/sp*co;return c;
}
const normalize=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function searchHouses(names,query){
 const q=normalize(query);if(!q)return [];
 const numbered=q.match(/^(?:jh|jouhouse|house)?0*(\d+)$/);
 const words=query.trim().split(/\s+/).map(normalize).filter(Boolean);
 return names.map((name,i)=>({name,i})).filter(({name,i})=>{
  if(numbered)return houseNumber(i)===Number(numbered[1]);
  const key=normalize(name);return key.includes(q)||words.every(word=>key.includes(word));
 }).sort((a,b)=>Number(normalize(b.name)===q)-Number(normalize(a.name)===q));
}
