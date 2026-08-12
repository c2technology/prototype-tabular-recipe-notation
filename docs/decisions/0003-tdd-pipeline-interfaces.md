# Decision: TDD pipeline interfaces

## Context

The prototype needs to move from an all-in-one script toward a testable pipeline. Jim clarified that even prototypes should proceed through light requirements, architecture/interfaces, tests first, and then implementation.

## Decision

Use a small static-page-compatible pipeline with explicit interfaces:

```text
RecipeIngestor
  input: URL
  output: RecipeSource[]

MarkupDetector
  input: RecipeSource[]
  output: MarkupDetection { standard, confidence, source }

RecipeExtractor
  input: MarkupDetection
  output: ExtractedRecipe { title, ingredients, steps, sections, metadata }

TrnBuilder
  input: ExtractedRecipe
  output: TrnModel { columns, rows, cells }

TrnRenderer
  input: TrnModel
  output: SVG string
```

## Initial Standard Support

Start with schema.org `Recipe` JSON-LD because it is the common recipe-page interchange format exposed by WP Recipe Maker and many recipe sites.

## Fallbacks

Reader-markdown fallback can remain, but it must be labeled as heuristic and should not masquerade as a standardized recipe extraction.

## Consequences

- Each pipeline piece can be tested independently.
- The render button becomes a coordinator instead of the parser.
- Future standards can be added by creating another detector/extractor pair.
