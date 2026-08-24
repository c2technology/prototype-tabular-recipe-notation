const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Given, When, Then } = require('@cucumber/cucumber');
const { renderTrnSvg, renderTrnPngFile } = require('../../src/trn-png-renderer.js');

const fixtureDir = path.join(__dirname, '..', 'fixtures');

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

Given('the hand-authored TRN matrix fixture {string}', function (fixtureFile) {
  this.fixtureFile = fixtureFile;
  this.fixturePath = path.join(fixtureDir, fixtureFile);
  this.fixture = JSON.parse(fs.readFileSync(this.fixturePath, 'utf8'));
  this.outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'trn-cucumber-'));
  this.outputPath = path.join(this.outputDir, fixtureFile.replace(/\.json$/, '.png'));
});

When('the PNG generator renders the fixture', function () {
  this.svg = renderTrnSvg(this.fixture);
  this.pngPath = renderTrnPngFile(this.fixture, this.outputPath);
  this.pngBytes = fs.readFileSync(this.pngPath);
});

Then('a PNG file is created', function () {
  assert.equal(this.pngPath, this.outputPath);
  assert.deepEqual([...this.pngBytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.ok(this.pngBytes.length > 10_000, `expected non-trivial PNG for ${this.fixtureFile}, got ${this.pngBytes.length} bytes`);
});

Then('the PNG contains ingredient rows', function () {
  assert.match(this.svg, new RegExp(escapeRegex(this.fixture.rows[0].label)));
  assert.match(this.svg, new RegExp(escapeRegex(this.fixture.rows.at(-1).label)));
  assert.ok((this.svg.match(/data-kind="ingredient-row"/g) || []).length >= this.fixture.rows.length);
});

Then('the PNG contains action columns', function () {
  assert.match(this.svg, new RegExp(escapeRegex(this.fixture.columns[0].label)));
  const lastColumnWords = this.fixture.columns.at(-1).label.split(/\s+/).filter(Boolean);
  assert.match(this.svg, new RegExp(escapeRegex(lastColumnWords[0])));
  if (lastColumnWords.length > 1) {
    assert.match(this.svg, new RegExp(escapeRegex(lastColumnWords.at(-1))));
  }
  assert.ok((this.svg.match(/data-kind="action-column"/g) || []).length >= this.fixture.columns.length);
});

Then('the PNG contains participation marks', function () {
  assert.ok((this.svg.match(/data-kind="participation-mark"/g) || []).length >= this.fixture.marks.length);
  assert.ok((this.svg.match(/data-kind="combination-span"/g) || []).length >= (this.fixture.spans || []).length);
});

Then('the PNG contains the finished dish', function () {
  assert.match(this.svg, new RegExp(escapeRegex(this.fixture.finalDish)));
});

Then('the PNG contains only TRN marks and labels, not recipe prose', function () {
  assert.doesNotMatch(this.svg, /recipe blog prose|must not appear|perfect for parties|lunchboxes|bake sales|cozy weekends/i);
});
