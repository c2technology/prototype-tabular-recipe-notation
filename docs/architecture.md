# Architecture

This document describes the current architecture of the Tabular Recipe Notation (TRN) prototype. It must stay aligned with code changes in the same commit whenever the application structure, interfaces, data model, fetch behavior, parser behavior, or renderer behavior changes.

## Current Working Concept

The app is a static GitHub Pages-compatible browser application. A user enters a recipe URL, the app ingests recipe sources through public CORS-friendly services, detects supported recipe markup, extracts a recipe, builds a TRN model, and renders the model as an inline SVG graphic.

The implementation currently lives in `src/app.js` with tests in `tests/app.test.js`. The architecture is intentionally small but now has explicit pipeline interfaces so each stage can be tested independently.

## Runtime Context

```mermaid
flowchart LR
  User[User]
  Browser[Static Browser App\nGitHub Pages]
  MetadataProxy[Metadata Proxy\napi.allorigins.win]
  ReaderProxy[Reader Proxy\nr.jina.ai]
  RecipeSite[Recipe Website]

  User -->|enters recipe URL| Browser
  Browser -->|HTML metadata fetch| MetadataProxy
  MetadataProxy --> RecipeSite
  Browser -->|reader markdown fallback| ReaderProxy
  ReaderProxy --> RecipeSite
  Browser -->|renders inline SVG| User
```

## Pipeline Overview

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
  I --> J[TrnModel]
  J --> K[TrnRenderer]
  K --> L[SVG string]
  L --> M[Browser DOM]
```

## Interface Contracts

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

### TrnModel

```js
{
  phases: string[],
  rows: Array<{
    ingredient: string,
    cells: Record<string, string[]>
  }>
}
```

Current limitation: `rows[].ingredient` may contain the synthetic `General method` row. Issue #5 tracks separating synthetic method rows from real ingredient rows.

## Implemented Functions

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

### Source fetchers

- `metadataUrl(inputUrl)` builds the CORS metadata proxy URL.
- `readerUrl(inputUrl)` builds the reader markdown fallback URL.
- `fetchRecipeSource(url, options)` tries metadata first with timeout; if metadata fails, hangs, or does not produce supported markup, it falls back to reader markdown.

### Markup detection

- `detectRecipeMarkup(sources)` scans provided sources for supported recipe markup.
- Current supported standard: schema.org `Recipe` JSON-LD.
- No markup returns `standard: 'none'` and `confidence: 0`.

### Extraction

- `parseRecipeFromJsonLd(rawText, sourceUrl)` parses `application/ld+json` script blocks or raw JSON-LD text, finds schema.org `Recipe` nodes, and extracts standardized fields.
- `extractRecipeFromMarkup(detection)` converts a successful detection into an `ExtractedRecipe`.
- `parseRecipeText(text, sourceUrl)` remains a compatibility helper. It tries JSON-LD first and then falls back to reader-markdown heuristics.

### TRN building

- `buildTrnModel(recipe)` turns an `ExtractedRecipe` into rows, phases, and cells.
- If `instructionSections` exists, phases are derived from source `HowToSection` names.
- If no structured sections exist, the fallback phases are `Prep`, `Cook`, and `Finish`.
- Unmatched structured steps currently go to a synthetic `General method` row.

### Rendering

- `renderTrnSvg(recipe)` builds a `TrnModel` and renders it as inline SVG.
- The browser stores the SVG for download.

## Form Submit Sequence

```mermaid
sequenceDiagram
  participant U as User
  participant UI as Browser UI
  participant M as Metadata Proxy
  participant R as Reader Proxy
  participant P as Parser/Pipeline
  participant S as SVG Renderer

  U->>UI: Paste recipe URL and click Render TRN
  UI->>UI: Show fetching status
  UI->>M: Fetch page HTML metadata with timeout
  alt Metadata returns supported JSON-LD
    M-->>UI: HTML / JSON-LD text
    UI->>P: parse schema.org Recipe
  else Metadata fails or times out
    UI->>R: Fetch reader markdown fallback
    R-->>UI: Markdown-like text
    UI->>P: parse fallback heuristics
  end
  P->>S: Build TRN model and SVG
  S-->>UI: SVG string
  UI->>U: Display SVG, summary, and enable download
```

## Testing Strategy

Tests are no-dependency Node/Python checks run by:

```bash
npm run check
```

`tests/app.test.js` covers:

- demo recipe parsing,
- reader and metadata proxy URL helpers,
- Dining with Skyler reader fallback extraction,
- schema.org `Recipe` JSON-LD extraction,
- section-aware TRN phase generation,
- no-markup detection,
- pipeline output shape,
- metadata timeout fallback.

`tests/check_html.py` covers static HTML sanity: required DOM IDs and app script reference.

## Known Limitations

- Static deployment depends on public proxy services for cross-origin recipe access.
- Only schema.org `Recipe` JSON-LD is treated as a standardized markup source today.
- Reader markdown fallback is heuristic and can be incomplete.
- Ingredient/action relationship mapping is approximate; issue #5 tracks notation cleanup, method-row separation, and false-positive matching.
- There is no persistent storage or backend scraper.

## Architecture Alignment Rule

Any PR that changes application structure, exported interfaces, parsing behavior, source-ingestion behavior, TRN model shape, rendering behavior, or major data contracts must update this document in the same commit as the code change.
