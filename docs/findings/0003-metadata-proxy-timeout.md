# Finding: Metadata proxy can hang silently

## Example

<https://diningwithskyler.com/ground-chicken-cutlet/>

## Problem

After switching to schema-first parsing, the render button could appear to do nothing when the metadata proxy request stayed pending. The UI remained at:

```text
Fetching recipe metadata, then falling back to readable recipe text if needed…
```

Because the fetch never rejected, the reader-markdown fallback never ran and no error appeared.

## Fix

Add a timeout around the metadata fetch. If metadata fetch hangs, fails, or does not contain parseable schema.org `Recipe` JSON-LD, the app falls back to the reader-service markdown path.

## Test

`tests/app.test.js` now stubs `fetch` so the metadata call never resolves and asserts that `fetchRecipeSource()` proceeds to the reader fallback.
