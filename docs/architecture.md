# Architecture

This document describes the current architecture of the Tabular Recipe Notation (TRN) prototype. It must stay aligned with code changes in the same commit whenever application structure, exported interfaces, parsing behavior, source-ingestion behavior, renderer behavior, model shape, or major data contracts change.

## Current working concept

The repository currently contains two working slices:

1. **Browser MVP** — a static GitHub Pages-compatible browser application in `src/app.js`. A user enters a recipe URL, the app ingests recipe sources through public CORS-friendly services, detects supported recipe markup, extracts recipe data, builds a browser TRN model, and renders inline SVG.
2. **Python PNG renderer** — a canonical Python/Pillow renderer in `trn_renderer/`. It renders hand-authored TRN matrix fixtures directly to PNG bytes/files without Chromium, a browser, a GUI, or browser-side rendering. This is the path intended for a future headless AWS Lambda handler.
3. **Local Docker renderer environment** — a pinned `python:3.11.9-slim` container that installs `fonts-dejavu-core` plus `requirements-dev.txt`, runs renderer verification, and generates PNG review artifacts into a mounted `artifacts/` directory without requiring host Python dependency installation.
4. **Local Python API handler** — a Lambda/API Gateway-shaped handler in `trn_api/` that accepts a JSON TRN matrix request body and returns either a base64-encoded PNG response or a structured JSON validation error. It is local-only for now and does not require AWS services.
5. **Invite-only Cognito auth configuration** — a CloudFormation template in `infra/cognito-auth.template.json` configures a Cognito user pool, Google identity provider, Hosted UI client, and a pre-signup trigger that checks sign-ins against manually created Cognito users. No tester email addresses or Google secrets are committed.

## Product direction

TRN is a grid-style recipe notation inspired by the Recipe Grid reference at <https://toddschiller.com/artifacts/recipe-grid/#p=brownies>.

For the Python PNG renderer contract:

- rows are ingredients,
- columns are actions/operations moving left-to-right,
- marks show ingredient participation in an action,
- optional spans show combined/intermediate preparations,
- the finished dish appears at the far right,
- superfluous recipe prose is removed,
- the output is a PNG artifact.

## Runtime context

```mermaid
flowchart LR
  User[User]
  Browser[Static Browser App\nGitHub Pages]
  MetadataProxy[Metadata Proxy\napi.allorigins.win]
  ReaderProxy[Reader Proxy\nr.jina.ai]
  RecipeSite[Recipe Website]
  Fixture[Hand-authored TRN\nMatrix Fixture JSON]
  PyRenderer[Python trn_renderer\nPillow]
  ApiHandler[Local trn_api.handler\nLambda/API Gateway shape]
  ApiResponse[Base64 image/png\nAPI response]
  Png[PNG Artifact / Bytes]

  User -->|enters recipe URL| Browser
  Browser -->|HTML metadata fetch| MetadataProxy
  MetadataProxy --> RecipeSite
  Browser -->|reader markdown fallback| ReaderProxy
  ReaderProxy --> RecipeSite
  Browser -->|renders inline SVG| User

  Fixture --> PyRenderer
  PyRenderer -->|draws directly with Pillow| Png
  Fixture --> ApiHandler
  ApiHandler --> PyRenderer
  ApiHandler --> ApiResponse
```

## Browser MVP pipeline

```mermaid
flowchart TD
  A[Recipe URL] --> B[RecipeIngestor]
  B --> C[RecipeSource array]
  C --> D[MarkupDetector]
  D --> E{Supported markup?}
  E -->|schema.org Recipe JSON-LD| F[RecipeExtractor]
  E -->|none / timeout| G[Reader Markdown Heuristic]
  F --> H[ExtractedRecipe]
  G --> H
  H --> I[TrnBuilder]
  I --> J[Browser TrnModel]
  J --> K[TrnRenderer]
  K --> L[SVG string]
  L --> M[Browser DOM]
```

## Browser interface contracts

