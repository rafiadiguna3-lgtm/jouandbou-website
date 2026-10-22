(()=>{
 if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
 let ready=false;
 function show(){if(ready)return;document.documentElement.setAttribute('data-site-fallback','');document.documentElement.classList.remove('world-intro-pending');const fallback=document.getElementById('site-fallback');if(fallback)fallback.hidden=false;document.dispatchEvent(new Event('jou:fallback'));}
 const timer=setTimeout(show,12000);
 addEventListener('error',event=>{if(event.target?.tagName==='SCRIPT'&&/\/app\.mjs(?:\?|$)/.test(event.target.src))show();},true);
 function complete(){ready=true;clearTimeout(timer);document.documentElement.removeAttribute('data-site-fallback');const fallback=document.getElementById('site-fallback');if(fallback)fallback.hidden=true;}
 document.addEventListener('jou:scene-ready',complete,{once:true});
 document.addEventListener('jou:app-ready',()=>{if(location.hash&&location.hash!=='#projects')complete();},{once:true});
 document.addEventListener('jou:app-error',show);
})();
