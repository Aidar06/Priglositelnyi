// Portable fallback: same Sites staging validator, native Windows tar instead of Git Bash.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const [validator,archive]=process.argv.slice(2);
if(!path.isAbsolute(validator||'')||!path.isAbsolute(archive||''))throw new Error('Absolute validator and archive paths required');
const stage=fs.mkdtempSync(path.join(root,'.package-stage-'));
function run(file,args){const r=spawnSync(file,args,{cwd:root,encoding:'utf8',windowsHide:true});if(r.status!==0)throw new Error(r.stderr||r.error?.message||'Packaging failed');return r.stdout.trim();}
const sha=run('git',['rev-parse','HEAD']);
if(run('git',['status','--porcelain']))throw new Error('Commit all source changes before packaging');
const buildKind=run(process.execPath,[validator,root,path.join(stage,'dist')]);
if(buildKind!=='static')throw new Error('This fallback supports static sites only');
run('C:/Windows/System32/tar.exe',['-czf',archive,'-C',stage,'dist']);
const entries=run('C:/Windows/System32/tar.exe',['-tzf',archive]);
if(!entries.split(/\r?\n/).includes('dist/.openai/hosting.json'))throw new Error('Archive manifest missing');
if(sha!==run('git',['rev-parse','HEAD'])||run('git',['status','--porcelain']))throw new Error('Source changed while packaging');
console.log(JSON.stringify({project_id:JSON.parse(fs.readFileSync(path.join(root,'.openai/hosting.json'),'utf8')).project_id,commit_sha:sha,archive}));
