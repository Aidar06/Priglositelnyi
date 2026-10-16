import {clamp,storyFrame,calendarRows,createCalendarEvent} from './story-model.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
history.scrollRestoration='manual';
if(location.hash)history.replaceState(null,'',location.pathname+location.search);
window.scrollTo({top:0,behavior:'instant'});
for(const section of $$('main > section:not(#story), .footer'))section.inert=true;
let config;
try{const r=await fetch('content.json');if(!r.ok)throw new Error('content');config=await r.json();}catch{$('#formStatus').textContent='Не удалось загрузить приглашение. Пожалуйста, обновите страницу.';}
if(config) renderContent(config);
function renderContent(c){
  const date=new Date(c.date);
  const format=(options)=>new Intl.DateTimeFormat('ru-RU',{timeZone:c.timezone,...options}).format(date);
  document.title=`${c.names.first} & ${c.names.second} — ${format({day:'numeric',month:'long',year:'numeric'})}`;
  for(const el of $$('[data-name]'))el.textContent=c.names[el.dataset.name];
  for(const el of $$('[data-date]'))el.textContent=el.dataset.date==='numeric'?format({day:'2-digit',month:'2-digit',year:'numeric'}).replaceAll('.',' · '):format({day:'numeric',month:'long',year:'numeric'}).replace(' г.','');
  $('#welcomeText').textContent=c.welcome;$('#hosts').textContent=c.hosts;
  const parts=new Intl.DateTimeFormat('en',{timeZone:c.timezone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date);
  const part=t=>Number(parts.find(p=>p.type===t).value);
  const month=format({month:'long'});$('#calendarMonth').replaceChildren(document.createTextNode(month[0].toUpperCase()+month.slice(1)+' '));
  const yearEl=document.createElement('span');yearEl.textContent=part('year');$('#calendarMonth').append(yearEl);
  for(const row of calendarRows(part('year'),part('month')-1)){
    const tr=document.createElement('tr');
    for(const day of row){const td=document.createElement('td');if(day){const span=document.createElement('span');span.textContent=day;td.append(span);if(day===part('day')){td.className='wedding-day';td.setAttribute('aria-label',`${day} — день свадьбы`);}}tr.append(td);}$('#calendarBody').append(tr);
  }
  for(const item of c.schedule){const li=document.createElement('li');li.className='reveal';const time=document.createElement('time');time.textContent=item.time;const symbol=document.createElement('span');symbol.className='timeline-symbol';symbol.textContent=item.symbol;symbol.setAttribute('aria-hidden','true');const content=document.createElement('div');const h=document.createElement('h3');h.textContent=item.title;const p=document.createElement('p');p.textContent=item.description;content.append(h,p);li.append(time,symbol,content);$('#timeline').append(li);}
  $('#venueType').textContent=c.venue.type;$('#venueName').textContent=`«${c.venue.name}»`;$('#venueCity').textContent=c.venue.city;$('#venueAddress').textContent=c.venue.address;$('#arrivalTime').textContent=c.schedule[0]?.time||'';
  if(c.venue.mapUrl&&/^https:\/\//.test(c.venue.mapUrl)){$('#mapLink').href=c.venue.mapUrl;$('#mapLink').hidden=false;}$('#venueDemo').hidden=!c.demo;
  for(const color of c.palette){const sw=document.createElement('div');sw.className='swatch';const dot=document.createElement('i');dot.style.backgroundColor=color.color;dot.setAttribute('aria-hidden','true');const title=document.createElement('span');title.textContent=color.name;sw.append(dot,title);$('#palette').append(sw);}
  $('#deadline').textContent=new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(c.rsvpDeadline+'T12:00:00Z'));
  const live=!c.demo&&Boolean(c.rsvpEndpoint);$('#demoNote').hidden=live;$('#submitRsvp').firstChild.textContent=live?'Подтвердить присутствие ':'Сохранить ответ ';
  for(const contact of c.contacts){if(!/^\+?[\d\s()-]+$/.test(contact.phone))continue;const a=document.createElement('a');a.href='tel:'+contact.phone.replace(/[^+\d]/g,'');a.textContent=contact.name+' · '+contact.phone;$('#contacts').append(a);}
  const countParts=[['days','ДНЕЙ'],['hours','ЧАСОВ'],['minutes','МИНУТ'],['seconds','СЕКУНД']];
  for(const [id,label]of countParts){const block=document.createElement('div');const value=document.createElement('strong');value.id='count-'+id;value.textContent='00';const text=document.createElement('span');text.textContent=label;block.append(value,text);$('#countdown').append(block);}
  const updateCountdown=()=>{const seconds=Math.max(0,Math.floor((date-Date.now())/1000));const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];countParts.forEach(([id],i)=>$('#count-'+id).textContent=String(values[i]).padStart(2,'0'));};updateCountdown();setInterval(updateCountdown,1000);
  $('#calendarDownload').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([createCalendarEvent(c)],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='our-wedding.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);});
}

// Three continuous film chapters: click-to-play, then scroll-controlled seeking.
const story=$('#story'), opening=$('#openingVideo'), proposal=$('#proposalVideo'), forever=$('#foreverVideo'), poster=$('#scenePoster');
let state='closed',currentChapter='intro',raf=0,lastProgress=-1,playingWatchdog;
function chapter(name){if(currentChapter===name)return;currentChapter=name;for(const el of $$('.chapter')){const active=el.dataset.chapter===name;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active));}}
function visibleVideo(video){for(const v of [opening,proposal,forever])v.classList.toggle('is-visible',v===video);}
function showPoster(name){poster.src=`assets/${name}.webp`;visibleVideo(null);}
function unlock(){clearTimeout(playingWatchdog);document.body.classList.remove('is-playing','intro-locked');document.documentElement.classList.remove('scroll-locked');for(const section of $$('main > section:not(#story), .footer'))section.inert=false;}
function lock(){document.body.classList.add('intro-locked');document.documentElement.classList.add('scroll-locked');for(const section of $$('main > section:not(#story), .footer'))section.inert=true;window.scrollTo({top:0,behavior:'instant'});}
lock();
function readyToScroll(){if(state!=='playing')return;opening.pause();unlock();state='scrolling';story.classList.add('is-open');$('#boxHotspot').hidden=true;$('#videoError').hidden=true;$('#playbackStatus').textContent='Теперь прокручивайте страницу, чтобы продолжить историю.';$('#scrollHint').hidden=false;$('#storyCounter').textContent='01 / 03';chapter('promise');showPoster('ring-held');proposal.preload='auto';forever.preload='auto';proposal.load();forever.load();scheduleUpdate();}
function playbackFailed(){clearTimeout(playingWatchdog);opening.pause();document.body.classList.remove('is-playing');state='closed';$('#boxHotspot').hidden=true;$('#videoError').hidden=false;$('#playbackStatus').textContent='Не удалось загрузить видео. Можно повторить или перейти к приглашению.';}
async function startStory(){
  if(state!=='closed')return;
  $('#videoError').hidden=true;
  if(reduced.matches){unlock();state='static';showPoster('forever');chapter('forever');$('#boxHotspot').hidden=true;return;}
  state='playing';document.body.classList.add('is-playing');window.scrollTo({top:0,behavior:'instant'});$('#boxHotspot').hidden=true;$('#playbackStatus').textContent='Коробочка открывается. История скоро продолжится прокруткой.';
  playingWatchdog=setTimeout(()=>{if(state==='playing')playbackFailed();},45000);
  try{opening.currentTime=0;await opening.play();if(state==='playing')visibleVideo(opening);}catch{if(state==='playing')playbackFailed();}
}
$('#boxHotspot').addEventListener('click',startStory);$('#retryStory').addEventListener('click',startStory);
opening.addEventListener('ended',readyToScroll);
opening.addEventListener('timeupdate',()=>{if(state==='playing'&&opening.duration){$('#storyProgress').style.transform=`scaleX(${opening.currentTime/opening.duration})`;if(opening.currentTime>=opening.duration-.1)readyToScroll();}});
opening.addEventListener('error',()=>{if(state==='playing')playbackFailed();});
function skip(){opening.pause();unlock();state='static';$('#boxHotspot').hidden=true;$('#videoError').hidden=true;showPoster('forever');chapter('forever');$('#welcome').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}
$('#skipStory').addEventListener('click',skip);
$('.skip-link').addEventListener('click',e=>{e.preventDefault();skip();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state==='playing')skip();});
function requestSeek(video,time){
  video.dataset.targetTime=String(time);
  if(video.readyState<2||video.seeking)return;
  if(Math.abs(video.currentTime-time)>.025){try{video.currentTime=time;}catch{}}
}
for(const video of [proposal,forever]){
  video.addEventListener('seeked',()=>{if(state!=='scrolling')return;const target=Number(video.dataset.targetTime||0);if(Math.abs(video.currentTime-target)>.04)requestSeek(video,target);});
  video.addEventListener('loadeddata',()=>{lastProgress=-1;scheduleUpdate();});
  video.addEventListener('error',()=>{lastProgress=-1;scheduleUpdate();});
}
function updateStory(){
  raf=0;if(state!=='scrolling')return;
  const rect=story.getBoundingClientRect();const progress=clamp(-rect.top/(story.offsetHeight-$('.story-stage').offsetHeight));
  if(Math.abs(progress-lastProgress)<.0003)return;lastProgress=progress;
  const frame=storyFrame(progress,proposal.duration||10,forever.duration||10);chapter(frame.chapter);
  const target=frame.clip==='proposal'?proposal:forever;
  if(target.readyState>=2&&!target.error){visibleVideo(target);requestSeek(target,frame.time);}else showPoster(progress<.3?'ring-held':progress<.65?'ring-worn':'forever');
  $('#storyCounter').textContent=frame.chapter==='promise'?'01 / 03':frame.chapter==='together'?'02 / 03':'03 / 03';
  $('#storyProgress').style.transform=`scaleX(${progress})`;
}
function scheduleUpdate(){if(!raf)raf=requestAnimationFrame(updateStory);}
window.addEventListener('scroll',scheduleUpdate,{passive:true});window.addEventListener('resize',()=>{lastProgress=-1;scheduleUpdate();},{passive:true});
$('#replayStory').addEventListener('click',()=>{unlock();state='closed';opening.pause();opening.currentTime=0;proposal.pause();forever.pause();story.classList.remove('is-open');showPoster('closed-box');chapter('intro');$('#boxHotspot').hidden=false;$('#videoError').hidden=true;$('#playbackStatus').textContent='';$('#scrollHint').hidden=true;$('#storyCounter').textContent='';$('#storyProgress').style.transform='scaleX(0)';lastProgress=-1;lock();$('#boxHotspot').focus({preventScroll:true});});
reduced.addEventListener('change',()=>{if(reduced.matches&&state==='playing'){opening.pause();unlock();state='static';showPoster('forever');chapter('forever');}});

