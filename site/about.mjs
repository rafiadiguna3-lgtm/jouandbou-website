import {renderBou} from './bou.mjs?v=147';
import './contact-map.mjs?v=141';
import {journalPosts} from './about-journal.mjs';
const about=document.getElementById('about-page'),studio=document.getElementById('studio'),projects=document.getElementById('projects'),brand=document.querySelector('.brand');
const originalProjects=projects.onclick;
const contact=document.getElementById('contact-page'),contactLink=document.getElementById('contact');
const bou=document.getElementById('bou-page');
const bouClose=document.createElement('button');
bouClose.id='bou-close';bouClose.type='button';bouClose.hidden=true;bouClose.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
brand.closest('header').append(bouClose);
function closeBou(){location.hash=location.hash.startsWith('#bou-works/')?'bou-works':'about';}
bouClose.onclick=closeBou;
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('view-bou')){event.preventDefault();closeBou();}});
let shownRoute;
const bouScrollPositions=new Map();
const homeTitle = document.title;
function updateTitle(){const page=location.hash==='#about'?'about us':location.hash==='#contact'?'contact us':location.hash.startsWith('#bou-works')?'bou works':document.querySelector('dialog.project-page[open],dialog#detail[open]')?'project details':'';document.title=page?`jou and bou - ${page}`:homeTitle;}
for(const panel of document.querySelectorAll('dialog.project-page,dialog#detail'))new MutationObserver(updateTitle).observe(panel,{attributes:true,attributeFilter:['open']});
function showRoute(){
 if(/^#bou(?:\/|$)/.test(location.hash))history.replaceState(null,'',location.hash.replace(/^#bou/,'#bou-works'));
 if(shownRoute?.startsWith('#bou-works')&&shownRoute!==location.hash&&!bou.hidden)bouScrollPositions.set(shownRoute,bou.scrollTop);
 const active=location.hash==='#about',contactActive=location.hash==='#contact',bouActive=/^#bou-works(?:\/|$)/.test(location.hash),page=active||contactActive||bouActive;
 const panel=active?about:contactActive?contact:bou;
 about.hidden=!active;contact.hidden=!contactActive;bou.hidden=!bouActive;
 document.body.classList.toggle('view-about',active||bouActive);document.body.classList.toggle('view-bou',bouActive);document.body.classList.toggle('view-contact',contactActive);
 document.getElementById('viewport').inert=page;
 for(const el of [studio,projects,contactLink])el.removeAttribute('aria-current');(active||bouActive?studio:contactActive?contactLink:projects).setAttribute('aria-current','page');
 const route=bouActive?location.hash:active?'about':contactActive?'contact':'projects';
 bouClose.hidden=!bouActive;
 bouClose.setAttribute('aria-label',location.hash.startsWith('#bou-works/')?'Back to Bou Works':'Back to About Us');
 if(bouActive){document.getElementById('main-nav').classList.remove('menu-open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false');const destination=location.hash;const restoreTop=bouScrollPositions.get(destination)||0;
 renderBou(destination.slice(11)).then(()=>{if(location.hash===destination&&!bou.hidden){bou.scrollTo({top:restoreTop,left:0,behavior:'instant'});document.documentElement.removeAttribute('data-route-pending');}});}
 if(page&&!bouActive&&shownRoute!==route)panel.scrollTo({top:0,left:0,behavior:'instant'});
 shownRoute=route;
 if(page){closeSearch();document.querySelectorAll('dialog[open]').forEach(d=>d.close());panel.focus({preventScroll:true});}
 updateTitle();
 if(!bouActive&&!location.hash.startsWith('#project/'))document.documentElement.removeAttribute('data-route-pending');
}

studio.onclick=()=>{if(location.hash!=='#about')location.hash='about';else about.scrollTo({top:0,behavior:'smooth'});};
const fromOtherSection=()=>document.body.matches('.view-about,.view-contact');
projects.onclick=()=>{const fromSection=fromOtherSection();location.hash='projects';showRoute();originalProjects?.({fromSection});};
document.querySelector('.about-work[href="#projects"]').onclick=e=>{e.preventDefault();projects.click();};
brand.onclick=e=>{e.preventDefault();const fromSection=fromOtherSection();closeSearch();location.hash='projects';showRoute();originalProjects?.({fromSection,resetIntro:true});};
contactLink.onclick=()=>{if(location.hash==='#contact')contact.scrollTo({top:0,behavior:'smooth'});};
addEventListener('hashchange',showRoute);
const track=document.querySelector('.about-feed-track');
for(const post of journalPosts){const a=document.createElement('a');a.href=post.url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${post.alt}; visit Jou and Bou on Instagram`);const img=document.createElement('img');img.src=post.image;img.alt=post.alt;img.width=post.width;img.height=post.height;img.loading='lazy';img.decoding='async';a.append(img);track.append(a);}
const prev=document.getElementById('feed-prev'),next=document.getElementById('feed-next');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function move(d){track.scrollBy({left:track.clientWidth*d,behavior:reduced?'instant':'smooth'});}prev.onclick=()=>move(-1);next.onclick=()=>move(1);function controls(){prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}track.addEventListener('scroll',controls,{passive:true});addEventListener('resize',controls);new ResizeObserver(controls).observe(track);controls();

const searchToggle=document.getElementById('search-toggle'),searchWrap=document.querySelector('.search-wrap'),searchInput=document.getElementById('search');
function closeSearch(){searchInput.value='';document.getElementById('search-clear').hidden=true;document.getElementById('results').replaceChildren();document.body.classList.remove('search-open');searchToggle.setAttribute('aria-expanded','false');searchInput.inert=true;searchInput.tabIndex=-1;document.getElementById('results').hidden=true;searchInput.setAttribute('aria-expanded','false');}
searchToggle.onclick=()=>{if(location.hash==='#about'||location.hash==='#contact'||location.hash.startsWith('#bou-works')){history.pushState(null,'','#projects');showRoute();}const open=!document.body.classList.contains('search-open');document.body.classList.toggle('search-open',open);searchToggle.setAttribute('aria-expanded',String(open));if(open){searchInput.value='';document.getElementById('search-clear').hidden=true;document.getElementById('results').replaceChildren();document.getElementById('results').hidden=true;searchInput.inert=false;searchInput.tabIndex=0;searchInput.focus();}else closeSearch();};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search-wrap,#search-toggle'))closeSearch();});
searchWrap.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();searchToggle.focus();}});
document.getElementById('results').addEventListener('click',e=>{if(e.target.closest('button'))closeSearch();});
addEventListener('hashchange',closeSearch);addEventListener('popstate',showRoute);

closeSearch();showRoute();

track.tabIndex=0;track.setAttribute('aria-label','12 architectural photographs; swipe or use arrow keys to browse');track.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
