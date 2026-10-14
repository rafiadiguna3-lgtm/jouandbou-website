import {galleryArrows} from './gallery-arrows.mjs';
const content=document.getElementById('bou-content');
const names=['diantara','temu','koru','selebu','sabang','ikat','raindeer'];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dataPromise,route='',generation=0,removeGalleryArrows;
const image=(src,alt,eager=false)=>`<img src="${escape(src)}" alt="${escape(alt)}" loading="${eager?'eager':'lazy'}" decoding="async" draggable="false"/>`;
const icon=(name)=>`<a href="#bou-works/${name}" aria-label="${name} — view concept project">${image(`assets/bou/${name}-icon.svg`,name,true)}</a>`;
function index(){
 content.innerHTML=`<div class="bou-index"><h1>bou works</h1><p class="bou-intro">Bou is our code to specify our concept project. In Bou posts you will see concept design only, such as diagram, working drawing, some 3D visualization and animation</p><div class="bou-concepts">${[1,2,3,4].map((n)=>image(`assets/bou/concept-${n}.webp`,'Bou architectural concept study',true)).join('')}</div><div class="bou-project-picker"><h2>bou works</h2><p>click the icons below to see our latest project</p><nav aria-label="Bou concept projects">${names.map(icon).join('')}</nav></div></div>`;
}
export async function renderBou(slug){
 if(route===location.hash&&content.childElementCount)return;
 removeGalleryArrows?.();removeGalleryArrows=null;
 route=location.hash;const token=++generation;
 if(!slug){index();return;}
 if(!names.includes(slug)){index();return;}
 dataPromise??=fetch('bou-projects.json?v=145').then(r=>{if(!r.ok)throw Error('Project data unavailable');return r.json();}).catch(error=>{dataPromise=null;throw error;});
 // Keep navigation usable while retrieving the small content manifest.
 content.innerHTML=`<div class="bou-project-head"><h1>${escape(slug)}</h1><a class="bou-back" href="#bou-works">bou works</a></div>`;
 try{
 const list=await dataPromise;if(token!==generation)return;const p=list.find(item=>item.slug===slug);if(!p)return;
 const [title,category,...paragraphs]=p.text;
 const pics=p.images;
 const lead=`<div class="bou-lead"><figure>${image(pics[0],`${title} architectural concept`,true)}</figure><div class="bou-copy"><p class="bou-facts">${p.facts.map(escape).join('<br>')}</p><p>${escape(paragraphs[0]||'')}</p>${pics[1]?image(pics[1],`${title} architectural massing`,true):''}${paragraphs.slice(1,3).map(t=>`<p>${escape(t)}</p>`).join('')}</div></div>`;
 const rest=pics.slice(2);
 content.innerHTML=`<article class="bou-project"><div class="bou-project-head"><img class="bou-symbol" src="assets/bou/${slug}-icon.svg" alt=""/><h1>${escape(title)}</h1><p>${escape(category)}</p></div>${lead}<div class="bou-image-pair">${rest.slice(0,2).map(src=>`<figure>${image(src,`${title} concept illustration`)}</figure>`).join('')}</div>${paragraphs.slice(3).map(t=>`<p class="bou-story-copy">${escape(t)}</p>`).join('')}${rest.length>2?`<div class="bou-gallery" aria-label="${escape(title)} concept images" tabindex="0">${rest.slice(2).map(src=>image(src,`${title} design study`)).join('')}</div><div class="bou-dots" aria-label="Choose image">${rest.slice(2).map((_,i)=>`<button aria-label="Image ${i+1}" aria-pressed="${i===0}"></button>`).join('')}</div>`:''}${slug==='temu'?'<div class="bou-film"><iframe title="Temu house concept animation" loading="lazy" src="https://www.youtube-nocookie.com/embed/W4tdYkhFPb8" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>':''}<a class="bou-back" href="#bou-works">bou works</a></article>`;
 const gallery=content.querySelector('.bou-gallery');
 if(gallery){removeGalleryArrows=galleryArrows(gallery.parentElement,gallery);const dots=[...content.querySelectorAll('.bou-dots button')];const update=()=>{const i=Math.round(gallery.scrollLeft/gallery.clientWidth);dots.forEach((dot,n)=>dot.setAttribute('aria-pressed',String(n===i)));};gallery.addEventListener('scroll',update,{passive:true});dots.forEach((dot,i)=>dot.onclick=()=>gallery.scrollTo({left:gallery.clientWidth*i,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();gallery.scrollBy({left:gallery.clientWidth*(e.key==='ArrowRight'?1:-1),behavior:'smooth'});}});}
 }catch{if(token===generation)content.innerHTML=`<div class="bou-project-head"><h1>${escape(slug)}</h1><p>Project content could not be loaded.</p><a class="bou-back" href="#bou-works">bou works</a></div>`;}
}
