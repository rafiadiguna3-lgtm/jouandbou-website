// A bounded camera move: gentle acceleration, logarithmic zoom, soft landing.
export function cameraFlight(from,to,start=0) {
  const turn=(a,b)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a));
  to={...to,yaw:turn(from.yaw,to.yaw)};
  const distance=Math.hypot(to.x-from.x,to.z-from.z);
  const zoomDistance=Math.abs(Math.log(to.scale/from.scale));
  return {from:{...from},to,start,duration:Math.min(460,340+distance*.4+zoomDistance*25)};
}
export function sampleCameraFlight(flight,now) {
  const p=Math.max(0,Math.min(1,(now-flight.start)/flight.duration));
  const eased=(1-(1+8*p)*Math.exp(-8*p))/(1-9*Math.exp(-8)),state={};
  for(const key of Object.keys(flight.from)) state[key]=key==='scale'
    ? Math.exp(Math.log(flight.from.scale)+(Math.log(flight.to.scale)-Math.log(flight.from.scale))*eased)
    : flight.from[key]+(flight.to[key]-flight.from[key])*eased;
  return {state,done:p===1};
}
