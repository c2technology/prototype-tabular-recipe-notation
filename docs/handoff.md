# Handoff

## Current State

A static browser prototype accepts a recipe URL, detects supported recipe markup, extracts ingredients and instructions, and renders a Tabular Recipe Notation graphic as inline SVG.

Live GitHub Pages URL: <https://c2technology.github.io/prototype-tabular-recipe-notation/>

Issue #17 adds the canonical Python/Pillow TRN PNG renderer for local and Docker use. The renderer consumes hand-authored TRN matrix fixtures and writes PNG bytes/files without Chromium, a browser, a GUI, or cloud services.

## What Works

- Built-in demo recipe renders without network access in the browser MVP.
- URL form validates recipe links and attempts metadata/reader ingestion.
- Markup detector currently supports schema.org `Recipe` JSON-LD.
- Reader fallback remains labeled as heuristic when markup metadata is unavailable.
- Extracted recipe summary displays title, timing, servings, ingredient count, and step count.
- SVG TRN graphic can be downloaded from the browser MVP.
- Python schema.org parser can normalize `Recipe` JSON-LD from HTML/script blocks or raw JSON-LD into source-backed recipe fields.
- Python/Pillow renderer can render hand-authored TRN matrix fixtures to PNG artifacts.
- Executable Gherkin behavior tests cover Python renderer output for brownies and Toll House fixtures.
- Renderer coverage command enforces 100% branch coverage for `trn_renderer/__init__.py`.
- Docker renderer workflow can run the Python renderer verification path and generate PNG artifacts without installing Python dependencies on the host.

## Verification

Run from the repository root:

```bash
npm run check
npm run coverage:trn-renderer
npm run coverage:recipe-parser
npm run render:trn-fixture
npm run render:trn-tollhouse
npm run docker:build
npm run docker:check
npm run docker:render
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/` and exercise the form or demo button for the browser MVP.

Generated PNG artifacts are written to:

```text
artifacts/fudgy-brownies-trn.png
artifacts/toll-house-cookie-trn.png
```

## Known Risks

- The static app depends on public CORS-friendly proxies; schema metadata may time out and trigger reader fallback.
- Reader fallback is heuristic and should not be treated as a standardized extraction.
- Ingredient-to-action cell assignment in the browser MVP is still approximate; uncertain method steps should remain in `General method` instead of being forced into ingredient rows.
- The TRN browser layout currently caps ingredients and steps to keep the SVG readable.
- The Python parser does not yet translate normalized recipes into TRN matrix rows/columns/marks.
- The Python renderer consumes hand-authored matrix fixtures only; URL-to-TRN generation still needs parser-to-matrix translation.

## Next Steps

1. Translate normalized recipe data into the TRN matrix model.
2. Generate a TRN PNG from a recipe URL in the local Docker image (#36).
3. Add persistence, auth, and deployment later only after the local Docker URL-to-PNG path is proven.

## GitHub Issues

- #17 Implement TRN PNG renderer in Python and Pillow.
- #32 Run Python TRN renderer in local Docker container.
- #12 Parse Schema.org Recipe JSON-LD into a normalized recipe object.
- #36 Generate TRN PNG from recipe URL in local Docker container.
