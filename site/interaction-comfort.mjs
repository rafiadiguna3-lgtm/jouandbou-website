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
