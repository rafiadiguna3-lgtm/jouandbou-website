// Camera-driven landing copy; desktop navigation keeps its existing behavior.
export function createPhoneIntro(){
 const intro=document.getElementById('phone-intro'),guide=document.getElementById('phone-intro-guide'),summary=document.getElementById('home-summary');
 let last=null,dismissed=false,motionAnchor=null,revealOnZoomOut=false,zoomIntent=null,previousScale=null;
 function update(state){
  last=state;const {phone,front,view,home}=state,intent=zoomIntent;zoomIntent=null;
  if(!phone||!home){intro.inert=true;guide.inert=true;summary.style.removeProperty('--intro-opacity');summary.inert=false;summary.removeAttribute('aria-hidden');return;}
  const target=state.goal||view;
  if(!motionAnchor)motionAnchor={...target};
  const panPixels=Math.hypot(target.x-motionAnchor.x,target.z-motionAnchor.z)*Math.min(target.scale,motionAnchor.scale);
  const zoomDelta=Math.log(target.scale/motionAnchor.scale),zoomChanged=Math.abs(zoomDelta)>.0001;
  const reversedToZoomIn=previousScale!==null&&target.scale>previousScale*(1+1e-9);
  previousScale=target.scale;
  if(intent==='in'||reversedToZoomIn){dismissed=true;revealOnZoomOut=false;motionAnchor={...target};}
  else if(intent==='out'){
   dismissed=true;revealOnZoomOut=target.scale<=home.scale;motionAnchor={...target};
  }else if(panPixels>=1.5||zoomChanged){dismissed=true;revealOnZoomOut=false;motionAnchor={...target};}
  if(front){dismissed=true;revealOnZoomOut=false;}
  else if(revealOnZoomOut&&view.scale<=home.scale&&target.scale<=home.scale){dismissed=false;revealOnZoomOut=false;}
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
 return {update,onZoom(direction){zoomIntent=direction;if(direction==='in'){dismissed=true;revealOnZoomOut=false;}}};
}
