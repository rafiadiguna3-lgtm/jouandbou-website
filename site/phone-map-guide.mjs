import {routeHash} from './project-routing.mjs';
export function createPhoneMapGuide(){
 let dismissed=false,visible=false;
 const phone=matchMedia('(max-width:899px),(hover:none),(any-pointer:coarse)');
 const guide=document.createElement('section');guide.id='phone-map-guide';guide.hidden=true;guide.setAttribute('role','status');guide.setAttribute('aria-label','Map instructions');
 guide.innerHTML='<div class="phone-map-guidance"><svg aria-hidden="true" viewBox="0 0 48 48" fill="#fff" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 26V13a3 3 0 0 1 6 0v10l3-1 8 4v8c0 6-4 10-10 10h-2c-4 0-6-2-8-5l-6-9a3 3 0 0 1 4-4l5 4"/></svg><strong></strong><p></p></div>';
 document.body.append(guide);
 const update=()=>{
  guide.querySelector('strong').textContent=phone.matches?'Move the screen':'Drag the screen';
  guide.querySelector('p').textContent=phone.matches?'Tap a house':'Click a house';
  const summary=document.getElementById('home-summary');
  if(summary)guide.style.setProperty('--guide-copy-size',getComputedStyle(summary).fontSize);
  const home=!routeHash()||routeHash()==='#projects';
  visible=!dismissed&&home&&!document.body.matches('.model-view,.has-selection,.view-about,.view-bou,.view-contact')&&!document.querySelector('dialog[open]');
  guide.hidden=!visible;document.body.classList.toggle('phone-map-guided',visible);
 };
 const observer=new MutationObserver(update);observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 const dismiss=()=>{if(!visible)return;dismissed=true;guide.remove();document.body.classList.remove('phone-map-guided');observer.disconnect();document.removeEventListener('pointerdown',dismiss,true);document.removeEventListener('keydown',keyDismiss,true);document.removeEventListener('wheel',dismiss,true);removeEventListener('hashchange',update);removeEventListener('popstate',update);phone.removeEventListener('change',update);};
 const keyDismiss=event=>{if(event.key==='Enter'||event.key==='Escape')dismiss();};
 document.addEventListener('pointerdown',dismiss,{capture:true,passive:true});document.addEventListener('keydown',keyDismiss,true);document.addEventListener('wheel',dismiss,{capture:true,passive:true});
 addEventListener('hashchange',update);addEventListener('popstate',update);phone.addEventListener('change',update);update();
}
