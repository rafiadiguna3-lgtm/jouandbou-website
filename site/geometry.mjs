// Parametric axonometric massing diagrams. These are study geometry, not real projects.
export const names=['Sela','Teras','Naung','Sudut','Ruang','Temu','Jeda','Dalam','Pagi','Rimbun','Teduh','Rona','Kisi','Taman','Ambang','Langit','Lapis','Senja','Tumbuh','Pulang'];
const lines=['A little space between.','Life, opening outward.','Under one generous roof.','A different point of view.','Room for the everyday.','Where the day comes together.','A pause in the city.','A quiet world within.','The first light, at home.','Space to put down roots.','Shelter from the rush.','A home with its own rhythm.','Light, through a different lens.','A garden at the center.','Between outside and in.','An opening to the sky.','A home, layer by layer.','For the slower hours.','Room for what comes next.','Somewhere to come home to.'];
const studies=['Courtyard','Terraced living','Pitched roof','Corner volume','Split volumes','Connected spaces','Recessed entry','Internal courtyard','Raised volume','Garden terrace','Deep overhang','Stepped volume','Screened facade','Garden court','Entry threshold','Roof terrace','Layered facade','Veranda','Incremental volume','Gabled living'];
export const projects=names.map((n,i)=>({id:i,name:'Rumah '+n,number:String(i+1).padStart(2,'0'),line:lines[i],study:studies[i],description:[
 'An open pocket breaks the building into quieter rooms. This massing study explores the space between privacy and connection.',
 'A layered terrace extends the living space toward the street. The diagram studies the relationship between solid walls and open edges.',
 'A simple roof brings the spaces together. The study considers shade, proportion, and a clear silhouette.',
 'Two volumes meet at a corner, making room for a sheltered entrance. A study in how a home meets its surroundings.'
 ][i%4]}));
