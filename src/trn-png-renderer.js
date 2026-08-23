const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxChars) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function textBlock(text, x, y, maxChars, options = {}) {
  const { size = 14, weight = 400, fill = '#1f2933', lineHeight = Math.round(size * 1.25), anchor = 'start', className = '' } = options;
  const lines = wrapText(text, maxChars);
  const attrs = [`font-size="${size}"`, `font-weight="${weight}"`, `fill="${fill}"`, `text-anchor="${anchor}"`];
  if (className) attrs.push(`class="${escapeXml(className)}"`);
  return `<text x="${x}" y="${y}" ${attrs.join(' ')}>${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('')}</text>`;
}

function validateFixture(fixture) {
  if (!fixture || typeof fixture !== 'object') throw new Error('TRN fixture must be an object');
  for (const key of ['title', 'finalDish', 'rows', 'columns', 'marks']) {
    if (!(key in fixture)) throw new Error(`TRN fixture missing ${key}`);
  }
  if (!Array.isArray(fixture.rows) || !fixture.rows.length) throw new Error('TRN fixture rows must be a non-empty array');
  if (!Array.isArray(fixture.columns) || !fixture.columns.length) throw new Error('TRN fixture columns must be a non-empty array');
  if (!Array.isArray(fixture.marks)) throw new Error('TRN fixture marks must be an array');
  if (fixture.spans !== undefined && !Array.isArray(fixture.spans)) throw new Error('TRN fixture spans must be an array');
  const rowIds = new Set(fixture.rows.map((row) => row.id));
  const columnIds = new Set(fixture.columns.map((column) => column.id));
  for (const span of fixture.spans || []) {
    if (!Array.isArray(span.rows) || !span.rows.length) throw new Error(`TRN span ${span.id || ''} must reference rows`);
    for (const row of span.rows) {
      if (!rowIds.has(row)) throw new Error(`TRN span references unknown row ${row}`);
    }
    if (!columnIds.has(span.fromColumn)) throw new Error(`TRN span references unknown fromColumn ${span.fromColumn}`);
    if (!columnIds.has(span.toColumn)) throw new Error(`TRN span references unknown toColumn ${span.toColumn}`);
  }
  for (const mark of fixture.marks) {
    if (!rowIds.has(mark.row)) throw new Error(`TRN mark references unknown row ${mark.row}`);
    if (!columnIds.has(mark.column)) throw new Error(`TRN mark references unknown column ${mark.column}`);
  }
}

