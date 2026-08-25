# Prototype: Tabular Recipe Notation

A static GitHub Pages prototype that accepts a recipe URL and renders the recipe as a **Tabular Recipe Notation (TRN)** graphic.

TRN target format for the new PNG generator means:

- ingredients are rows,
- actions/operations are columns moving left-to-right,
- participation marks show which ingredients are used in each action,
- the finished dish appears at the far right,
- superfluous recipe prose is removed,
- the output is a PNG review artifact.

The current browser MVP still renders SVG from recipe URLs. Issue #11 adds the first standalone TRN PNG renderer for hand-authored matrix fixtures while preserving the existing browser app.

## Current Status

MVP deployed and verified on GitHub Pages.

Live app: <https://c2technology.github.io/prototype-tabular-recipe-notation/>

## Quick Start

```bash
npm run check
npm run coverage:trn-renderer
npm run render:trn-fixture
npm run render:trn-tollhouse
npm run serve
```

`npm run render:trn-fixture` writes a local PNG review artifact to `artifacts/fudgy-brownies-trn.png`.
`npm run render:trn-tollhouse` writes a local PNG review artifact to `artifacts/toll-house-cookie-trn.png`.

Open <http://127.0.0.1:4173/> for the legacy browser MVP.

## How It Works

### Browser MVP

1. The user enters a recipe URL.
2. The app ingests metadata HTML and reader text sources.
3. `MarkupDetector` determines whether sources expose supported recipe markup.
4. `RecipeExtractor` extracts ingredients, steps, sections, and metadata from the detected standard.
5. `TrnBuilder` builds the current browser TRN model.
6. `TrnRenderer` renders the model as SVG and enables SVG download.

### Issue #11 PNG renderer slice

1. A hand-authored TRN matrix fixture defines rows, columns, marks/spans, and final dish label.
2. `src/trn-png-renderer.js` validates the fixture.
3. The renderer creates an SVG grid.
4. Headless Chromium converts the SVG/HTML wrapper to PNG.
5. The PNG is written to `artifacts/` as a review artifact.

## Architecture Interfaces

```text
Browser MVP:
RecipeIngestor -> RecipeSource[]
MarkupDetector -> MarkupDetection
RecipeExtractor -> ExtractedRecipe
TrnBuilder -> TrnModel
TrnRenderer -> SVG

Issue #11 renderer:
TRN Matrix Fixture -> renderTrnSvg -> renderTrnPngFile -> PNG
```

See `docs/architecture.md`, `docs/requirements.md`, and `docs/decisions/0003-tdd-pipeline-interfaces.md`.

## Verification Commands

```bash
npm run check
npm run coverage:trn-renderer
npm run render:trn-fixture
npm run render:trn-tollhouse
python3 -m http.server 4173 --bind 127.0.0.1
```

Browser verification should confirm:

- the page renders with no console errors,
- the demo recipe produces an SVG,
- a supported recipe URL renders an extracted recipe and SVG,
- SVG download is enabled after rendering.

Renderer verification should confirm:

- Cucumber/Gherkin scenarios execute,
- fixture commands produce PNG files,
- PNG artifacts are not cropped,
- ingredients are on the left,
- actions move left-to-right,
- finished dish is on the right,
- superfluous prose is absent.

## Repository Context Map

- `index.html` — static page shell.
- `styles.css` — responsive app styling and TRN presentation.
- `src/app.js` — URL reader, parser, browser TRN model, SVG renderer, UI wiring.
- `src/trn-png-renderer.js` — hand-authored TRN matrix fixture to SVG/PNG renderer.
- `tests/` — lightweight checks, Cucumber/Gherkin behavior tests, and fixtures.
- `docs/architecture.md` — current architecture, interfaces, diagrams, and renderer contracts.
- `MEMORY.md` — durable project facts and decisions.
- `docs/handoff.md` — current state and next steps.
- `docs/findings/` — extraction findings.
- `docs/decisions/` — design decisions.

## Caveats

- Recipe-site extraction is best-effort.
- The public reader service may fail, rate-limit, or return content in unexpected shapes.
- The issue #11 PNG renderer does not parse Schema.org JSON-LD yet.
- The issue #11 PNG renderer currently requires headless Chromium locally.
- This prototype does not store recipes or run a scraper backend.
