export function createRotationTipGate(storage){
 let used=false;try{used=storage?.getItem('jnb-rotate-tip-seen-v1')==='1';}catch{}
 return {take(){if(used)return false;used=true;try{storage?.setItem('jnb-rotate-tip-seen-v1','1');}catch{}return true;}};
}
