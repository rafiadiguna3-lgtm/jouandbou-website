import {routeHash} from './project-routing.mjs';
export function createPhoneMapGuide({onChange=()=>{},order=[0]}={}){
 let dismissed=false,visible=false,frame=0,started=0,press=null;
 const phone=matchMedia('(max-width:899px),(hover:none),(any-pointer:coarse)'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const guide=document.createElement('section');guide.id='phone-map-guide';guide.hidden=true;guide.setAttribute('role','status');guide.setAttribute('aria-label','Map instructions');
 guide.innerHTML='<div class="world-guidance"><h1><span></span><i aria-hidden="true"></i></h1><div class="world-info"><p>Explore our projects’ neighborhood.</p><p class="world-how"><span></span><br><span></span></p></div></div>';
 document.body.append(guide);
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 function animate(now){
  frame=0;if(!visible||dismissed)return;if(!started)started=now;
  const t=(now-started)/1000;
  guide.querySelector('h1 span').textContent=reduce?'jou world':'jou world'.slice(0,Math.max(0,Math.floor((t-1.1)/.1)+1));
  guide.querySelector('h1').style.opacity=t>=1.1?'1':'0';
  guide.querySelector('.world-info').style.opacity=String(smooth((t-2.35)/.42));
  guide.style.setProperty('--world-blur',`${(phone.matches?2:3)*smooth((t-1.05)/.2)}px`);
  document.body.style.setProperty('--world-blur',guide.style.getPropertyValue('--world-blur'));
  const elapsed=Math.max(0,t-2.6),local=elapsed%1.35;
  guide.dataset.house=String(order[Math.floor(elapsed/1.35)%order.length]);
  guide.dataset.level=String(t<2.6?0:smooth(local/.28)*(1-smooth((local-1.07)/.28)));
  onChange();frame=requestAnimationFrame(animate);
 }
 function update(){
  if(dismissed)return;
  const home=!routeHash()||routeHash()==='#projects';
  const eligible=home&&!document.body.matches('.model-view,.has-selection,.view-about,.view-bou,.view-contact,.search-open')&&!document.querySelector('dialog[open]')&&document.getElementById('menu-toggle')?.getAttribute('aria-expanded')!=='true';
  if(!eligible&&visible){dismiss({immediate:true});return;}
  const spans=guide.querySelectorAll('.world-how span');spans[0].textContent=phone.matches?'Move the screen.':'Drag to move.';spans[1].textContent=phone.matches?'Tap a house.':'Click a house.';
  if(eligible&&!visible){visible=true;guide.hidden=false;document.body.classList.add('phone-map-guided');document.documentElement.classList.remove('world-intro-pending');document.fonts.load('400 29px JouWorld').catch(()=>{}).then(()=>{if(visible&&!dismissed)frame=requestAnimationFrame(animate);});}
 }
 const abort=new AbortController(),listen=(target,type,fn)=>target.addEventListener(type,fn,{capture:true,passive:true,signal:abort.signal});
 function dismiss({immediate=false}={}){
  if(dismissed)return;dismissed=true;visible=false;cancelAnimationFrame(frame);observer.disconnect();abort.abort();
  const viewport=document.getElementById('viewport'),blur=getComputedStyle(viewport).filter;
  document.body.classList.remove('phone-map-guided');document.documentElement.classList.remove('world-intro-pending');document.body.style.removeProperty('--world-blur');
  guide.querySelector('h1 i').style.visibility='hidden';onChange();
  const cleanup=()=>{guide.remove();document.body.classList.remove('world-guide-leaving');};
  if(reduce||immediate){cleanup();return;}
  document.body.classList.add('world-guide-leaving');
  const options={duration:520,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'};
  const heading=guide.querySelector('h1'),info=guide.querySelector('.world-info');
  heading.animate([{opacity:getComputedStyle(heading).opacity,transform:'translateY(0) scale(1)',filter:'blur(0px)'},{opacity:0,transform:'translateY(-14px) scale(.98)',filter:'blur(3px)'}],options);
  info.animate([{opacity:getComputedStyle(info).opacity,transform:'translateY(0)'},{opacity:0,transform:'translateY(-9px)'}],{...options,duration:360});
  const clear=viewport.animate([{filter:blur},{filter:'blur(0px)'}],{...options,duration:560,fill:'none'});
  clear.finished.then(cleanup,cleanup);
 }

 listen(document,'pointerdown',e=>{press={x:e.clientX,y:e.clientY};if(!e.target.closest('#viewport'))dismiss({immediate:true});});
 listen(document,'pointermove',e=>{if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>5)dismiss();});
 listen(document,'pointerup',()=>{if(press)dismiss();press=null;});
 listen(document,'wheel',dismiss);listen(document,'keydown',e=>{if(['Enter','Escape',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))dismiss();});
 listen(window,'hashchange',update);listen(window,'popstate',update);phone.addEventListener('change',update,{signal:abort.signal});
 const observer=new MutationObserver(update);observer.observe(document.body,{attributes:true,attributeFilter:['class']});observer.observe(document.getElementById('menu-toggle'),{attributes:true,attributeFilter:['aria-expanded']});
 update();document.documentElement.classList.remove('world-intro-pending');return {get visible(){return visible},level(id){return visible&&Number(guide.dataset.house)===id?Number(guide.dataset.level||0):0},dismiss};
}