These are lightweight JavaScript object contracts, not TypeScript types.

### RecipeSource

```js
{
  kind: 'html' | 'reader-markdown',
  url: string,
  text: string
}
```

### MarkupDetection

```js
{
  standard: 'schema.org Recipe JSON-LD' | 'none',
  confidence: number,
  source: RecipeSource | null,
  parsedRecipe: ExtractedRecipe | null
}
```

### ExtractedRecipe

```js
{
  title: string,
  sourceUrl: string,
  basis: string,
  ingredients: string[],
  steps: string[],
  instructionSections: null | Array<{ text: string, section: string }>,
  prep: string,
  cook: string,
  total: string,
  servings: string
}
```

### Browser TrnModel

```js
{
  phases: string[],
  rows: Array<{
    ingredient: string,
    cells: Record<string, string[]>
  }>
}
```

Current limitation: the browser MVP model is not the Product Owner's target TRN matrix. The current backlog moves toward a PNG matrix generator where rows are ingredients and columns are actions.

## Browser implemented functions

```mermaid
classDiagram
  class SourceFetchers {
    readerUrl(inputUrl)
    metadataUrl(inputUrl)
    fetchRecipeSource(url, options)
  }

  class MarkupDetector {
    detectRecipeMarkup(sources)
  }

  class RecipeExtractor {
    parseRecipeFromJsonLd(rawText, sourceUrl)
    parseRecipeText(text, sourceUrl)
    extractRecipeFromMarkup(detection)
  }

  class TrnBuilder {
    buildTrnModel(recipe)
  }

  class TrnRenderer {
    renderTrnSvg(recipe)
  }

  class Pipeline {
    runRecipePipeline(sources)
  }

  SourceFetchers --> MarkupDetector
  MarkupDetector --> RecipeExtractor
  RecipeExtractor --> TrnBuilder
  TrnBuilder --> TrnRenderer
  Pipeline --> MarkupDetector
  Pipeline --> RecipeExtractor
  Pipeline --> TrnBuilder
  Pipeline --> TrnRenderer
```

## Python PNG renderer pipeline

```mermaid
flowchart LR
  Fixture[TRN Matrix Fixture]
  Validate[Fixture validation]
  Manifest[render_trn_manifest]
  Image[render_trn_image]
  Bytes[render_trn_png_bytes]
  File[render_trn_png_file]
  PNG[PNG]

  Fixture --> Validate
  Validate --> Manifest
  Manifest --> Image
  Image --> Bytes
  Bytes --> File
  Bytes --> PNG
  File --> PNG
```

## Local API handler pipeline

```mermaid
flowchart LR
  Event[API Gateway-like event\nbody + isBase64Encoded]
  Decode[Decode plain/base64 JSON body]
  Validate[TRN matrix validation]
  Render[render_trn_png_bytes]
  PngResp[200 image/png\nbase64 body]
  ErrorResp[400 application/json\nstructured error]

  Event --> Decode
  Decode --> Validate
  Validate --> Render
  Render --> PngResp
  Decode --> ErrorResp
  Validate --> ErrorResp
```

`trn_api.handler.handler(event, context)` is intentionally Lambda-shaped but local-only for this story. It accepts API Gateway-style events so the next AWS story can wrap or reuse the same contract.

Supported request forms:

```python
{"body": "{...TRN matrix JSON...}", "isBase64Encoded": False}
{"body": "<base64 utf-8 JSON>", "isBase64Encoded": True}
```

Successful response:

```python
{
  "statusCode": 200,
  "headers": {"Content-Type": "image/png", "Cache-Control": "no-store"},
  "isBase64Encoded": True,
  "body": "<base64 PNG bytes>"
}
```

Error response:

```python
{
  "statusCode": 400,
  "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
  "isBase64Encoded": False,
  "body": "{\"error\":\"invalid_trn_matrix\",\"message\":\"...\"}"
}
```

Current error categories:

