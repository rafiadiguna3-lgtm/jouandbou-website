// Camera-driven landing copy; desktop navigation keeps its existing behavior.
export function createPhoneIntro(){
 const intro=document.getElementById('phone-intro'),guide=document.getElementById('phone-intro-guide'),summary=document.getElementById('home-summary');
 let last=null,dismissed=false,motionAnchor=null,revealOnZoomOut=false;
 function update(state){
  last=state;const {phone,front,view,home}=state;
  if(!phone||!home){intro.inert=true;guide.inert=true;summary.style.removeProperty('--intro-opacity');summary.inert=false;summary.removeAttribute('aria-hidden');return;}
  const target=state.goal||view;
  if(!motionAnchor)motionAnchor={...target};
  const panPixels=Math.hypot(target.x-motionAnchor.x,target.z-motionAnchor.z)*Math.min(target.scale,motionAnchor.scale);
  const zoomChanged=Math.abs(Math.log(target.scale/motionAnchor.scale))>.005;
  if(panPixels>=3||zoomChanged){
   revealOnZoomOut=zoomChanged&&target.scale<motionAnchor.scale&&target.scale<=home.scale*.85;
   dismissed=true;motionAnchor={...target};
  }
  if(front){dismissed=true;revealOnZoomOut=false;}
  else if(revealOnZoomOut&&view.scale<=home.scale*.85){dismissed=false;revealOnZoomOut=false;}
  let opacity=dismissed?0:1;
  const searching=document.body.classList.contains('search-open');
  if(front||searching)opacity=0;
  for(const element of [intro,guide,summary]){
   element.style.setProperty('--intro-opacity',opacity.toFixed(3));
   element.inert=opacity<.15||front;
   element.setAttribute('aria-hidden',String(opacity<.15||front));
  }
 }
 const syncWork=()=>{
  const work=location.hash.startsWith('#bou-works')?'bou':'jou';
  for(const option of intro.querySelectorAll('[data-work]')){if(option.dataset.work===work)option.setAttribute('aria-current','page');else option.removeAttribute('aria-current');}
 };
 for(const button of intro.querySelectorAll('[data-work]'))button.onclick=()=>{
  button.dataset.chosen='true';dismissed=true;revealOnZoomOut=false;update(last);
  if(button.dataset.work==='bou')location.hash='bou-works';else document.getElementById('projects').click();
 };
 addEventListener('hashchange',syncWork);syncWork();
 for(const button of intro.querySelectorAll('[data-service]'))button.onclick=()=>{
  for(const option of intro.querySelectorAll('[data-service]')){option.setAttribute('aria-pressed',String(option===button));option.dataset.chosen=String(option===button);}
 };
 return {update};
}
