'use strict';
// Source regressions for a test harness, not responsive or device acceptance.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../tools/viewport-check.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
test('harness loads the existing same-origin app without external dependencies', () => {
  assert.equal((html.match(/<iframe\b/g) || []).length, 1);
  assert.match(html, /<iframe[^>]*src="\.\.\/index\.html"/);
  assert.doesNotMatch(html, /(?:src|href)="(?:https?:)?\/\//);
});
test('harness exposes only the three specified CSS viewport widths', () => {
  const widths = [...html.matchAll(/<option value="(\d+)"/g)].map(m => m[1]);
  assert.deepEqual(widths, ['320', '390', '768']);
  assert.match(html, /height="1200"/);
});
test('native controls and frame have accessible labels and bounded claims', () => {
  assert.match(html, /<label for="width">/);
  assert.match(html, /<iframe[^>]*title="DecisionTrail app at the selected CSS viewport width"/);
  assert.match(html, /not physical-device, browser-emulation or operating-system preference acceptance/);
  assert.match(html, /does not test a reduced-motion preference/);
});
test('width changes affect only harness frame attributes, not app contents', () => {
  new vm.Script(script);
  assert.doesNotMatch(script, /contentWindow|contentDocument|postMessage|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|userAgent|matchMedia|eval\s*\(|innerHTML/);
  let onChange;
  const attrs = {};
  const frame = {style: {}, setAttribute: (key, value) => {attrs[key] = value;}};
  const control = {value: '390', addEventListener: (event, fn) => {assert.equal(event, 'change'); onChange = fn;}};
  const status = {textContent: ''};
  const nodes = {'width': control, 'app-frame': frame, 'width-status': status};
  vm.runInNewContext(script, {document: {getElementById: id => {assert.ok(Object.hasOwn(nodes, id)); return nodes[id];}}});
  onChange();
  assert.equal(frame.style.width, '390px');
  assert.deepEqual(attrs, {width: '390'});
  assert.match(status.textContent, /390 CSS pixels/);
  control.value = '9999'; onChange();
  assert.equal(frame.style.width, '390px');
  assert.deepEqual(attrs, {width: '390'});
});
