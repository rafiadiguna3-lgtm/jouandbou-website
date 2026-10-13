import {prepareFilm,releaseFilm} from './project-film.mjs?v=83';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function setupPanel(id){
 const panel=document.getElementById(id),scroll=panel.querySelector('.project-scroll'),film=panel.querySelector('video'),toggle=panel.querySelector('.film-hero button');
 let userPaused=false;
 function syncButton(){toggle.innerHTML=film.paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>';toggle.setAttribute('aria-label',film.paused?'Play project film':'Pause project film');}
 function play(){if(panel.open&&!panel.classList.contains('is-closing')&&!userPaused&&!document.hidden)film.play().catch(syncButton);}
 const reset=()=>{userPaused=reduced.matches;film.muted=true;prepareFilm(film,`assets/${id}/`).then(ok=>{if(ok&&!userPaused)play();});try{film.currentTime=0;}catch{}if(!userPaused)play();syncButton();};
 toggle.onclick=()=>{userPaused=!film.paused;if(film.paused){userPaused=false;play();}else film.pause();};
 film.addEventListener('canplay',()=>{if(scroll.scrollTop<scroll.clientHeight*.65)play();});film.addEventListener('play',syncButton);film.addEventListener('pause',syncButton);panel.addEventListener('project-will-close',()=>releaseFilm(film));panel.addEventListener('close',()=>releaseFilm(film));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseFilm(film);else if(panel.open&&!panel.classList.contains('is-closing')&&scroll.scrollTop<scroll.clientHeight*.65)prepareFilm(film,`assets/${id}/`).then(ok=>{if(ok)play();});});
 new IntersectionObserver(entries=>{if(entries[0].isIntersecting)play();else film.pause();},{root:scroll,threshold:.35}).observe(film);
 return reset;
}
window.resetProjectStage=setupPanel('marboy');
window.resetRempoaStage=setupPanel('rempoa');
