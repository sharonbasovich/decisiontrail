(function(root){
'use strict';
function selectCase(cases,id){return cases.find(c=>c.id===id)||cases[0]||null;}
// URL state is limited to reviewed IDs; the fragment remains available to skip links.
function caseFromUrl(cases,href){
 try{return selectCase(cases,new URL(href).searchParams.get('case'));}
 catch{return selectCase(cases,null);}
}
function caseUrl(cases,id,href){
 const record=selectCase(cases,id);
 if(!record)return null;
 try{const url=new URL(href);url.searchParams.set('case',record.id);return url.href;}
 catch{return null;}
}
function participationView(record){
 // These reviewed archival cases never infer a live opportunity from meeting dates.
 if(record.participation?.status !== 'unknown' || record.participation?.deadline != null) throw new Error('Unsupported participation evidence; requires new review.');
 return {title:'No current participation deadline verified',detail:'Historical meeting. Check the official item and City guidance for any later consideration. Unknown does not mean permanently closed.'};
}
function validateCases(cases){
 if(!Array.isArray(cases)||cases.length===0) throw new Error('Cases required');
 const ids=new Set();
 for(const c of cases){
  if(!/^2026\.[A-Z]+\d+\.\d+$/.test(c.id)||ids.has(c.id)) throw new Error('Invalid or duplicate item ID'); ids.add(c.id);
  if(c.source!=='https://secure.toronto.ca/council/agenda-item.do?item='+c.id) throw new Error('Source does not match item');
  if(c.archival!==true || !Number.isFinite(Date.parse(c.checkedAt))) throw new Error('Missing snapshot disclosure');
  for(const key of ['short','summary','notDecided','unknown','outcome']) if(typeof c[key]!=='string'||!c[key].trim()) throw new Error('Missing claim or qualification');
  if(!c.trail?.length||!c.locators?.length) throw new Error('Missing evidence locators');
  for(const step of c.trail) if(!step.body||!step.action||!step.date||!step.locators?.length) throw new Error('Incomplete trail evidence');
  participationView(c);
 }
 return true;
}
const api={selectCase,caseFromUrl,caseUrl,participationView,validateCases};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DecisionTrailCore=api;
})(typeof globalThis==='object'?globalThis:this);
