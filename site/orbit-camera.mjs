// Derive the target from the current orbit angle, so easing never moves the pivot.
export function centerOrbitCamera(camera,bounds,placement,view,width,height){
 const {min:lo,max:hi}=bounds;
 const sy=Math.sin(camera.yaw),cy=Math.cos(camera.yaw),sp=Math.sin(camera.pitch),cp=Math.cos(camera.pitch);
 const dx=(view.x-width/2)/camera.scale,dy=(height/2-view.y)/camera.scale;
 camera.x=placement[0]+(lo[0]+hi[0])/2-cy*dx+sy*sp*dy;
 camera.y=(lo[1]+hi[1])/2-cp*dy;
 camera.z=placement[1]+(lo[2]+hi[2])/2+sy*dx+cy*sp*dy;
 return camera;
}