// Reveal only when JavaScript and IntersectionObserver are available.
if('IntersectionObserver'in window&&!reduced.matches){document.body.classList.add('js-reveal');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}},{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}

// RSVP has an explicit local demo adapter; switch config to a real API later.
const form=$('#rsvpForm');
form.addEventListener('change',()=>{$('#guestOptions').hidden=new FormData(form).get('attending')!=='yes';});
form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity()||!config)return;
  const data=new FormData(form),name=String(data.get('name')||'').trim();
  if(name.length<2){$('#guestName').setCustomValidity('Пожалуйста, укажите имя.');$('#guestName').reportValidity();return;}$('#guestName').setCustomValidity('');
  const response={name,attending:data.get('attending')==='yes',guests:data.get('attending')==='yes'?Number(data.get('guests')||1):0,note:String(data.get('note')||'').trim(),updatedAt:new Date().toISOString()};
  const submit=$('#submitRsvp');submit.disabled=true;
  try{
    if(!config.demo&&config.rsvpEndpoint){const r=await fetch(config.rsvpEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(response)});if(!r.ok)throw new Error('network');$('#formStatus').textContent=response.attending?'Спасибо! Ваш ответ отправлен. До встречи на нашем празднике.':'Спасибо, что сообщили. Будем скучать!';}
    else{localStorage.setItem('priglasi-rsvp-demo',JSON.stringify(response));$('#formStatus').textContent='Ответ сохранён в этом браузере. Это демоверсия — организаторам он пока не отправлен.';}
    $('#formStatus').focus();
  }catch{$('#formStatus').textContent=config.demo?'Браузер не разрешил сохранение. Ваш ответ пока не сохранён.':'Не удалось отправить ответ. Пожалуйста, попробуйте ещё раз.';}finally{submit.disabled=false;}
});
$('#guestName').addEventListener('input',()=>$('#guestName').setCustomValidity(''));
try{const saved=JSON.parse(localStorage.getItem('priglasi-rsvp-demo')||'null');if(saved&&config?.demo){$('#guestName').value=saved.name||'';const radio=form.querySelector(`input[value="${saved.attending?'yes':'no'}"]`);if(radio)radio.checked=true;$('#guestCount').value=String(saved.guests||1);$('#guestNote').value=saved.note||'';$('#guestOptions').hidden=!saved.attending;}}catch{}

// Quiet original ambient chimes. Never start audio without a click.
let audioContext,musicTimer,musicPlaying=false;
function musicPhrase(){if(!audioContext||!musicPlaying)return;const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66];const now=audioContext.currentTime;notes.forEach((frequency,i)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(0,now+i*.75);gain.gain.linearRampToValueAtTime(.035,now+i*.75+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.75+2.6);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now+i*.75);osc.stop(now+i*.75+2.7);});}
$('#musicToggle').addEventListener('click',async()=>{try{if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();musicPlaying=!musicPlaying;if(musicPlaying){await audioContext.resume();musicPhrase();musicTimer=setInterval(musicPhrase,6800);}else{clearInterval(musicTimer);await audioContext.suspend();}$('#musicToggle').setAttribute('aria-pressed',String(musicPlaying));$('#musicToggle').setAttribute('aria-label',musicPlaying?'Выключить музыку':'Включить музыку');}catch{$('.music-label').textContent='Звук недоступен';}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&musicPlaying){musicPlaying=false;clearInterval(musicTimer);audioContext?.suspend();$('#musicToggle').setAttribute('aria-pressed','false');$('#musicToggle').setAttribute('aria-label','Включить музыку');}});
