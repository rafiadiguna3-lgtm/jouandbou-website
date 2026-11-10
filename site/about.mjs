import {routeHash,routeProject,writeRoute,routeSection} from './project-routing.mjs';
import {metadata} from './project-seo.mjs';
import {renderBou} from './bou.mjs?v=148';
import './contact-map.mjs?v=141';
import {journalPosts} from './about-journal.mjs';
const about=document.getElementById('about-page'),studio=document.getElementById('studio'),projects=document.getElementById('projects'),brand=document.querySelector('.brand');
const originalProjects=projects.onclick;
const contact=document.getElementById('contact-page'),contactLink=document.getElementById('contact');
const bou=document.getElementById('bou-page');
const bouClose=document.createElement('button');
bouClose.id='bou-close';bouClose.type='button';bouClose.hidden=true;bouClose.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
brand.closest('header').append(bouClose);
let bouOrigin='about';
function closeBou(){
 if(routeHash().startsWith('#bou-works/'))location.hash='bou-works';
 else if(bouOrigin==='projects')brand.click();
 else location.hash='about';
}
bouClose.onclick=closeBou;
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('view-bou')){event.preventDefault();closeBou();}});
let shownRoute;
const bouScrollPositions=new Map();
const homeTitle = 'jou and bou studio';
function updateTitle(){const project=routeProject(),section=routeSection();if(project||section){document.title=metadata(project||section).title;return;}document.title=routeHash()==='#contact'?'contact us | jou and bou studio':document.querySelector('dialog.project-page[open],dialog#detail[open]')?'project details | jou and bou studio':homeTitle;}
for(const panel of document.querySelectorAll('dialog.project-page,dialog#detail'))new MutationObserver(updateTitle).observe(panel,{attributes:true,attributeFilter:['open']});
function showRoute(){
 if(/^#bou(?:\/|$)/.test(routeHash()))history.replaceState(null,'',routeHash().replace(/^#bou/,'#bou-works'));
 if(shownRoute?.startsWith('#bou-works')&&shownRoute!==routeHash()&&!bou.hidden)bouScrollPositions.set(shownRoute,bou.scrollTop);
 const active=routeHash()==='#about',contactActive=routeHash()==='#contact',bouActive=/^#bou-works(?:\/|$)/.test(routeHash()),page=active||contactActive||bouActive;
 if(bouActive&&!shownRoute?.startsWith('#bou-works')&&shownRoute)bouOrigin=shownRoute==='projects'?'projects':'about';
 const panel=active?about:contactActive?contact:bou;
 about.hidden=!active;contact.hidden=!contactActive;bou.hidden=!bouActive;
 document.body.classList.toggle('view-about',active||bouActive);document.body.classList.toggle('view-bou',bouActive);document.body.classList.toggle('view-contact',contactActive);
 document.getElementById('viewport').inert=page;
 for(const el of [studio,projects,contactLink,document.getElementById('concepts')])el?.removeAttribute('aria-current');(bouActive?document.getElementById('concepts'):active?studio:contactActive?contactLink:projects).setAttribute('aria-current','page');
 const route=bouActive?routeHash():active?'about':contactActive?'contact':'projects';
 bouClose.hidden=!bouActive;
 bouClose.setAttribute('aria-label',routeHash().startsWith('#bou-works/')?'Back to Bou Works':bouOrigin==='projects'?'Back to Home':'Back to About Us');
 if(bouActive){document.getElementById('main-nav').classList.remove('menu-open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false');const destination=routeHash();const restoreTop=bouScrollPositions.get(destination)||0;
 renderBou(destination.slice(11)).then(()=>{if(routeHash()===destination&&!bou.hidden){bou.scrollTo({top:restoreTop,left:0,behavior:'instant'});document.documentElement.removeAttribute('data-route-pending');}});}
 if(page&&!bouActive&&shownRoute!==route)panel.scrollTo({top:0,left:0,behavior:'instant'});
 shownRoute=route;
 if(page){closeSearch();document.querySelectorAll('dialog[open]').forEach(d=>d.close());panel.focus({preventScroll:true});}
 updateTitle();
 if(!bouActive&&!routeHash().startsWith('#project/'))document.documentElement.removeAttribute('data-route-pending');
}

studio.onclick=event=>{event?.preventDefault();if(routeHash()!=='#about'){writeRoute('#about');showRoute();}else about.scrollTo({top:0,behavior:'smooth'});};
const fromOtherSection=()=>document.body.matches('.view-about,.view-contact');
projects.onclick=event=>{event?.preventDefault?.();const fromSection=fromOtherSection(),firstProject=document.body.classList.contains('touch-layout')&&document.getElementById('main-nav').classList.contains('menu-open');writeRoute('#projects',{section:true});showRoute();originalProjects?.({fromSection,firstProject});};
document.querySelector('.about-work[href="/jou-works/"]').onclick=e=>{e.preventDefault();projects.click();};
brand.onclick=e=>{e.preventDefault();const fromSection=fromOtherSection();closeSearch();writeRoute('#projects');showRoute();originalProjects?.({fromSection,resetIntro:true});};
contactLink.onclick=()=>{if(routeHash()==='#contact')contact.scrollTo({top:0,behavior:'smooth'});};
addEventListener('hashchange',showRoute);
const track=document.querySelector('.about-feed-track');
for(const post of journalPosts){const a=document.createElement('a');a.href=post.url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${post.alt}; visit Jou and Bou on Instagram`);const img=document.createElement('img');img.src=post.image;img.alt=post.alt;img.width=post.width;img.height=post.height;img.loading='lazy';img.decoding='async';a.append(img);track.append(a);}
const prev=document.getElementById('feed-prev'),next=document.getElementById('feed-next');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function move(d){track.scrollBy({left:track.clientWidth*d,behavior:reduced?'instant':'smooth'});}prev.onclick=()=>move(-1);next.onclick=()=>move(1);function controls(){prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}track.addEventListener('scroll',controls,{passive:true});addEventListener('resize',controls);new ResizeObserver(controls).observe(track);controls();

const searchToggle=document.getElementById('search-toggle'),searchWrap=document.querySelector('.search-wrap'),searchInput=document.getElementById('search');
function closeSearch(){const phone=document.body.classList.contains('touch-layout');searchToggle.tabIndex=phone?-1:0;searchToggle.setAttribute('aria-hidden',String(phone));document.getElementById('phone-search-action').setAttribute('aria-expanded','false');searchInput.value='';document.getElementById('search-clear').hidden=true;document.getElementById('results').replaceChildren();document.body.classList.remove('search-open');searchToggle.setAttribute('aria-expanded','false');searchInput.inert=true;searchInput.tabIndex=-1;document.getElementById('results').hidden=true;searchInput.setAttribute('aria-expanded','false');}
searchToggle.onclick=()=>{if(routeHash()==='#about'||routeHash()==='#contact'||routeHash().startsWith('#bou-works')){writeRoute('#projects');showRoute();}const open=!document.body.classList.contains('search-open');document.body.classList.toggle('search-open',open);searchToggle.setAttribute('aria-expanded',String(open));if(open){searchInput.value='';document.getElementById('search-clear').hidden=true;document.getElementById('results').replaceChildren();document.getElementById('results').hidden=true;searchInput.inert=false;searchInput.tabIndex=0;searchInput.focus();}else closeSearch();};
document.getElementById('phone-search-action').onclick=()=>{const fromSection=fromOtherSection();writeRoute('#projects');showRoute();originalProjects?.({fromSection});searchWrap.hidden=false;document.getElementById('main-nav').classList.remove('menu-open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false');if(!document.body.classList.contains('search-open'))searchToggle.onclick();document.getElementById('phone-search-action').setAttribute('aria-expanded','true');};
document.getElementById('phone-search-close').onclick=()=>{closeSearch();document.getElementById('menu-toggle').focus();};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search-wrap,#search-toggle'))closeSearch();});
searchWrap.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();(document.body.classList.contains('touch-layout')?document.getElementById('menu-toggle'):searchToggle).focus();}});
document.getElementById('results').addEventListener('click',e=>{if(e.target.closest('button'))closeSearch();});
addEventListener('hashchange',closeSearch);addEventListener('popstate',showRoute);

closeSearch();showRoute();

track.tabIndex=0;track.setAttribute('aria-label','12 architectural photographs; swipe or use arrow keys to browse');track.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
