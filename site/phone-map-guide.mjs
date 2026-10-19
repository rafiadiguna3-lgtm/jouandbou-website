import {routeHash} from './project-routing.mjs';
const key='jou-phone-map-guide-v1';
export function createPhoneMapGuide(){
 let dismissed=false,visible=false;
 try{dismissed=localStorage.getItem(key)==='seen';}catch{}
 if(dismissed)return;
 const phone=matchMedia('(max-width:899px),(hover:none),(any-pointer:coarse)');
 const guide=document.createElement('section');guide.id='phone-map-guide';guide.hidden=true;guide.setAttribute('role','status');guide.setAttribute('aria-label','Map instructions');
 guide.innerHTML='<div class="phone-map-guidance"><svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 25V11a3 3 0 0 1 6 0v14-8a3 3 0 0 1 6 0v8-5a3 3 0 0 1 6 0v7-3a3 3 0 0 1 6 0v9c0 8-5 12-12 12h-3c-5 0-7-3-10-7l-7-9a3 3 0 0 1 4-4l4 3"/><path d="M12 10a9 9 0 0 1 18-1M10 4l-2 3M34 6l2 2"/></svg><strong class="sr-only">Tap a house to explore</strong><p class="sr-only">Drag to move. Pinch to zoom.</p><svg class="phone-drag-hint" aria-hidden="true" viewBox="0 0 48 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h40M10 6l-6 6 6 6M38 6l6 6-6 6"/></svg></div>';
 document.body.append(guide);
 const update=()=>{
  const home=!routeHash()||routeHash()==='#projects';
  visible=!dismissed&&phone.matches&&home&&!document.body.matches('.model-view,.has-selection,.view-about,.view-bou,.view-contact')&&!document.querySelector('dialog[open]');
  guide.hidden=!visible;document.body.classList.toggle('phone-map-guided',visible);
 };
 const observer=new MutationObserver(update);observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 const dismiss=()=>{if(!visible)return;dismissed=true;try{localStorage.setItem(key,'seen');}catch{}guide.remove();document.body.classList.remove('phone-map-guided');observer.disconnect();document.removeEventListener('pointerdown',dismiss,true);document.removeEventListener('keydown',keyDismiss,true);removeEventListener('hashchange',update);removeEventListener('popstate',update);phone.removeEventListener('change',update);};
 const keyDismiss=event=>{if(event.key==='Enter'||event.key==='Escape')dismiss();};
 document.addEventListener('pointerdown',dismiss,{capture:true,passive:true});document.addEventListener('keydown',keyDismiss,true);
 addEventListener('hashchange',update);addEventListener('popstate',update);phone.addEventListener('change',update);update();
}
