// A single footer follows project dialogs into the browser's modal top layer.
(()=>{
 const footer=document.getElementById('site-footer');
 const header=document.querySelector('header');
 if(!footer)return;
 function align(){
  if(!header||header.getBoundingClientRect().width===0)return;
  const image=header.querySelector('.brand img'),rect=image?.getBoundingClientRect();
  // The supplied SVG's black mark starts at x=78 in viewBox 58 42 64 64.
  const left=rect?rect.left+(image.getAttribute('src')?.includes('header-mark.svg')?rect.width*20/64:0):16;
  const menu=header.querySelector('#menu-toggle'),menuBox=menu?.getBoundingClientRect();
  let right=innerWidth-header.getBoundingClientRect().right+parseFloat(getComputedStyle(header).paddingRight);
  if(menuBox?.width){const stroke=menu.querySelector('span');const width=stroke?.getBoundingClientRect().width||18;right=innerWidth-(menuBox.left+menuBox.width/2+width/2);}
  if(!Number.isFinite(left)||!Number.isFinite(right)||left>innerWidth/3||right>innerWidth/3)return;
  document.documentElement.style.setProperty('--jb-footer-left',`${Math.max(16,left)}px`);
  document.documentElement.style.setProperty('--jb-footer-right',`${Math.max(16,right)}px`);
 }
 function place(){
  const dialogs=[...document.querySelectorAll('dialog.project-page[open],dialog.project-fullpage[open],dialog#detail[open]')];
  const target=dialogs.at(-1)||document.body;
  if(footer.parentElement!==target)target.append(footer);
  align();
 }
 new MutationObserver(place).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 const resize=new ResizeObserver(align);if(header){resize.observe(header);const image=header.querySelector('.brand img');if(image)resize.observe(image);}
 addEventListener('resize',align,{passive:true});
 place();
})();
