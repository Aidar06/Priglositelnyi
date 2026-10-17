export const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
export function storyFrame(progress,proposalDuration,foreverDuration){
  const p=clamp(progress);
  return {chapter:p<.36?'promise':p<.69?'together':'forever',clip:p<.58?'proposal':'forever',time:p<.58?clamp(p/.58)*Math.max(0,proposalDuration-.05):clamp((p-.58)/.42)*Math.max(0,foreverDuration-.05)};
}
export function calendarRows(year,month){
  const start=(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7;
  const days=new Date(Date.UTC(year,month+1,0)).getUTCDate();
  return Array.from({length:Math.ceil((start+days)/7)},(_,row)=>Array.from({length:7},(_,col)=>{const d=row*7+col-start+1;return d>0&&d<=days?d:null;}));
}
export function icsEscape(value){return String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');}
export function createCalendarEvent(c){
  const utc=s=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const localized=c.venue?c:{...c,...(c.locales?.[c.language||'ru']||c.locales?.ru)};const ky=c.language==='ky';
  const summary=ky?`${localized.names.first} менен ${localized.names.second} — үйлөнүү тою`:`Свадьба ${localized.names.first} и ${localized.names.second}`;
  const description=localized.demo?(ky?'Демо маалыматтар. Күнү жана жери тууралуу уюштуруучулардан тактаңыз.':'Демонстрационные данные. Уточните дату и место у организаторов.'):localized.welcome;
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Priglasi//Wedding//RU','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:wedding-${utc(localized.date)}@priglasi.local`,`DTSTAMP:${utc(new Date())}`,`DTSTART:${utc(localized.date)}`,`DTEND:${utc(localized.endDate)}`,`SUMMARY:${icsEscape(summary)}`,`LOCATION:${icsEscape(`${localized.venue.name}, ${localized.venue.city}${localized.demo?'':`, ${localized.venue.address}`}`)}`,`DESCRIPTION:${icsEscape(description)}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
