# Decision: Schema-first recipe parsing

## Context

Dining with Skyler exposed a weakness in the original reader-markdown parser: ingredients happened to be detectable, but directions were being inferred from transformed markdown rather than the recipe source of truth.

## Decision

The app now determines whether a page has standardized recipe metadata before using markdown heuristics.

Parsing order:

1. Fetch page HTML through a CORS-capable metadata proxy.
2. Parse embedded `application/ld+json` blocks.
3. Search JSON-LD graphs for schema.org `Recipe` objects.
4. Use `recipeIngredient`, `recipeYield`, duration fields, and `recipeInstructions` directly.
5. Preserve `HowToSection` names internally so future TRN layouts can use real recipe sections instead of guessed phases.
6. Fall back to reader-service markdown only when no parseable Recipe JSON-LD is available or metadata fetch fails.

## Consequences

- Sites with schema.org Recipe metadata should produce substantially more accurate ingredients and instructions.
- WP Recipe Maker pages, including Dining with Skyler, are handled from their exported JSON-LD rather than TOC/reader text.
- The current static-only architecture still depends on public CORS-friendly proxy services; a production version should use a small backend extractor for reliability.
