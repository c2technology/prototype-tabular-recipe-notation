# Prototype: Tabular Recipe Notation

A static GitHub Pages prototype that accepts a recipe URL and renders the recipe as a **Tabular Recipe Notation (TRN)** graphic.

TRN in this prototype means:

- ingredients are rows,
- phases (`Prep`, `Cook`, `Finish`) are columns,
- recipe steps are placed into table cells,
- the output is an inline SVG graphic that can be downloaded.

## Current Status

MVP deployed and verified on GitHub Pages.

Live app: <https://c2technology.github.io/prototype-tabular-recipe-notation/>

## Quick Start

```bash
npm run check
npm run serve
```

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
- `src/app.js` — URL reader, parser, TRN model, SVG renderer, UI wiring.
- `tests/` — lightweight no-dependency checks.
- `MEMORY.md` — durable project facts and decisions.
- `docs/handoff.md` — current state and next steps.
- `docs/findings/` — future extraction findings.
- `docs/decisions/` — future design decisions.

## Caveats

- Recipe-site extraction is best-effort.
- The public reader service may fail, rate-limit, or return content in unexpected shapes.
- This prototype does not store recipes or run a scraper backend.
