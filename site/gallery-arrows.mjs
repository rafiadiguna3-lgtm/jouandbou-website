// Touch galleries keep their navigation visible; desktop uses hover/focus.
export function galleryArrows(container,track){
 const items=[...track.children];if(items.length<2)return ()=>{};
 container.classList.add('gallery-with-arrows');
 const buttons=[-1,1].map(direction=>{
  const button=document.createElement('button');button.type='button';button.className=`gallery-arrow gallery-arrow-${direction<0?'prev':'next'}`;
  button.setAttribute('aria-label',direction<0?'Previous photo':'Next photo');
  button.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction<0?'m15 5-7 7 7 7':'m9 5 7 7-7 7'}"/></svg>`;
  button.onclick=()=>track.scrollBy({left:stride()*direction,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  container.append(button);return button;
 });
 let step=1,frame=0;
 const stride=()=>step;
 function update(){frame=0;const index=Math.max(0,Math.min(items.length-1,Math.round(track.scrollLeft/step)));buttons[0].disabled=index===0;buttons[1].disabled=index===items.length-1;}
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 function measure(){step=Math.max(1,items[1].offsetLeft-items[0].offsetLeft);const top=`${track.offsetTop+track.clientHeight/2}px`;for(const button of buttons)if(button.style.top!==top)button.style.top=top;schedule();}
 track.addEventListener('scroll',schedule,{passive:true});const observer=new ResizeObserver(measure);observer.observe(track);observer.observe(items[0]);measure();
 return ()=>{cancelAnimationFrame(frame);observer.disconnect();track.removeEventListener('scroll',schedule);buttons.forEach(button=>button.remove());container.classList.remove('gallery-with-arrows');};
}
