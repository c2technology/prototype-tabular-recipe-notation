# Finding: Recipe Extraction Surface

The MVP extracts recipe data from readable markdown/text rather than page HTML or JSON-LD.

## Observations

- Many recipe pages expose Ingredients and Instructions/Directions headings in reader output.
- A static GitHub Pages app cannot directly scrape arbitrary recipe pages because of browser CORS.
- A public reader service keeps the first prototype backend-free but introduces reliability and rate-limit risk.

## Follow-up

Collect a small recipe-site test set and record which headings, list markers, and timing labels each site returns.
