// Camera-driven landing copy; desktop navigation keeps its existing behavior.
export function createPhoneIntro(){
 const intro=document.getElementById('phone-intro'),guide=document.getElementById('phone-intro-guide'),toggle=document.getElementById('phone-intro-toggle');
 let manual=null,manualView=null,last=null,dismissed=false;
 const movement=(a,b)=>Math.max(Math.abs(Math.log(a.scale/b.scale))/Math.log(2.4),Math.hypot(a.x-b.x,a.z-b.z)*Math.min(a.scale,b.scale)/110);
 function update(state){
  last=state;const {phone,front,view,home}=state;
  if(!phone||!home){document.body.classList.remove('phone-exploring','phone-intro-open');intro.inert=true;guide.inert=true;toggle.hidden=true;return;}
  const progress=movement(view,home);
  if(movement(state.goal||view,home)>.05||front)dismissed=true;
  if(manualView&&movement(state.goal||view,manualView)>.05){manual=false;manualView=null;dismissed=true;}
  let opacity=manual===true?1:manual===false||dismissed?0:Math.max(0,1-progress/.32);
  const searching=document.body.classList.contains('search-open');
  if(front||searching)opacity=0;
  const exploring=dismissed||manual!==null||front||searching;
  document.body.classList.toggle('phone-exploring',exploring);
  document.body.classList.toggle('phone-intro-open',manual===true&&!front&&!searching);
  for(const element of [intro,guide]){
   element.style.setProperty('--intro-opacity',opacity.toFixed(3));
   element.inert=opacity<.15||front;
   element.setAttribute('aria-hidden',String(opacity<.15||front));
  }
  toggle.hidden=!exploring||front;
  toggle.setAttribute('aria-expanded',String(opacity>.5));
  toggle.setAttribute('aria-label',opacity>.5?'Hide introduction':'Show introduction');
 }
 toggle.onclick=()=>{manual=toggle.getAttribute('aria-expanded')!=='true';manualView={...(last.goal||last.view)};update(last);};
 const syncWork=()=>{
  const work=location.hash.startsWith('#bou-works')?'bou':'jou';
  for(const option of intro.querySelectorAll('[data-work]')){if(option.dataset.work===work)option.setAttribute('aria-current','page');else option.removeAttribute('aria-current');}
 };
 for(const button of intro.querySelectorAll('[data-work]'))button.onclick=()=>{
  button.dataset.chosen='true';dismissed=true;manual=false;manualView=null;update(last);
  if(button.dataset.work==='bou')location.hash='bou-works';else document.getElementById('projects').click();
 };
 addEventListener('hashchange',syncWork);syncWork();
 for(const button of intro.querySelectorAll('[data-service]'))button.onclick=()=>{
  for(const option of intro.querySelectorAll('[data-service]')){option.setAttribute('aria-pressed',String(option===button));option.dataset.chosen=String(option===button);}
 };
 return {update};
}
