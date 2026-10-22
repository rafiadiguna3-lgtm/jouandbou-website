import {projects} from './project-catalog.mjs';
const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function near(a,b){if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,n=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue;}if(++n>1)return false;if(a.length>=b.length)i++;if(b.length>=a.length)j++;}return n+a.length-i+b.length-j<=1;}
export function searchProjects(names,query,{canExplore,title,houseNumber}){
 const q=normalize(query);if(!q)return [];
 const words=query.trim().split(/\s+/).map(normalize).filter(Boolean),number=q.match(/^(?:jh|jouhouse|house)?0*(\d+)$/);
 const entries=names.flatMap((name,id)=>canExplore(id)?[{name,id,kind:'jou',status:'',aliases:[name,title(id)]}]:[]).concat(projects.filter(p=>p.kind==='bou').map(p=>({...p,status:'bou works',aliases:[p.name,p.slug]})));
 const matches=entries.filter(p=>number?p.kind==='jou'&&houseNumber(p.id)===Number(number[1]):p.aliases.some(a=>{const key=normalize(a);return key.includes(q)||words.every(w=>key.includes(w));}));
 if(matches.length)return matches.sort((a,b)=>Number(b.aliases.some(n=>normalize(n)===q))-Number(a.aliases.some(n=>normalize(n)===q)));
 return q.length<5?[]:entries.filter(p=>p.aliases.some(a=>near(q,normalize(a)))).map(p=>({...p,suggested:true}));
}
