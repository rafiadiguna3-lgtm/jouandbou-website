// Leave native text selection available only for project copy and form inputs.
const editable = 'input,textarea,[contenteditable="true"]';
const projectCopy = 'body.model-view #focus h1,body.model-view #focus p,body.model-view #focus h2,dialog h1,dialog h2,dialog h3,dialog p,dialog small,dialog figcaption,dialog .slide-caption > span';
const elementFor = target => target.closest ? target : target.parentElement;
const canSelect = target => {
  const element = elementFor(target);
  return !!element?.closest(`${editable},${projectCopy}`) && !element.closest('button,img,video,canvas,svg');
};
let touchPress = null;
document.addEventListener('pointerdown', event => {
  document.body.dataset.inputMode = 'pointer';
  touchPress = event.pointerType === 'touch' ? {started: performance.now()} : null;
  if (!canSelect(event.target)) document.getSelection()?.removeAllRanges();
}, {capture:true, passive:true});
document.addEventListener('keydown', () => {
  document.body.dataset.inputMode = 'keyboard';
  touchPress = null;
}, {capture:true});
document.addEventListener('selectstart', event => {
  // A deliberate long press can copy project text; a quick tap cannot select the card.
  if (!canSelect(event.target) || (touchPress && !elementFor(event.target)?.closest(editable) && performance.now() - touchPress.started < 350)) event.preventDefault();
});
document.addEventListener('dragstart', event => {
  if (!event.target.closest?.(editable)) event.preventDefault();
});
document.addEventListener('contextmenu', event => {
  if (event.target.closest?.('img,video,canvas,svg')) event.preventDefault();
});
// Cancel browser double-tap zoom without consuming either project activation.
// Canvas double taps still reach the existing normal-view reset handler.
document.addEventListener('dblclick', event => event.preventDefault());

// Native image cursors follow the pointer without a JavaScript animation loop.
const cursorArrow=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M4 3 27 12 17 16 25 25Q27 28 24 29Q22 30 20 27L13 19 9 28Z" fill="#111217" stroke="white" stroke-width="3" stroke-linejoin="round"/></svg>`;
const cursorCircle=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="9" fill="#111217" stroke="white" stroke-width="2"/></svg>`;
const cursorURL=svg=>`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const cursorStyle=document.createElement('style');
cursorStyle.textContent=`@media (hover:hover) and (pointer:fine){
 html[data-desktop-cursor],html[data-desktop-cursor] *{cursor:${cursorURL(cursorArrow)} 4 3,auto!important}
 html[data-desktop-cursor="idle"] :is(input,textarea,[contenteditable="true"]){cursor:text!important}
 html[data-desktop-cursor="pressed"],html[data-desktop-cursor="pressed"] *{cursor:${cursorURL(cursorCircle)} 12 12,auto!important}
}`;
document.head.append(cursorStyle);
const desktopCursor=matchMedia('(hover:hover) and (pointer:fine)');
const cursorRoot=document.documentElement;
function releaseCursor(){if(cursorRoot.hasAttribute('data-desktop-cursor'))cursorRoot.dataset.desktopCursor='idle';}
document.addEventListener('pointermove',event=>{
 if(event.pointerType==='mouse'&&desktopCursor.matches&&!cursorRoot.hasAttribute('data-desktop-cursor'))cursorRoot.dataset.desktopCursor='idle';
},{passive:true});
document.addEventListener('pointerdown',event=>{
 if(event.pointerType==='mouse'&&event.button===0&&desktopCursor.matches)cursorRoot.dataset.desktopCursor='pressed';
 else if(event.pointerType!=='mouse')cursorRoot.removeAttribute('data-desktop-cursor');
},{capture:true,passive:true});
for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,releaseCursor,{capture:true,passive:true});
window.addEventListener('blur',releaseCursor);
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseCursor();});
document.addEventListener('pointerout',event=>{if(!event.relatedTarget)releaseCursor();},{passive:true});
desktopCursor.addEventListener('change',()=>{if(!desktopCursor.matches)cursorRoot.removeAttribute('data-desktop-cursor');});
