// Best effort: storage restrictions never block photographs or the site.
if('serviceWorker' in navigator&&isSecureContext){
 navigator.serviceWorker.register('./photo-offline-sw.js?v=128',{scope:'./'}).catch(()=>{});
}
