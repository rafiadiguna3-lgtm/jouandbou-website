export function landscapeModelScale(bounds,yaw,pitch,view,zoom=1){
 const co=Math.cos(yaw),si=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),xs=[],ys=[];
 for(const x of [bounds.min[0],bounds.max[0]])for(const y of [bounds.min[1],bounds.max[1]])for(const z of [bounds.min[2],bounds.max[2]]){xs.push(x*co-z*si);ys.push(y*cp-(x*si+z*co)*sp);}
 return Math.min(view.width*.82/Math.max(.1,Math.max(...xs)-Math.min(...xs)),view.height*.82/Math.max(.1,Math.max(...ys)-Math.min(...ys)))*zoom;
}
