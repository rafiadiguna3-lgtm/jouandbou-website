import {readdir} from 'node:fs/promises';
import {join,relative} from 'node:path';

// Reject accidental deployment of server configuration, repository internals,
// private keys and backup/database dumps. Certificate verification files in
// .well-known remain valid public assets.
export function sensitivePublicPath(path){
 return path.split(/[\\/]/).some(part=>/^\.env(?:\.|$)/i.test(part)||/^(?:\.git|\.svn|\.hg|node_modules)$/i.test(part)||/\.(?:pem|key|p12|pfx|sql|sqlite|sqlite3|bak|backup|old)$/i.test(part));
}
export async function assertPublicFiles(root){
 async function visit(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
   const path=join(directory,entry.name),name=relative(root,path);
   if(sensitivePublicPath(name)||entry.isSymbolicLink())throw Error(`Unsafe public deploy path: ${name}`);
   if(entry.isDirectory())await visit(path);
  }
 }
 await visit(root);
}
