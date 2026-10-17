// Camera-driven landing copy; desktop navigation keeps its existing behavior.
export function createPhoneIntro(){
 const intro=document.getElementById('phone-intro'),guide=document.getElementById('phone-intro-guide');
 let last=null,dismissed=false,farOpen=false;
 const movement=(a,b)=>Math.max(Math.abs(Math.log(a.scale/b.scale))/Math.log(2.4),Math.hypot(a.x-b.x,a.z-b.z)*Math.min(a.scale,b.scale)/110);
 function update(state){
  last=state;const {phone,front,view,home}=state;
  if(!phone||!home){intro.inert=true;guide.inert=true;return;}
  const progress=movement(view,home);
  if(!front&&view.scale<=home.scale*.82&&!farOpen){farOpen=true;dismissed=false;}
  if(front||view.scale>=home.scale*.95)farOpen=false;
  if(!farOpen&&(movement(state.goal||view,home)>.05||front))dismissed=true;
  let opacity=dismissed?0:farOpen?1:Math.max(0,1-progress/.32);
  const searching=document.body.classList.contains('search-open');
  if(front||searching)opacity=0;
  for(const element of [intro,guide]){
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
  button.dataset.chosen='true';dismissed=true;update(last);
  if(button.dataset.work==='bou')location.hash='bou-works';else document.getElementById('projects').click();
 };
 addEventListener('hashchange',syncWork);syncWork();
 for(const button of intro.querySelectorAll('[data-service]'))button.onclick=()=>{
  for(const option of intro.querySelectorAll('[data-service]')){option.setAttribute('aria-pressed',String(option===button));option.dataset.chosen=String(option===button);}
 };
 return {update};
}
