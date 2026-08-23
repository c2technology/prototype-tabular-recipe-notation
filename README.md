# Prototype: Tabular Recipe Notation

A static GitHub Pages prototype that accepts a recipe URL and renders the recipe as a **Tabular Recipe Notation (TRN)** graphic.

TRN target format for the new PNG generator means:

- ingredients are rows,
- actions/operations are columns moving left-to-right,
- participation marks show which ingredients are used in each action,
- the finished dish appears at the far right,
- superfluous recipe prose is removed,
- the output is a PNG review artifact.

The current browser MVP still renders SVG from recipe URLs. Issue #11 adds the first standalone TRN PNG renderer for a hand-authored matrix fixture.

## Current Status

MVP deployed and verified on GitHub Pages.

Live app: <https://c2technology.github.io/prototype-tabular-recipe-notation/>

## Quick Start

```bash
npm run check
npm run render:trn-fixture
npm run render:trn-tollhouse
npm run serve
```

`npm run render:trn-fixture` writes a local PNG review artifact to `artifacts/fudgy-brownies-trn.png`.
`npm run render:trn-tollhouse` writes a local PNG review artifact to `artifacts/toll-house-cookie-trn.png`.

Open <http://127.0.0.1:4173/>.

## How It Works

1. The user enters a recipe URL.
2. The static page fetches page HTML through a CORS-capable metadata proxy and looks for schema.org `Recipe` JSON-LD.
3. If JSON-LD is present, the parser uses standardized `recipeIngredient`, `recipeYield`, duration fields, and `recipeInstructions` / `HowToSection` data.
4. If metadata is unavailable, the parser falls back to readable markdown text through `r.jina.ai`.
5. The renderer builds an ingredient-by-phase TRN model.
6. The page renders the model as SVG and enables SVG download.

## Verification Commands

```bash
npm run check
python3 -m http.server 4173 --bind 127.0.0.1
```

Browser verification should confirm:

- the page renders with no console errors,
- the demo recipe produces an SVG,
- a supported recipe URL renders an extracted recipe and SVG,
- SVG download is enabled after rendering.

## Repository Context Map

- `index.html` — static page shell.
- `styles.css` — responsive app styling and TRN presentation.
- `src/app.js` — URL reader, parser, legacy TRN model, SVG renderer, UI wiring.
- `src/trn-png-renderer.js` — hand-authored TRN matrix fixture to SVG/PNG renderer.
- `tests/` — lightweight no-dependency checks and fixtures.
- `docs/architecture.md` — current architecture and renderer contracts.
- `MEMORY.md` — durable project facts and decisions.
- `docs/handoff.md` — current state and next steps.
- `docs/findings/` — future extraction findings.
- `docs/decisions/` — future design decisions.

## Caveats

- Recipe-site extraction is best-effort.
- The public reader service may fail, rate-limit, or return content in unexpected shapes.
- This prototype does not store recipes or run a scraper backend.
