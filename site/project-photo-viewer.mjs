import {photoVariants} from './photo-variants.mjs?v=126';
// One full-size photograph at a time, with ordinary buttons and no drag handling.
const viewer=document.createElement('dialog');viewer.className='photo-viewer';viewer.setAttribute('aria-label','Project photographs');
viewer.innerHTML='<button class="photo-viewer-close" aria-label="Close photograph">×</button><img alt="" draggable="false"><button class="photo-viewer-prev" aria-label="Previous photograph">‹</button><button class="photo-viewer-next" aria-label="Next photograph">›</button><span class="photo-viewer-count" aria-live="polite"></span>';
const dots=document.createElement('div');dots.className='photo-viewer-dots';viewer.append(dots);document.body.append(viewer);
const image=viewer.querySelector('img'),prev=viewer.querySelector('.photo-viewer-prev'),next=viewer.querySelector('.photo-viewer-next'),count=viewer.querySelector('span');let photos=[],index=0;
function show(i){index=Math.max(0,Math.min(photos.length-1,i));image.src=photos[index].src;image.alt=photos[index].alt;count.textContent=`${index+1} / ${photos.length}`;prev.disabled=index===0;next.disabled=index===photos.length-1;for(const [i,b] of [...dots.children].entries())b.setAttribute('aria-current',String(i===index));}
viewer.querySelector('.photo-viewer-close').onclick=()=>viewer.close();prev.onclick=()=>show(index-1);next.onclick=()=>show(index+1);
viewer.addEventListener('close',()=>{image.removeAttribute('src');photos=[];dots.replaceChildren();});
viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}});
for(const panel of document.querySelectorAll('dialog.project-page:not(.construction-project)')){
 const originals=[...panel.querySelectorAll('.project-scroll img[src]')].filter(img=>!img.classList.contains('project-symbol')&&!/\.svg(?:\?|$)/i.test(img.getAttribute('src')));
 const items=originals.map(img=>({src:photoVariants[img.getAttribute('src')]?.[matchMedia('(any-pointer: coarse)').matches&&Math.min(innerWidth,innerHeight)<700?'800':'1280']||img.getAttribute('src'),alt:img.alt}));
 originals.forEach((img,i)=>{img.classList.add('expandable-photo');img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`Open photograph: ${img.alt||i+1}`);img.draggable=false;const open=()=>{photos=items;dots.replaceChildren();items.forEach((_,n)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Photograph ${n+1}`);b.onclick=()=>show(n);dots.append(b);});show(i);viewer.showModal();};let press=null,blockedUntil=0;img.addEventListener('pointerdown',e=>{press={x:e.clientX,y:e.clientY};});img.addEventListener('pointermove',e=>{if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>12){blockedUntil=performance.now()+500;press=null;}});img.addEventListener('pointercancel',()=>{blockedUntil=performance.now()+500;press=null;});img.addEventListener('click',e=>{if(performance.now()<blockedUntil){e.preventDefault();return;}open();});img.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});});
 panel.addEventListener('project-will-close',()=>{if(viewer.open)viewer.close();});
}

// A single swipe changes photograph, never pans or zooms the photograph itself.
let swipe=null;
image.addEventListener('pointerdown',e=>{swipe={id:e.pointerId,x:e.clientX,y:e.clientY};if(e.pointerType==='mouse')image.setPointerCapture(e.pointerId);});
image.addEventListener('pointerup',e=>{if(!swipe||swipe.id!==e.pointerId)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1));});
image.addEventListener('pointercancel',()=>{swipe=null;});
