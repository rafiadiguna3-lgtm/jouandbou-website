// A film belongs to one open project. Closing releases network, buffers and Blob URLs.
const sessions=new WeakMap(),active=new Set();
const abortError=()=>new DOMException('Film cancelled','AbortError');
function waitFor(target,event,signal,timeout=15000){return new Promise((resolve,reject)=>{
 let timer;const finish=error=>{clearTimeout(timer);target.removeEventListener(event,done);target.removeEventListener('error',fail);signal.removeEventListener('abort',cancel);error?reject(error):resolve();};
 const done=()=>finish(),fail=()=>finish(Error('Film unavailable')),cancel=()=>finish(abortError());
 target.addEventListener(event,done,{once:true});target.addEventListener('error',fail,{once:true});signal.addEventListener('abort',cancel,{once:true});timer=setTimeout(()=>finish(Error('Film timeout')),timeout);if(signal.aborted)cancel();
});}
function delay(signal){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{signal.removeEventListener('abort',cancel);resolve();},350);const cancel=()=>{clearTimeout(timer);signal.removeEventListener('abort',cancel);reject(abortError());};signal.addEventListener('abort',cancel,{once:true});if(signal.aborted)cancel();});}
export function releaseFilm(video){const state=sessions.get(video);if(!state)return;sessions.delete(video);active.delete(video);state.controller.abort();try{video.pause();}catch{}try{if(state.buffer?.updating)state.buffer.abort();}catch{}video.removeAttribute('src');try{video.load();}catch{}if(state.url)URL.revokeObjectURL(state.url);state.url=null;state.media=null;state.buffer=null;}
export function prepareFilm(video=document.getElementById('project-film'),folder='assets/marboy/'){
 if(sessions.has(video))return sessions.get(video).job;
 // Never retain decoded films belonging to a previous project.
 for(const previous of [...active])if(previous!==video)releaseFilm(previous);
 const state={controller:new AbortController(),url:null,media:null,buffer:null,job:null};sessions.set(video,state);active.add(video);const signal=state.controller.signal,base=folder+'film-hq/';
 const request=async path=>{const response=await fetch(path,{signal});if(!response.ok)throw Error('Film unavailable');return response;};
 const live=()=>{if(signal.aborted||sessions.get(video)!==state)throw abortError();};
 state.job=(async()=>{try{
  const manifest=await (await request(base+'manifest.json')).json();live();
  if(window.MediaSource&&MediaSource.isTypeSupported(manifest.mime)){
   const media=state.media=new MediaSource();state.url=URL.createObjectURL(media);const opened=waitFor(media,'sourceopen',signal);video.src=state.url;await opened;live();const buffer=state.buffer=media.addSourceBuffer(manifest.mime);
   for(const name of manifest.parts){
    while(buffer.buffered.length&&buffer.buffered.end(buffer.buffered.length-1)-video.currentTime>20)await delay(signal);
    const bytes=await (await request(base+name)).arrayBuffer();live();const appended=waitFor(buffer,'updateend',signal);try{buffer.appendBuffer(bytes);}catch(error){appended.catch(()=>{});throw error;}await appended;
    if(video.currentTime>30&&buffer.buffered.length&&buffer.buffered.start(0)<video.currentTime-25){const trimmed=waitFor(buffer,'updateend',signal);try{buffer.remove(0,video.currentTime-15);}catch(error){trimmed.catch(()=>{});throw error;}await trimmed;}
   }
   live();if(media.readyState==='open')media.endOfStream();return true;
  }
  // Native iPhone fallback: one sequential, cancellable download instead of all parts in parallel.
  let parts=[];for(const name of manifest.parts){parts.push(await (await request(base+name)).arrayBuffer());live();}
  state.url=URL.createObjectURL(new Blob(parts,{type:'video/mp4'}));parts=[];live();video.src=state.url;video.load();return true;
 }catch(error){if(sessions.get(video)===state)releaseFilm(video);return false;}})();return state.job;
}