function renderTrnSvg(fixture) {
  validateFixture(fixture);
  const margin = 28;
  const titleHeight = 70;
  const headerHeight = 74;
  const rowHeight = 46;
  const ingredientWidth = 220;
  const actionWidth = 118;
  const finalWidth = 132;
  const gridX = margin;
  const gridY = margin + titleHeight;
  const bottomPadding = 92;
  const width = margin * 2 + ingredientWidth + fixture.columns.length * actionWidth + finalWidth;
  const height = margin * 2 + titleHeight + headerHeight + fixture.rows.length * rowHeight + bottomPadding;
  const markSet = new Set(fixture.marks.map((mark) => `${mark.row}::${mark.column}`));
  const markRadius = 8;
  const rowIndexById = new Map(fixture.rows.map((row, index) => [row.id, index]));
  const columnIndexById = new Map(fixture.columns.map((column, index) => [column.id, index]));

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(fixture.title)} TRN grid">`;
  svg += '<rect width="100%" height="100%" fill="#fbfaf7"/>';
  svg += textBlock(fixture.title, margin, margin + 28, 56, { size: 26, weight: 700, fill: '#111827' });
  svg += textBlock('Read left to right: ingredients combine through actions into the finished dish.', margin, margin + 54, 90, { size: 13, fill: '#5f6b7a' });

  const headerY = gridY;
  const bodyY = gridY + headerHeight;
  svg += `<rect x="${gridX}" y="${headerY}" width="${ingredientWidth}" height="${headerHeight}" fill="#ede7dc" stroke="#c9bda9"/>`;
  svg += textBlock('Ingredients', gridX + 14, headerY + 34, 22, { size: 15, weight: 700, fill: '#2f302c' });

  fixture.columns.forEach((column, index) => {
    const x = gridX + ingredientWidth + index * actionWidth;
    svg += `<rect data-kind="action-column" data-column="${escapeXml(column.id)}" x="${x}" y="${headerY}" width="${actionWidth}" height="${headerHeight}" fill="#efe6d3" stroke="#c9bda9"/>`;
    svg += textBlock(column.label, x + actionWidth / 2, headerY + 30, 13, { size: 13, weight: 700, fill: '#3a3328', anchor: 'middle' });
  });

  const finalX = gridX + ingredientWidth + fixture.columns.length * actionWidth;
  svg += `<rect x="${finalX}" y="${headerY}" width="${finalWidth}" height="${headerHeight}" fill="#dfe8d6" stroke="#a9b99d"/>`;
  svg += textBlock('Finished', finalX + finalWidth / 2, headerY + 26, 12, { size: 13, weight: 700, fill: '#263322', anchor: 'middle' });
  svg += textBlock(fixture.finalDish, finalX + finalWidth / 2, headerY + 48, 12, { size: 13, weight: 700, fill: '#263322', anchor: 'middle' });

  fixture.rows.forEach((row, rowIndex) => {
    const y = bodyY + rowIndex * rowHeight;
    const fill = rowIndex % 2 === 0 ? '#fffdf8' : '#f7f3eb';
    svg += `<rect data-kind="ingredient-row" data-row="${escapeXml(row.id)}" x="${gridX}" y="${y}" width="${ingredientWidth}" height="${rowHeight}" fill="${fill}" stroke="#ddd3c2"/>`;
    svg += textBlock(row.label, gridX + 12, y + 27, 24, { size: 13, fill: '#22272e' });

    fixture.columns.forEach((column, columnIndex) => {
      const x = gridX + ingredientWidth + columnIndex * actionWidth;
      svg += `<rect x="${x}" y="${y}" width="${actionWidth}" height="${rowHeight}" fill="${fill}" stroke="#ddd3c2"/>`;
    });
    svg += `<rect x="${finalX}" y="${y}" width="${finalWidth}" height="${rowHeight}" fill="#eef5e9" stroke="#c9d6bd"/>`;
  });

  for (const span of fixture.spans || []) {
    const rowIndexes = span.rows.map((row) => rowIndexById.get(row)).sort((a, b) => a - b);
    const firstRow = rowIndexes[0];
    const lastRow = rowIndexes[rowIndexes.length - 1];
    const firstColumn = Math.min(columnIndexById.get(span.fromColumn), columnIndexById.get(span.toColumn));
    const lastColumn = Math.max(columnIndexById.get(span.fromColumn), columnIndexById.get(span.toColumn));
    const x = gridX + ingredientWidth + firstColumn * actionWidth + 8;
    const y = bodyY + firstRow * rowHeight + 8;
    const w = (lastColumn - firstColumn + 1) * actionWidth - 16;
    const h = (lastRow - firstRow + 1) * rowHeight - 16;
    svg += `<rect data-kind="combination-span" data-span="${escapeXml(span.id || span.label)}" x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="#8f6f35" stroke-width="2" stroke-dasharray="6 5"/>`;
    if (span.label) svg += textBlock(span.label, x + w - 10, y + 19, 12, { size: 12, weight: 700, fill: '#8f6f35', anchor: 'end' });
  }

  fixture.rows.forEach((row, rowIndex) => {
    const y = bodyY + rowIndex * rowHeight;
    fixture.columns.forEach((column, columnIndex) => {
      const x = gridX + ingredientWidth + columnIndex * actionWidth;
      if (markSet.has(`${row.id}::${column.id}`)) {
        svg += `<circle data-kind="participation-mark" data-row="${escapeXml(row.id)}" data-column="${escapeXml(column.id)}" cx="${x + actionWidth / 2}" cy="${y + rowHeight / 2}" r="${markRadius}" fill="#111827"/>`;
      }
    });
    svg += `<circle data-kind="participation-mark" data-row="${escapeXml(row.id)}" data-column="final" cx="${finalX + finalWidth / 2}" cy="${y + rowHeight / 2}" r="${markRadius}" fill="#111827"/>`;
  });

  svg += '</svg>';
  return svg;
}

function findChromium() {
  const candidates = [process.env.CHROMIUM_BIN, 'chromium', 'chromium-browser', 'google-chrome'];
  for (const candidate of candidates.filter(Boolean)) {
    try {
      execFileSync('which', [candidate], { stdio: 'ignore' });
      return candidate;
    } catch (_) {
      // continue
    }
  }
  throw new Error('PNG rendering requires chromium, chromium-browser, or google-chrome on PATH');
}

function renderTrnPngFile(fixture, outputPath) {
  const svg = renderTrnSvg(fixture);
  const out = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'trn-svg-'));
  const htmlPath = path.join(tempDir, 'diagram.html');
  const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const width = viewBoxMatch ? viewBoxMatch[1] : '1200';
  const height = viewBoxMatch ? viewBoxMatch[2] : '800';
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:${width}px;height:${height}px;overflow:hidden;background:#fbfaf7;}svg{display:block;width:${width}px;height:${height}px;}</style></head><body>${svg}</body></html>`;
  fs.writeFileSync(htmlPath, html);
  const chromium = findChromium();
  execFileSync(chromium, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--screenshot=${out}`,
    `--window-size=${width},${height}`,
    `file://${htmlPath}`,
  ], { stdio: 'ignore' });
  return out;
}

function main(argv) {
  const [, , fixturePath, outputPath] = argv;
  if (!fixturePath || !outputPath) {
    console.error('Usage: node src/trn-png-renderer.js <fixture.json> <output.png>');
    process.exit(2);
  }
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const out = renderTrnPngFile(fixture, outputPath);
  console.log(out);
}

if (require.main === module) main(process.argv);

module.exports = { renderTrnSvg, renderTrnPngFile };
