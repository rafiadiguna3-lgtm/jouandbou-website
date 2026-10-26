// Keep the crawlable black favicon until a person interacts with the page.
// No user-agent detection and no timer-driven replacement during rendering.
const icon=document.getElementById('site-favicon');
const controller=new AbortController();
if(icon)icon.dataset.tabPreference='interaction';
function activate(event){
 if(!event.isTrusted)return;
 if(event.type==='keydown'&&(event.metaKey||event.ctrlKey||event.altKey))return;
 if(icon){icon.href='/assets/brand/jou-and-bou-white-48-v143.png?v=browser-tab-3';icon.sizes='48x48';}
 controller.abort();
}
for(const type of ['pointerdown','keydown','wheel'])addEventListener(type,activate,{capture:true,passive:true,signal:controller.signal});
