import './contact-map.mjs?v=112';
import {journalPosts} from './about-journal.mjs';
const about=document.getElementById('about-page'),studio=document.getElementById('studio'),projects=document.getElementById('projects'),brand=document.querySelector('.brand');
const originalProjects=projects.onclick;
const contact=document.getElementById('contact-page'),contactLink=document.getElementById('contact');
function showRoute(){const active=location.hash==='#about',contactActive=location.hash==='#contact',page=active||contactActive;about.hidden=!active;contact.hidden=!contactActive;document.body.classList.toggle('view-about',active);document.body.classList.toggle('view-contact',contactActive);document.getElementById('viewport').inert=page;for(const el of [studio,projects,contactLink])el.removeAttribute('aria-current');(active?studio:contactActive?contactLink:projects).setAttribute('aria-current','page');if(page){closeSearch();document.querySelectorAll('dialog[open]').forEach(d=>d.close());(active?about:contact).focus({preventScroll:true});}document.title=active?'About us — Jou & Bou':contactActive?'Contact us — Jou & Bou':'Jou & Bou — A neighborhood of ideas';}

studio.onclick=()=>{if(location.hash!=='#about')location.hash='about';else about.scrollTo({top:0,behavior:'smooth'});};
projects.onclick=()=>{location.hash='projects';showRoute();originalProjects?.();};
brand.onclick=e=>{e.preventDefault();closeSearch();location.hash='projects';showRoute();originalProjects?.();};
addEventListener('hashchange',showRoute);
const track=document.querySelector('.about-feed-track');
for(const post of journalPosts){const a=document.createElement('a');a.href=post.url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${post.alt}; visit Jou and Bou on Instagram`);const img=document.createElement('img');img.src=post.image;img.alt=post.alt;img.width=post.width;img.height=post.height;img.loading='lazy';img.decoding='async';a.append(img);track.append(a);}
const prev=document.getElementById('feed-prev'),next=document.getElementById('feed-next');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function move(d){track.scrollBy({left:track.clientWidth*d,behavior:reduced?'instant':'smooth'});}prev.onclick=()=>move(-1);next.onclick=()=>move(1);function controls(){prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}track.addEventListener('scroll',controls,{passive:true});addEventListener('resize',controls);new ResizeObserver(controls).observe(track);controls();

const searchToggle=document.getElementById('search-toggle'),searchWrap=document.querySelector('.search-wrap'),searchInput=document.getElementById('search');
function closeSearch(){document.body.classList.remove('search-open');searchToggle.setAttribute('aria-expanded','false');searchInput.inert=true;searchInput.tabIndex=-1;document.getElementById('results').hidden=true;searchInput.setAttribute('aria-expanded','false');}
searchToggle.onclick=()=>{if(location.hash==='#about'||location.hash==='#contact'){history.pushState(null,'','#projects');showRoute();}const open=!document.body.classList.contains('search-open');document.body.classList.toggle('search-open',open);searchToggle.setAttribute('aria-expanded',String(open));if(open){searchInput.inert=false;searchInput.tabIndex=0;searchInput.focus();}else closeSearch();};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search-wrap,#search-toggle'))closeSearch();});
searchWrap.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();searchToggle.focus();}});
document.getElementById('results').addEventListener('click',e=>{if(e.target.closest('button'))closeSearch();});
addEventListener('hashchange',closeSearch);addEventListener('popstate',showRoute);

closeSearch();showRoute();

track.tabIndex=0;track.setAttribute('aria-label','12 architectural photographs; swipe or use arrow keys to browse');track.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
