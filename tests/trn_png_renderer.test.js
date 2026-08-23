const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { renderTrnSvg, renderTrnPngFile } = require('../src/trn-png-renderer.js');

const fixturePath = path.join(__dirname, 'fixtures', 'hand-authored-trn-matrix.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'trn-png-test-'));
const pngPath = path.join(outDir, 'fudgy-brownies-trn.png');

const svg = renderTrnSvg(fixture);

// Given a hand-authored TRN matrix fixture
// When the renderer creates a TRN diagram
// Then it contains ingredient rows and action columns, but no superfluous prose.
assert.match(svg, /Fudgy Brownies/);
assert.match(svg, /4 oz unsalted butter/);
assert.match(svg, /1\/4 tsp salt/);
assert.match(svg, /melt/);
assert.match(svg, /fold in/);
assert.match(svg, /Brownies/);
assert.doesNotMatch(svg, /recipe blog prose|must not appear/i);
assert.ok((svg.match(/data-kind="ingredient-row"/g) || []).length >= fixture.rows.length);
assert.ok((svg.match(/data-kind="action-column"/g) || []).length >= fixture.columns.length);
assert.ok((svg.match(/data-kind="participation-mark"/g) || []).length >= fixture.marks.length);
assert.ok((svg.match(/data-kind="combination-span"/g) || []).length >= fixture.spans.length);

// Given a hand-authored TRN matrix fixture
// When the PNG generator renders the fixture
// Then a PNG file is created.
renderTrnPngFile(fixture, pngPath);
const bytes = fs.readFileSync(pngPath);
assert.deepEqual([...bytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
assert.ok(bytes.length > 10_000, `expected non-trivial PNG, got ${bytes.length} bytes`);

console.log('trn png renderer behavior tests passed');
