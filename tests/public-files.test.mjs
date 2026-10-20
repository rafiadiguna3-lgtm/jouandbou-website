import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {assertPublicFiles,sensitivePublicPath} from '../scripts/public-files.mjs';

test('private file patterns are rejected, normal public assets and certificate paths allowed',()=>{
 for(const path of ['.env','app/.env.local','.git/config','config/.ENV.old','backup/data.sql','private.key','site.tar.bak'])assert.equal(sensitivePublicPath(path),true,path);
 for(const path of ['assets/house.bin','app.mjs','_headers','.well-known/cf-custom-hostname-challenge/token','assets/model.glb'])assert.equal(sensitivePublicPath(path),false,path);
});
test('public tree validation stops nested secrets and symlink escapes',async()=>{
 const root=await mkdtemp(join(tmpdir(),'jnb-public-'));
 try{
  await mkdir(join(root,'app'));await writeFile(join(root,'index.html'),'public');await assertPublicFiles(root);
  await writeFile(join(root,'app/.env'),'test fixture');await assert.rejects(assertPublicFiles(root),/Unsafe public deploy path/);
  await rm(join(root,'app/.env'));await symlink(join(root,'index.html'),join(root,'linked.html'));await assert.rejects(assertPublicFiles(root),/Unsafe public deploy path/);
 }finally{await rm(root,{recursive:true,force:true});}
});
