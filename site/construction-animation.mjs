const panel=document.getElementById('jh37'),frame=document.getElementById('jh37-frame');
function showFirstFrame(){
 const house=Number(panel.dataset.house||37);
 frame.setAttribute('href',[37,39].includes(house)?`assets/jh${house}/scene-1.webp`:`assets/jh${house}/construction-1.webp`);
 panel.dataset.buildStage='0';
 panel.classList.toggle('source-construction',![37,39].includes(house));
 panel.classList.toggle('complete-scene',house===39);
 panel.querySelector('#jh37-art-title').textContent=`JH${house} construction illustration`;
 panel.querySelector('.clouds').removeAttribute('transform');
 for(const caption of panel.querySelectorAll('[data-typewriter]')){caption.textContent=caption.dataset.typewriter;caption.classList.remove('typing');}
}
new MutationObserver(()=>{if(panel.open)showFirstFrame();}).observe(panel,{attributes:true,attributeFilter:['open','data-house']});
showFirstFrame();
