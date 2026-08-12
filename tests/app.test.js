const assert = require('node:assert/strict');
const { parseRecipeText, buildTrnModel, renderTrnSvg, readerUrl, metadataUrl, fetchRecipeSource, detectRecipeMarkup, extractRecipeFromMarkup, runRecipePipeline, DEMO_RECIPE_TEXT, SKYLER_READER_SAMPLE, SKYLER_JSON_LD_SAMPLE } = require('../src/app.js');

const recipe = parseRecipeText(DEMO_RECIPE_TEXT, 'demo');
assert.equal(recipe.title, 'Weeknight Tomato Pasta');
assert.equal(recipe.ingredients.length, 8);
assert.equal(recipe.steps.length, 5);
assert.equal(recipe.prep, '10 minutes');
assert.equal(recipe.cook, '20 minutes');
assert.equal(recipe.total, '30 minutes');

const model = buildTrnModel(recipe);
assert.deepEqual(model.phases, ['Prep', 'Cook', 'Finish']);
assert.ok(model.rows.some((row) => row.cells.Cook.length > 0), 'expected at least one cook cell');
assert.ok(model.rows.some((row) => row.cells.Finish.length > 0), 'expected at least one finish cell');

const svg = renderTrnSvg(recipe);
assert.match(svg, /<svg/);
assert.match(svg, /Weeknight Tomato Pasta/);
assert.match(svg, /Ingredient/);
assert.match(svg, /Prep/);
assert.match(svg, /Cook/);
assert.match(svg, /Finish/);

const proxied = readerUrl('https://www.allrecipes.com/recipe/24074/alysias-basic-meat-lasagna/');
assert.equal(
  proxied,
  'https://r.jina.ai/http://r.jina.ai/http://https://www.allrecipes.com/recipe/24074/alysias-basic-meat-lasagna/',
);
assert.equal(
  metadataUrl('https://diningwithskyler.com/ground-chicken-cutlet/'),
  'https://api.allorigins.win/raw?url=https%3A%2F%2Fdiningwithskyler.com%2Fground-chicken-cutlet%2F',
);

const skyler = parseRecipeText(SKYLER_READER_SAMPLE, 'skyler');
assert.equal(skyler.title, 'Crispy Oven-Fried Chicken Cutlet (Ground Chicken)');
assert.equal(skyler.basis, 'reader markdown section-aware recipe-card heuristic');
assert.deepEqual(skyler.ingredients.slice(0, 4), [
  '1 lb.ground chicken or ground turkey',
  '1 tsp kosher salt',
  '1 tsp garlic powder',
  '1 tsp onion powder',
]);
assert.ok(!skyler.steps.some((step) => /Why you’ll love this recipe|Ingredients|Directions/.test(step)), 'steps should not use table-of-contents links');
assert.ok(skyler.steps.includes('In a bowl, mix the ground meat with salt, garlic powder, and onion powder until just combined.'));
assert.ok(skyler.steps.includes('Bake at 450°F in a convection oven or air fry for 15 minutes.'));
assert.ok(skyler.steps.includes('Let it rest for 1–2 minutes, then slice.'));

const skylerSchema = parseRecipeText(SKYLER_JSON_LD_SAMPLE, 'skyler-json');
assert.equal(skylerSchema.basis, 'schema.org Recipe JSON-LD');
assert.equal(skylerSchema.title, 'Giant Crispy Oven-Fried Ground Chicken Cutlet');
assert.equal(skylerSchema.servings, '2');
assert.equal(skylerSchema.ingredients.length, 9);
assert.equal(skylerSchema.steps.length, 20);
assert.deepEqual(skylerSchema.instructionSections.map((step) => step.section).filter((section, index, all) => section && all.indexOf(section) === index), [
  'Prepthe Meat',
  'Shape the Cutlet',
  'Bread the First Side',
  'Flip+ Bread the Second Side',
  'Bake',
  'Broilto Finish',
  'Finish',
]);
assert.equal(skylerSchema.steps[0], 'In a bowl, mix the ground meat with salt, garlic powder, and onion powder until just combined.');
assert.equal(skylerSchema.steps.at(-1), 'Let it rest for 1–2 minutes, then slice.');

const skylerModel = buildTrnModel(skylerSchema);
assert.deepEqual(skylerModel.phases, [
  'Prep the Meat',
  'Shape the Cutlet',
  'Bread the First Side',
  'Flip + Bread the Second Side',
  'Bake',
  'Broil to Finish',
  'Finish',
]);
const saltRow = skylerModel.rows.find((row) => row.ingredient === '1 tsp kosher salt');
assert.ok(saltRow.cells['Prep the Meat'].some((step) => /mix the ground meat with salt/.test(step)));
assert.ok(!Object.values(saltRow.cells).flat().some((step) => /Let it sit|Place another large sheet/.test(step)), 'unmatched method steps should not be assigned to salt');
const generalRow = skylerModel.rows.find((row) => row.ingredient === 'General method');
assert.ok(generalRow, 'expected a General method row for schema steps that do not name an ingredient');
assert.ok(skylerModel.rows.find((row) => row.ingredient === '1 lb. ground chicken or ground turkey').cells['Shape the Cutlet'].some((step) => /Place the meat on top/.test(step)));
assert.ok(generalRow.cells.Finish.some((step) => /Let it rest/.test(step)));

const detectedSchema = detectRecipeMarkup([{ kind: 'html', url: 'skyler', text: SKYLER_JSON_LD_SAMPLE }]);
assert.equal(detectedSchema.standard, 'schema.org Recipe JSON-LD');
assert.equal(detectedSchema.confidence, 1);
const extractedSchema = extractRecipeFromMarkup(detectedSchema);
assert.equal(extractedSchema.title, 'Giant Crispy Oven-Fried Ground Chicken Cutlet');
assert.equal(extractedSchema.ingredients.length, 9);
assert.equal(extractedSchema.steps.length, 20);
const pipelineResult = runRecipePipeline([{ kind: 'html', url: 'skyler', text: SKYLER_JSON_LD_SAMPLE }]);
assert.equal(pipelineResult.recipe.basis, 'schema.org Recipe JSON-LD');
assert.deepEqual(pipelineResult.trn.phases, skylerModel.phases);
assert.ok(pipelineResult.svg.includes('<svg'));
const noMarkup = detectRecipeMarkup([{ kind: 'html', url: 'plain', text: '<html><title>No recipe</title></html>' }]);
assert.equal(noMarkup.standard, 'none');
assert.equal(noMarkup.confidence, 0);

async function testFetchSourceTimeoutFallback() {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).startsWith('https://api.allorigins.win/raw')) {
      return new Promise(() => {});
    }
    return { ok: true, text: async () => SKYLER_READER_SAMPLE };
  };
  try {
    const source = await fetchRecipeSource('https://diningwithskyler.com/ground-chicken-cutlet/', { metadataTimeoutMs: 25 });
    const parsed = parseRecipeText(source, 'skyler-fallback');
    assert.equal(parsed.basis, 'reader markdown section-aware recipe-card heuristic');
    assert.ok(calls[0].startsWith('https://api.allorigins.win/raw'), 'metadata fetch should be tried first');
    assert.ok(calls[1].startsWith('https://r.jina.ai/'), 'reader fallback should run after metadata timeout');
  } finally {
    global.fetch = originalFetch;
  }
}

async function main() {
  await testFetchSourceTimeoutFallback();
  console.log('app tests passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
