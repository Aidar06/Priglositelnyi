import {clamp,storyFrame,calendarRows,createCalendarEvent} from './story-model.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const kyText={
  'Перейти к приглашению':'Чакыруу бөлүмүнө өтүү','ГЛАВА I · НАШЕ НАЧАЛО':'I БӨЛҮМ · БИЗДИН БАШТАЛЫШЫ','Одно':'Бир','маленькое «да».':'кичинекей «ооба».','И целая жизнь,':'Жана бүтүндөй бир өмүр,','которую хочется прожить вместе.':'аны бирге өткөргүң келет.','ГЛАВА II · ДВА СЕРДЦА':'II БӨЛҮМ · ЭКИ ЖҮРӨК','Выбрать тебя.':'Сени тандоо.','Снова и снова.':'Кайра-кайра.','В каждом завтра,':'Ар бир эртеңде,','в каждом новом дне.':'ар бир жаңы күндө.','ГЛАВА III · ТЕПЕРЬ НАВСЕГДА':'III БӨЛҮМ · ЭМИ ТҮБӨЛҮККӨ','Одна любовь.':'Бир сүйүү.','Одна семья.':'Бир үй-бүлө.','И вы — часть этой истории.':'Сиздер да бул тарыхтын бир бөлүгүсүздөр.','Разделите с нами самый счастливый день.':'Эң бактылуу күнүбүздү биз менен бөлүшүңүздөр.','Наше приглашение':'Биздин чакыруу','Не удалось загрузить видео.':'Видео жүктөлбөй калды.','Попробовать ещё раз':'Кайра аракет кылуу','Открыть приглашение':'Чакырууну ачуу','С ЛЮБОВЬЮ, ДЛЯ ВАС':'СҮЙҮҮ МЕНЕН, СИЗДЕР ҮЧҮН','Прокручивайте — история продолжается':'Жылдырыңыз — окуя уланат','САМЫМ БЛИЗКИМ':'ЭҢ ЖАКЫНДАРГА','Дорогие наши!':'Биздин кымбаттуулар!','Счастье больше,':'Бакыт көбөйөт,','когда вы':'эгер сиздер','рядом.':'жаныбызда болсоңуздар.','ТОТ САМЫЙ ДЕНЬ':'ДАЛ ОШОЛ КҮН','ПН':'ДШ','ВТ':'ШШ','СР':'ШР','ЧТ':'БШ','ПТ':'ЖМ','СБ':'ИШ','ВС':'ЖК','Сохранить этот день':'Бул күндү сактоо','КАК ПРОЙДЁТ НАШ ДЕНЬ':'БИЗДИН КҮН КАНДАЙ ӨТӨТ','Моменты счастья':'Бакыт көз ирмемдери','Вечер, который':'Биз эстей турган','мы':'кече.','запомним.':'','Пусть время немного замедлится.':'Убакыт бир аз жайласын.','В этот день нам некуда спешить.':'Бул күнү шашуунун кереги жок.','МЕСТО НАШЕЙ ВСТРЕЧИ':'ЖОЛУГУШУУЧУ ЖЕРИБИЗ','to have & to hold':'сүйүүгө жана сактоого','Сбор гостей в':'Конокторду тосуу:','Посмотреть на карте':'Картадан көрүү','Место указано для примера.':'Жер азырынча мисал катары көрсөтүлдү.','Адрес и маршрут добавим перед отправкой приглашений.':'Чакыруу жөнөтүлгөнгө чейин дарек менен багытты кошобуз.','МАЛЕНЬКИЕ ДЕТАЛИ БОЛЬШОГО ДНЯ':'ЧОҢ КҮНДҮН КИЧИНЕКЕЙ ДЕТАЛДАРЫ','В гармонии':'Майрам менен','с праздником.':'айкалышта.','Главное украшение вечера — ваши улыбки.':'Кеченин эң башкы көркү — сиздердин жылмаюуңуздар.','А если захочется поддержать настроение, выбирайте эти оттенки.':'Маанайды толуктагыңыз келсе, ушул түстөрдү тандаңыз.','01 / ДРЕСС-КОД':'01 / ДРЕСС-КОД','Вечерняя элегантность.':'Кечки жарашык.','И немного вашего характера.':'Жана өзүңүзгө мүнөздүү бир аз өзгөчөлүк.','02 / ЦВЕТЫ':'02 / ГҮЛДӨР','Вместо букета — тёплые слова.':'Гүлдестенин ордуна — жылуу сөздөр.','Они останутся с нами надолго.':'Алар биз менен көпкө калат.','03 / НАСТРОЕНИЕ':'03 / МААНАЙ','Берите с собой любовь':'Өзүңүз менен сүйүүнү','и готовность танцевать.':'жана бийлөөгө даярдыкты ала келиңиз.','До нашего «навсегда»':'Биздин «түбөлүккө» чейин','БУДЕТЕ С НАМИ?':'БИЗ МЕНЕН БОЛОСУЗБУ?','Очень ждём вас':'Сиздерди чыдамсыздык менен күтөбүз','Ваше место —':'Сиздин ордуңуз —','рядом с нами.':'биздин жаныбызда.','Поделитесь своими планами до':'Планыңызды ушул күнгө чейин билдириңиз:','чтобы мы подготовили для вас':'сиздер үчүн эң жылуу кечени','самый тёплый вечер.':'даярдап коюшубуз үчүн.','ВАШЕ ИМЯ И ФАМИЛИЯ':'АТЫҢЫЗ ЖАНА ФАМИЛИЯҢЫЗ','СМОЖЕТЕ РАЗДЕЛИТЬ С НАМИ ЭТОТ ДЕНЬ?':'БУЛ КҮНДҮ БИЗ МЕНЕН БӨЛҮШӨ АЛАСЫЗБЫ?','С радостью буду!':'Кубаныч менен келем!','К сожалению, не получится':'Тилекке каршы, келе албайм','СКОЛЬКО ВАС БУДЕТ, ВКЛЮЧАЯ ВАС?':'СИЗ МЕНЕН БИРГЕ КАНЧА АДАМ БОЛОТ?','Только я':'Жалгыз өзүм','Нас двое':'Экөөбүз','Нас трое':'Үчөөбүз','Нас четверо':'Төртөөбүз','Нас пятеро':'Бешөөбүз','ПОЖЕЛАНИЯ К МЕНЮ ИЛИ ПАРА ТЁПЛЫХ СЛОВ':'МЕНЮ БОЮНЧА КААЛОО ЖЕ БИР-ЭКИ ЖЫЛУУ СӨЗ','Демонстрация: ответ сохранится только в этом браузере. Отправку организаторам подключим позже.':'Демо: жооп ушул браузерде гана сакталат. Уюштуруучуларга жөнөтүүнү кийин кошобуз.','Сохранить ответ':'Жоопту сактоо','ЛУЧШЕЕ ТОЛЬКО НАЧИНАЕТСЯ':'ЭҢ ЖАКШЫСЫ ЭМИ ГАНА БАШТАЛАТ','С любовью и предвкушением встречи.':'Сүйүү жана жолугушууну күтүү менен.','Посмотреть историю ещё раз ↗':'Окуяны кайра көрүү ↗','СОЗДАНО С ЛЮБОВЬЮ':'СҮЙҮҮ МЕНЕН ЖАСАЛДЫ','Музыка':'Музыка'
};
const messages={
  ru:{load:'Не удалось загрузить приглашение. Пожалуйста, обновите страницу.',weddingDay:d=>`${d} — день свадьбы`,playReady:'Теперь прокручивайте страницу, чтобы продолжить историю.',playFail:'Не удалось загрузить видео. Можно повторить или перейти к приглашению.',playing:'Коробочка открывается. История скоро продолжится прокруткой.',name:'Пожалуйста, укажите имя.',yes:'Спасибо! Ваш ответ отправлен. До встречи на нашем празднике.',no:'Спасибо, что сообщили. Будем скучать!',saved:'Ответ сохранён в этом браузере. Это демоверсия — организаторам он пока не отправлен.',saveFail:'Браузер не разрешил сохранение. Ваш ответ пока не сохранён.',sendFail:'Не удалось отправить ответ. Пожалуйста, попробуйте ещё раз.',musicOn:'Выключить музыку',musicOff:'Включить музыку',musicFail:'Звук недоступен',lang:'Кыргызчага которуу',settings:'Настройки приглашения',confirm:'Подтвердить присутствие',save:'Сохранить ответ',days:'ДНЕЙ',hours:'ЧАСОВ',minutes:'МИНУТ',seconds:'СЕКУНД',guestPlaceholder:'Как к вам обращаться?',notePlaceholder:'Можно оставить здесь…',photoAlt:'Золотое обручальное кольцо на руке невесты',storyAria:'Интерактивная история предложения',calendarAria:'Календарь свадьбы',countdownAria:'До свадьбы осталось',boxAria:'Открыть коробочку с кольцом и начать историю'},
  ky:{load:'Чакыруу жүктөлбөй калды. Баракты жаңыртыңыз.',weddingDay:d=>`${d} — үйлөнүү күнү`,playReady:'Окуяны улантуу үчүн эми баракты жылдырыңыз.',playFail:'Видео жүктөлбөй калды. Кайра аракет кылсаңыз же чакырууну ачсаңыз болот.',playing:'Шакек салынган кутуча ачылууда. Андан кийин окуяны жылдырып улантасыз.',name:'Атыңызды жазыңыз.',yes:'Рахмат! Жообуңуз жөнөтүлдү. Майрамыбызда жолугушканча!',no:'Билдиргениңиз үчүн рахмат. Сизди сагынабыз!',saved:'Жооп ушул браузерде сакталды. Бул демо-нуска — азырынча уюштуруучуларга жөнөтүлгөн жок.',saveFail:'Браузер сактоого уруксат берген жок. Жообуңуз сакталган жок.',sendFail:'Жооп жөнөтүлбөй калды. Кайра аракет кылып көрүңүз.',musicOn:'Музыканы өчүрүү',musicOff:'Музыканы күйгүзүү',musicFail:'Үн жеткиликсиз',lang:'Орусчага которуу',settings:'Чакыруу жөндөөлөрү',confirm:'Катышууну ырастоо',save:'Жоопту сактоо',days:'КҮН',hours:'СААТ',minutes:'МҮНӨТ',seconds:'СЕКУНД',guestPlaceholder:'Сизге кантип кайрылалы?',notePlaceholder:'Бул жерге жазсаңыз болот…',photoAlt:'Колуктунун колундагы алтын нике шакеги',storyAria:'Сунуштун интерактивдүү окуясы',calendarAria:'Үйлөнүү тоюнун календары',countdownAria:'Үйлөнүү тоюна чейин',boxAria:'Шакек салынган кутучаны ачып, окуяны баштоо'}
};
let language='ru';try{language=localStorage.getItem('priglasi-language')==='ky'?'ky':'ru';}catch{}
const staticBindings=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
while(node=walker.nextNode()){const key=node.nodeValue.trim();if(key&&Object.hasOwn(kyText,key)){const leading=node.nodeValue.match(/^\s*/)[0],trailing=node.nodeValue.match(/\s*$/)[0];staticBindings.push({node,key,leading,trailing});}}
function msg(key,...args){const value=messages[language][key];return typeof value==='function'?value(...args):value;}
function applyStaticLanguage(){document.documentElement.lang=language;for(const item of staticBindings)item.node.nodeValue=item.leading+(language==='ky'?kyText[item.key]:item.key)+item.trailing;for(const el of $$('[data-language]'))el.classList.toggle('is-active',el.dataset.language===language);$('#languageToggle').setAttribute('aria-label',msg('lang'));$('.floating-controls').setAttribute('aria-label',msg('settings'));$('#musicToggle').setAttribute('aria-label',$('#musicToggle').getAttribute('aria-pressed')==='true'?msg('musicOn'):msg('musicOff'));$('#guestName').placeholder=msg('guestPlaceholder');$('#guestNote').placeholder=msg('notePlaceholder');$('.place-photo img').alt=msg('photoAlt');$('#story').setAttribute('aria-label',msg('storyAria'));$('.calendar')?.setAttribute('aria-label',msg('calendarAria'));$('.countdown-section')?.setAttribute('aria-label',msg('countdownAria'));$('#boxHotspot').setAttribute('aria-label',msg('boxAria'));}
history.scrollRestoration='manual';
if(location.hash)history.replaceState(null,'',location.pathname+location.search);
window.scrollTo({top:0,behavior:'instant'});
for(const section of $$('main > section:not(#story), .footer'))section.inert=true;
let config;
let activeConfig,countdownTimer,formStatusKey='',playbackStatusKey='';
applyStaticLanguage();
try{const r=await fetch('content.json');if(!r.ok)throw new Error('content');config=await r.json();}catch{$('#formStatus').textContent=msg('load');}
if(config) renderContent(config);
function renderContent(c){
  const localized=c.locales?.[language]||c.locales?.ru||{};activeConfig={...c,...localized,venue:{...localized.venue,mapUrl:c.mapUrl}};
  const date=new Date(activeConfig.date),locale=language==='ky'?'ky-KG':'ru-RU';
  const kyMonths=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  const dateNumbers=value=>{const p=new Intl.DateTimeFormat('en',{timeZone:activeConfig.timezone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(value);return Object.fromEntries(p.filter(x=>x.type!=='literal').map(x=>[x.type,Number(x.value)]));};
  const format=(options,value=date)=>{if(language!=='ky')return new Intl.DateTimeFormat(locale,{timeZone:activeConfig.timezone,...options}).format(value);const p=dateNumbers(value),month=kyMonths[p.month-1];if(options.month==='2-digit')return `${String(p.day).padStart(2,'0')}.${String(p.month).padStart(2,'0')}.${p.year}`;if(options.day&&options.month&&options.year)return `${p.day} ${month} ${p.year}`;if(options.day&&options.month)return `${p.day} ${month}`;if(options.month)return month;return String(p.year);};
  document.title=`${activeConfig.names.first} & ${activeConfig.names.second} — ${format({day:'numeric',month:'long',year:'numeric'})}`;
  document.querySelector('meta[name="description"]').content=language==='ky'?`${activeConfig.names.first} менен ${activeConfig.names.second}дин үйлөнүү тоюна чакыруу.`:`Приглашение на свадьбу ${activeConfig.names.first} и ${activeConfig.names.second}.`;
  for(const el of $$('[data-name]'))el.textContent=activeConfig.names[el.dataset.name];
  for(const el of $$('[data-date]'))el.textContent=el.dataset.date==='numeric'?format({day:'2-digit',month:'2-digit',year:'numeric'}).replaceAll('.',' · '):format({day:'numeric',month:'long',year:'numeric'}).replace(' г.','');
  $('#welcomeText').textContent=activeConfig.welcome;$('#hosts').textContent=activeConfig.hosts;
  const parts=new Intl.DateTimeFormat('en',{timeZone:activeConfig.timezone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date);
  const part=t=>Number(parts.find(p=>p.type===t).value);
  const month=format({month:'long'});$('#calendarMonth').replaceChildren(document.createTextNode(month[0].toUpperCase()+month.slice(1)+' '));
  const yearEl=document.createElement('span');yearEl.textContent=part('year');$('#calendarMonth').append(yearEl);
  $('#calendarBody').replaceChildren();
  for(const row of calendarRows(part('year'),part('month')-1)){
    const tr=document.createElement('tr');
    for(const day of row){const td=document.createElement('td');if(day){const span=document.createElement('span');span.textContent=day;td.append(span);if(day===part('day')){td.className='wedding-day';td.setAttribute('aria-label',msg('weddingDay',day));}}tr.append(td);}$('#calendarBody').append(tr);
  }
  $('#timeline').replaceChildren();for(const item of activeConfig.schedule){const li=document.createElement('li');li.className='reveal in-view';const time=document.createElement('time');time.textContent=item.time;const symbol=document.createElement('span');symbol.className='timeline-symbol';symbol.textContent=item.symbol;symbol.setAttribute('aria-hidden','true');const content=document.createElement('div');const h=document.createElement('h3');h.textContent=item.title;const p=document.createElement('p');p.textContent=item.description;content.append(h,p);li.append(time,symbol,content);$('#timeline').append(li);}
  $('#venueType').textContent=activeConfig.venue.type;$('#venueName').textContent=`«${activeConfig.venue.name}»`;$('#venueCity').textContent=activeConfig.venue.city;$('#venueAddress').textContent=activeConfig.venue.address;$('#arrivalTime').textContent=activeConfig.schedule[0]?.time||'';
  $('#mapLink').hidden=true;if(activeConfig.venue.mapUrl&&/^https:\/\//.test(activeConfig.venue.mapUrl)){$('#mapLink').href=activeConfig.venue.mapUrl;$('#mapLink').hidden=false;}$('#venueDemo').hidden=!activeConfig.demo;
  $('#palette').replaceChildren();for(const color of activeConfig.palette){const sw=document.createElement('div');sw.className='swatch';const dot=document.createElement('i');dot.style.backgroundColor=color.color;dot.setAttribute('aria-hidden','true');const title=document.createElement('span');title.textContent=color.name;sw.append(dot,title);$('#palette').append(sw);}
  $('#deadline').textContent=format({day:'numeric',month:'long'},new Date(activeConfig.rsvpDeadline+'T12:00:00Z'));
  const live=!activeConfig.demo&&Boolean(activeConfig.rsvpEndpoint);$('#demoNote').hidden=live;$('#submitRsvp').firstChild.textContent=(live?msg('confirm'):msg('save'))+' ';
  $('#contacts').replaceChildren();for(const contact of activeConfig.contacts){if(!/^\+?[\d\s()-]+$/.test(contact.phone))continue;const a=document.createElement('a');a.href='tel:'+contact.phone.replace(/[^+\d]/g,'');a.textContent=contact.name+' · '+contact.phone;$('#contacts').append(a);}
  const countParts=[['days',msg('days')],['hours',msg('hours')],['minutes',msg('minutes')],['seconds',msg('seconds')]];$('#countdown').replaceChildren();
  for(const [id,label]of countParts){const block=document.createElement('div');const value=document.createElement('strong');value.id='count-'+id;value.textContent='00';const text=document.createElement('span');text.textContent=label;block.append(value,text);$('#countdown').append(block);}
  const updateCountdown=()=>{const seconds=Math.max(0,Math.floor((date-Date.now())/1000));const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];countParts.forEach(([id],i)=>$('#count-'+id).textContent=String(values[i]).padStart(2,'0'));};updateCountdown();
  clearInterval(countdownTimer);countdownTimer=setInterval(updateCountdown,1000);
}
$('#calendarDownload').addEventListener('click',()=>{if(!activeConfig)return;const url=URL.createObjectURL(new Blob([createCalendarEvent({...activeConfig,language})],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='our-wedding.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);});

// Three continuous film chapters: click-to-play, then scroll-controlled seeking.
const story=$('#story'), opening=$('#openingVideo'), proposal=$('#proposalVideo'), forever=$('#foreverVideo'), poster=$('#scenePoster');
let state='closed',currentChapter='intro',raf=0,lastProgress=-1,playingWatchdog;
function chapter(name){if(currentChapter===name)return;currentChapter=name;for(const el of $$('.chapter')){const active=el.dataset.chapter===name;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active));}}
function visibleVideo(video){for(const v of [opening,proposal,forever])v.classList.toggle('is-visible',v===video);}
function showPoster(name){poster.src=`assets/${name}.webp`;visibleVideo(null);}
function unlock(){clearTimeout(playingWatchdog);document.body.classList.remove('is-playing','intro-locked');document.documentElement.classList.remove('scroll-locked');for(const section of $$('main > section:not(#story), .footer'))section.inert=false;}
function lock(){document.body.classList.add('intro-locked');document.documentElement.classList.add('scroll-locked');for(const section of $$('main > section:not(#story), .footer'))section.inert=true;window.scrollTo({top:0,behavior:'instant'});}
lock();
function setPlaybackStatus(key=''){playbackStatusKey=key;$('#playbackStatus').textContent=key?msg(key):'';}
function setFormStatus(key=''){formStatusKey=key;$('#formStatus').textContent=key?msg(key):'';}
function readyToScroll(){if(state!=='playing')return;opening.pause();unlock();state='scrolling';story.classList.add('is-open');$('#boxHotspot').hidden=true;$('#videoError').hidden=true;setPlaybackStatus('playReady');$('#scrollHint').hidden=false;$('#storyCounter').textContent='01 / 03';chapter('promise');showPoster('ring-held');proposal.preload='auto';forever.preload='auto';proposal.load();forever.load();scheduleUpdate();}
function playbackFailed(){clearTimeout(playingWatchdog);opening.pause();document.body.classList.remove('is-playing');state='closed';$('#boxHotspot').hidden=true;$('#videoError').hidden=false;setPlaybackStatus('playFail');}
async function startStory(){
  if(state!=='closed')return;
  $('#videoError').hidden=true;
  if(reduced.matches){unlock();state='static';showPoster('forever');chapter('forever');$('#boxHotspot').hidden=true;return;}
  state='playing';document.body.classList.add('is-playing');window.scrollTo({top:0,behavior:'instant'});$('#boxHotspot').hidden=true;setPlaybackStatus('playing');
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
$('#replayStory').addEventListener('click',()=>{unlock();state='closed';opening.pause();opening.currentTime=0;proposal.pause();forever.pause();story.classList.remove('is-open');showPoster('closed-box');chapter('intro');$('#boxHotspot').hidden=false;$('#videoError').hidden=true;setPlaybackStatus();$('#scrollHint').hidden=true;$('#storyCounter').textContent='';$('#storyProgress').style.transform='scaleX(0)';lastProgress=-1;lock();$('#boxHotspot').focus({preventScroll:true});});
reduced.addEventListener('change',()=>{if(reduced.matches&&state==='playing'){opening.pause();unlock();state='static';showPoster('forever');chapter('forever');}});

// Reveal only when JavaScript and IntersectionObserver are available.
if('IntersectionObserver'in window&&!reduced.matches){document.body.classList.add('js-reveal');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}},{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}

// RSVP has an explicit local demo adapter; switch config to a real API later.
const form=$('#rsvpForm');
form.addEventListener('change',()=>{$('#guestOptions').hidden=new FormData(form).get('attending')!=='yes';});
form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity()||!config)return;
  const data=new FormData(form),name=String(data.get('name')||'').trim();
  if(name.length<2){$('#guestName').setCustomValidity(msg('name'));$('#guestName').reportValidity();return;}$('#guestName').setCustomValidity('');
  const response={name,attending:data.get('attending')==='yes',guests:data.get('attending')==='yes'?Number(data.get('guests')||1):0,note:String(data.get('note')||'').trim(),updatedAt:new Date().toISOString()};
  const submit=$('#submitRsvp');submit.disabled=true;
  try{
    if(!config.demo&&config.rsvpEndpoint){const r=await fetch(config.rsvpEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(response)});if(!r.ok)throw new Error('network');setFormStatus(response.attending?'yes':'no');}
    else{localStorage.setItem('priglasi-rsvp-demo',JSON.stringify(response));setFormStatus('saved');}
    $('#formStatus').focus();
  }catch{setFormStatus(config.demo?'saveFail':'sendFail');}finally{submit.disabled=false;}
});
$('#guestName').addEventListener('input',()=>$('#guestName').setCustomValidity(''));
try{const saved=JSON.parse(localStorage.getItem('priglasi-rsvp-demo')||'null');if(saved&&config?.demo){$('#guestName').value=saved.name||'';const radio=form.querySelector(`input[value="${saved.attending?'yes':'no'}"]`);if(radio)radio.checked=true;$('#guestCount').value=String(saved.guests||1);$('#guestNote').value=saved.note||'';$('#guestOptions').hidden=!saved.attending;}}catch{}

// Quiet original ambient chimes. Never start audio without a click.
let audioContext,musicTimer,musicPlaying=false,audioFailed=false;
function musicPhrase(){if(!audioContext||!musicPlaying)return;const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66];const now=audioContext.currentTime;notes.forEach((frequency,i)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(0,now+i*.75);gain.gain.linearRampToValueAtTime(.035,now+i*.75+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+i*.75+2.6);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now+i*.75);osc.stop(now+i*.75+2.7);});}
$('#musicToggle').addEventListener('click',async()=>{try{if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();musicPlaying=!musicPlaying;if(musicPlaying){await audioContext.resume();musicPhrase();musicTimer=setInterval(musicPhrase,6800);}else{clearInterval(musicTimer);await audioContext.suspend();}audioFailed=false;$('#musicToggle').setAttribute('aria-pressed',String(musicPlaying));$('#musicToggle').setAttribute('aria-label',musicPlaying?msg('musicOn'):msg('musicOff'));$('.music-label').textContent=language==='ky'?kyText.Музыка:'Музыка';}catch{audioFailed=true;$('.music-label').textContent=msg('musicFail');}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&musicPlaying){musicPlaying=false;clearInterval(musicTimer);audioContext?.suspend();$('#musicToggle').setAttribute('aria-pressed','false');$('#musicToggle').setAttribute('aria-label',msg('musicOff'));}});
$('#languageToggle').addEventListener('click',()=>{language=language==='ru'?'ky':'ru';try{localStorage.setItem('priglasi-language',language);}catch{}applyStaticLanguage();if(config)renderContent(config);if(playbackStatusKey)setPlaybackStatus(playbackStatusKey);if(formStatusKey)setFormStatus(formStatusKey);if(audioFailed)$('.music-label').textContent=msg('musicFail');});
