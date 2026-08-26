# Prototype: Tabular Recipe Notation

A prototype that accepts recipe input and renders the recipe as a **Tabular Recipe Notation (TRN)** graphic.

The current deployed browser MVP is still a static GitHub Pages app that renders inline SVG from recipe URLs. The current backend-aligned renderer slice adds a canonical **Python/Pillow PNG renderer** that is intended to run locally now and later inside a headless AWS Lambda.

TRN target format for the Python PNG renderer means:

- ingredients are rows,
- actions/operations are columns moving left-to-right,
- participation marks show which ingredients are used in each action,
- optional spans show combined/intermediate preparations,
- the finished dish appears at the far right,
- superfluous recipe prose is removed,
- the output is a PNG artifact.

## Current Status

MVP deployed and verified on GitHub Pages.

Live app: <https://c2technology.github.io/prototype-tabular-recipe-notation/>

Issue #17 adds the canonical Python/Pillow renderer for fixture-to-PNG generation. It does not yet wire the renderer into the browser UI or AWS.

## Quick Start

```bash
npm run check
npm run coverage:trn-renderer
npm run render:trn-fixture
npm run render:trn-tollhouse
npm run serve
```

`npm run render:trn-fixture` writes `artifacts/fudgy-brownies-trn.png`.
`npm run render:trn-tollhouse` writes `artifacts/toll-house-cookie-trn.png`.

Open <http://127.0.0.1:4173/> to run the legacy browser MVP locally.

## Runtime Dependencies

The canonical PNG renderer uses Python/Pillow and does **not** require Chromium, a browser, a GUI, or browser-side rendering.

For local development, install the Python tooling listed in `requirements-dev.txt` or use distro packages equivalent to:

```bash
python3-pil python3-behave python3-coverage
```

## How It Works

### Browser MVP

1. The user enters a recipe URL.
2. The app ingests metadata HTML and reader text sources.
3. `MarkupDetector` determines whether sources expose supported recipe markup.
4. `RecipeExtractor` extracts ingredients, steps, sections, and metadata from the detected standard.
5. `TrnBuilder` builds a section-aware browser TRN model.
6. `TrnRenderer` renders the model as SVG and enables SVG download.

### Python PNG renderer

1. A hand-authored TRN matrix fixture defines rows, columns, marks/spans, and final dish label.
2. `trn_renderer` validates the fixture.
3. Pillow draws the grid directly into an RGB image.
4. Pillow writes PNG bytes or a PNG file.

## Architecture Interfaces

```text
Browser MVP:
RecipeIngestor -> RecipeSource[]
MarkupDetector -> MarkupDetection
RecipeExtractor -> ExtractedRecipe
TrnBuilder -> Browser TrnModel
TrnRenderer -> SVG

Python PNG renderer:
TRN Matrix Fixture -> render_trn_manifest -> render_trn_image -> render_trn_png_bytes/file -> PNG
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

- executable Gherkin scenarios run,
- fixture commands produce valid PNG files,
- no browser/Chromium is used,
- ingredients are on the left,
- actions move left-to-right,
- finished dish is on the right,
- superfluous prose is absent from rendered semantic manifest.

## Repository Context Map

- `index.html` — static page shell.
- `styles.css` — responsive app styling and TRN presentation.
- `src/app.js` — URL reader, parser, browser TRN model, SVG renderer, UI wiring.
- `trn_renderer/` — canonical Python/Pillow TRN matrix fixture to PNG renderer.
- `features/` — executable Gherkin behavior tests for the Python renderer.
- `tests/` — Node/browser-MVP checks, Python renderer unit tests, and fixtures.
- `docs/architecture.md` — current architecture, interfaces, diagrams, and renderer contracts.
- `MEMORY.md` — durable project facts and decisions.
- `docs/handoff.md` — current state and next steps.
- `docs/findings/` — extraction findings.
- `docs/decisions/` — design decisions.

## Caveats

- Recipe-site extraction in the browser MVP is best-effort.
- The public reader service may fail, rate-limit, or return content in unexpected shapes.
- The Python renderer currently consumes hand-authored TRN matrix fixtures; recipe parsing-to-matrix translation is a later story.
- This prototype does not yet store recipes or run the AWS backend.
