import {prepareFilm,releaseFilm} from './project-film.mjs?v=83';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
for(const film of document.querySelectorAll('video[data-project-film]')){
 const panel=film.closest('dialog'),scroller=panel.querySelector('.project-scroll'),toggle=film.parentElement.querySelector('.film-toggle');
 let visible=false,userPaused=reduced.matches;
 function sync(){toggle.innerHTML=film.paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>';toggle.setAttribute('aria-label',film.paused?'Play project film':'Pause project film');}
 function play(){if(panel.open&&!panel.classList.contains('is-closing')&&visible&&!userPaused&&!document.hidden)film.play().catch(sync);}
 function prepare(){film.muted=true;prepareFilm(film,`assets/${film.dataset.projectFilm}/`).then(ok=>{if(ok)play();});}
 toggle.onclick=()=>{prepare();if(film.paused){userPaused=false;visible=true;play();}else{userPaused=true;film.pause();}};
 film.addEventListener('canplay',play);film.addEventListener('play',()=>{if(!panel.open||!visible||userPaused||document.hidden)film.pause();sync();});film.addEventListener('pause',sync);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&panel.open){prepare();play();}else film.pause();},{root:scroller,threshold:.3}).observe(film);
 new MutationObserver(()=>{if(panel.open&&!panel.classList.contains('is-closing')&&visible){prepare();play();}else if(!panel.open)releaseFilm(film);}).observe(panel,{attributes:true,attributeFilter:['open']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseFilm(film);else if(panel.open&&!panel.classList.contains('is-closing')&&visible){prepare();play();}});
 panel.addEventListener('project-will-close',()=>releaseFilm(film));panel.addEventListener('close',()=>releaseFilm(film));sync();
}
