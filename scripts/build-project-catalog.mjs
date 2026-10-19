import {readFile,writeFile} from 'node:fs/promises';
const html=await readFile('site/index.html','utf8');
const text=s=>s.replace(/<br\s*\/?>/gi,' ').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const records=[
 ['marboy-house','marboy',29,'Marboy House','assets/marboy/photos/0.webp','Modern tropical house','A modern tropical home balancing openness and privacy, with natural light, fresh air and connections between indoor spaces and greenery.'],
 ['rumah-anas','rumah-anas',0,'Rumah Anas','assets/rumah-anas/20.webp','Contemporary house','A contemporary home in Cimanggis, near Cibubur, designed around meaningful human interactions and connections with its surroundings.'],
 ['rumasoka','rumasoka',9,'Rumasoka','assets/rumasoka/01.webp','Tropical modern minimalist house','A modern tropical corner-site home in Cibubur, combining compact forms, generous openings, natural materials and garden spaces.'],
 ['jangkrik-house','jangkrik',18,'Jangkrik House','assets/jangkrik/01.webp','Tropical modern minimalist house','A modern interpretation of rumah nenek, using two building masses, a generous gable roof and semi-outdoor spaces for a growing family.'],
 ['flute-house','flute',26,'Flute House','assets/flute/01.webp','House renovation','A renovation on a narrow 5 × 20 metre site, improving everyday circulation, natural light and efficiency while allowing the home to grow.'],
 ['rumah-zubair','zubair',19,'Rumah Zubair','assets/zubair/01.webp','House renovation','A compact renovation in Cibubur for a young family, bringing natural light, airflow, greenery and privacy into everyday spaces.'],
 ['rr-house','rr-house',12,'RR House','assets/rr-house/01.webp','Architecture and interior design','A three-storey corner-site home with natural light, moving air and warm timber interiors, balancing openness and privacy for family life.'],
 ['rempoa-padel','rempoa',44,'Rempoa Padel','assets/rempoa/photos/facade.webp','Commercial architecture','Four padel courts connected by a central link, with a repeated facade, terracotta surfaces, natural materials and planted edges.']
];
const projects=records.map(([slug,panel,modelId,name,image,category,description])=>{
 const body=html.match(new RegExp(`<dialog\\b(?=[^>]*\\bid="${panel}")[^>]*>([\\s\\S]*?)<\\/dialog>`))?.[1];if(!body)throw Error('Missing panel '+panel);
 const paragraphs=[...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m=>text(m[1])).filter(Boolean).filter(p=>!(panel==='marboy'&&/Rumah Anas/i.test(p)));
 const photos=[...new Set([...body.matchAll(/<img\b[^>]*\bsrc="([^"]+\.webp)"[^>]*>/g)].map(m=>m[1]))].slice(0,6);
 const legacySlug=({marboy:'marboy',rumasoka:'rumahsoka',jangkrik:'jangkrik',flute:'flute',zubair:'rumah-zubair',rempoa:'rempoa-padel'})[panel]||slug;
 return {slug,name,panel,modelId,kind:'jou',path:`/projects/${slug}/`,legacyHash:`#project/${legacySlug}`,category,description,image,paragraphs,photos,shareImage:`assets/share/projects/${slug}.jpg`};
});
for(const p of JSON.parse(await readFile('site/bou-projects.json','utf8'))){
 const name=p.text[0][0].toUpperCase()+p.text[0].slice(1),description=p.text[2].length>180?p.text[2].slice(0,177).replace(/\s+\S*$/,'')+'…':p.text[2];
 projects.push({slug:p.slug,name,kind:'bou',path:`/projects/bou/${p.slug}/`,legacyHash:`#bou-works/${p.slug}`,category:p.text[1]+' · Concept project',description,image:p.images[0],paragraphs:[...p.facts,...p.text.slice(2)],photos:p.images.slice(0,6),shareImage:`assets/share/projects/bou-${p.slug}.jpg`});
}
await writeFile('site/project-catalog.mjs','// Published projects only; generated from the existing project content.\nexport const projects='+JSON.stringify(projects,null,2)+';\n');
console.log(`Catalogued ${projects.length} published projects.`);

await writeFile('site/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+['/','/projects/',...projects.map(p=>p.path)].map(path=>`  <url><loc>https://jouandbou.com${path}</loc></url>`).join('\n')+'\n</urlset>\n');
