import {projects} from './project-catalog.mjs';
import {metadata,structuredData,collections} from './project-seo.mjs';
const byHash=new Map(projects.map(p=>[p.legacyHash,p])),byPath=new Map(projects.map(p=>[p.path,p]));
const collectionByPath=new Map(collections.map(p=>[p.path,p]));
const routeCollection=()=>collections.find(p=>p.collection==='jou'?location.pathname===p.path&&!location.hash:p.legacyHash===routeHash());
const pathProject=()=>byPath.get(location.pathname.replace(/index\.html$/,'').replace(/\/?$/,'/'));
export function routeHash(){return location.hash||pathProject()?.legacyHash||collectionByPath.get(location.pathname.replace(/index\.html$/,'').replace(/\/?$/,'/'))?.legacyHash||'';}
export const projectURL=hash=>byHash.get(hash)?.path||'/'+hash;
export const routeProject=()=>byHash.get(routeHash().replace(/^#bou\//,'#bou-works/'));
export function refreshMetadata(){
 const project=routeProject(),m=metadata(project||routeCollection());document.title=m.title;
 document.querySelector('link[rel=canonical]')?.setAttribute('href',m.url);
 const values={'name:description':m.description,'name:robots':m.robots,'property:og:url':m.url,'property:og:title':m.title,'property:og:description':m.socialDescription,'property:og:image':m.image,'property:og:image:type':m.imageType,'property:og:image:alt':m.imageAlt,'property:og:image:width':m.width,'property:og:image:height':m.height,'name:twitter:card':m.card,'name:twitter:title':m.title,'name:twitter:description':m.socialDescription,'name:twitter:image':m.image,'name:twitter:image:alt':m.imageAlt};
 for(const [key,value] of Object.entries(values)){const separator=key.indexOf(':'),attribute=key.slice(0,separator),name=key.slice(separator+1);document.querySelector(`meta[${attribute}="${name}"]`)?.setAttribute('content',String(value));}
 const schema=document.querySelector('script[type="application/ld+json"]');if(schema)schema.textContent=JSON.stringify(structuredData(project||routeCollection()));
}
export function writeRoute(hash,{replace=false}={}){
 const project=byHash.get(hash),destination=project?project.path+location.search:'/'+location.search+hash;
 if(location.pathname+location.search+location.hash!==destination)history[replace?'replaceState':'pushState'](null,'',destination);
 refreshMetadata();
}
function normalizeRoute(){
 const hash=routeHash().replace(/^#bou\//,'#bou-works/');
 if(byHash.has(hash))writeRoute(hash,{replace:true});
 else{if(collectionByPath.has(location.pathname.replace(/\/?$/,'/')))history.replaceState(null,'','/'+location.search+hash);if(location.pathname!=='/'&&location.hash)history.replaceState(null,'','/'+location.search+location.hash);refreshMetadata();}
 releaseStaticContent();
}
let observer;
function releaseStaticContent(){
 const fallback=document.getElementById('project-static-content');if(!fallback)return;
 const project=routeProject();
 if(!project||(project.kind==='jou'?document.getElementById(project.panel)?.open:document.querySelector('#bou-content .bou-project'))){fallback.remove();document.documentElement.removeAttribute('data-static-project');observer?.disconnect();}
}
if(document.getElementById('project-static-content')){observer=new MutationObserver(releaseStaticContent);observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});}
addEventListener('hashchange',normalizeRoute);addEventListener('popstate',normalizeRoute);normalizeRoute();

// Keep in-site links on the existing map/detail experience; modified clicks
// still open the real static project URL in another tab.
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const link=event.target.closest?.('a[href]');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
 const href=link.getAttribute('href');
 if(/^#(?:projects|project\/|about|contact|bou(?:-works)?(?:\/|$))/.test(href)){
  event.preventDefault();if(routeHash()!==href)location.hash=href;return;
 }
 const url=new URL(href,document.baseURI),project=url.origin===location.origin?byPath.get(url.pathname):null;
 if(project){event.preventDefault();if(routeHash()!==project.legacyHash){writeRoute(project.legacyHash);dispatchEvent(new PopStateEvent('popstate'));}}
});
