import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {calendarRows,storyFrame,createCalendarEvent} from '../dist/story-model.js';
const root=path.resolve(import.meta.dirname,'../dist');
const config=JSON.parse(fs.readFileSync(path.join(root,'content.json'),'utf8'));
assert.equal(calendarRows(2027,5)[2][6],20,'Wedding must be on Sunday June 20');
assert.equal(calendarRows(2028,1).flat().filter(Boolean).length,29,'Leap year');
assert.equal(storyFrame(-1,10,10).time,0,'Reverse overscroll clamp');
assert.equal(storyFrame(1,10,10).clip,'forever');
assert(storyFrame(1,10,10).time<10,'Never seek beyond last decodable frame');
assert.equal(storyFrame(.58,10,10).time,0,'Clip transition');
assert.equal(storyFrame(.2,10,10).chapter,'promise');
assert.equal(storyFrame(.5,10,10).chapter,'together');
const ics=createCalendarEvent(config);assert(ics.includes('DTSTART:20270620T110000Z'),'Bishkek to UTC');assert(ics.includes('\r\nEND:VCALENDAR'));
const kyIcs=createCalendarEvent({...config,language:'ky'});assert(kyIcs.includes('SUMMARY:Айдар менен Алина — үйлөнүү тою'),'Kyrgyz calendar export');
assert.equal(config.locales.ky.schedule.length,config.locales.ru.schedule.length,'Both languages need the same schedule');
for(const name of ['opening.mp4','proposal.mp4','forever.mp4','closed-box.webp','ring-held.webp','ring-worn.webp','forever.webp'])assert(fs.statSync(path.join(root,'assets',name)).size>1000,`Missing asset ${name}`);
for(const file of ['index.html','app.js','style.css','fonts.css','content.json']){const text=fs.readFileSync(path.join(root,file),'utf8');assert(!/HIGGSFIELD_API_KEY|Authorization: Key/.test(text),'No secrets/client credentials');}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('id="languageToggle"')&&html.includes('data-language="ky"'),'Russian/Kyrgyz switch');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const url=match[1];if(!url.startsWith('http')&&!url.startsWith('data:'))assert(fs.existsSync(path.join(root,url)),`Missing file ${url}`);}
console.log('Passed: calendar, leap year, scroll timeline boundaries, timezone export, assets and client secret checks.');
