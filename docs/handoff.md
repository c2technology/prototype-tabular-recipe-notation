# Handoff

## Current State

A static browser prototype accepts a recipe URL, detects supported recipe markup, extracts ingredients and instructions, and renders a Tabular Recipe Notation graphic as inline SVG.

Live GitHub Pages URL: <https://c2technology.github.io/prototype-tabular-recipe-notation/>

Issue #17 adds the canonical Python/Pillow TRN PNG renderer intended for local use now and future headless AWS Lambda use. The renderer consumes hand-authored TRN matrix fixtures and writes PNG bytes/files without Chromium, a browser, or a GUI.

## What Works

- Built-in demo recipe renders without network access in the browser MVP.
- URL form validates recipe links and attempts metadata/reader ingestion.
- Markup detector currently supports schema.org `Recipe` JSON-LD.
- Reader fallback remains labeled as heuristic when markup metadata is unavailable.
- Extracted recipe summary displays title, timing, servings, ingredient count, and step count.
- SVG TRN graphic can be downloaded from the browser MVP.
- Python/Pillow renderer can render hand-authored TRN matrix fixtures to PNG artifacts.
- Executable Gherkin behavior tests cover Python renderer output for brownies and Toll House fixtures.
- Renderer coverage command enforces 100% branch coverage for `trn_renderer/__init__.py`.
- Docker renderer workflow can run the Python renderer verification path and generate PNG artifacts without installing Python dependencies on the host.
- Local Lambda/API Gateway-shaped Python handler can accept a TRN matrix JSON request and return a base64 `image/png` response or structured JSON `400` error.
- Invite-only Cognito Google OAuth is represented as repo-owned CloudFormation configuration with manual Cognito users as the invitation source, no committed tester email list, and a pre-signup trigger for Google sign-ins.

## Verification

Run from the repository root:

```bash
npm run check
npm run coverage:trn-renderer
npm run coverage:trn-api
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
- The Python renderer consumes hand-authored matrix fixtures only; recipe-to-matrix translation is a later issue.
- The local API handler is not deployed to AWS yet.

## Next Steps

1. Deploy authenticated AWS fixture PNG endpoint.
2. Add Amplify Bootstrap/jQuery frontend shell.
3. Add S3/DynamoDB persistence and recipe box features.
4. Add Schema.org parsing to normalized recipe data, then normalized recipe to TRN matrix translation.

## GitHub Issues

- #17 Implement TRN PNG renderer in Python and Pillow.
- #18 Add local Python API handler for TRN matrix to PNG.
- #19 Configure invite-only Cognito Google OAuth.
- #20 Deploy authenticated AWS fixture PNG endpoint.
