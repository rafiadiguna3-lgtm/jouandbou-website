// Restrained travel with zero speed and acceleration at both ends.
export function cameraFlight(from,to,start=0,{viewportDiagonal=1000,focus=null,durationScale=1}={}) {
  const turn=(a,b)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a));
  to={...to,yaw:turn(from.yaw,to.yaw)};
  const distance=Math.hypot(to.x-from.x,to.z-from.z);
  const screenTravel=distance*Math.min(from.scale,to.scale)/Math.max(1,viewportDiagonal);
  const zoomDistance=Math.abs(Math.log(to.scale/from.scale));
  const duration=durationScale*Math.min(1100,450+Math.min(1,screenTravel)*260+Math.min(2,zoomDistance)*110+Math.abs(to.yaw-from.yaw)*120+Math.abs(to.pitch-from.pitch)*80);
  const relative=c=>{const dx=focus[0]-c.x,dy=focus[1]-c.y,dz=focus[2]-c.z,co=Math.cos(c.yaw),si=Math.sin(c.yaw),cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);return [(dx*co-dz*si)*c.scale,(dy*cp-(dx*si+dz*co)*sp)*c.scale,dx*si*cp+dy*sp+dz*co*cp];};
  return {from:{...from},to,start,duration,focus:focus&&[...focus],screenFrom:focus&&relative(from),screenTo:focus&&relative(to)};
}
export function sampleCameraFlight(flight,now) {
  const p=Math.max(0,Math.min(1,(now-flight.start)/flight.duration));
  const eased=p*p*p*(p*(p*6-15)+10),state={};
  for(const key of Object.keys(flight.from)) state[key]=key==='scale'
    ? Math.exp(Math.log(flight.from.scale)+(Math.log(flight.to.scale)-Math.log(flight.from.scale))*eased)
    : flight.from[key]+(flight.to[key]-flight.from[key])*eased;
  if(flight.focus){
    // Interpolate the house's projected location, avoiding zoom-induced arcs.
    const [u,v,depth]=flight.screenFrom.map((value,i)=>value+(flight.screenTo[i]-value)*eased);
    const co=Math.cos(state.yaw),si=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch),x=u/state.scale,y=v/state.scale;
    state.x=flight.focus[0]-(x*co-y*si*sp+depth*si*cp);
    state.y=flight.focus[1]-(y*cp+depth*sp);
    state.z=flight.focus[2]-(-x*si-y*co*sp+depth*co*cp);
  }
  return {state,done:p===1};
}
