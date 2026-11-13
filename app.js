'use strict';
(function(){
 const {cases,participationGuide}=DecisionTrailData;
 const {selectCase,caseFromUrl,caseUrl,participationView,validateCases}=DecisionTrailCore;
 const panel=document.querySelector('#case-detail'),list=document.querySelector('#case-list');
 function el(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
 function sourceLink(record,label){const a=el('a',label,'source-link');a.href=record.source;return a;}
 function evidence(record,locators){const d=el('details',undefined,'evidence');d.append(el('summary','Check this in the official record'));d.append(el('p','Find these sections: '+locators.join(' · ')));d.append(sourceLink(record,'Open '+record.id+' on the City website'));d.append(el('p','The link opens the item page, not a highlighted passage.','source-note'));return d;}
 try{validateCases(cases);}catch(e){panel.append(el('p','The example records could not be validated. Do not rely on this snapshot.','error'));return;}
 let selectedId=null;
 function render(id,announce=false){
  const c=selectCase(cases,id);selectedId=c.id;panel.replaceChildren();
  for(const b of list.querySelectorAll('button')) b.setAttribute('aria-pressed',String(b.dataset.id===c.id));
  const head=el('div',undefined,'detail-head');head.append(el('p',c.id+' · '+c.scope,'eyebrow'),el('h2',c.short),el('span',c.outcome,'outcome'));panel.append(head);
  const permalink=caseUrl(cases,c.id,window.location.href);
  if(permalink){const url=new URL(permalink);url.search='';url.searchParams.set('case',c.id);url.hash='case-detail';const link=el('a','Link to this archived example','case-permalink');link.href=url.href;head.append(link);}
  const answer=el('section',undefined,'answer');answer.append(el('h3','What this establishes'),el('p',c.summary,'answer-text'),evidence(c,c.locators));panel.append(answer);
  const boundary=el('section',undefined,'boundary');boundary.append(el('h3','What this does not establish'),el('p',c.notDecided));panel.append(boundary);
  const timeline=el('section',undefined,'trail');timeline.append(el('h3','The recorded path'));const ol=el('ol');for(const s of c.trail){const li=el('li');li.append(el('p',s.date,'step-date'),el('h4',s.body),el('p',s.action),evidence(c,s.locators));ol.append(li);}timeline.append(ol);panel.append(timeline);
  if(c.vote){const v=el('section',undefined,'vote');v.append(el('h3','Read the vote in context'));const tally=el('div',undefined,'tally');tally.append(el('strong',c.vote.yes+' yes / '+c.vote.no+' no'),el('span',c.vote.label+' · '+c.vote.result));v.append(tally,el('p',c.vote.meaning),evidence(c,c.vote.locators));panel.append(v);}
  const p=participationView(c),part=el('section',undefined,'participation');part.append(el('p','PARTICIPATION IS A SEPARATE QUESTION','eyebrow'),el('h3',p.title),el('p',p.detail),el('p',c.unknown,'specific-limit'));const links=el('div',undefined,'links');links.append(sourceLink(c,'Check the official item'));const guide=el('a','Read City participation guidance');guide.href=participationGuide;links.append(guide);part.append(links,el('p','Use the City’s official channels, not this prototype. Names and comments submitted to the City may become public.','source-note'));panel.append(part);
  panel.append(el('p','Evidence checked November 13, 2026 at 00:12 UTC · July 2026 historical meeting record','checked'));
  if(announce)document.querySelector('#announcement').textContent=c.short+' selected. '+c.outcome+'. Historical example; no current participation deadline verified.';
 }
 cases.forEach((c,i)=>{const b=el('button',undefined,'case-button');b.type='button';b.dataset.id=c.id;b.setAttribute('aria-controls','case-detail');b.setAttribute('aria-pressed','false');b.append(el('span','0'+(i+1),'case-number'),el('span',c.short,'case-title'),el('span',c.outcome,'case-status'));b.addEventListener('click',()=>{
   if(selectedId===c.id)return;
   const url=caseUrl(cases,c.id,window.location.href);
   if(url){try{window.history.pushState(null,'',url);}catch{/* Selection still works if URL mutation is unavailable. */}}
   render(c.id,true);
  });list.append(b);});
 window.addEventListener('popstate',()=>{
  const id=caseFromUrl(cases,window.location.href).id;
  if(id!==selectedId)render(id,true);
 });
 render(caseFromUrl(cases,window.location.href).id);
})();
