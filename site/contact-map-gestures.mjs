// Ordinary wheel/trackpad scrolling belongs to the page. Only pinch zooms.
export function contactMapGestures(container, map, vector) {
  let gesture = null, screenTouches = 0;
  const point = e => {
    const r = container.getBoundingClientRect();
    return [Number.isFinite(e.clientX) ? e.clientX-r.left : r.width/2,
      Number.isFinite(e.clientY) ? e.clientY-r.top : r.height/2];
  };
  const zoom = (value, at) => {
    const z = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), value));
    if (vector) map.easeTo({zoom:z, around:map.unproject(at), duration:0});
    else map.setZoomAround(map.containerPointToLatLng(at), z, {animate:false});
  };
  const wheel = e => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    if (gesture) return; // Safari must not apply the same pinch twice.
    const units = e.deltaMode===1 ? 16 : e.deltaMode===2 ? container.clientHeight : 1;
    zoom(map.getZoom()-Math.max(-100,Math.min(100,e.deltaY*units))*.012, point(e));
  };
  const touch = e => { screenTouches=e.touches.length; };
  const start = e => {
    if (screenTouches) return; // Native map handlers own touchscreen pinch.
    e.preventDefault();
    gesture={zoom:map.getZoom(), scale:e.scale||1, point:point(e)};
  };
  const change = e => {
    if (!gesture) return;
    e.preventDefault();
    zoom(gesture.zoom+Math.log2(Math.max(.01,e.scale||1)/gesture.scale),gesture.point);
  };
  const end = e => { if (gesture) e.preventDefault(); gesture=null; };
  const listeners=[['wheel',wheel,{passive:false}],['gesturestart',start,{passive:false}],
    ['gesturechange',change,{passive:false}],['gestureend',end,{passive:false}],
    ['touchstart',touch,{passive:true,capture:true}],['touchend',touch,{passive:true,capture:true}],['touchcancel',touch,{passive:true,capture:true}]];
  for (const [name,fn,options] of listeners) container.addEventListener(name,fn,options);
  return () => { for (const [name,fn,options] of listeners) container.removeEventListener(name,fn,options); gesture=null; };
}
