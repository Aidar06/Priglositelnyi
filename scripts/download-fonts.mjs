import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
let css=await fs.readFile(path.join(root,'production/fonts-source.css'),'utf8');
const urls=[...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
await fs.mkdir(path.join(root,'dist/assets/fonts'),{recursive:true});
for(const [index,url]of urls.entries()){const response=await fetch(url);if(!response.ok)throw new Error(`Font ${index} failed`);const filename=`font-${index}.ttf`;await fs.writeFile(path.join(root,'dist/assets/fonts',filename),Buffer.from(await response.arrayBuffer()));css=css.replaceAll(url,'assets/fonts/'+filename);}
await fs.writeFile(path.join(root,'dist/fonts.css'),css);console.log(`Downloaded ${urls.length} fonts for self-hosting.`);
