import {projectSocialHTML} from '../site/project-social.mjs';
import {inquiryHTML} from '../site/project-inquiry.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {projects} from '../site/project-catalog.mjs';
import {metadata,structuredData} from '../site/project-seo.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function buildProjectPages(directory){
 const template=await readFile(new URL('index.html',directory),'utf8');
 const style=`html[data-static-project]{height:auto!important;overflow:auto!important}html[data-static-project] body{overflow:auto!important;height:auto!important}html[data-static-project] body>:not(header):not(#project-static-content){display:none!important}#project-static-content{max-width:1000px;margin:auto;padding:110px 24px 60px;font:16px/1.8 Arial,sans-serif;color:#292b27}#project-static-content h1{font-size:clamp(28px,5vw,46px);line-height:1.2}#project-static-content img{display:block;width:100%;height:auto;max-height:75vh;object-fit:contain;margin:28px 0}#project-static-content a{color:inherit}#project-static-content nav{display:flex;gap:18px;flex-wrap:wrap}#project-static-content p{max-width:760px}`;
 for(const p of projects){
  const m=metadata(p);
  let html=template.replace('<html lang="en">','<html lang="en" data-static-project>');
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(m.title)}</title>`).replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${m.url}"/>`);
  const fields={'name:description':m.description,'name:robots':m.robots,'property:og:url':m.url,'property:og:title':m.title,'property:og:description':m.description,'property:og:image':m.image,'property:og:image:type':m.imageType,'property:og:image:width':m.width,'property:og:image:height':m.height,'property:og:image:alt':m.imageAlt,'name:twitter:card':m.card,'name:twitter:title':m.title,'name:twitter:description':m.description,'name:twitter:image':m.image,'name:twitter:image:alt':m.imageAlt};
  for(const [key,value] of Object.entries(fields)){const separator=key.indexOf(':'),attr=key.slice(0,separator),name=key.slice(separator+1);const pattern=new RegExp(`<meta\\b(?=[^>]*${attr}="${name}")[^>]*>`);if(!pattern.test(html))throw Error('Missing metadata '+key);html=html.replace(pattern,`<meta ${attr}="${name}" content="${escape(value)}"/>`);}
  html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">${JSON.stringify(structuredData(p)).replace(/</g,'\\u003c')}</script>`);
  const photos=[...new Set([p.image,...p.photos])].slice(0,6);
  const content=`<main id="project-static-content"><nav aria-label="Breadcrumb"><a href="/">jou and bou</a><a href="/#projects">projects</a></nav><h1>${escape(p.name)}</h1><p>${escape(p.category)}</p><p>${escape(p.description)}</p>${photos.map((src,i)=>`<img src="/${escape(src)}" alt="${escape(p.name)} — ${i===0?'project view':'architecture and interior view '+(i+1)}" loading="${i===0?'eager':'lazy'}" decoding="async"/>`).join('')}${p.kind==='collection'?'<nav aria-label="Projects">'+p.projects.map(item=>`<a href="${item.path}">${escape(item.name)}</a>`).join('')+'</nav>':''}${p.paragraphs.map((text,i)=>`<p>${escape(text)}${i===p.paragraphs.length-1&&p.kind!=='collection'?projectSocialHTML():''}</p>`).join('')}${p.kind==='collection'?'':inquiryHTML(p)}<nav><a href="/">explore the neighborhood</a><a href="/#projects">all projects</a></nav></main>`;
  html=html.replace('</head>',`<style>${style}</style></head>`).replace('<body>','<body>'+content);
  const target=new URL(p.path.slice(1),directory);await mkdir(target,{recursive:true});await writeFile(new URL('index.html',target),html);
 }
 console.log(`Generated ${projects.length} static project pages using the existing website UI.`);
}
