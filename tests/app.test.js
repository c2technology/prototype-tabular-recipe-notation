const assert = require('node:assert/strict');
const { parseRecipeText, buildTrnModel, renderTrnSvg, readerUrl, metadataUrl, DEMO_RECIPE_TEXT, SKYLER_READER_SAMPLE, SKYLER_JSON_LD_SAMPLE } = require('../src/app.js');

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
assert.equal(skyler.basis, 'reader markdown recipe-card heuristic');
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

console.log('app tests passed');
