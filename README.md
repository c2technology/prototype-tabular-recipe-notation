# Prototype: Tabular Recipe Notation

A prototype that accepts recipe input and renders the recipe as a **Tabular Recipe Notation (TRN)** graphic.

The current deployed browser MVP is still a static GitHub Pages app that renders inline SVG from recipe URLs. The current local renderer slice adds a canonical **Python/Pillow PNG renderer** that runs locally and in Docker without browser or cloud dependencies.

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

Issue #17 adds the canonical Python/Pillow renderer for fixture-to-PNG generation. Issue #32 adds the local Docker workflow for pinned Python/dependency execution. Issue #12 adds a Python schema.org `Recipe` JSON-LD parser that normalizes source-backed recipe fields for the future URL-to-PNG Docker path. The current stack intentionally excludes AWS, Lambda, API Gateway, Cognito, OAuth, S3, and DynamoDB.

## Quick Start

Host Python path:

```bash
npm run check
npm run coverage:trn-renderer
npm run coverage:recipe-parser
npm run render:trn-fixture
npm run render:trn-tollhouse
npm run serve
```

Docker path, no host Python dependency installation required:

```bash
npm run docker:build
npm run docker:check
npm run docker:render
```

`npm run render:trn-fixture` writes `artifacts/fudgy-brownies-trn.png`.
`npm run render:trn-tollhouse` writes `artifacts/toll-house-cookie-trn.png`.

Open <http://127.0.0.1:4173/> to run the legacy browser MVP locally.

## Runtime Dependencies

The canonical PNG renderer uses Python/Pillow and does **not** require Chromium, a browser, a GUI, or browser-side rendering.

The Docker workflow pins the renderer/test environment to `python:3.11.9-slim`, installs `fonts-dejavu-core` for deterministic text rendering, and installs Python dependencies from `requirements-dev.txt`. It mounts `./artifacts` into the container so generated PNGs land on the host for review.

For local development without Docker, install the Python tooling listed in `requirements-dev.txt` or use distro packages equivalent to:

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

### Python Schema.org Recipe parser

1. Source HTML or raw JSON-LD is passed to `trn_recipe.parse_schema_org_recipe`.
2. The parser extracts `<script type="application/ld+json">` blocks or accepts raw JSON-LD documents.
3. It walks JSON-LD arrays and `@graph` structures to find schema.org `Recipe` nodes.
4. It returns a normalized recipe with title, source URL, ingredients, ordered instruction steps, instruction sections, recipe yield, and timing fields.
5. Ratings, reviews, images, author profiles, comments, nutrition, ads, and unrelated page metadata are not copied into parser output.

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

Python Schema.org parser:
HTML / JSON-LD -> parse_schema_org_recipe -> NormalizedRecipe
```

See `docs/architecture.md`, `docs/requirements.md`, and `docs/decisions/0003-tdd-pipeline-interfaces.md`.

## Verification Commands

```bash
npm run check
npm run coverage:trn-renderer
npm run coverage:recipe-parser
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
- `trn_recipe/` — Python schema.org `Recipe` JSON-LD parser and normalized recipe contract.
- `trn_renderer/` — canonical Python/Pillow TRN matrix fixture to PNG renderer.
- `features/` — executable Gherkin behavior tests for the Python parser and renderer.
- `tests/` — Node/browser-MVP checks, Python renderer unit tests, and fixtures.
- `docs/architecture.md` — current architecture, interfaces, diagrams, and renderer contracts.
- `MEMORY.md` — durable project facts and decisions.
- `docs/handoff.md` — current state and next steps.
- `docs/findings/` — extraction findings.
- `docs/decisions/` — design decisions.

## Caveats

- Recipe-site extraction in the browser MVP is best-effort.
- The public reader service may fail, rate-limit, or return content in unexpected shapes.
- The Python parser normalizes schema.org recipes, but recipe-to-TRN matrix translation is still a later story.
- This prototype does not yet store recipes or run a deployed backend.
