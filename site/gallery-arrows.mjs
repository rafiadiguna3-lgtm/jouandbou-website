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
 const stride=()=>Math.max(1,items[1].offsetLeft-items[0].offsetLeft);
 function update(){const index=Math.max(0,Math.min(items.length-1,Math.round(track.scrollLeft/stride())));buttons[0].disabled=index===0;buttons[1].disabled=index===items.length-1;for(const button of buttons)button.style.top=`${track.offsetTop+track.clientHeight/2}px`;}
 track.addEventListener('scroll',update,{passive:true});const observer=new ResizeObserver(update);observer.observe(track);update();
 return ()=>{observer.disconnect();track.removeEventListener('scroll',update);buttons.forEach(button=>button.remove());container.classList.remove('gallery-with-arrows');};
}
