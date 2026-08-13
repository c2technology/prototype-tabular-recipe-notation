const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { parseRecipeText, buildTrnModel, renderTrnSvg, readerUrl, metadataUrl, fetchRecipeSource, detectRecipeMarkup, extractRecipeFromMarkup, runRecipePipeline, DEMO_RECIPE_TEXT, SKYLER_READER_SAMPLE, SKYLER_JSON_LD_SAMPLE } = require('../src/app.js');

const fixture = (name) => fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');

const recipe = parseRecipeText(DEMO_RECIPE_TEXT, 'demo');
assert.equal(recipe.title, 'Weeknight Tomato Pasta');
assert.equal(recipe.ingredients.length, 8);
assert.equal(recipe.steps.length, 5);
assert.equal(recipe.prep, '10 minutes');
assert.equal(recipe.cook, '20 minutes');
assert.equal(recipe.total, '30 minutes');

const model = buildTrnModel(recipe);
assert.deepEqual(model.phases, ['Prep', 'Cook', 'Finish']);
assert.equal(model.rows.filter((row) => row.type === 'ingredient').length, recipe.ingredients.length);
assert.equal(model.procedure.length, recipe.steps.length);
assert.ok(model.rows.every((row) => Object.values(row.cells).flat().length === 0), 'fallback TRN should preserve procedure separately instead of guessing ingredient cells');

const svg = renderTrnSvg(recipe);
assert.match(svg, /<svg/);
assert.match(svg, /Weeknight Tomato Pasta/);
assert.match(svg, /Ingredient/);
assert.match(svg, /Procedure/);

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
const skylerIngredientRows = skylerModel.rows.filter((row) => row.type === 'ingredient');
assert.equal(skylerIngredientRows.length, skylerSchema.ingredients.length, 'TRN inventory should exactly match source recipeIngredient entries');
assert.ok(!skylerModel.rows.some((row) => row.label === 'General method' || row.label === 'Method lane'), 'deterministic translator should not invent synthetic ingredient or method rows');
assert.equal(skylerModel.procedure.length, skylerSchema.steps.length);
assert.deepEqual(skylerModel.procedure.slice(0, 2).map((unit) => ({ section: unit.section, stepNumber: unit.stepNumber, text: unit.text })), [
  { section: 'Prep the Meat', stepNumber: 1, text: 'In a bowl, mix the ground meat with salt, garlic powder, and onion powder until just combined.' },
  { section: 'Prep the Meat', stepNumber: 2, text: 'Let it sit for a few minutes while you prep.' },
]);
assert.ok(skylerModel.rows.every((row) => Object.values(row.cells).flat().length === 0), 'schema.org prose instructions must not be guessed into ingredient cells');

const genericFixtures = [
  ['schema-sectioned-recipe.json', ['Prep', 'Cook'], 3, 4],
  ['schema-flat-steps-recipe.json', ['Procedure'], 2, 2],
  ['schema-string-instructions-recipe.json', ['Procedure'], 3, 2],
];
for (const [file, phases, ingredientCount, stepCount] of genericFixtures) {
  const genericRecipe = parseRecipeText(fixture(file), file);
  const genericTrn = buildTrnModel(genericRecipe);
  assert.equal(genericRecipe.basis, 'schema.org Recipe JSON-LD');
  assert.deepEqual(genericTrn.phases, phases);
  assert.equal(genericTrn.rows.filter((row) => row.type === 'ingredient').length, ingredientCount);
  assert.equal(genericTrn.procedure.length, stepCount);
  assert.ok(genericTrn.rows.every((row) => Object.values(row.cells).flat().length === 0), `${file} should not guess ingredient/action cells`);
}

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
assert.ok(pipelineResult.svg.includes('Procedure'));
assert.ok(pipelineResult.svg.includes('In a bowl, mix the ground meat'));
assert.ok(!pipelineResult.svg.includes('mix seasoning'), 'core markup translator should render source procedure text, not heuristic action labels');
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
