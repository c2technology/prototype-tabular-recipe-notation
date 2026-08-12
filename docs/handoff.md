# Handoff

## Current State

A static browser prototype accepts a recipe URL, detects supported recipe markup, extracts ingredients and instructions, and renders a Tabular Recipe Notation graphic as inline SVG.

Live GitHub Pages URL: <https://c2technology.github.io/prototype-tabular-recipe-notation/>

## What Works

- Built-in demo recipe renders without network access.
- URL form validates recipe links and attempts metadata/reader ingestion.
- Markup detector currently supports schema.org `Recipe` JSON-LD.
- Reader fallback remains labeled as heuristic when markup metadata is unavailable.
- Extracted recipe summary displays title, timing, servings, ingredient count, and step count.
- SVG TRN graphic can be downloaded.
- Local checks cover JavaScript syntax, parser/model/SVG behavior, and basic HTML structure.

## Verification

Run from the repository root:

```bash
npm run check
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/` and exercise the form or demo button.

## Known Risks

- The static app depends on public CORS-friendly proxies; schema metadata may time out and trigger reader fallback.
- Reader fallback is heuristic and should not be treated as a standardized extraction.
- Ingredient-to-action cell assignment is still approximate; uncertain method steps should remain in `General method` instead of being forced into ingredient rows.
- The TRN layout currently caps ingredients and steps to keep the SVG readable.

## Next Steps

1. Add more markup standards through detector/extractor pairs.
2. Add user-editable ingredient/step correction before rendering.
3. Improve ingredient/action relationship modeling so ambiguous matches are surfaced rather than guessed.
4. Test against 10-20 recipe sites and capture failures in `docs/findings/` or issue #2.
5. Explore more expressive TRN symbols for timing, equipment, heat level, and parallel prep.
6. Add PNG export if SVG download is not enough for sharing.

## GitHub Issues

- #1 Define TRN notation acceptance criteria.
- #2 Evaluate recipe extraction across real sites.
- #3 Enable and verify GitHub Pages deployment.
