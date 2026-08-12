# Handoff

## Current State

A static browser prototype accepts a recipe URL, fetches readable recipe page text, extracts likely ingredients and instructions, and renders a Tabular Recipe Notation graphic as inline SVG.

## What Works

- Built-in demo recipe renders without network access.
- URL form validates recipe links and attempts a fetch through `r.jina.ai`.
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

- Real recipe extraction is best-effort and depends on markdown shape returned by the reader service.
- Some recipe pages block scrapers or return incomplete text.
- The TRN layout currently caps ingredients and steps to keep the SVG readable.

## Next Steps

1. Resolve GitHub Pages deployment blocker: issue #3.
2. Test against 10-20 recipe sites and capture failures in `docs/findings/` or issue #2.
3. Add schema.org Recipe JSON-LD extraction if a lightweight static-compatible source is found.
4. Add user-editable ingredient/step correction before rendering.
5. Explore more expressive TRN symbols for timing, equipment, heat level, and parallel prep.
6. Add PNG export if SVG download is not enough for sharing.

## GitHub Issues

- #1 Define TRN notation acceptance criteria.
- #2 Evaluate recipe extraction across real sites.
- #3 Enable and verify GitHub Pages deployment.
