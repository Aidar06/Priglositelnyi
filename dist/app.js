import {clamp,storyFrame,calendarRows,createCalendarEvent,advanceStoryProgress} from './story-model.js';
import {invitationIdFromPath,adaptXanoInvitation,createGuestPatch} from './backend-adapter.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const guestDirectoryPage=location.pathname.split('/').filter(Boolean).at(-1)==='guests';
const kyText={
  'Перейти к приглашению':'Чакыруу бөлүмүнө өтүү','ГЛАВА I · НАШЕ НАЧАЛО':'I БӨЛҮМ · БИЗДИН БАШТАЛЫШЫ','Одно':'Бир','маленькое «да».':'кичинекей «ооба».','И целая жизнь,':'Жана бүтүндөй бир өмүр,','которую хочется прожить вместе.':'аны бирге өткөргүң келет.','ГЛАВА II · ДВА СЕРДЦА':'II БӨЛҮМ · ЭКИ ЖҮРӨК','Выбрать тебя.':'Сени тандоо.','Снова и снова.':'Кайра-кайра.','В каждом завтра,':'Ар бир эртеңде,','в каждом новом дне.':'ар бир жаңы күндө.','ГЛАВА III · ТЕПЕРЬ НАВСЕГДА':'III БӨЛҮМ · ЭМИ ТҮБӨЛҮККӨ','Одна любовь.':'Бир сүйүү.','Одна семья.':'Бир үй-бүлө.','И вы — часть этой истории.':'Сиздер да бул тарыхтын бир бөлүгүсүздөр.','Разделите с нами самый счастливый день.':'Эң бактылуу күнүбүздү биз менен бөлүшүңүздөр.','Наше приглашение':'Биздин чакыруу','Не удалось загрузить видео.':'Видео жүктөлбөй калды.','Попробовать ещё раз':'Кайра аракет кылуу','Открыть приглашение':'Чакырууну ачуу','Нажмите на кейс, чтобы открыть':'Кутучаны ачуу үчүн басыңыз','С ЛЮБОВЬЮ, ДЛЯ ВАС':'СҮЙҮҮ МЕНЕН, СИЗДЕР ҮЧҮН','Прокручивайте — история продолжается':'Жылдырыңыз — окуя уланат','САМЫМ БЛИЗКИМ':'ЭҢ ЖАКЫНДАРГА','Дорогие наши!':'Биздин кымбаттуулар!','Счастье больше,':'Бакыт көбөйөт,','когда вы':'эгер сиздер','рядом.':'жаныбызда болсоңуздар.','ТОТ САМЫЙ ДЕНЬ':'ДАЛ ОШОЛ КҮН','ПН':'ДШ','ВТ':'ШШ','СР':'ШР','ЧТ':'БШ','ПТ':'ЖМ','СБ':'ИШ','ВС':'ЖК','Сохранить этот день':'Бул күндү сактоо','КАК ПРОЙДЁТ НАШ ДЕНЬ':'БИЗДИН КҮН КАНДАЙ ӨТӨТ','Моменты счастья':'Бакыт көз ирмемдери','Вечер, который':'Биз эстей турган','мы':'кече.','запомним.':'','Пусть время немного замедлится.':'Убакыт бир аз жайласын.','В этот день нам некуда спешить.':'Бул күнү шашуунун кереги жок.','МЕСТО НАШЕЙ ВСТРЕЧИ':'ЖОЛУГУШУУЧУ ЖЕРИБИЗ','to have & to hold':'сүйүүгө жана сактоого','Сбор гостей в':'Конокторду тосуу:','Посмотреть на карте':'Картадан көрүү','Место указано для примера.':'Жер азырынча мисал катары көрсөтүлдү.','Адрес и маршрут добавим перед отправкой приглашений.':'Чакыруу жөнөтүлгөнгө чейин дарек менен багытты кошобуз.','МАЛЕНЬКИЕ ДЕТАЛИ БОЛЬШОГО ДНЯ':'ЧОҢ КҮНДҮН КИЧИНЕКЕЙ ДЕТАЛДАРЫ','В гармонии':'Майрам менен','с праздником.':'айкалышта.','Главное украшение вечера — ваши улыбки.':'Кеченин эң башкы көркү — сиздердин жылмаюуңуздар.','А если захочется поддержать настроение, выбирайте эти оттенки.':'Маанайды толуктагыңыз келсе, ушул түстөрдү тандаңыз.','01 / ДРЕСС-КОД':'01 / ДРЕСС-КОД','Вечерняя элегантность.':'Кечки жарашык.','И немного вашего характера.':'Жана өзүңүзгө мүнөздүү бир аз өзгөчөлүк.','02 / ЦВЕТЫ':'02 / ГҮЛДӨР','Вместо букета — тёплые слова.':'Гүлдестенин ордуна — жылуу сөздөр.','Они останутся с нами надолго.':'Алар биз менен көпкө калат.','03 / НАСТРОЕНИЕ':'03 / МААНАЙ','Берите с собой любовь':'Өзүңүз менен сүйүүнү','и готовность танцевать.':'жана бийлөөгө даярдыкты ала келиңиз.','До нашего «навсегда»':'Биздин «түбөлүккө» чейин','БУДЕТЕ С НАМИ?':'БИЗ МЕНЕН БОЛОСУЗБУ?','Очень ждём вас':'Сиздерди чыдамсыздык менен күтөбүз','Ваше место —':'Сиздин ордуңуз —','рядом с нами.':'биздин жаныбызда.','Поделитесь своими планами до':'Планыңызды ушул күнгө чейин билдириңиз:','чтобы мы подготовили для вас':'сиздер үчүн эң жылуу кечени','самый тёплый вечер.':'даярдап коюшубуз үчүн.','ВАШЕ ИМЯ И ФАМИЛИЯ':'АТЫҢЫЗ ЖАНА ФАМИЛИЯҢЫЗ','СМОЖЕТЕ РАЗДЕЛИТЬ С НАМИ ЭТОТ ДЕНЬ?':'БУЛ КҮНДҮ БИЗ МЕНЕН БӨЛҮШӨ АЛАСЫЗБЫ?','С радостью буду!':'Кубаныч менен келем!','К сожалению, не получится':'Тилекке каршы, келе албайм','СКОЛЬКО ВАС БУДЕТ, ВКЛЮЧАЯ ВАС?':'СИЗ МЕНЕН БИРГЕ КАНЧА АДАМ БОЛОТ?','ПОЖЕЛАНИЯ К МЕНЮ ИЛИ ПАРА ТЁПЛЫХ СЛОВ':'МЕНЮ БОЮНЧА КААЛОО ЖЕ БИР-ЭКИ ЖЫЛУУ СӨЗ','Демонстрация: ответ сохранится только в этом браузере. Отправку организаторам подключим позже.':'Демо: жооп ушул браузерде гана сакталат. Уюштуруучуларга жөнөтүүнү кийин кошобуз.','Сохранить ответ':'Жоопту сактоо','ЛУЧШЕЕ ТОЛЬКО НАЧИНАЕТСЯ':'ЭҢ ЖАКШЫСЫ ЭМИ ГАНА БАШТАЛАТ','С любовью и предвкушением встречи.':'Сүйүү жана жолугушууну күтүү менен.','Посмотреть историю ещё раз ↗':'Окуяны кайра көрүү ↗','СОЗДАНО С ЛЮБОВЬЮ':'СҮЙҮҮ МЕНЕН ЖАСАЛДЫ','Список гостей':'Коноктордун тизмеси','Назад к приглашению':'Чакыруу барагына кайтуу','НАШИ ДОРОГИЕ ГОСТИ':'БИЗДИН КЫМБАТТУУ КОНОКТОР','Пока никто не оставил ответ.':'Азырынча эч ким жооп бере элек.','Музыка':'Музыка'
};
const messages={
  ru:{load:'Не удалось загрузить приглашение. Пожалуйста, обновите страницу.',dataTitle:'Приглашение не найдено',dataText:'Проверьте номер в ссылке и попробуйте снова.',retry:'Повторить',wishesAria:'Пожелания гостям',weddingDay:d=>`${d} — день свадьбы`,playReady:'Теперь прокручивайте страницу, чтобы продолжить историю.',playFail:'Не удалось загрузить видео. Можно повторить или перейти к приглашению.',playing:'Коробочка открывается. История скоро продолжится прокруткой.',name:'Пожалуйста, укажите имя.',yes:'Спасибо! Ваш ответ сохранён. До встречи на нашем празднике.',no:'Спасибо, что сообщили. Ваш ответ сохранён.',saved:'Ответ сохранён в этом браузере. Это демоверсия — организаторам он пока не отправлен.',saving:'Сохраняем ваш ответ…',saveFail:'Браузер не разрешил сохранение. Ваш ответ пока не сохранён.',sendFail:'Не удалось сохранить ответ. Пожалуйста, попробуйте ещё раз.',musicOn:'Выключить музыку',musicOff:'Включить музыку',musicFail:'Звук недоступен',lang:'Кыргызчага которуу',settings:'Настройки приглашения',confirm:'Подтвердить присутствие',save:'Сохранить ответ',days:'ДНЕЙ',hours:'ЧАСОВ',minutes:'МИНУТ',seconds:'СЕКУНД',guestPlaceholder:'Как к вам обращаться?',notePlaceholder:'Можно оставить здесь…',photoAlt:'Золотое обручальное кольцо на руке невесты',storyAria:'Интерактивная история предложения',calendarAria:'Календарь свадьбы',countdownAria:'До свадьбы осталось',boxAria:'Открыть коробочку с кольцом и начать историю',guestTitle:'Список гостей',guestStatsAria:'Статистика ответов',responses:'Ответов',attending:'Будут на празднике',declined:'Не придут',willAttend:'Будет на празднике',willNotAttend:'Не сможет прийти',people:n=>`${n} ${n===1?'гость':n<5?'гостя':'гостей'}`,noWish:'Без пожелания'},
  ky:{load:'Чакыруу жүктөлбөй калды. Баракты жаңыртыңыз.',dataTitle:'Чакыруу табылган жок',dataText:'Шилтемедеги номерди текшерип, кайра аракет кылыңыз.',retry:'Кайталоо',wishesAria:'Конокторго каалоолор',weddingDay:d=>`${d} — үйлөнүү күнү`,playReady:'Окуяны улантуу үчүн эми баракты жылдырыңыз.',playFail:'Видео жүктөлбөй калды. Кайра аракет кылсаңыз же чакырууну ачсаңыз болот.',playing:'Шакек салынган кутуча ачылууда. Андан кийин окуяны жылдырып улантасыз.',name:'Атыңызды жазыңыз.',yes:'Рахмат! Жообуңуз сакталды. Майрамыбызда жолугушканча!',no:'Билдиргениңиз үчүн рахмат. Жообуңуз сакталды.',saved:'Жооп ушул браузерде сакталды. Бул демо-нуска — азырынча уюштуруучуларга жөнөтүлгөн жок.',saving:'Жообуңуз сакталууда…',saveFail:'Браузер сактоого уруксат берген жок. Жообуңуз сакталган жок.',sendFail:'Жооп сакталбай калды. Кайра аракет кылып көрүңүз.',musicOn:'Музыканы өчүрүү',musicOff:'Музыканы күйгүзүү',musicFail:'Үн жеткиликсиз',lang:'Орусчага которуу',settings:'Чакыруу жөндөөлөрү',confirm:'Катышууну ырастоо',save:'Жоопту сактоо',days:'КҮН',hours:'СААТ',minutes:'МҮНӨТ',seconds:'СЕКУНД',guestPlaceholder:'Сизге кантип кайрылалы?',notePlaceholder:'Бул жерге жазсаңыз болот…',photoAlt:'Колуктунун колундагы алтын нике шакеги',storyAria:'Сунуштун интерактивдүү окуясы',calendarAria:'Үйлөнүү тоюнун календары',countdownAria:'Үйлөнүү тоюна чейин',boxAria:'Шакек салынган кутучаны ачып, окуяны баштоо',guestTitle:'Коноктордун тизмеси',guestStatsAria:'Жооптордун статистикасы',responses:'Жооптор',attending:'Майрамга келет',declined:'Келе албайт',willAttend:'Майрамга келет',willNotAttend:'Келе албайт',people:n=>`${n} конок`,noWish:'Каалоо калтырган жок'}
};
let language='ru';try{language=localStorage.getItem('priglasi-language')==='ky'?'ky':'ru';}catch{}
const staticBindings=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
while(node=walker.nextNode()){const key=node.nodeValue.trim();if(key&&Object.hasOwn(kyText,key)){const leading=node.nodeValue.match(/^\s*/)[0],trailing=node.nodeValue.match(/\s*$/)[0];staticBindings.push({node,key,leading,trailing});}}
function msg(key,...args){const value=messages[language][key];return typeof value==='function'?value(...args):value;}
function applyStaticLanguage(){document.documentElement.lang=language;for(const item of staticBindings)item.node.nodeValue=item.leading+(language==='ky'?kyText[item.key]:item.key)+item.trailing;for(const el of $$('[data-language]'))el.classList.toggle('is-active',el.dataset.language===language);$('#languageToggle').setAttribute('aria-label',msg('lang'));$('.floating-controls').setAttribute('aria-label',msg('settings'));$('#musicToggle').setAttribute('aria-label',$('#musicToggle').getAttribute('aria-pressed')==='true'?msg('musicOn'):msg('musicOff'));$('#guestName').placeholder=msg('guestPlaceholder');$('#guestNote').placeholder=msg('notePlaceholder');$('.place-photo img').alt=msg('photoAlt');$('#story').setAttribute('aria-label',msg('storyAria'));$('.calendar')?.setAttribute('aria-label',msg('calendarAria'));$('.countdown-section')?.setAttribute('aria-label',msg('countdownAria'));$('#dress').setAttribute('aria-label',msg('wishesAria'));$('#boxHotspot').setAttribute('aria-label',msg('boxAria'));$('#dataErrorTitle').textContent=msg('dataTitle');$('#dataErrorText').textContent=msg('dataText');$('#dataRetry').textContent=msg('retry');}
history.scrollRestoration='manual';
if(location.hash)history.replaceState(null,'',location.pathname+location.search);
window.scrollTo({top:0,behavior:'instant'});
if(guestDirectoryPage){document.body.classList.add('guest-list-page');document.body.classList.remove('intro-locked');$('main').hidden=true;$('#guestDirectory').hidden=false;$('#musicToggle').hidden=true;}
if(!guestDirectoryPage)for(const section of $$('main > section:not(#story), .footer'))section.inert=true;
let config,backendRecord,invitationId;
let activeConfig,countdownTimer,formStatusKey='',playbackStatusKey='';
applyStaticLanguage();
try{
  const fallbackResponse=await fetch('content.json');if(!fallbackResponse.ok)throw new Error('content');const fallback=await fallbackResponse.json();
  invitationId=invitationIdFromPath(location.pathname,fallback.backend.defaultId);if(!invitationId)throw new Error('invalid-id');
  try{const endpoint=`${fallback.backend.baseUrl.replace(/\/$/,'')}/${encodeURIComponent(invitationId)}`;const response=await fetch(endpoint,{headers:{Accept:'application/json'},cache:'no-store'});if(!response.ok)throw new Error('backend');backendRecord=await response.json();if(String(backendRecord.priglosi_id)!==invitationId)throw new Error('wrong-id');config=adaptXanoInvitation(backendRecord,fallback);}
  catch{config=fallback;document.body.classList.add('has-data-error');$('#dataError').hidden=false;$('#boxHotspot').hidden=true;}
}catch{$('#formStatus').textContent=msg('load');document.body.classList.add('has-data-error');$('#dataError').hidden=false;$('#boxHotspot').hidden=true;}
if(config)renderContent(config);
function renderContent(c,{preserveScroll=false}={}){
  const scrollBefore=window.scrollY;
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
  $('#mapLink').hidden=true;if(activeConfig.venue.mapUrl&&/^https:\/\//.test(activeConfig.venue.mapUrl)){$('#mapLink').href=activeConfig.venue.mapUrl;$('#mapLink').hidden=false;}$('#venueDemo').hidden=!(activeConfig.dataDemo??activeConfig.demo);
  $('#deadline').textContent=format({day:'numeric',month:'long'},new Date(activeConfig.rsvpDeadline+'T12:00:00Z'));
  const live=Boolean(activeConfig.backendId);$('#demoNote').hidden=live;$('#submitRsvp').firstChild.textContent=(live?msg('confirm'):msg('save'))+' ';
  const invitationPath=`/${encodeURIComponent(activeConfig.backendId||invitationId)}`;$('#guestListLink').href=invitationPath+'/guests';$('#guestListBack').href=invitationPath;
  $('#contacts').replaceChildren();for(const contact of activeConfig.contacts){if(!/^\+?[\d\s()-]+$/.test(contact.phone))continue;const a=document.createElement('a');a.href='tel:'+contact.phone.replace(/[^+\d]/g,'');a.textContent=contact.name+' · '+contact.phone;$('#contacts').append(a);}
  const countParts=[['days',msg('days')],['hours',msg('hours')],['minutes',msg('minutes')],['seconds',msg('seconds')]];$('#countdown').replaceChildren();
  for(const [id,label]of countParts){const block=document.createElement('div');const value=document.createElement('strong');value.id='count-'+id;value.textContent='00';const text=document.createElement('span');text.textContent=label;block.append(value,text);$('#countdown').append(block);}
  const updateCountdown=()=>{const seconds=Math.max(0,Math.floor((date-Date.now())/1000));const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];countParts.forEach(([id],i)=>$('#count-'+id).textContent=String(values[i]).padStart(2,'0'));};updateCountdown();
  clearInterval(countdownTimer);countdownTimer=setInterval(updateCountdown,1000);
  renderGuestDirectory(activeConfig,format);
  if(preserveScroll)requestAnimationFrame(()=>{window.scrollTo({top:scrollBefore,behavior:'instant'});scheduleUpdate();});
}
function renderGuestDirectory(c,format){
  const guests=Array.isArray(c.guests)?c.guests:[];
  $('#guestDirectoryTitle').textContent=msg('guestTitle');$('#guestDirectoryNames').textContent=`${c.names.first} & ${c.names.second}`;$('#guestDirectoryDate').textContent=format({day:'numeric',month:'long',year:'numeric'}).replace(' г.','');
  $('#guestStats').setAttribute('aria-label',msg('guestStatsAria'));$('#guestStats').replaceChildren();
  const attending=guests.filter(item=>item.is_attending).reduce((total,item)=>total+Math.max(1,Number(item.guests_count)||1),0),declined=guests.filter(item=>!item.is_attending).length;
  for(const [value,label] of [[guests.length,msg('responses')],[attending,msg('attending')],[declined,msg('declined')]]){const block=document.createElement('div'),strong=document.createElement('strong'),span=document.createElement('span');strong.textContent=String(value);span.textContent=label;block.append(strong,span);$('#guestStats').append(block);}
  $('#guestCards').replaceChildren();$('#guestEmpty').hidden=guests.length>0;
  for(const guest of guests){const card=document.createElement('article');card.className='guest-card';const top=document.createElement('div');top.className='guest-card-top';const name=document.createElement('h2');name.textContent=String(guest.name||'—');const badge=document.createElement('span');badge.className=`guest-badge ${guest.is_attending?'is-attending':'is-declined'}`;badge.textContent=guest.is_attending?msg('willAttend'):msg('willNotAttend');top.append(name,badge);const count=document.createElement('p');count.className='guest-card-count';count.textContent=msg('people',Math.max(1,Number(guest.guests_count)||1));const wish=document.createElement('p');wish.className='guest-card-wish';wish.textContent=String(guest.wish||'').trim()||msg('noWish');card.append(top,count,wish);$('#guestCards').append(card);}
}
$('#calendarDownload').addEventListener('click',()=>{if(!activeConfig)return;const url=URL.createObjectURL(new Blob([createCalendarEvent({...activeConfig,language})],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='our-wedding.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);});

// Three continuous film chapters: click-to-play, then scroll-controlled seeking.
const story=$('#story'), opening=$('#openingVideo'), proposal=$('#proposalVideo'), forever=$('#foreverVideo'), proposalReverse=$('#proposalReverseVideo'), foreverReverse=$('#foreverReverseVideo'), poster=$('#scenePoster');
const storyVideos=[opening,proposal,forever,proposalReverse,foreverReverse],scrubVideos=[proposal,forever,proposalReverse,foreverReverse];
const STORY_PROGRESS_RATE=.05;
let state='closed',currentChapter='intro',raf=0,lastProgress=-1,lastRenderDirection=0,playingWatchdog,targetProgress=0,displayedProgress=0,lastAnimationTime=0,touchY=null,activeScrubVideo=null;
function chapter(name){if(currentChapter===name)return;currentChapter=name;for(const el of $$('.chapter')){const active=el.dataset.chapter===name;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active));}}
function visibleVideo(video){for(const v of storyVideos)v.classList.toggle('is-visible',v===video);}
function showPoster(name){poster.src=`assets/${name}.webp`;visibleVideo(null);}
function unlock(){clearTimeout(playingWatchdog);document.body.classList.remove('is-playing','intro-locked');document.documentElement.classList.remove('scroll-locked');for(const section of $$('main > section:not(#story), .footer'))section.inert=false;}
function lock(){document.body.classList.add('intro-locked');document.documentElement.classList.add('scroll-locked');for(const section of $$('main > section:not(#story), .footer'))section.inert=true;window.scrollTo({top:0,behavior:'instant'});}
function controlStoryScroll(active){document.body.classList.toggle('story-controlled',active);document.documentElement.classList.toggle('story-controlled',active);}
if(!guestDirectoryPage)lock();else unlock();
function setPlaybackStatus(key=''){playbackStatusKey=key;$('#playbackStatus').textContent=key?msg(key):'';}
function setFormStatus(key=''){formStatusKey=key;$('#formStatus').textContent=key?msg(key):'';}
function readyToScroll(){if(state!=='playing')return;opening.pause();unlock();state='scrolling';targetProgress=0;displayedProgress=0;lastAnimationTime=0;lastProgress=-1;lastRenderDirection=0;controlStoryScroll(true);story.classList.add('is-open');$('#boxHotspot').hidden=true;$('#caseHint').hidden=true;$('#videoError').hidden=true;setPlaybackStatus('playReady');$('#scrollHint').hidden=false;$('#storyCounter').textContent='01 / 03';chapter('promise');showPoster('ring-held');for(const video of [proposal,forever]){video.dataset.loading='true';video.preload='auto';video.load();}scheduleUpdate();}
function playbackFailed(){clearTimeout(playingWatchdog);opening.pause();document.body.classList.remove('is-playing');state='closed';$('#boxHotspot').hidden=true;$('#videoError').hidden=false;setPlaybackStatus('playFail');}
async function startStory(){
  if(state!=='closed')return;
  startMusic();
  $('#videoError').hidden=true;
  if(reduced.matches){unlock();state='static';showPoster('forever');chapter('forever');$('#boxHotspot').hidden=true;$('#caseHint').hidden=true;return;}
  state='playing';document.body.classList.add('is-playing');window.scrollTo({top:0,behavior:'instant'});$('#boxHotspot').hidden=true;$('#caseHint').hidden=true;setPlaybackStatus('playing');
  playingWatchdog=setTimeout(()=>{if(state==='playing')playbackFailed();},45000);
  try{opening.currentTime=0;await opening.play();if(state==='playing')visibleVideo(opening);}catch{if(state==='playing')playbackFailed();}
}
$('#boxHotspot').addEventListener('click',startStory);$('#retryStory').addEventListener('click',startStory);
opening.addEventListener('ended',readyToScroll);
opening.addEventListener('timeupdate',()=>{if(state==='playing'&&opening.duration){$('#storyProgress').style.transform=`scaleX(${opening.currentTime/opening.duration})`;if(opening.currentTime>=opening.duration-.1)readyToScroll();}});
opening.addEventListener('error',()=>{if(state==='playing')playbackFailed();});
function skip(){opening.pause();controlStoryScroll(false);unlock();state='static';$('#boxHotspot').hidden=true;$('#caseHint').hidden=true;$('#videoError').hidden=true;showPoster('forever');chapter('forever');$('#welcome').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}
$('#skipStory').addEventListener('click',skip);
$('.skip-link').addEventListener('click',e=>{e.preventDefault();skip();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state==='playing')skip();});
function requestSeek(video,time){
  video.dataset.targetTime=String(time);
  if(video.readyState<2||video.seeking)return;
  if(Math.abs(video.currentTime-time)>.025){try{video.currentTime=time;}catch{}}
}
for(const video of scrubVideos){
  video.addEventListener('seeked',()=>{if(state!=='scrolling')return;const target=Number(video.dataset.targetTime||0);if(Math.abs(video.currentTime-target)>.12)requestSeek(video,target);scheduleUpdate();});
  video.addEventListener('loadeddata',()=>{lastProgress=-1;scheduleUpdate();});
  video.addEventListener('canplay',()=>{lastProgress=-1;scheduleUpdate();});
  video.addEventListener('waiting',()=>{lastProgress=-1;scheduleUpdate();});
  video.addEventListener('error',()=>{lastProgress=-1;scheduleUpdate();});
}
function posterForProgress(progress){return progress<.3?'ring-held':progress<.65?'ring-worn':'forever';}
function pauseScrubVideos(except=null){for(const video of scrubVideos)if(video!==except&&!video.paused)video.pause();}
function scrubVideoFor(frame,direction){const backwards=direction<0;return frame.clip==='proposal'?(backwards?proposalReverse:proposal):(backwards?foreverReverse:forever);}
function renderStoryProgress(progress,direction=0){
  if(Math.abs(progress-lastProgress)<.0003&&direction===lastRenderDirection)return;lastProgress=progress;lastRenderDirection=direction;
  const frame=storyFrame(progress,proposal.duration||10,forever.duration||10);chapter(frame.chapter);
  poster.src=`assets/${posterForProgress(progress)}.webp`;
  const backwards=direction<0,target=scrubVideoFor(frame,direction);
  const baseDuration=frame.clip==='proposal'?(proposal.duration||10):(forever.duration||10),duration=target.duration||baseDuration;
  const desiredTime=backwards?Math.max(0,duration-.05-frame.time):frame.time;
  if(target.readyState>=3&&!target.error){
    pauseScrubVideos(target);visibleVideo(target);target.dataset.targetTime=String(desiredTime);
    const changed=activeScrubVideo!==target;activeScrubVideo=target;
    const drift=Math.abs(target.currentTime-desiredTime);
    if(changed||(!direction&&drift>.04)||(direction&&drift>.65))requestSeek(target,desiredTime);
    if(direction){
      const span=frame.clip==='proposal'?.58:.42;
      target.playbackRate=clamp((duration-.05)*STORY_PROGRESS_RATE/span,.5,1.5);
      if(target.paused&&!target.seeking)target.play().catch(()=>{});
    }else{
      target.pause();
      if(drift>.04)requestSeek(target,desiredTime);
    }
  }else{if(!target.error&&target.dataset.loading!=='true'){target.dataset.loading='true';target.preload='auto';target.load();}activeScrubVideo=null;pauseScrubVideos();showPoster(posterForProgress(progress));}
  $('#storyCounter').textContent=frame.chapter==='promise'?'01 / 03':frame.chapter==='together'?'02 / 03':'03 / 03';
  $('#storyProgress').style.transform=`scaleX(${progress})`;
}
function completeScrollStory(){displayedProgress=targetProgress=1;renderStoryProgress(1,0);state='complete';$('#scrollHint').hidden=true;lastAnimationTime=0;for(const video of [proposalReverse,foreverReverse])if(video.readyState<2&&video.dataset.loading!=='true'){video.dataset.loading='true';video.preload='auto';video.load();}const range=story.offsetHeight-$('.story-stage').offsetHeight;window.scrollTo({top:story.offsetTop+range,behavior:'instant'});controlStoryScroll(false);}
function resumeReverseStory(){
  if(state!=='complete')return;
  const range=story.offsetHeight-$('.story-stage').offsetHeight,end=story.offsetTop+range;
  if(window.scrollY>=end-1)return;
  const raw=clamp((window.scrollY-story.offsetTop)/range);state='scrolling';displayedProgress=1;targetProgress=raw;lastProgress=-1;lastRenderDirection=0;lastAnimationTime=0;poster.src='assets/forever.webp';window.scrollTo({top:end,behavior:'instant'});controlStoryScroll(true);$('#scrollHint').hidden=false;scheduleUpdate();
}
function updateStory(timestamp){
  raf=0;if(state!=='scrolling')return;
  if(!lastAnimationTime)lastAnimationTime=timestamp;const seconds=Math.min(.2,Math.max(0,(timestamp-lastAnimationTime)/1000));lastAnimationTime=timestamp;
  const direction=Math.sign(targetProgress-displayedProgress),currentFrame=storyFrame(displayedProgress,proposal.duration||10,forever.duration||10),currentVideo=scrubVideoFor(currentFrame,direction);
  if(direction&&!currentVideo.error&&currentVideo.readyState<3){renderStoryProgress(displayedProgress,direction);return;}
  displayedProgress=advanceStoryProgress(displayedProgress,targetProgress,seconds,STORY_PROGRESS_RATE);const moving=Math.abs(targetProgress-displayedProgress)>.0003?direction:0;renderStoryProgress(displayedProgress,moving);
  if(targetProgress>=.999&&displayedProgress>=.999){completeScrollStory();return;}
  if(Math.abs(targetProgress-displayedProgress)>.0003)scheduleUpdate();
}
function scheduleUpdate(){if(!raf)raf=requestAnimationFrame(updateStory);}
window.addEventListener('wheel',e=>{if(state!=='scrolling')return;e.preventDefault();const unit=e.deltaMode===1?24:e.deltaMode===2?innerHeight:1;targetProgress=clamp(targetProgress+clamp(e.deltaY*unit,-220,220)/1800);scheduleUpdate();},{passive:false});
window.addEventListener('touchstart',e=>{if(state==='scrolling')touchY=e.touches[0]?.clientY??null;},{passive:true});
window.addEventListener('touchmove',e=>{if(state!=='scrolling'||touchY===null)return;e.preventDefault();const next=e.touches[0]?.clientY??touchY,delta=touchY-next;touchY=next;targetProgress=clamp(targetProgress+clamp(delta,-90,90)/1100);scheduleUpdate();},{passive:false});
window.addEventListener('touchend',()=>{touchY=null;},{passive:true});
document.addEventListener('keydown',e=>{if(state!=='scrolling'||!['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home')targetProgress=0;else if(e.key==='End')targetProgress=1;else targetProgress=clamp(targetProgress+(['ArrowUp','PageUp'].includes(e.key)?-1:1)*(['PageDown','PageUp',' '].includes(e.key)?.2:.06));scheduleUpdate();});
window.addEventListener('scroll',resumeReverseStory,{passive:true});
window.addEventListener('resize',()=>{lastProgress=-1;scheduleUpdate();},{passive:true});
$('#replayStory').addEventListener('click',()=>{controlStoryScroll(false);unlock();state='closed';targetProgress=displayedProgress=0;lastAnimationTime=0;activeScrubVideo=null;for(const video of storyVideos){video.pause();video.currentTime=0;}story.classList.remove('is-open');showPoster('closed-box');chapter('intro');$('#boxHotspot').hidden=false;$('#caseHint').hidden=false;$('#videoError').hidden=true;setPlaybackStatus();$('#scrollHint').hidden=true;$('#storyCounter').textContent='';$('#storyProgress').style.transform='scaleX(0)';lastProgress=-1;lastRenderDirection=0;lock();$('#boxHotspot').focus({preventScroll:true});});
reduced.addEventListener('change',()=>{if(reduced.matches&&state==='playing'){opening.pause();controlStoryScroll(false);unlock();state='static';$('#caseHint').hidden=true;showPoster('forever');chapter('forever');}});

// Reveal only when JavaScript and IntersectionObserver are available.
if('IntersectionObserver'in window&&!reduced.matches){document.body.classList.add('js-reveal');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}},{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}

// RSVP appends a guest to the freshest backend record, then patches the full invitation.
const form=$('#rsvpForm');
const rsvpStorageKey=()=>`priglasi-rsvp-demo${config?.backendId?`-${config.backendId}`:''}`;
async function saveGuestToBackend(guest){
  const id=String(config.backendId),base=config.backend.baseUrl.replace(/\/$/,'');
  const latestResponse=await fetch(`${base}/${encodeURIComponent(id)}`,{headers:{Accept:'application/json'},cache:'no-store'});if(!latestResponse.ok)throw new Error('refresh-failed');
  const latest=await latestResponse.json();if(String(latest.priglosi_id)!==id)throw new Error('wrong-id');
  const payload=createGuestPatch(latest,id,guest);
  const patchResponse=await fetch(`${base}/${encodeURIComponent(id)}/full`,{method:'PATCH',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(payload)});if(!patchResponse.ok)throw new Error('patch-failed');
  backendRecord=payload;config={...config,guests:payload.guests};activeConfig={...activeConfig,guests:payload.guests};return payload;
}
form.addEventListener('change',()=>{$('#guestOptions').hidden=new FormData(form).get('attending')!=='yes';});
form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity()||!config)return;
  const data=new FormData(form),name=String(data.get('name')||'').trim();
  if(name.length<2){$('#guestName').setCustomValidity(msg('name'));$('#guestName').reportValidity();return;}$('#guestName').setCustomValidity('');
  const attending=data.get('attending')==='yes',guest={name,wish:String(data.get('note')||'').trim(),guests_count:attending?Number(data.get('guests')||1):1,is_attending:attending};
  const submit=$('#submitRsvp');submit.disabled=true;
  try{
    if(config.backendId){setFormStatus('saving');await saveGuestToBackend(guest);setFormStatus(attending?'yes':'no');form.reset();$('#guestOptions').hidden=true;}
    else{localStorage.setItem(rsvpStorageKey(),JSON.stringify({name,attending,guests:guest.guests_count,note:guest.wish}));setFormStatus('saved');}
    $('#formStatus').focus();
  }catch{setFormStatus(config.backendId?'sendFail':'saveFail');}finally{submit.disabled=false;}
});
$('#guestName').addEventListener('input',()=>$('#guestName').setCustomValidity(''));
try{const saved=JSON.parse(localStorage.getItem(rsvpStorageKey())||'null');if(saved&&config?.demo){$('#guestName').value=saved.name||'';const radio=form.querySelector(`input[value="${saved.attending?'yes':'no'}"]`);if(radio)radio.checked=true;$('#guestCount').value=String(saved.guests||1);$('#guestNote').value=saved.note||'';$('#guestOptions').hidden=!saved.attending;}}catch{}

