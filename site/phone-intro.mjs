// Camera-driven landing copy; desktop navigation keeps its existing behavior.
export function createPhoneIntro(){
 const intro=document.getElementById('phone-intro'),guide=document.getElementById('phone-intro-guide'),toggle=document.getElementById('phone-intro-toggle');
 let manual=null,manualView=null,last=null,wasHome=false;
 const movement=(a,b)=>Math.max(Math.abs(Math.log(a.scale/b.scale))/Math.log(2.4),Math.hypot(a.x-b.x,a.z-b.z)*Math.min(a.scale,b.scale)/110);
 function update(state){
  last=state;const {phone,front,view,home}=state;
  if(!phone||!home){document.body.classList.remove('phone-exploring','phone-intro-open');intro.inert=true;guide.inert=true;toggle.hidden=true;return;}
  const progress=movement(view,home),atHome=progress<.025;
  if(atHome&&!wasHome){manual=null;manualView=null;}wasHome=atHome;
  if(manualView&&movement(view,manualView)>.12){manual=null;manualView=null;}
  let opacity=manual===true?1:manual===false?0:Math.max(0,1-progress/.7);
  const searching=document.body.classList.contains('search-open');
  if(front||searching)opacity=0;
  const exploring=progress>=.7||manual!==null||front||searching;
  document.body.classList.toggle('phone-exploring',exploring);
  document.body.classList.toggle('phone-intro-open',manual===true&&!front);
  for(const element of [intro,guide]){
   element.style.setProperty('--intro-opacity',opacity.toFixed(3));
   element.style.setProperty('--intro-slide',`${((1-opacity)*18).toFixed(2)}px`);
   element.inert=opacity<.15||front;
   element.setAttribute('aria-hidden',String(opacity<.15||front));
  }
  toggle.hidden=!exploring||front;
  toggle.setAttribute('aria-expanded',String(opacity>.5));
  toggle.setAttribute('aria-label',opacity>.5?'Hide introduction':'Show introduction');
 }
 toggle.onclick=()=>{manual=toggle.getAttribute('aria-expanded')!=='true';manualView={...last.view};update(last);};
 for(const button of intro.querySelectorAll('[data-work]'))button.onclick=()=>{
  for(const option of intro.querySelectorAll('[data-work]')){if(option===button)option.setAttribute('aria-current','page');else option.removeAttribute('aria-current');}
 };
 for(const button of intro.querySelectorAll('[data-service]'))button.onclick=()=>{
  for(const option of intro.querySelectorAll('[data-service]'))option.setAttribute('aria-pressed',String(option===button));
 };
 return {update};
}
