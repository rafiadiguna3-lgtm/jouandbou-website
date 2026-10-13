import {prepareAlbum} from './photo-album-cache.mjs?v=129';
import {photoVariants} from './photo-variants.mjs?v=126';
const warmed=new Map();
const phonePhoto=matchMedia('(any-pointer: coarse)').matches&&Math.min(innerWidth,innerHeight)<700;
// Load a bounded neighborhood of photos; keep visible images until leaving the page.
for(const panel of document.querySelectorAll('dialog.project-page')){
 const root=panel.querySelector('.project-scroll');if(!root)continue;
 const photos=[...root.querySelectorAll('img[src]')].filter(img=>!img.closest('.construction-story-viewer')&&!img.classList.contains('project-symbol')&&!/\.svg(?:\?|$)/i.test(img.getAttribute('src')));
 const sources=new Map(photos.map(img=>[img,{src:(photoVariants[img.getAttribute('src')]?.[phonePhoto?'800':'1280']||img.getAttribute('src')),srcset:null}]));
 const nearby=new Set();let scheduled=0;
 function unload(img){img.classList.remove('image-ready');img.removeAttribute('src');img.removeAttribute('srcset');}
 function load(img){if(!panel.open||!sources.has(img)||img.hasAttribute('src'))return;const source=sources.get(img);img.loading='eager';img.fetchPriority=img===photos[0]?'high':'auto';if(source.srcset)img.srcset=source.srcset;img.src=source.src;if(img.complete&&img.naturalWidth)img.classList.add('image-ready');}
 function sync(){scheduled=0;if(!panel.open)return;const box=root.getBoundingClientRect();const distance=img=>{const r=img.getBoundingClientRect();return Math.max(0,box.top-r.bottom,r.top-box.bottom)+Math.max(0,box.left-r.right,r.left-box.right);};const wanted=[...nearby].sort((a,b)=>distance(a)-distance(b)).slice(0,matchMedia("(any-pointer: coarse)").matches?4:8);const keep=new Set(wanted);if(root.scrollTop<100)photos.slice(0,2).forEach(img=>keep.add(img));photos.forEach(img=>keep.has(img)?load(img):unload(img));}
 function schedule(){if(!scheduled)scheduled=requestAnimationFrame(sync);}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)nearby.add(entry.target);else nearby.delete(entry.target);}schedule();},{root,rootMargin:'500px 500px',threshold:0});
 function close(){observer.disconnect();nearby.clear();if(scheduled)cancelAnimationFrame(scheduled);scheduled=0;photos.forEach(unload);}
 window.jouPreparePhotos??=new Map();window.jouPreparePhotos.set(panel.id,()=>{prepareAlbum(photos.map(img=>sources.get(img).src));for(const img of photos.slice(0,2)){const src=sources.get(img).src;if(warmed.has(src))continue;const warm=new Image();warm.decoding='async';warm.fetchPriority=img===photos[0]?'high':'low';warm.src=src;warm.decode?.().catch(()=>{});warmed.set(src,warm);while(warmed.size>2)warmed.delete(warmed.keys().next().value);}});
 function open(){close();if(!panel.open)return;photos.slice(0,2).forEach(load);photos.forEach(img=>observer.observe(img));}
 photos.forEach(img=>{img.dataset.projectImage='';img.addEventListener('load',()=>img.classList.add('image-ready'));img.decoding='async';img.draggable=false;const width=Number(img.getAttribute('width')),height=Number(img.getAttribute('height'));if(width&&height)img.style.aspectRatio=`${width} / ${height}`;});
 new MutationObserver(()=>panel.open?open():close()).observe(panel,{attributes:true,attributeFilter:['open']});panel.addEventListener('project-will-close',()=>{observer.disconnect();if(scheduled)cancelAnimationFrame(scheduled);scheduled=0;});panel.addEventListener('close',close);if(panel.open)open();else close();
}
