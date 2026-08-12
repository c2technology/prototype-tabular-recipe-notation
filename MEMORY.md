# Project Memory

## Durable Facts

- This project prototypes Tabular Recipe Notation (TRN): a recipe rendering format with ingredients as rows, preparation/cooking/finish phases as columns, and recipe actions placed into cells.
- The MVP is a backend-free static GitHub Pages app.
- Recipe URLs are fetched through the public `r.jina.ai` reader service to work around browser CORS limits on arbitrary recipe sites.
- Current implementation is schema-first: it tries embedded schema.org `Recipe` JSON-LD before falling back to reader-service markdown heuristics.

## Decisions

- Use vanilla HTML/CSS/JavaScript and SVG output to keep the prototype deployable from GitHub Pages without a build step.
- Render the TRN graphic as inline SVG so it can be downloaded, copied, or later converted to PNG/PDF.
- Keep URL extraction best-effort; harden parsers after testing against real recipe sites.

## Constraints and Risks

- Arbitrary recipe sites vary widely; extraction may miss ingredients or steps.
- `r.jina.ai` is a public third-party reader service and may rate-limit, transform content unexpectedly, or fail on some domains.
- GitHub Pages deployment may require the repository to be public or Pages support for private repos on the account plan.

## Non-goals for MVP

- No account system.
- No server-side scraping service.
- No persistent recipe storage.
- No production-grade recipe normalization.
