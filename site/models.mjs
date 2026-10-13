export const names=['Courtyard House','Split House','Inner Garden House','House of Light','Parkside House','Terrace House','Quiet House','Corner House','Gathering House','Patio House','Canopy House','Morning House','Screen House','Garden Room','Threshold House','Sky House','Layer House','Dusk House','Growing House','Homecoming House'];
names.push(...Array.from({length:24},(_,i)=>`Jou House ${i+21}`),'Rempoa Padel');
names[0]='Rumah Anas';
names[9]='Rumahsoka';
names[13]='Banjay House';
names[5]='Jupiter';
names[11]='BSD';
names[12]='RR House';
names[18]='Jangkrik House';
names[19]='Rumah Zubair';
names[26]='Flute House';
names[33]='JH34';
names[38]='E House';
names[29]='Jou House 30';
names[36]='JH37';names[40]='Cipete';names[41]='Sentul';names[42]='Kebon Jeruk';names[43]='Cakung';names.push('JH49','Rumarka','JH46','JH51','JH52','JH53','PDG Mosque');
export const houseNumber=i=>i===51?null:i===45?49:i===46?50:i===47?46:i>=48?i+3:i+1;
export const title=i=>i===51?'':i===44?'Jou Commercial 01':`Jou House ${String(houseNumber(i)).padStart(2,'0')}`;
export const description=i=>i===37?"Built around the client's requirements, the design begins with a complete facade transformation, redefining the house with a cleaner and more contemporary architectural expression.":'';
export const spacing=22;
// Original six-house streets, retaining the current architectural models.
export const position=i=>i===51?[146,48]:i===44?[146,-5]:i===45?[44,336]:i===46?[66,336]:i===47?[88,336]:i===48?[110,336]:i>=49?[(i-49)*spacing,384]:[(i%6)*spacing,Math.floor(i/6)*48];
export const orientation=()=>0;
export function project(p,c,w,h){const dx=p[0]-c.x,dz=p[2]-c.z,dy=p[1]-c.y,co=Math.cos(c.yaw),si=Math.sin(c.yaw),cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);return [w/2+(dx*co-dz*si)*c.scale,h/2-(dy*cp-(dx*si+dz*co)*sp)*c.scale,dx*si*cp+dy*sp+dz*co*cp]}
export function buildWorld(){const faces=[],anchors=[];function face(v,color,id=-1){faces.push({v:id>=0?v.map(p=>[position(id)[0]+(p[0]-(id%6)*spacing)*Math.cos(orientation(id))+p[2]*Math.sin(orientation(id)),p[1],position(id)[1]-(p[0]-(id%6)*spacing)*Math.sin(orientation(id))+p[2]*Math.cos(orientation(id))]):v,color,id,ground:v.every(p=>p[1]<.1)})}function box(x,y,z,w,h,d,id,color=250){const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d],A=[x,y+h,z],B=[x+w,y+h,z],C=[x+w,y+h,z+d],E=[x,y+h,z+d];face([a,b,B,A],color-43,id);face([b,c,C,B],color-25,id);face([c,e,E,C],color-18,id);face([e,a,A,E],color-34,id);face([A,B,C,E],color,id)}function ground(x,z,w,d,col,id=-1){face([[x,.02,z],[x+w,.02,z],[x+w,.02,z+d],[x,.02,z+d]],col,id)}function roof(x,y,z,w,d,h,id){const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d],r=[x+w/2,y+h,z],s=[x+w/2,y+h,z+d];face([a,b,r],218,id);face([e,s,c],225,id);face([a,r,s,e],253,id);face([r,b,c,s],215,id)}function crown(x,y,z,rx,ry,rz,id,tone=184){
 const sides=8,rings=4;
 for(let j=0;j<rings;j++)for(let k=0;k<sides;k++){
  const p=(j,k)=>{const t=j/rings*Math.PI,a=k/sides*Math.PI*2;return [x+Math.sin(t)*Math.cos(a)*rx,y+Math.cos(t)*ry,z+Math.sin(t)*Math.sin(a)*rz]};
  face([p(j,k),p(j,k+1),p(j+1,k+1),p(j+1,k)],Math.max(197,Math.min(205,tone))+Math.round(6*Math.cos(k/sides*Math.PI*2)),id);
 }
}
function shadow(x,z,w,d,id,tone=229){const v=[];for(let k=0;k<16;k++){const a=k/16*Math.PI*2;v.push([x+w*.4+Math.cos(a)*w,.045,z+d*.5+Math.sin(a)*d]);}face(v,tone,id)}
function tree(x,z,h,id,kind=false){
 const type=kind===true?'spire':kind===false?'oval':kind;
 shadow(x,z,h*.34,h*.19,id,229);
 box(x-.085,0,z-.085,.17,h*.68,.17,id,159);
 if(type==='spire'){
  for(let k=0;k<9;k++){const a=k/9*Math.PI*2,b=(k+1)/9*Math.PI*2,r=h*.14;face([[x+Math.cos(a)*r,h*.26,z+Math.sin(a)*r],[x,h,z],[x+Math.cos(b)*r,h*.26,z+Math.sin(b)*r]],200+Math.round(7*Math.cos(a)),id);}
 }else if(type==='broad'){
  crown(x,h*.71,z,h*.25,h*.27,h*.22,id,188);
  crown(x-h*.16,h*.63,z+.2,h*.17,h*.21,h*.18,id,181);
  crown(x+h*.15,h*.68,z-.25,h*.18,h*.23,h*.17,id,195);
 }else crown(x,h*.69,z,h*.18,h*.31,h*.16,id,183);
}
function shrub(x,z,r,id,tone=192){shadow(x,z,r*1.15,r*.7,id,234);crown(x,r*.66,z,r,r*.64,r*.8,id,tone)}

