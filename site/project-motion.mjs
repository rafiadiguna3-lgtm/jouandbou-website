const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Project details open and close immediately; retain gesture dismissal and cleanup events.
for(const panel of document.querySelectorAll('dialog.project-page,dialog#detail')){
 const show=panel.showModal.bind(panel),nativeClose=panel.close.bind(panel),scroll=panel.querySelector('.project-scroll')||panel;
 function reset(){panel.classList.remove('is-closing');for(const el of [panel,scroll]){el.style.removeProperty('translate');el.style.removeProperty('opacity');el.style.removeProperty('transform');}}
 panel.classList.add('details-motion');
 panel.showModal=()=>{reset();if(!panel.open)show();};
 panel.close=value=>{if(!panel.open)return;panel.classList.add('is-closing');panel.dispatchEvent(new Event('project-will-close'));nativeClose(value);reset();};
 panel.addEventListener('cancel',event=>{event.preventDefault();panel.close();});panel.addEventListener('close',reset);
}

// Pull down at the top of a project to return to its 3D model.
for(const panel of document.querySelectorAll('dialog.project-page,dialog#detail')){
 const scroller=panel.querySelector('.project-scroll')||panel,gestureTarget=panel.classList.contains('project-fullpage')?scroller:panel;
 let pull=null;
 scroller.addEventListener('touchstart',event=>{
  if(event.touches.length!==1||event.target.closest('button,a,input,video,.project-ribbon-track,.slide-track')||panel.classList.contains('story-viewer-open')){pull=null;return;}
  const touch=event.touches[0];pull={x:touch.clientX,y:touch.clientY,dy:0,active:false,top:scroller.scrollTop<=1,bottom:scroller.scrollTop+scroller.clientHeight>=scroller.scrollHeight-2};
 },{passive:true});
 scroller.addEventListener('touchmove',event=>{
  if(!pull||event.touches.length!==1)return;
  const touch=event.touches[0],dy=touch.clientY-pull.y,dx=touch.clientX-pull.x;
  if(!pull.active){if(Math.abs(dx)>Math.abs(dy)){pull=null;return;}if(Math.abs(dy)<=20)return;if(!(dy>0&&pull.top||dy<0&&pull.bottom)){pull=null;return;}}
  pull.active=true;pull.dy=dy;event.preventDefault();
  gestureTarget.style.translate=`0 ${Math.sign(dy)*Math.min(180,Math.abs(dy)*.45)}px`;
  gestureTarget.style.opacity=String(Math.max(.4,1-Math.abs(dy)/420));
 },{passive:false});
 function end(){if(!pull)return;const dismiss=pull.active&&Math.abs(pull.dy)>130;pull=null;
  const from=gestureTarget.style.translate;
  if(dismiss){panel.close();}else{gestureTarget.style.removeProperty('translate');gestureTarget.style.removeProperty('opacity');}
  if(dismiss)return;else if(from&&!reduced.matches)gestureTarget.animate?.([{translate:from},{translate:'0 0'}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'});
 }
 scroller.addEventListener('touchend',end,{passive:true});
 scroller.addEventListener('touchcancel',()=>{pull=null;gestureTarget.style.removeProperty('translate');gestureTarget.style.removeProperty('opacity');},{passive:true});
 panel.addEventListener('close',()=>{pull=null;gestureTarget.style.removeProperty('translate');gestureTarget.style.removeProperty('opacity');});
}
