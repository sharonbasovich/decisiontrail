'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const core=require('../core'),{cases,participationGuide}=require('../cases');
const base='https://example.test/app/index.html';
for(const c of cases)test('reviewed case URL roundtrips '+c.id,()=>{
 const url=core.caseUrl(cases,c.id,base);assert.equal(core.caseFromUrl(cases,url),c);
 assert.equal(core.caseFromUrl(cases,base+'?case='+encodeURIComponent(c.id).replaceAll('.','%2E')),c);
});
test('unknown, malformed, absent and duplicate query handling is deterministic',()=>{
 for(const suffix of ['', '?case=missing','?case=%E0%A4%A','?case=%3Cscript%3E','#case-detail','#case=%E0%A4%A'])assert.equal(core.caseFromUrl(cases,base+suffix),cases[0]);
 assert.equal(core.caseFromUrl(cases,base+'?case='+cases[1].id+'&case='+cases[2].id),cases[1]);
 assert.equal(core.caseFromUrl(cases,'not a URL'),cases[0]);assert.equal(core.caseUrl([],null,base),null);
});
test('navigation URL preserves location and fragment, including file URLs',()=>{
 const url=new URL(core.caseUrl(cases,cases[2].id,base+'?view=compact#case-detail'));
 assert.equal(url.searchParams.get('view'),'compact');assert.equal(url.hash,'#case-detail');
 assert.equal(core.caseFromUrl(cases,core.caseUrl(cases,cases[1].id,'file:///tmp/decisiontrail/index.html#case-detail')),cases[1]);
});
// Small standard-library DOM double exercises application wiring, not native rendering/focus acceptance.
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.dataset={};this.listeners={};this.textContent='';}
 append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}
 setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}
 querySelectorAll(tag){return this.children.flatMap(c=>[...(c.tag===tag?[c]:[]),...c.querySelectorAll(tag)]);}
}
function app(href=base,failHistory=false){
 const panel=new Element('section'),list=new Element('div'),announcement=new Element('p');const event={};
 const document={activeElement:null,createElement:t=>new Element(t),querySelector:s=>({'#case-detail':panel,'#case-list':list,'#announcement':announcement}[s])};
 const stack=[href];let index=0,pushes=0;
 const window={location:{href},addEventListener:(type,fn)=>event[type]=fn,history:{pushState(_a,_b,url){if(failHistory)throw Error('unsupported');pushes++;stack.splice(++index);stack.push(url);window.location.href=url;}}};
 const move=delta=>{index+=delta;window.location.href=stack[index];event.popstate();};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),{DecisionTrailData:{cases,participationGuide},DecisionTrailCore:core,document,window,URL});
 return{panel,list,announcement,document,window,move,pop:()=>event.popstate(),pushes:()=>pushes,selected:()=>list.children.find(b=>b.attrs['aria-pressed']==='true').dataset.id,click(i){document.activeElement=list.children[i];list.children[i].listeners.click();},link:()=>panel.querySelectorAll('a').find(a=>a.className==='case-permalink')};
}
test('direct load, case selection, repeated click, Back and Forward restore case without stealing focus',()=>{
 const a=app(base+'?case='+cases[1].id+'#case-detail');assert.equal(a.selected(),cases[1].id);
 a.click(2);const focused=a.document.activeElement;assert.equal(a.selected(),cases[2].id);assert.equal(a.pushes(),1);
 a.click(2);assert.equal(a.pushes(),1);a.move(-1);assert.equal(a.selected(),cases[1].id);assert.equal(a.document.activeElement,focused);
 a.move(1);assert.equal(a.selected(),cases[2].id);assert.match(a.announcement.textContent,/Historical example/);
 assert.equal(app(a.window.location.href).selected(),cases[2].id);
});
test('return to initial no-query entry restores default; native skip fragment does not select another case',()=>{
 const a=app();a.click(1);const url=new URL(a.window.location.href);url.hash='case-detail';assert.equal(core.caseFromUrl(cases,url.href),cases[1]);
 a.move(-1);assert.equal(a.selected(),cases[0].id);
 assert.match(fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),/class="skip" href="#case-detail"/);
});
test('share link contains only case identifier and native detail anchor, not unrelated query data',()=>{
 const a=app(base+'?tracking=private&case='+cases[1].id+'#old');const url=new URL(a.link().href);
 assert.deepEqual([...url.searchParams], [['case',cases[1].id]]);assert.equal(url.hash,'#case-detail');
 assert.equal(a.link().textContent,'Link to this archived example');
});
test('history exception does not break selection or explicit share link',()=>{
 const a=app(base,true);a.click(2);assert.equal(a.selected(),cases[2].id);assert.equal(a.window.location.href,base);
 assert.equal(core.caseFromUrl(cases,a.link().href),cases[2]);assert.match(a.announcement.textContent,/selected/);
});

test('same-case fragment history keeps expanded detail subtree and announcement intact',()=>{
 const a=app(base+'?case='+cases[1].id);const first=a.panel.children[0];
 const detail=a.panel.querySelectorAll('details')[0];detail.open=true;a.document.activeElement=detail;
 const announcement=a.announcement.textContent;
 a.window.location.href+='\u0023case-detail';a.pop();
 assert.equal(a.panel.children[0],first);assert.equal(detail.open,true);assert.equal(a.document.activeElement,detail);
 assert.equal(a.announcement.textContent,announcement);
});
