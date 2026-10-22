document.addEventListener('click',async event=>{
 const button=event.target.closest?.('button[data-share-url]');if(!button)return;
 const data={title:button.dataset.shareTitle,url:button.dataset.shareUrl},root=button.closest('.project-share'),feedback=root.querySelector('.share-feedback');feedback.textContent='';root.querySelector('input')?.remove();
 if(navigator.share){try{await navigator.share(data);return;}catch(error){if(error.name==='AbortError')return;}}
 try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(data.url);feedback.textContent='Link copied';}
 catch{const input=document.createElement('input');input.value=data.url;input.readOnly=true;input.setAttribute('aria-label','Project link — select and copy');root.append(input);input.focus();input.select();feedback.textContent='Copy this link';}
});
