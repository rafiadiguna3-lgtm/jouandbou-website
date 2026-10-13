const reduced=matchMedia('(prefers-reduced-motion: reduce)'),ease='cubic-bezier(.22,1,.36,1)';
const header=document.querySelector('body > header'),marker=document.createComment('Shared studio header');header.before(marker);
const menu=header.querySelector('#menu-toggle'),nav=header.querySelector('nav');let active=null,deferred=null,bypass=false,animations=[],origin=null;
function cancel(){animations.forEach(a=>a.cancel());animations=[];}
function animate(){}
function returnHeader(){marker.after(header);header.classList.remove('detail-header-context');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Toggle navigation');nav.inert=false;nav.removeAttribute('aria-hidden');active=null;cancel();}
header.addEventListener('click',e=>{if(!active||bypass)return;const target=e.target.closest('.brand,nav button,nav a,#menu-toggle');if(!target)return;e.preventDefault();e.stopImmediatePropagation();if(active.classList.contains('is-closing'))return;deferred=target===menu?null:target;active.close();},{capture:true});
for(const panel of document.querySelectorAll('.project-fullpage')){
 panel.querySelector('.project-return-nav')?.remove();const close=panel.querySelector('.project-close');
 close.innerHTML='<span class="header-cross-line"></span><span class="header-cross-line"></span><span class="header-cross-line"></span>';
 const show=panel.showModal.bind(panel);
 panel.showModal=()=>{cancel();deferred=null;if(active&&active!==panel)returnHeader();const back=document.getElementById('back');origin=back&&!back.hidden?back.getBoundingClientRect():null;show();active=panel;panel.prepend(header);header.classList.add('detail-header-context','detail-paper-header');nav.classList.remove('menu-open');nav.inert=true;nav.setAttribute('aria-hidden','true');const mobile=getComputedStyle(menu).display!=='none';close.hidden=mobile;menu.setAttribute('aria-label','Close project');menu.setAttribute('aria-expanded','true');const control=mobile?menu:close,rect=control.getBoundingClientRect(),dy=origin&&origin.height?Math.max(0,origin.top-rect.top):48;animate(control,[{transform:`translateY(${dy}px)`,opacity:0},{transform:'translateY(0)',opacity:1}],520);};
 panel.addEventListener('project-will-close',()=>{cancel();const control=close.hidden?menu:close,rect=control.getBoundingClientRect(),dy=origin&&origin.height?Math.max(0,origin.top-rect.top):48;animate(control,[{opacity:1},{opacity:0}],280);});
 panel.addEventListener('close',()=>{if(active!==panel)return;const destination=deferred;deferred=null;returnHeader();if(destination){bypass=true;destination.click();bypass=false;}});
}
