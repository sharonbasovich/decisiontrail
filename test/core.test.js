'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const {cases}=require('../cases');const {selectCase,validateCases,participationView}=require('../core');
test('three reviewed real records validate',()=>assert.equal(validateCases(cases),true));
test('known item selection preserves exact record',()=>assert.equal(selectCase(cases,'2026.TE34.98'),cases[1]));
test('unknown selection safely chooses first record; empty list yields null',()=>{assert.equal(selectCase(cases,'<script>'),cases[0]);assert.equal(selectCase([],'x'),null)});
test('all real cases remain archival with unknown participation',()=>{for(const c of cases){assert.equal(c.archival,true);assert.equal(c.participation.deadline,null);assert.match(participationView(c).detail,/Unknown does not mean permanently closed/);}});
test('real MM vote is procedural and lost despite majority',()=>{const c=cases[0];assert.equal(c.vote.yes,13);assert.equal(c.vote.no,9);assert.equal(c.vote.result,'Lost');assert.match(c.vote.meaning,/two-thirds/);assert.match(c.notDecided,/not approval or rejection/)});
test('real TE report target is not represented as participation deadline',()=>{assert.match(cases[1].summary,/second quarter of 2027/);assert.match(cases[1].unknown,/not a meeting date/);assert.equal(cases[1].participation.deadline,null)});
test('real IE trail does not invent a next Council stage',()=>{assert.equal(cases[2].trail.length,1);assert.match(cases[2].notDecided,/does not.*Council considers/);assert.match(cases[2].unknown,/not inspected/)});
// Synthetic mutation tests below are not extra source-verified cases.
for(const [name,mutate] of [
 ['duplicate identity',a=>a.push(structuredClone(a[0]))],
 ['mismatched evidence URL',a=>a[0].source='https://example.com/'],
 ['missing snapshot',a=>a[0].archival=false],
 ['missing qualification',a=>a[0].notDecided=''],
 ['missing evidence',a=>a[0].trail[0].locators=[]],
 ['invented deadline',a=>a[0].participation.deadline='2027-01-01'],
 ['invented open status',a=>a[0].participation.status='open']])test('synthetic invalid record rejected: '+name,()=>{const a=structuredClone(cases);mutate(a);assert.throws(()=>validateCases(a));});
