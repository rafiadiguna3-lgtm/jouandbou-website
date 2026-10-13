// Wheel events do not expose device type; retain a stable intent per gesture.
export function wheelIntent(event,previous){
 const time=event.timeStamp;
 if(event.ctrlKey||event.metaKey)return {kind:'zoom',time};
 if(previous&&time-previous.time<180)return {...previous,time};
 const pixel=event.deltaMode===0;
 const continuous=pixel&&(Math.abs(event.deltaX)>.1||Math.abs(event.deltaY)<50||!Number.isInteger(event.deltaY));
 return {kind:continuous?'pan':'zoom',time};
}
export function panDelta(dx,dy,camera){
 const co=Math.cos(camera.yaw),si=Math.sin(camera.yaw),sp=Math.sin(camera.pitch),scale=camera.scale;
 return {x:(dx*co+dy/sp*si)/scale,z:(-dx*si+dy/sp*co)/scale};
}