function rounded(x,z,w,d,r,col){const v=[];for(const [cx,cz,start] of [[x+r,z+r,Math.PI],[x+w-r,z+r,Math.PI*1.5],[x+w-r,z+d-r,0],[x+r,z+d-r,Math.PI*.5]])for(let j=0;j<=8;j++){const a=start+j/8*Math.PI/2;v.push([cx+Math.cos(a)*r,.02,cz+Math.sin(a)*r])}face(v,col)}
// Nine short streets connected by planted end roads.
rounded(-29,-18,203,442,13,247);
rounded(-20,8,185,410,10,233);
rounded(-12,16,169,394,4,249);
for(let row=0;row<9;row++){
 const z=row*48;
 ground(-17,z+10,179,7,233);
 for(const x of [-23,168]){tree(x,z,4.3,-1,true);tree(x,z+26,3.8,-1);}
 if(row===0)for(let col=0;col<3;col++){const x=col*spacing;ground(x-6,z+25,12,10,240);ground(x-5.4,z+25.6,10.8,8.8,245);}
 if(row>0){ground(134,z-9,24,19,237);ground(135,z-8,22,17,244);}
}
// Remaining plots on the new final street stay open.
for(let i=0;i<names.length;i++){
if(i===44||i===51)continue;
 const x=(i%6)*spacing,id=i,kind=i%5;
 // No individual lot slabs.
 // Long domestic plots, a clear forecourt and two storeys comparable to JH30.
 ground(x-4.7,3.3,7.9,6.7,243,id);

 box(x-4.4,.02,-6.2,8.8,.28,8.9,id,246);
 box(x-4.4,.3,-6.2,8.8,4.15,8.9,id,248);
 // Recessed ground-floor glazing and slender structural piers.
 box(x-3.95,.55,2.72,7.9,3.45,.05,id,179);
 for(const dx of [-4.35,-.2,4.15])box(x+dx,.3,2.8,.22,4.2,.28,id,246);
 if(kind===0){
  box(x-4.4,4.45,-6.2,3.1,4.5,9.1,id,249);
  box(x+1.3,4.45,-6.2,3.1,4.5,9.1,id,248);
  box(x-1.3,4.45,-6.2,2.6,4.5,3.6,id,250);
  box(x-1.3,4.46,-2.6,2.6,.12,5.5,id,231);
  box(x-1.15,4.7,-2.55,2.3,3.6,.04,id,177);
  box(x-1.3,4.5,2.8,2.6,1,.12,id,231);
 }else if(kind===1){
  box(x-3.8,4.45,-5.9,7.6,3.6,8.6,id,248);
  roof(x-4,8.05,-6.1,8,9,2.1,id);
  box(x-3.25,4.7,2.74,6.5,2.95,.05,id,174);
  for(let k=0;k<5;k++)box(x-3.3+k*1.6,4.55,2.8,.1,3.4,.16,id,241);
 }else if(kind===2){
  box(x-4.4,4.45,-6.2,8.8,4.4,5.7,id,249);
  box(x-4.4,4.45,-.5,2.65,4.4,3.5,id,246);
  box(x-1.75,4.46,-.5,6.15,.17,3.5,id,239);
  box(x-1.55,4.75,-.44,5.65,3.5,.05,id,180);
  box(x-1.75,4.62,2.88,6.15,1.05,.14,id,232);
  box(x-4.6,8.85,-6.4,9.2,.22,6.1,id,251);
 }else if(kind===3){
  box(x-4.4,4.45,-6.2,8.8,4.8,9,id,248);
  box(x-3.9,4.85,2.83,7.8,3.85,.05,id,174);
  for(let k=0;k<13;k++)box(x-4.15+k*.67,4.45,3.08,.16,4.8,.34,id,244);
  box(x-4.4,9.25,-6.2,8.8,.18,9.65,id,250);
 }else{
  box(x-4.4,4.45,-6.2,5.1,4.85,8.8,id,249);
  box(x+.7,4.45,-6.2,3.7,3.4,5.3,id,241);
  box(x+.7,4.46,-.9,3.7,.18,3.8,id,237);
  box(x-3.95,4.8,2.65,4.2,3.8,.04,id,179);
  box(x+.7,4.6,2.82,3.7,.95,.12,id,230);
  box(x-4.55,9.3,-6.35,5.4,.2,9.1,id,252);
 }
 // Entry canopy and garden boundary keep the ground floor domestic.
 box(x-4.65,4.1,2.9,6.6,.16,3.6,id,245);
 for(const dx of [-4.5,1.65])box(x+dx,.3,6.25,.14,3.8,.14,id,223);
 box(x-7,.15,7.5,2.15,1.25,.18,id,239);box(x+2.25,.15,7.5,4.6,1.25,.18,id,239);
 if(i%3===0)box(x-7,.05,-7,.12,.65,12,id,246);
 // Alternate garden compositions; plants leave the driveway and facade clear.
 const left=i%2===0;
 if(i%2===0)tree(x+(left?-6.2:5.75),-4.8,6.2+(i%3)*.4,id,kind===1?'spire':'oval');
 for(let j=0;j<3;j++)shrub(x+3.5+j,6.7,.45,id,199);
 anchors[i]=[position(i)[0],10.5,1+position(i)[1]];
}
// Rempoa's plot ends at world z=7.7, behind the curved street at z=8.
const id=44,x=(44%6)*spacing;

box(x-7.344,.04,-13.6,14.688,6.91,27.2,id,240);
anchors[44]=[position(44)[0],7.5,position(44)[1]];
box((51%6)*spacing-8.4,.04,-7.48,16.8,10.75,14.96,51,240);
anchors[51]=[146,11,48];
return {faces,anchors}}