- `invalid_request` for missing/malformed event body or base64 payload,
- `invalid_json` for non-JSON bodies,
- `invalid_trn_matrix` for renderer fixture validation failures.

## Docker renderer workflow

```mermaid
flowchart LR
  Host[Developer machine\nDocker only]
  Compose[docker compose]
  Image[prototype-trn-renderer:local\npython:3.11.9-slim]
  Deps[requirements-dev.txt]
  Verify[verify command\nunittest + behave + coverage + fixture sanity]
  Render[render-fixtures command]
  Artifacts[Mounted host artifacts/]

  Host --> Compose
  Compose --> Image
  Deps --> Image
  Image --> Verify
  Image --> Render
  Render --> Artifacts
```

Docker files:

- `Dockerfile` pins the Python runtime, installs deterministic font assets, and installs repo-owned dependencies.
- `docker-compose.yml` defines the local `renderer` service and mounts `./artifacts:/app/artifacts`.
- `scripts/docker-renderer.sh` exposes `verify` and `render-fixtures` commands.

Docker commands:

```bash
npm run docker:build
npm run docker:check
npm run docker:render
```

The Docker workflow intentionally runs only the Python renderer verification path, not the existing static browser MVP. It exists so the renderer can be tested without host Python package installation and with a controlled Python version/dependency set.

## Python PNG renderer contract

The renderer consumes a TRN matrix fixture with this shape:

```js
{
  title: string,
  finalDish: string,
  rows: Array<{ id: string, label: string }>,
  columns: Array<{ id: string, label: string }>,
  spans?: Array<{
    id?: string,
    label?: string,
    rows: string[],
    fromColumn: string,
    toColumn: string
  }>,
  marks: Array<{ row: string, column: string }>
}
```

Ignored/superfluous fixture fields may exist for testing, but renderer output must not include them.

## Python PNG renderer module

`trn_renderer` exports:

```python
FixtureValidationError
render_trn_manifest(fixture) -> dict
render_trn_image(fixture) -> PIL.Image.Image
render_trn_png_bytes(fixture) -> bytes
render_trn_png_file(fixture, output_path) -> pathlib.Path
```

### `render_trn_manifest(fixture)`

- validates fixture structure and references,
- returns semantic render metadata for tests and future API metadata,
- includes title, final dish, ingredient rows, action columns, participation marks, combination spans, and rendered text,
- excludes superfluous fixture prose.

### `render_trn_image(fixture)`

- creates an RGB Pillow image,
- draws ingredient rows on the left,
- draws action columns left-to-right,
- draws one consistent participation mark for each `marks[]` entry,
- draws optional combination spans for each `spans[]` entry,
- draws the finished dish column on the right.

### `render_trn_png_bytes(fixture)`

- renders a Pillow image,
- serializes it to PNG bytes,
- returns bytes suitable for a future Lambda/API Gateway response body.

### `render_trn_png_file(fixture, output_path)`

- renders PNG bytes,
- creates the output directory if needed,
- writes the PNG file,
- returns the resolved output path.

## Invite-only Cognito auth configuration

```mermaid
flowchart LR
  Admin[Admin]
  UserPool[Cognito User Pool\nmanual users]
  Google[Google OAuth]
  HostedUI[Cognito Hosted UI]
  Trigger[Pre-signup Lambda\ninvite-only check]
  Client[Future frontend/client]
  Tokens[Cognito tokens\nid token includes verified email]
  Rejected[Rejected sign-in]

  Admin -->|AdminCreateUser| UserPool
  Client --> HostedUI
  HostedUI --> Google
  Google --> HostedUI
  HostedUI --> Trigger
  Trigger -->|ListUsers email match exists| UserPool
  Trigger -->|invited| Tokens
  Trigger -->|not invited| Rejected
```

Auth resources are defined in `infra/cognito-auth.template.json`:

