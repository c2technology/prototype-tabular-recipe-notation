# Requirements

## Working Concept Goal

The prototype should ingest a recipe link and render a working Tabular Recipe Notation (TRN) image based on recipe markup when the linked page exposes it.

## Initial Requirements

1. Ingest any user-provided recipe URL.
2. Determine whether the link exposes recipe markup.
3. Identify the recipe markup standard, starting with schema.org `Recipe` JSON-LD.
4. Extract ingredients and steps from that markup language.
5. Build a TRN model from the extracted recipe.
6. Render the TRN model as an SVG image on the page.
7. Show visible status/errors so failures are diagnosable.

## Development Process Requirement

Use test-driven development for every iteration, including prototypes:

1. Capture light requirements.
2. Design architecture and interfaces.
3. Write tests first for the next working concept.
4. Implement the minimum code to pass tests.
5. Verify the concept with automated checks and a browser exercise.

## Non-goals For This Iteration

- Production-grade scraping backend.
- Persistent recipe storage.
- Perfect natural-language understanding of every ingredient/action relationship.
- Support for every recipe markup standard in one pass.
