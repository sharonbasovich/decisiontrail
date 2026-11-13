'use strict';
// Source-level regressions for the observed decorative missing-glyph defect.
// These are not native browser rendering or screen-reader acceptance tests.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
test('brand and link decorations do not require Unicode arrow glyphs',()=>{
 for(const name of ['index.html','app.js']) assert.doesNotMatch(read(name),/[\u2197\u21b3]/u);
});
test('brand retains its accessible home label',()=>{
 assert.match(read('index.html'),/<a class="brand" href="\.\/index\.html" aria-label="DecisionTrail home">/);
});
test('brand decoration is a hidden non-focusable vector with explicit dimensions',()=>{
 const html=read('index.html');
 assert.match(html,/<span class="brand-mark" aria-hidden="true"><svg width="20" height="20"[^>]*focusable="false" aria-hidden="true"><path d="[^"]+"\/><\/svg><\/span>/);
 assert.doesNotMatch(html,/<svg[^>]*tabindex=/);
});
test('source link wording and destinations remain descriptive without decorations',()=>{
 const app=read('app.js');
 assert.match(app,/'Open '\+record\.id\+' on the City website'/);
 assert.match(app,/'Check the official item'/);
 assert.match(app,/'Read City participation guidance'/);
 assert.match(app,/a\.href=record\.source/);
 assert.match(app,/guide\.href=participationGuide/);
});