- `TrnUserPool` uses email usernames, auto-verifies email, and sets `AdminCreateUserConfig.AllowAdminCreateUserOnly` to block public self-signup.
- `GoogleIdentityProvider` reads Google OAuth client values from deploy-time parameters, not committed secrets.
- `TrnUserPoolClient` enables Hosted UI authorization-code flow with `openid`, `email`, and `profile` scopes.
- `InviteOnlyPreSignUpFunction` queries Cognito `ListUsers` in the current user pool and rejects Google sign-ins when no manually created Cognito user already has that email.
- `TrnUserPoolDomain` creates the Cognito hosted UI domain from a deploy-time prefix.

The auth contract is documented in `docs/auth.md`. Cognito remains the invitation source; application code must not carry a hardcoded tester email list.

## Commands

```bash
npm run check
npm run coverage:trn-renderer
npm run coverage:trn-api
npm run render:trn-fixture
npm run render:trn-tollhouse
npm run docker:build
npm run docker:check
npm run docker:render
npm run serve
```

Fixture rendering commands produce local review artifacts under:

```text
artifacts/
```

Generated PNG files are local review artifacts and are not committed.

## Testing strategy

`npm run check` runs:

- JavaScript syntax checks for the existing browser MVP,
- existing browser app behavior tests,
- Python TRN PNG renderer unit/edge-case tests,
- local Python API handler tests,
- invite-only Cognito auth configuration tests,
- executable Gherkin behavior tests with `behave`,
- HTML sanity checks,
- JSON fixture sanity checks,
- Docker configuration checks.

Issue #17's renderer tests verify:

- executable Gherkin scenarios bind to step definitions and render both fixture PNGs,
- a fixture can define ingredient rows, action columns, marks, spans, and final dish label,
- valid PNG bytes and files are produced,
- semantic manifest contains ingredient rows,
- semantic manifest contains action columns,
- semantic manifest contains participation marks and spans,
- semantic manifest contains the finished dish,
- superfluous prose is absent from renderer output,
- validation rejects malformed fixture references,
- CLI success and usage-error paths are covered.

`npm run coverage:trn-renderer` measures branch coverage for `trn_renderer/__init__.py` and enforces 100% for that renderer module.

Issue #18's API handler tests verify:

- valid plain JSON request bodies return `200` PNG responses,
- valid base64-encoded JSON request bodies return `200` PNG responses,
- PNG responses use `Content-Type: image/png` and `isBase64Encoded: true`,
- missing event bodies, non-object events, invalid base64, invalid JSON, and invalid TRN matrices return structured JSON `400` errors,
- executable Gherkin scenarios cover the valid and invalid local handler flows.

`npm run coverage:trn-api` measures branch coverage for `trn_api/` and enforces 100% for the local handler module.

Issue #19's auth tests verify:

- CloudFormation parses as JSON,
- public self-signup is blocked through Cognito configuration,
- email is the Cognito user identity attribute,
- Google OAuth is configured through deploy-time parameters rather than committed secrets,
- Hosted UI client uses authorization-code flow and `openid email profile` scopes,
- pre-signup Lambda trigger is attached and queries Cognito for an existing invited user,
- no committed tester email list controls access,
- docs explain manual `AdminCreateUser` invites and the signed-in user identity contract.

## Known limitations

- The browser MVP still uses public CORS-friendly proxies and best-effort extraction.
- The browser MVP output is legacy SVG and does not yet use the Python PNG renderer.
- The Python PNG renderer does not parse Schema.org JSON-LD.
- The Python PNG renderer does not translate recipe steps into TRN rows/columns/marks.
- The Python PNG renderer is exposed only through local fixture commands and a local Lambda-shaped handler; no deployed AWS endpoint exists yet.

Future issues will add AWS auth/deployment, persistence, Schema.org parsing, normalized recipe to TRN matrix translation, and cached TRN PNG generation from recipe URLs.

## Architecture alignment rule

Any PR that changes application structure, exported interfaces, parsing behavior, source-ingestion behavior, TRN model shape, rendering behavior, or major data contracts must update this document in the same commit as the code change.
