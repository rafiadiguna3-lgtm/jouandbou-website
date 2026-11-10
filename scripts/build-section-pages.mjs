import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {sections,metadata,structuredData} from '../site/project-seo.mjs';
import {withPageMetadata} from './build-project-pages.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Read the existing About section rather than maintain a second copy of studio content.
function sectionInner(html,id){
 const start=new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>`).exec(html);
 if(!start)throw Error('Missing source section '+id);
 const tags=/<\/?section\b[^>]*>/g;tags.lastIndex=start.index+start[0].length;let depth=1,tag;
 while((tag=tags.exec(html))){depth+=tag[0].startsWith('</')?-1:1;if(depth===0)return html.slice(start.index+start[0].length,tag.index);}
 throw Error('Unclosed source section '+id);
}
export async function buildSectionPages(directory){
 const template=await readFile(new URL('index.html',directory),'utf8');
 const navigation='<nav aria-label="studio sections"><a href="/about-us/">about us</a><a href="/jou-works/">jou works</a><a href="/bou-works/">bou works</a></nav>';
 const style=`html[data-static-section],html[data-static-section] body{height:auto!important;overflow:auto!important}html[data-static-section] body>:not(header):not(#section-static-content){display:none!important}#section-static-content{display:block!important;max-width:1000px;margin:0 auto;padding:110px 24px 60px;font:16px/1.8 Arial,sans-serif;color:#292b27}#section-static-content h1{font-size:clamp(28px,5vw,46px);line-height:1.2}#section-static-content a{color:inherit}#section-static-content nav{display:flex;gap:24px;flex-wrap:wrap;margin:24px 0}#section-static-content img{max-width:100%;height:auto}#section-static-content .section-projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px}#section-static-content .section-projects img{width:100%;aspect-ratio:4/3;object-fit:cover}#section-static-content .section-projects h2{font-size:21px}#section-static-content .section-projects p{font-size:14px}#section-static-content .about-feed-track{display:flex;overflow:auto}#section-static-content .about-feed-track>a{flex:0 0 240px}`;
 for(const entry of sections){
  let html=withPageMetadata(template,metadata(entry),structuredData(entry));
  html=html.replace('<html lang="en">','<html lang="en" data-static-section>');
  let content;
  if(entry.section==='about'){
   content=sectionInner(template,'about-page').replace(/\bid="([^"]+)"/g,'id="static-$1"').replace(/\baria-labelledby="([^"]+)"/g,(_,ids)=>`aria-labelledby="${ids.split(' ').map(id=>'static-'+id).join(' ')}"`);
  }else{
   const projects=entry.projects;
   content=`<h1>${entry.name}</h1><p>${escape(entry.description)}</p><div class="section-projects">${projects.map(p=>`<article><a href="${p.path}"><img src="/${escape(p.image)}" alt="${escape(p.name)}" loading="lazy"/><h2>${escape(p.name)}</h2></a><p>${escape(p.description)}</p></article>`).join('')}</div>`;
  }
  html=html.replace('</head>',`<style>${style}</style></head>`).replace('<body>',`<body><main id="section-static-content" aria-label="${entry.name}">${navigation}${content}</main>`);
  const target=new URL(entry.path.slice(1),directory);await mkdir(target,{recursive:true});await writeFile(new URL('index.html',target),html);
 }
 console.log('Generated 3 indexable studio section pages using the existing site content.');
}
