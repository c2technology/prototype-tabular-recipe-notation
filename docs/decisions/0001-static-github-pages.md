# Decision: Static GitHub Pages MVP

## Context

The requested prototype should render a working GitHub page that accepts a recipe link and displays a TRN graphic.

## Decision

Use a static GitHub Pages app with vanilla HTML, CSS, and JavaScript. Fetch recipe text through the public `r.jina.ai` reader service rather than adding a backend.

## Consequences

- The project can deploy from repository root without build tooling.
- The app remains easy for future agents to understand and modify.
- Recipe extraction is constrained by browser CORS and the behavior of the reader service.
- A production version likely needs either a dedicated recipe extraction backend or a more robust external extraction API.
