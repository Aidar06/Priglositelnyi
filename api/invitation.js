import fs from 'node:fs/promises';
import path from 'node:path';

const API_BASE='https://x8ki-letl-twmt.n7.xano.io/api:X8-e2j1w/priglosi';
const templatePromise=fs.readFile(path.join(process.cwd(),'dist','index.html'),'utf8');
const genericMeta={
  title:'Свадебное приглашение',
  description:'Откройте приглашение и узнайте дату, место и программу свадебного дня.'
};

function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function replaceMeta(html,attribute,key,value){
  const escaped=escapeHtml(value),pattern=new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`,'i');
  const tag=`<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html)?html.replace(pattern,tag):html.replace('</head>',`  ${tag}\n</head>`);
}
function formatWeddingDate(value){
  const match=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})/);if(!match)return '';
  const date=new Date(Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3])));
  return new Intl.DateTimeFormat('ru-RU',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}).format(date);
}

export function invitationMeta(record){
  const first=String(record?.names?.has||'').trim(),second=String(record?.names?.wife||'').trim();
  if(!first||!second)return genericMeta;
  const couple=`${first} & ${second}`,date=formatWeddingDate(record?.date);
  return {title:`${couple} — свадебное приглашение`,description:`Свадебное приглашение • ${couple}${date?` • ${date}`:''}.`};
}

export function renderInvitationHtml(template,meta,imageUrl){
  let html=template.replace(/<title>[\s\S]*?<\/title>/i,`<title>${escapeHtml(meta.title)}</title>`);
  html=replaceMeta(html,'name','description',meta.description);
  html=replaceMeta(html,'property','og:type','website');
  html=replaceMeta(html,'property','og:title',meta.title);
  html=replaceMeta(html,'property','og:description',meta.description);
  html=replaceMeta(html,'name','twitter:card','summary_large_image');
  html=replaceMeta(html,'name','twitter:title',meta.title);
  html=replaceMeta(html,'name','twitter:description',meta.description);
  if(imageUrl){html=replaceMeta(html,'property','og:image',imageUrl);html=replaceMeta(html,'name','twitter:image',imageUrl);}
  return html;
}

export default {
  async fetch(request){
    const url=new URL(request.url),id=url.searchParams.get('id');
    if(!/^\d+$/.test(id||''))return new Response('Invalid invitation id',{status:400});
    const template=await templatePromise;
    let meta=genericMeta;
    try{
      const response=await fetch(`${API_BASE}/${encodeURIComponent(id)}`,{headers:{accept:'application/json'}});
      if(response.ok)meta=invitationMeta(await response.json());
    }catch{}
    const imageUrl=new URL('/assets/closed-box.webp',url.origin).href;
    return new Response(renderInvitationHtml(template,meta,imageUrl),{headers:{
      'content-type':'text/html; charset=utf-8',
      'cache-control':'public, max-age=0, must-revalidate',
      'CDN-Cache-Control':'public, max-age=300, stale-while-revalidate=86400'
    }});
  }
};
