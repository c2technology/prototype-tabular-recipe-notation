const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { renderTrnSvg, renderTrnPngFile } = require('../src/trn-png-renderer.js');

const fixtureDir = path.join(__dirname, 'fixtures');
const fixtureFiles = [
  'hand-authored-trn-matrix.json',
  'toll-house-cookie-trn-matrix.json',
];

for (const fixtureFile of fixtureFiles) {
  const fixturePath = path.join(fixtureDir, fixtureFile);
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'trn-png-test-'));
  const pngPath = path.join(outDir, fixtureFile.replace(/\.json$/, '.png'));

  const svg = renderTrnSvg(fixture);

  // Given a hand-authored TRN matrix fixture
  // When the renderer creates a TRN diagram
  // Then it contains ingredient rows and action columns, but no superfluous prose.
  assert.match(svg, new RegExp(fixture.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(svg, new RegExp(fixture.rows[0].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(svg, new RegExp(fixture.rows.at(-1).label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(svg, new RegExp(fixture.columns[0].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  const lastColumnWords = fixture.columns.at(-1).label.split(/\s+/).filter(Boolean);
  assert.match(svg, new RegExp(lastColumnWords[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  if (lastColumnWords.length > 1) {
    assert.match(svg, new RegExp(lastColumnWords.at(-1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(svg, new RegExp(fixture.finalDish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(svg, /recipe blog prose|must not appear|perfect for parties|lunchboxes|bake sales|cozy weekends/i);
  assert.ok((svg.match(/data-kind="ingredient-row"/g) || []).length >= fixture.rows.length);
  assert.ok((svg.match(/data-kind="action-column"/g) || []).length >= fixture.columns.length);
  assert.ok((svg.match(/data-kind="participation-mark"/g) || []).length >= fixture.marks.length);
  assert.ok((svg.match(/data-kind="combination-span"/g) || []).length >= (fixture.spans || []).length);

  // Given a hand-authored TRN matrix fixture
  // When the PNG generator renders the fixture
  // Then a PNG file is created.
  renderTrnPngFile(fixture, pngPath);
  const bytes = fs.readFileSync(pngPath);
  assert.deepEqual([...bytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.ok(bytes.length > 10_000, `expected non-trivial PNG for ${fixtureFile}, got ${bytes.length} bytes`);
}

const invalidCases = [
  [null, /TRN fixture must be an object/],
  [{ title: 'Invalid' }, /TRN fixture missing finalDish/],
  [{ title: 'Invalid', finalDish: 'X', rows: [], columns: [{ id: 'a', label: 'A' }], marks: [] }, /rows must be a non-empty array/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [], marks: [] }, /columns must be a non-empty array/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], marks: 'bad' }, /marks must be an array/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], spans: 'bad', marks: [] }, /spans must be an array/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], spans: [{ id: 's', rows: [], fromColumn: 'c', toColumn: 'c' }], marks: [] }, /s must reference rows/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], spans: [{ rows: [], fromColumn: 'c', toColumn: 'c' }], marks: [] }, /TRN span  must reference rows/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], spans: [{ id: 's', rows: ['missing'], fromColumn: 'c', toColumn: 'c' }], marks: [] }, /unknown row missing/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], spans: [{ id: 's', rows: ['r'], fromColumn: 'missing', toColumn: 'c' }], marks: [] }, /unknown fromColumn missing/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], spans: [{ id: 's', rows: ['r'], fromColumn: 'c', toColumn: 'missing' }], marks: [] }, /unknown toColumn missing/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], marks: [{ row: 'missing', column: 'c' }] }, /unknown row missing/],
  [{ title: 'Invalid', finalDish: 'X', rows: [{ id: 'r', label: 'R' }], columns: [{ id: 'c', label: 'C' }], marks: [{ row: 'r', column: 'missing' }] }, /unknown column missing/],
];
for (const [fixture, message] of invalidCases) {
  assert.throws(() => renderTrnSvg(fixture), message);
}

const minimalFixture = {
  title: 'Minimal',
  finalDish: 'Done',
  rows: [{ id: 'only', label: 'Only ingredient' }],
  columns: [{ id: 'act', label: 'act' }],
  marks: [{ row: 'only', column: 'act' }],
};
const minimalSvg = renderTrnSvg(minimalFixture);
assert.match(minimalSvg, /Minimal/);
assert.equal((minimalSvg.match(/data-kind="combination-span"/g) || []).length, 0);

const labelOnlySpanFixture = {
  ...minimalFixture,
  spans: [{ label: 'single span', rows: ['only'], fromColumn: 'act', toColumn: 'act' }],
};
assert.match(renderTrnSvg(labelOnlySpanFixture), /data-span="single span"/);

const cliMissingArgs = spawnSync(process.execPath, [path.join(__dirname, '..', 'src', 'trn-png-renderer.js')], { encoding: 'utf8' });
assert.equal(cliMissingArgs.status, 2);
assert.match(cliMissingArgs.stderr, /Usage: node src\/trn-png-renderer\.js/);

const cliOutDir = fs.mkdtempSync(path.join(os.tmpdir(), 'trn-png-cli-test-'));
const cliPngPath = path.join(cliOutDir, 'fixture.png');
const cliSuccess = spawnSync(process.execPath, [
  path.join(__dirname, '..', 'src', 'trn-png-renderer.js'),
  path.join(fixtureDir, fixtureFiles[0]),
  cliPngPath,
], { encoding: 'utf8' });
assert.equal(cliSuccess.status, 0, cliSuccess.stderr);
assert.match(cliSuccess.stdout, new RegExp(cliPngPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
const cliBytes = fs.readFileSync(cliPngPath);
assert.deepEqual([...cliBytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const priorPath = process.env.PATH;
const priorChromiumBin = process.env.CHROMIUM_BIN;
try {
  process.env.PATH = '';
  process.env.CHROMIUM_BIN = '';
  assert.throws(() => renderTrnPngFile(JSON.parse(fs.readFileSync(path.join(fixtureDir, fixtureFiles[0]), 'utf8')), path.join(os.tmpdir(), 'missing-chromium.png')), /PNG rendering requires chromium/);
} finally {
  process.env.PATH = priorPath;
  if (priorChromiumBin === undefined) delete process.env.CHROMIUM_BIN;
  else process.env.CHROMIUM_BIN = priorChromiumBin;
}

console.log('trn png renderer behavior tests passed');
