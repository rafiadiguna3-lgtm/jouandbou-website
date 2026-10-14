(()=>{
 const screen=document.getElementById('welcome-screen');if(!screen)return;
 const started=performance.now(),minimum=900,maximum=3600;
 let leaving=false,readyTimer=null;
 function leave(){
  if(leaving)return;leaving=true;clearTimeout(deadline);clearTimeout(readyTimer);
  document.removeEventListener('jou:scene-ready',ready);
  screen.classList.add('is-leaving');screen.setAttribute('aria-hidden','true');
  setTimeout(()=>screen.remove(),matchMedia('(prefers-reduced-motion: reduce)').matches?0:360);
 }
 function ready(){if(leaving)return;readyTimer=setTimeout(leave,Math.max(0,minimum-(performance.now()-started)));}
 const deadline=setTimeout(leave,maximum);
 document.addEventListener('jou:scene-ready',ready,{once:true});
 // Returning from the browser's page cache should never replay an entrance overlay.
 addEventListener('pageshow',event=>{if(event.persisted)leave();});
})();
