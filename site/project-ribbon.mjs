import {galleryArrows} from './gallery-arrows.mjs';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
for(const ribbon of document.querySelectorAll('.project-ribbon,.slider')){
 const track=ribbon.querySelector('.project-ribbon-track,.slide-track'),controls=ribbon.querySelector('.project-ribbon-controls,.slider-controls');
 if(!track)continue;
 galleryArrows(ribbon,track);
 const ui=controls||ribbon.appendChild(document.createElement('div'));ui.classList.add('project-ribbon-controls');ui.replaceChildren();const count=document.createElement('span');count.className='ribbon-position';count.setAttribute('aria-live','polite');ui.append(count);
 const items=[...track.children];let pressed=null,dragged=false;
 const dots=document.createElement('div');dots.className='project-photo-dots';dots.setAttribute('aria-label','Choose photo');ui.append(dots);
 const buttons=items.map((item,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Photo ${i+1} of ${items.length}`);button.addEventListener('click',()=>track.scrollTo({left:item.offsetLeft-items[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'}));dots.append(button);return button;});
 if(items.length<2)ui.hidden=true;
 const stride=()=>items[1]?items[1].offsetLeft-items[0].offsetLeft:track.clientWidth;
 function update(){const i=Math.min(items.length-1,Math.round(track.scrollLeft/Math.max(1,stride())));count.textContent=`${i+1} / ${items.length}`;buttons.forEach((button,n)=>button.setAttribute("aria-current",String(n===i)));}
 function move(d){track.scrollBy({left:stride()*d,behavior:reduced.matches?'instant':'smooth'});}
 track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);
 track.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 // Touch and trackpad use native scrolling; mouse uses hold-and-drag.
 track.addEventListener('pointerdown',e=>{dragged=false;if(e.pointerType!=='mouse'||e.button!==0)return;pressed={id:e.pointerId,x:e.clientX,left:track.scrollLeft};});
 track.addEventListener('pointermove',e=>{if(!pressed||e.pointerId!==pressed.id)return;const dx=e.clientX-pressed.x;if(Math.abs(dx)>5){dragged=true;track.setPointerCapture(e.pointerId);track.classList.add('is-dragging');track.scrollLeft=pressed.left-dx;e.preventDefault();}});
 function end(){if(!pressed)return;pressed=null;track.classList.remove('is-dragging');}
 track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);
 track.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopImmediatePropagation();dragged=false;}},{capture:true});
 // Keep the project-dismiss gesture from consuming a horizontal photo swipe.
 let x=0,y=0,horizontal=false;
 track.addEventListener('touchstart',e=>{x=e.touches[0].clientX;y=e.touches[0].clientY;horizontal=false;},{passive:true});
 track.addEventListener('touchmove',e=>{const t=e.touches[0];if(!t)return;if(Math.abs(t.clientX-x)>8&&Math.abs(t.clientX-x)>Math.abs(t.clientY-y)*1.2)horizontal=true;if(horizontal)e.stopPropagation();},{passive:true});
 track.addEventListener('touchend',e=>{if(horizontal)e.stopPropagation();},{passive:true});update();
}

