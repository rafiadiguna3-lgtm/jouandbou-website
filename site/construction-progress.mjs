const panel=document.getElementById('jh37'),viewer=panel.querySelector('.construction-story-viewer'),article=panel.querySelector('article'),button=panel.querySelector('.construction-progress'),surface=viewer.querySelector('.progress-story-surface'),image=viewer.querySelector('img'),message=viewer.querySelector('.progress-story-message'),bars=viewer.querySelector('.progress-story-bars'),status=viewer.querySelector('.progress-story-status'),pauseButton=viewer.querySelector('.progress-story-pause'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let items=[],index=0,elapsed=0,last=0,raf=0,paused=false,held=false,loading=false,revision=0,motion=null,controller=null,gesture=null,origin={x:0,y:0,r:0};
const visible=()=>panel.open&&!viewer.hidden;
function stopClock(){cancelAnimationFrame(raf);raf=0;last=0;}
function syncPause(){}
function paint(){[...bars.children].forEach((bar,i)=>bar.firstElementChild.style.width=`${i<index?100:i===index?Math.min(100,elapsed/(items[index]?.duration||6000)*100):0}%`);}
function tick(now){raf=0;if(!visible()||paused||held||loading||document.hidden||reduced.matches)return;if(last)elapsed+=Math.min(100,now-last);last=now;paint();if(elapsed>=(items[index]?.duration||6000)){if(index<items.length-1)show(index+1);else{paused=true;syncPause();stopClock();return;}}if(!raf)raf=requestAnimationFrame(tick);}
function playClock(){if(visible()&&items.length&&!paused&&!held&&!loading&&!document.hidden&&!reduced.matches&&!raf){last=0;raf=requestAnimationFrame(tick);}}
function show(next){stopClock();index=Math.max(0,Math.min(items.length-1,next));elapsed=0;loading=true;image.hidden=false;message.hidden=true;image.alt=items[index].alt;image.src=items[index].src;status.textContent=`JH39 progress, ${index+1} of ${items.length}`;paint();if(image.complete&&image.naturalWidth){loading=false;playClock();}}
image.addEventListener('load',()=>{if(!visible())return;loading=false;playClock();});
image.addEventListener('error',()=>{if(!visible())return;loading=false;if(index<items.length-1)show(index+1);else back();});
function circle(radius){return `circle(${radius}px at ${origin.x}px ${origin.y}px)`;}
function cancelMotion(){motion?.cancel();motion=null;}
function cleanup(){stopClock();controller?.abort();controller=null;cancelMotion();viewer.hidden=true;viewer.classList.remove('revealing');viewer.style.removeProperty('clip-path');panel.classList.remove('story-viewer-open');article.inert=false;items=[];bars.replaceChildren();image.removeAttribute('src');gesture=null;held=false;}
async function open(){
 if(Number(panel.dataset.house||37)!==39){panel.dispatchEvent(new Event('progress-viewer-close'));return;}
 if(visible())return;const token=++revision;cancelMotion();const dot=button.querySelector('.progress-dot').getBoundingClientRect();panel.classList.add('story-viewer-open');const card=panel.getBoundingClientRect();origin={x:dot.left+dot.width/2-card.left,y:dot.top+dot.height/2-card.top,r:0};origin.r=Math.ceil(Math.hypot(Math.max(origin.x,card.width-origin.x),Math.max(origin.y,card.height-origin.y)))+4;
 viewer.classList.add('revealing');viewer.style.clipPath=circle(0);viewer.hidden=false;panel.classList.add('story-viewer-open');article.inert=true;panel.dispatchEvent(new Event('progress-viewer-open'));paused=false;held=false;loading=true;syncPause();image.hidden=true;message.hidden=true;viewer.querySelector('.progress-story-heading>span').textContent='JH39 · E House';
 controller?.abort();controller=new AbortController();const signal=controller.signal;
 const load=(async()=>{try{const response=await fetch('assets/jh39/progress/manifest.json',{signal});if(!response.ok)throw Error('Progress unavailable');const manifest=await response.json();if(token!==revision||signal.aborted)return;items=manifest.items;if(!items.length)throw Error('Progress unavailable');bars.replaceChildren(...items.map(()=>{const span=document.createElement('span');span.append(document.createElement('i'));return span;}));show(0);}catch(error){if(token!==revision||signal.aborted)return;loading=false;image.hidden=true;message.hidden=false;message.textContent='Progress documentation could not load. Close and tap again to retry.';back();}})();
 if(!reduced.matches&&viewer.animate){const animation=motion=viewer.animate([{clipPath:circle(0)},{clipPath:circle(origin.r)}],{duration:520,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});try{await animation.finished;}catch{}if(token!==revision)return;viewer.style.clipPath=circle(origin.r);animation.cancel();motion=null;}else viewer.style.clipPath=circle(origin.r);
 viewer.classList.remove('revealing');panel.querySelector('.close').focus({preventScroll:true});await load;
}
async function back(){
 if(!visible())return;const token=++revision;stopClock();controller?.abort();cancelMotion();
 // Fade the fullscreen layer before restoring the card's dimensions.
 if(!reduced.matches&&panel.animate){const animation=motion=panel.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-out',fill:'forwards'});await Promise.race([animation.finished.catch(()=>{}),new Promise(resolve=>setTimeout(resolve,220))]);if(token!==revision)return;panel.style.opacity='0';animation.cancel();motion=null;}
 cleanup();panel.dispatchEvent(new Event('progress-viewer-close'));
 if(!reduced.matches&&panel.animate){panel.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});}
 panel.style.removeProperty('opacity');button.focus({preventScroll:true});
}
const panelExit=panel.querySelector('.close');panelExit.addEventListener('click',event=>{if(visible()){event.preventDefault();event.stopImmediatePropagation();back();}},{capture:true});button.addEventListener('click',open);viewer.querySelector('.progress-story-back').addEventListener('click',back);pauseButton.addEventListener('click',()=>{paused=!paused;syncPause();stopClock();playClock();});
surface.addEventListener('pointerdown',event=>{if(event.button!==0||!items.length)return;gesture={id:event.pointerId,x:event.clientX,y:event.clientY,at:performance.now()};held=true;stopClock();surface.setPointerCapture(event.pointerId);});
surface.addEventListener('pointerup',event=>{if(!gesture||event.pointerId!==gesture.id)return;const press=gesture;gesture=null;held=false;const dx=event.clientX-press.x,dy=event.clientY-press.y;if(Math.abs(dy)>44&&Math.abs(dy)>Math.abs(dx)){back();return;}if(Math.abs(dx)>24&&Math.abs(dx)>Math.abs(dy)){show(index+(dx<0?1:-1));}else if(performance.now()-press.at<300&&Math.hypot(dx,dy)<12){const box=surface.getBoundingClientRect();show(index+(event.clientX<box.left+box.width*.4?-1:1));}playClock();});
surface.addEventListener('pointercancel',()=>{gesture=null;held=false;playClock();});
panel.addEventListener('keydown',event=>{if(!visible())return;if(event.key==='Escape'){event.preventDefault();event.stopPropagation();back();}else if(items.length&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}else if(event.key===' '&&event.target===surface){event.preventDefault();pauseButton.click();}},{capture:true});
panel.addEventListener('close',()=>{revision++;cleanup();});new MutationObserver(()=>{if(!panel.open){revision++;cleanup();}}).observe(panel,{attributes:true,attributeFilter:['open']});
document.addEventListener('visibilitychange',()=>{stopClock();if(!document.hidden)playClock();});reduced.addEventListener('change',()=>{stopClock();playClock();});
