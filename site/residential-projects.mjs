for(const id of ['rumah-anas','rumasoka','jangkrik','flute','zubair','rr-house','jh37']){
 const panel=document.getElementById(id),scroll=panel.querySelector('.project-scroll');
 let outside=false;
 panel.addEventListener('pointerdown',event=>{outside=event.target===panel;});
 panel.addEventListener('click',event=>{if(outside&&event.target===panel){const r=panel.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)panel.close();}outside=false;});
}
