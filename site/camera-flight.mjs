// Restrained travel with zero speed and acceleration at both ends.
export function cameraFlight(from,to,start=0,{viewportDiagonal=1000}={}) {
  const turn=(a,b)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a));
  to={...to,yaw:turn(from.yaw,to.yaw)};
  const distance=Math.hypot(to.x-from.x,to.z-from.z);
  const screenTravel=distance*Math.min(from.scale,to.scale)/Math.max(1,viewportDiagonal);
  const zoomDistance=Math.abs(Math.log(to.scale/from.scale));
  const duration=Math.min(680,380+Math.min(1,screenTravel)*130+Math.min(2,zoomDistance)*80+Math.abs(to.pitch-from.pitch)*45);
  return {from:{...from},to,start,duration};
}
export function sampleCameraFlight(flight,now) {
  const p=Math.max(0,Math.min(1,(now-flight.start)/flight.duration));
  const eased=p*p*p*(p*(p*6-15)+10),state={};
  for(const key of Object.keys(flight.from)) state[key]=key==='scale'
    ? Math.exp(Math.log(flight.from.scale)+(Math.log(flight.to.scale)-Math.log(flight.from.scale))*eased)
    : flight.from[key]+(flight.to[key]-flight.from[key])*eased;
  return {state,done:p===1};
}
