// Keep the annotation attached to the projected roof while the map settles.
export function calloutLayout(anchor,width,height,cardWidth,scale=1,shape=null){
 const ax=anchor[0],ay=anchor[1];
 const right=ax+cardWidth*scale>width-12;
 const left=right?ax-cardWidth*scale:ax;
 const clearance=shape?Math.max(18*scale,Math.min(56*scale,shape.height*.14+shape.span*.06)):92*scale;
 const top=shape?Math.min(ay-80*scale,shape.roofTop-48*scale-clearance):ay-48*scale-clearance;
 const join=right?left+(cardWidth-1)*scale:left+scale;
 return {left,top,join,ax,ay,right};
}
export function createHouseCallout(onActivate,onBrowse){
 const node=document.createElement('div');node.className='house-callout';node.setAttribute('aria-hidden','true');
 node.innerHTML='<svg class="house-callout-leader" aria-hidden="true"><path/></svg><button class="house-callout-card" type="button" tabindex="-1"><svg class="house-callout-frame" viewBox="0 0 180 48" preserveAspectRatio="none" aria-hidden="true"><path d="M.5 .5H179.5V34.5H13L.5 47Z"/></svg><span class="house-callout-old" aria-hidden="true"></span><span class="house-callout-name"></span></button>';
 document.body.append(node);
 const card=node.querySelector('button'),leader=node.querySelector('.house-callout-leader path'),name=node.querySelector('.house-callout-name'),old=node.querySelector('.house-callout-old'),frame=node.querySelector('.house-callout-frame'),framePath=frame.querySelector('path');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let selected=-1,textWidth=0,target=null,display=null,raf=0,lastTime=0,opensLeft=false,textAnimations=[];
 let gesture=null,suppressClick=false;
 card.style.touchAction='pan-y';
 card.addEventListener('pointerdown',e=>{if(!onBrowse||e.button!==0)return;suppressClick=false;gesture={id:e.pointerId,x:e.clientX,y:e.clientY};card.setPointerCapture(e.pointerId);});
 card.addEventListener('pointerup',e=>{if(!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;if(Math.abs(dx)>30&&Math.abs(dx)>Math.abs(dy)*1.2){suppressClick=true;e.preventDefault();onBrowse(dx<0?1:-1);}});
 card.addEventListener('pointercancel',()=>{gesture=null;suppressClick=false;});
 card.addEventListener('click',e=>{if(suppressClick){suppressClick=false;e.preventDefault();return;}if(selected>=0)onActivate(selected)});
 function stopText(){textAnimations.forEach(a=>a?.cancel());textAnimations=[];}
 function paint(){
  const g=display,s=g.scale;frame.setAttribute('viewBox',`0 0 ${g.cw} 48`);framePath.setAttribute('d',`M.5 .5H${g.cw-.5}V34.5H13L.5 47Z`);
  g.left=opensLeft?target.ax-g.cw*s:target.ax;card.style.width=g.cw+'px';card.style.transform=`translate3d(${g.left}px,${g.top}px,0) scale(${s})`;
  leader.style.strokeWidth=String(s);leader.style.strokeDasharray=`${4*s} ${4*s}`;
  const join=opensLeft?g.left+(g.cw-1)*s:g.left+s,startY=g.top+47*s;
  leader.setAttribute('d',`M ${target.ax} ${startY} L ${target.ax} ${target.ay}`);
 }
 function tick(now){
  raf=0;if(!target)return;
  const dt=lastTime?Math.min(40,now-lastTime):16.7;lastTime=now;
  const ease=reduced.matches?1:1-Math.exp(-dt/75);let active=false;
  for(const key of ['top','cw','scale']){const delta=target[key]-display[key];if(Math.abs(delta)>.015){display[key]+=delta*ease;active=true;}else display[key]=target[key];}
  paint();if(active)raf=requestAnimationFrame(tick);else lastTime=0;
 }
 function hide(){selected=-1;target=null;display=null;textWidth=0;cancelAnimationFrame(raf);raf=0;lastTime=0;stopText();node.classList.remove('is-visible');node.setAttribute('aria-hidden','true');card.tabIndex=-1;}
 function update(id,label,code,anchor,width,height,visible,mapScale=14,shape=null){
  if(!visible||!anchor||!anchor.every(Number.isFinite)){hide();return;}
  const scale=Math.max(.08,mapScale/14),changed=selected!==id;
  if(changed){
   const previous=selected;stopText();old.textContent=name.textContent;name.textContent=label;selected=id;textWidth=Math.ceil(name.offsetWidth)+24;
   card.setAttribute('aria-label',`Explore ${label} in 3D`);
   // A stable tail side avoids flipping during the camera's centering animation.
   opensLeft=width/2+textWidth*scale>width-12;card.classList.toggle('opens-left',opensLeft);
   if(previous>=0&&!reduced.matches){const direction=id>previous?1:-1;const options={duration:180,easing:'ease-out'};textAnimations=[old.animate?.([{opacity:1},{opacity:0}],options),name.animate?.([{opacity:0},{opacity:1}],options),leader.animate?.([{opacity:0,offset:0},{opacity:0,offset:.35},{opacity:1,offset:1}],{...options,duration:320})];}
  }
  const g=calloutLayout(anchor,width,height,textWidth,scale,shape);
  g.left=opensLeft?g.ax-textWidth*scale:g.ax;
  target={...g,cw:textWidth,scale};
  if(!display){display={...target};paint();node.classList.add('is-visible');}
  node.setAttribute('aria-hidden','false');card.tabIndex=0;
  if(!raf)raf=requestAnimationFrame(tick);
 }
 return {update,hide};
}
