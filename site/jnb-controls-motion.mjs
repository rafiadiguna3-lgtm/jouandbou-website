// Press ring on the map controls + first-time rotate cue in 3D.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
// 1) press ring: re-trigger the CSS animation on every pointerdown
for (const button of document.querySelectorAll('.map-zoom button')) {
  button.addEventListener('pointerdown', () => {
    if (reduced.matches) return;
    button.classList.remove('is-pressed');
    void button.offsetWidth; // restart animation
    button.classList.add('is-pressed');
  }, {passive: true});
  button.addEventListener('animationend', e => {
    if (e.target === button || e.target.parentElement === button) button.classList.remove('is-pressed');
  });
}
// 2) rotate cue: shows once, the first time a house opens in 3D (see rotate-tip.mjs)
import('./rotate-tip.mjs?v=1').then(() => {
  const canvas = document.getElementById('map');
  let waiting = false;
  const announce = () => {
    const r = (document.getElementById('viewport') || canvas).getBoundingClientRect();
    const w = r.width, h = r.height;
    // central area of the screen, where the 3D house sits
    window.dispatchEvent(new CustomEvent('jnb-model-ready', {detail: {
      left: r.left + w * .22, right: r.right - w * .22, top: r.top + h * .2, bottom: r.top + h * .8
    }}));
  };
  const check = () => {
    if (!document.body.classList.contains('model-view')) { waiting = false; return; }
    if (waiting) return;
    waiting = true;
    setTimeout(() => { if (document.body.classList.contains('model-view')) announce(); }, 900);
  };
  new MutationObserver(check).observe(document.body, {attributes: true, attributeFilter: ['class']});
  // any real drag on the 3D view counts as "rotated" and dismisses the cue
  let down = null;
  addEventListener('pointerdown', e => { down = {x: e.clientX, y: e.clientY}; }, {capture: true, passive: true});
  addEventListener('pointermove', e => {
    if (!down || !document.body.classList.contains('model-view')) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 14) { window.dispatchEvent(new Event('jnb-model-rotate')); down = null; }
  }, {capture: true, passive: true});
  addEventListener('pointerup', () => { down = null; }, {capture: true, passive: true});
  check();
}).catch(() => {});
