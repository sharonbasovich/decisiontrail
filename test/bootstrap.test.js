'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const data=require('../cases'),core=require('../core');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const script=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.dataset={};this.listeners={};this.textContent='';}
 append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}
 setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}
 querySelectorAll(tag){return this.children.flatMap(c=>[...(c.tag===tag?[c]:[]),...c.querySelectorAll(tag)]);}
}
// VM executes the actual bootstrap with globals omitted; this DOM double is not native-browser acceptance.
function start(globals){
 const panel=new Element('section'),list=new Element('div'),announcement=new Element('p'),fallback=new Element('div');
 fallback.className='bootstrap-fallback';panel.append(fallback);
 const document={createElement:t=>new Element(t),querySelector:s=>({'#case-detail':panel,'#case-list':list,'#announcement':announcement}[s])};
 const window={location:{href:'https://example.test/index.html'},addEventListener(){},history:{pushState(){}}};
 let error;try{vm.runInNewContext(script,{document,window,URL,...globals});}catch(e){error=e;}
 return{panel,list,fallback,error};
}
test('static fallback precedes initialization and provides the three exact official record links',()=>{
 const fallback=html.match(/<section id="case-detail"[^>]*>([\s\S]*?)<\/section>/)[1];
 assert.match(fallback,/If this message remains, the examples could not start/);
 assert.match(fallback,/historical records, not verified current participation opportunities/);
 const hrefs=[...fallback.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(hrefs,data.cases.map(c=>c.source));
 assert.doesNotMatch(fallback,/loading\.\.\.|setTimeout|onclick/i);
});
for(const [label,globals] of [
 ['missing data script',{DecisionTrailCore:core}],
 ['missing core script',{DecisionTrailData:data}],
 ['both missing',{}],
 ['null dependencies',{DecisionTrailData:null,DecisionTrailCore:null}]
])test(label+' retains fallback and reports unavailable examples without throwing',()=>{
 const a=start(globals);assert.equal(a.error,undefined);assert.ok(a.panel.children.includes(a.fallback));
 assert.equal(a.list.children.length,0);assert.match(a.panel.children.at(-1).textContent,/could not start/);
});
test('invalid reviewed data retains fallback without rendering selectors',()=>{
 const invalid=structuredClone(data);invalid.cases[0].source='https://example.test/not-official';
 const a=start({DecisionTrailData:invalid,DecisionTrailCore:core});assert.equal(a.error,undefined);
 assert.ok(a.panel.children.includes(a.fallback));assert.equal(a.list.children.length,0);
});
test('render failure preserves static fallback and removes partial selectors',()=>{
 const a=start({DecisionTrailData:data,DecisionTrailCore:{...core,participationView(){throw Error('synthetic render failure');}}});
 assert.equal(a.error,undefined);assert.ok(a.panel.children.includes(a.fallback));assert.equal(a.list.children.length,0);
 assert.equal(a.panel.children.length,2); // Fallback plus explicit error; no half-rendered case.
});
test('successful bootstrap replaces fallback only with a complete selected record',()=>{
 const a=start({DecisionTrailData:data,DecisionTrailCore:core});assert.equal(a.error,undefined);
 assert.equal(a.panel.children.includes(a.fallback),false);assert.equal(a.list.children.length,3);
 assert.equal(a.panel.children.at(-1).className,'checked');
 assert.equal(a.list.children[0].attrs['aria-pressed'],'true');
});