// The first case tap is the browser-approved gesture that starts the soundtrack.
const backgroundMusic=$('#backgroundMusic');let musicEnabled=true,audioFailed=false;backgroundMusic.volume=.62;
function updateMusicControl(){const playing=!backgroundMusic.paused;$('#musicToggle').setAttribute('aria-pressed',String(playing));$('#musicToggle').setAttribute('aria-label',playing?msg('musicOn'):msg('musicOff'));$('.music-label').textContent=audioFailed?msg('musicFail'):(language==='ky'?kyText.Музыка:'Музыка');}
async function startMusic(){if(!musicEnabled)return;try{await backgroundMusic.play();audioFailed=false;}catch{audioFailed=true;}updateMusicControl();}
$('#musicToggle').addEventListener('click',()=>{musicEnabled=backgroundMusic.paused;if(musicEnabled)startMusic();else{backgroundMusic.pause();audioFailed=false;updateMusicControl();}});
backgroundMusic.addEventListener('play',updateMusicControl);backgroundMusic.addEventListener('pause',updateMusicControl);
document.addEventListener('visibilitychange',()=>{if(document.hidden)backgroundMusic.pause();else if(musicEnabled&&state!=='closed')startMusic();updateMusicControl();});
$('#languageToggle').addEventListener('click',()=>{const preservedState=state,preservedChapter=currentChapter,preservedTarget=targetProgress,preservedDisplayed=displayedProgress;language=language==='ru'?'ky':'ru';try{localStorage.setItem('priglasi-language',language);}catch{}applyStaticLanguage();if(config)renderContent(config,{preserveScroll:true});state=preservedState;currentChapter=preservedChapter;targetProgress=preservedTarget;displayedProgress=preservedDisplayed;if(playbackStatusKey)setPlaybackStatus(playbackStatusKey);if(formStatusKey)setFormStatus(formStatusKey);if(audioFailed)$('.music-label').textContent=msg('musicFail');});