export const P=(x,y,z=0)=>[(x-y)*.8660254,(x+y)*.5-z];
const fmt=v=>Number(v.toFixed(2));
const pt=p=>p.map(fmt).join(',');
const poly=(points,fill='#f7f7f7',stroke='#383838',width=.7,extra='')=>`<polygon points="${points.map(p=>pt(P(...p))).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const line=(a,b,color='#757575',width=.45,extra='')=>`<line x1="${fmt(P(...a)[0])}" y1="${fmt(P(...a)[1])}" x2="${fmt(P(...b)[0])}" y2="${fmt(P(...b)[1])}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
function cube(x,y,z,w,d,h,shade=false){return poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],shade?'#363636':'#f7f7f7')+poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],shade?'#272727':'#e5e5e5')+poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],shade?'#2b2b2b':'#fafafa');}
function frontWindow(x,y,z,w,h,dark=true){let s=poly([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],dark?'#282828':'#eaeaea','#363636',.65);s+=line([x+w*.5,y,z],[x+w*.5,y,z+h],dark?'#b7b7b7':'#383838',.5);s+=line([x,y,z+h*.12],[x+w,y,z+h*.12],dark?'#b7b7b7':'#383838',.4);return s;}
function sideWindow(x,y,z,d,h){return poly([[x,y,z],[x,y+d,z],[x,y+d,z+h],[x,y,z+h]],'#3f3f3f')+line([x,y+d*.5,z],[x,y+d*.5,z+h],'#c3c3c3',.45);}
function roof(x,y,z,w,d,rise){return poly([[x,y,z],[x+w/2,y,z+rise],[x+w/2,y+d,z+rise],[x,y+d,z]],'#3d3d3d')+poly([[x+w/2,y,z+rise],[x+w,y,z],[x+w,y+d,z],[x+w/2,y+d,z+rise]],'#232323')+poly([[x,y+d,z],[x+w,y+d,z],[x+w/2,y+d,z+rise]],'#eeeeee');}
function rail(x,y,z,w,d){let out='';for(let i=0;i<=w;i+=9)out+=line([x+i,y+d,z],[x+i,y+d,z+12],'#555555',.55);for(let i=0;i<=d;i+=9)out+=line([x+w,y+i,z],[x+w,y+i,z+12],'#555555',.55);return out+line([x,y+d,z+12],[x+w,y+d,z+12],'#373737',.8)+line([x+w,y,z+12],[x+w,y+d,z+12],'#373737',.8);}
function slats(x,y,z,w,h){let out='';for(let i=1;i<w;i+=3)out+=line([x+i,y,z],[x+i,y,z+h],'#808080',.4);return out;}
export function houseDrawing(index){
 const type=index%8,w=72+(index%3)*9,d=65+(index%4)*5,h=50+(index%3)*9;const x=-w/2,y=-d/2;
 let s='<g class="drawing">';
 // Diagram ground and a cast footprint with a single consistent direction.
 s+=poly([[-62,-49,0],[65,-49,0],[65,65,0],[-62,65,0]],'#eeeeee','#c3c3c3',.55);
 s+=poly([[x+12,y+d,1],[x+w+28,y+d+21,1],[x+w+35,y+15,1],[x+w,y,1]],'#dbdbdb','none');
 s+=cube(x-5,y-5,1,w+10,d+10,3,false);
 if(type===0){ // L-shaped court with two unequal wings
   s+=cube(x,y,4,w,35,h,true);s+=cube(x,y+35,4,27,d-35,h-12);s+=frontWindow(x+6,y+d,9,15,28);
   s+=frontWindow(x+37,y+35,12,w-45,28);s+=sideWindow(x+w,y+6,15,20,22);
   s+=cube(x+35,y+42,4,w-35,d-42,3);s+=rail(x+35,y+42,7,w-35,d-42);
 }else if(type===1){ // terraced cantilever
   s+=cube(x+6,y+5,4,w-12,d-5,h-12);s+=frontWindow(x+14,y+d,8,w-30,29);s+=sideWindow(x+w-6,y+12,12,d-23,23);
   s+=cube(x-3,y-3,h-8,w+6,d-14,24,true);s+=frontWindow(x+6,y+d-17,h-4,w-12,15,false);s+=slats(x-3,y+d-17,h-8,w+6,24);
   s+=cube(x-1,y+d-13,h-10,w+2,19,3);s+=rail(x-1,y+d-13,h-7,w+2,19);
 }else if(type===2||type===7){
   s+=cube(x,y,4,w,d,h,type===7);s+=frontWindow(x+9,y+d,9,w-18,28,type!==7);s+=sideWindow(x+w,y+10,13,21,26);
   s+=roof(x-4,y-4,h+4,w+8,d+8,25+index%3*5);
   s+=frontWindow(x+w/2-6,y+d+4,h+8,12,9);for(let j=8;j<w;j+=7)s+=line([x+j,y-4,h+4+Math.min(j,w+8-j)/(w+8)*2*(25+index%3*5)],[x+j,y+d+4,h+4+Math.min(j,w+8-j)/(w+8)*2*(25+index%3*5)],'#6b6b6b',.3);
 }else if(type===3){
   s+=cube(x,y,4,w*.52,d,h+22,true);s+=sideWindow(x+w*.52,y+8,19,d-20,23);s+=frontWindow(x+8,y+d,12,22,30,false);
   s+=cube(x+w*.52,y+15,4,w*.48,d-15,h-9);s+=frontWindow(x+w*.52+7,y+d,10,w*.48-14,25);s+=rail(x+w*.52,y+15,h-5,w*.48,d-15);
 }else if(type===4){
   s+=cube(x,y,4,w,d*.45,h,true);s+=frontWindow(x+6,y+d*.45,14,w-12,20,false);
   s+=cube(x,y+d*.58,4,w*.72,d*.42,h-17);s+=frontWindow(x+7,y+d,8,w*.72-14,23);s+=sideWindow(x+w*.72,y+d*.67,12,d*.2,20);
   s+=cube(x+w*.72,y+d*.65,4,w*.28,d*.35,3);
 }else if(type===5){
   s+=cube(x,y,4,w,d,h-10);s+=frontWindow(x+9,y+d,9,w-18,25);s+=sideWindow(x+w,y+7,13,d-16,21);
   s+=cube(x-4,y+8,h-6,w+8,d*.62,31,true);s+=frontWindow(x+5,y+8+d*.62,h, w-10,19,false);s+=slats(x-4,y+8+d*.62,h-6,w+8,31);
   s+=cube(x+10,y-5,h-8,28,16,28);s+=sideWindow(x+38,y-2,h-1,10,15);
 }else{
   s+=cube(x,y,4,w,d,h);s+=frontWindow(x+7,y+d,8,w-14,28);s+=sideWindow(x+w,y+8,12,d-16,25);
   s+=cube(x-8,y-8,h+4,w+16,d+16,6,true);s+=cube(x+13,y+8,h+10,w-26,d-30,15);s+=rail(x-8,y-8,h+10,w+16,d+16);
 }
 // Front threshold steps and short path: measurable diagram geometry.
 for(let k=0;k<3;k++)s+=cube(-12,y+d+6+k*4,0,24,4,3-k*.8);
 for(let k=0;k<3;k++)s+=poly([[-12,53+k*4,.1],[12,53+k*4,.1],[12,55+k*4,.1],[-12,55+k*4,.1]],'#e2e2e2','#b2b2b2',.35);
 s+='</g>';return s;
}
export function position(index){const col=Math.floor(index/2),row=index%2;return P(col*175,row?252:0,0);}
export function houseGroup(index){const pos=position(index),p=projects[index];return `<g class="house${index===0?' selected':''}" data-house="${index}" role="button" tabindex="0" aria-label="Jou House ${p.number}, ${p.name}. Open project" transform="translate(${pt(pos)})"><title>Jou House ${p.number} — ${p.name}</title><polygon class="plot-highlight" points="${[[-67,-54,0],[70,-54,0],[70,70,0],[-67,70,0]].map(a=>pt(P(...a))).join(' ')}" fill="#e4e4e4" stroke="#6a6a6a" stroke-width="1"/><polygon points="${[[-65,-50,0],[68,-50,0],[68,68,0],[-65,68,0]].map(a=>pt(P(...a))).join(' ')}" fill="transparent"/><g class="building">${houseDrawing(index)}</g><text class="lot-number" x="-18" y="87">${p.number}</text><g class="hover-tag" transform="translate(-64,-${index%8===3?125:115})"><rect x="0" y="-23" width="128" height="28" fill="#272727"/><text x="64" y="-5" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#f7f7f7">${p.name}</text><path d="M59 5l5 5 5-5" fill="#272727"/></g></g>`;}
export function neighborhood(){let s='';
 // A continuous street on one axonometric plane, with 10 plots on each side.
 s+=poly([[-135,98,0],[1730,98,0],[1730,166,0],[-135,166,0]],'#eaeaea','none');
 for(const yy of [84,92,172,180])s+=line([-150,yy,0],[1740,yy,0],yy===92||yy===172?'#c9c9c9':'#dfdfdf',.65);
 s+=line([-160,132,0],[1750,132,0],'#fbfbfb',1.2,'stroke-dasharray="14 12"');
 for(let col=0;col<10;col++)for(const row of [0,1]){let y=row?252:0,x=col*175;s+=poly([[x-76,y-62,0],[x+77,y-62,0],[x+77,y+79,0],[x-76,y+79,0]],'none','#dadada',.6,'stroke-dasharray="2 3"');}
 // Subtle perpendicular crossing marks and paving lines keep the shared scale legible.
 for(let c=0;c<10;c++){const xx=c*175;for(let k=0;k<7;k++)s+=line([xx-10+k*4,98,0],[xx-10+k*4,166,0],'#f9f9f9',1.5);}
 const sorted=projects.map(p=>p.id).sort((a,b)=>(Math.floor(a/2)*175+(a%2)*252)-(Math.floor(b/2)*175+(b%2)*252));
 for(const i of sorted)s+=houseGroup(i);return s;}
