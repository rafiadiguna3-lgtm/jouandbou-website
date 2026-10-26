import {readFile,writeFile} from 'node:fs/promises';
import {projects} from '../site/project-catalog.mjs';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function buildSiteFallback(directory){
 const file=new URL('index.html',directory);let html=await readFile(file,'utf8');
 const links=kind=>projects.filter(p=>p.kind===kind).map(p=>`<a href="${p.path}">${escape(p.name)}</a>`).join('');
 const fallback=`<section id="site-fallback" hidden aria-label="Projects without the interactive map"><h1>Explore our projects</h1><p>The interactive map is unavailable. You can still view our projects and get in touch.</p><h2>jou works</h2><nav aria-label="Jou projects">${links('jou')}</nav><h2>bou works</h2><nav aria-label="Bou projects">${links('bou')}</nav><div class="fallback-contact"><a href="https://wa.me/628118111439" target="_blank" rel="noopener noreferrer">lets talk~</a> · <a href="mailto:office@jouandbou.com">office@jouandbou.com</a> · <a href="https://www.instagram.com/jouandbou/" target="_blank" rel="noopener noreferrer">Instagram</a></div></section>`;
 const noScript='<noscript><style>html,body{overflow:auto!important;height:auto!important}body>:not(header):not(#site-fallback):not(#project-static-content):not(#site-footer){display:none!important}body>#site-fallback[hidden]{display:block!important}header :is(nav,#menu-toggle){display:none!important}html[data-static-project] body>#site-fallback{display:none!important}</style></noscript>';
 html=html.replace('<!-- site-fallback -->',fallback).replace('</head>',noScript+'</head>');await writeFile(file,html);
}
