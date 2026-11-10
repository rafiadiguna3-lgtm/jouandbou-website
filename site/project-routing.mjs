import {projects} from './project-catalog.mjs';
import {metadata,structuredData,sections} from './project-seo.mjs';
const byHash=new Map(projects.map(p=>[p.legacyHash,p])),byPath=new Map(projects.map(p=>[p.path,p]));
const normalizedPath=()=>location.pathname.replace(/index\.html$/,'').replace(/\/?$/,'/');
const sectionByPath=new Map(sections.map(p=>[p.path,p]));
const pathProject=()=>byPath.get(normalizedPath());
export function routeHash(){return location.hash||pathProject()?.legacyHash||sectionByPath.get(normalizedPath())?.legacyHash||'';}
export const routeSection=()=>sectionByPath.get(normalizedPath())||sections.find(s=>s.legacyHash===routeHash()&&s.legacyHash!=='#projects');
export const projectURL=hash=>byHash.get(hash)?.path||sections.find(s=>s.legacyHash===hash)?.path||'/'+hash;
export const routeProject=()=>byHash.get(routeHash().replace(/^#bou\//,'#bou-works/'));
export function refreshMetadata(){
 const project=routeProject(),m=metadata(project||routeSection());document.title=m.title;
 document.querySelector('link[rel=canonical]')?.setAttribute('href',m.url);
 const values={'name:description':m.description,'name:robots':m.robots,'property:og:url':m.url,'property:og:title':m.title,'property:og:description':m.socialDescription,'property:og:image':m.image,'property:og:image:type':m.imageType,'property:og:image:alt':m.imageAlt,'property:og:image:width':m.width,'property:og:image:height':m.height,'name:twitter:card':m.card,'name:twitter:title':m.title,'name:twitter:description':m.socialDescription,'name:twitter:image':m.image,'name:twitter:image:alt':m.imageAlt};
 for(const [key,value] of Object.entries(values)){const separator=key.indexOf(':'),attribute=key.slice(0,separator),name=key.slice(separator+1);document.querySelector(`meta[${attribute}="${name}"]`)?.setAttribute('content',String(value));}
 const schema=document.querySelector('script[type="application/ld+json"]');if(schema)schema.textContent=JSON.stringify(structuredData(project||routeSection()));
}
export function writeRoute(hash,{replace=false,section=false}={}){
 const project=byHash.get(hash),entry=sections.find(p=>p.legacyHash===hash&&(section||hash!=='#projects'));
 const destination=project?project.path+location.search:entry?entry.path+location.search:'/'+location.search+hash;
 if(location.pathname+location.search+location.hash!==destination)history[replace?'replaceState':'pushState'](null,'',destination);
 refreshMetadata();
}
function normalizeRoute(){
 const hash=routeHash().replace(/^#bou\//,'#bou-works/');
 if(byHash.has(hash))writeRoute(hash,{replace:true});
 else if(location.hash&&sections.some(p=>p.legacyHash===hash)&&(hash!=='#projects'||sectionByPath.has(normalizedPath())))writeRoute(hash,{replace:true,section:sectionByPath.has(normalizedPath())});
 else{if(location.pathname!=='/'&&location.hash)history.replaceState(null,'','/'+location.search+location.hash);refreshMetadata();}
 releaseStaticContent();releaseSectionContent();
}
let sectionObserver;
function releaseSectionContent(){
 const content=document.getElementById('section-static-content');if(!content)return;
 const section=routeSection();
 const ready=!section||section.legacyHash==='#about'&&!document.getElementById('about-page')?.hidden&&document.body.classList.contains('view-about')||section.legacyHash==='#bou-works'&&!document.getElementById('bou-page')?.hidden&&document.querySelector('#bou-content .bou-index')||section.legacyHash==='#projects'&&document.querySelector('header [aria-current]');
 if(ready){content.remove();document.documentElement.removeAttribute('data-static-section');sectionObserver?.disconnect();}
}
if(document.getElementById('section-static-content')){sectionObserver=new MutationObserver(releaseSectionContent);sectionObserver.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','aria-current']});}
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
 // Until the interactive UI is ready, let real anchors open their readable HTML pages.
 if(!document.querySelector('header [aria-current]'))return;
 const link=event.target.closest?.('a[href]');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
 const href=link.getAttribute('href');
 if(/^#(?:projects|project\/|about|contact|bou(?:-works)?(?:\/|$))/.test(href)){
  event.preventDefault();if(routeHash()!==href)location.hash=href;return;
 }
 const url=new URL(href,document.baseURI),project=url.origin===location.origin?byPath.get(url.pathname):null;
 const section=url.origin===location.origin?sectionByPath.get(url.pathname):null;
 if(section){event.preventDefault();writeRoute(section.legacyHash,{section:true});dispatchEvent(new PopStateEvent('popstate'));return;}
 if(project){event.preventDefault();if(routeHash()!==project.legacyHash){writeRoute(project.legacyHash);dispatchEvent(new PopStateEvent('popstate'));}}
});
