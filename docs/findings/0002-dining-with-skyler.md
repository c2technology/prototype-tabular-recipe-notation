# Finding: Dining with Skyler checkbox ingredients

## Example

<https://diningwithskyler.com/ground-chicken-cutlet/>

## Problem

The reader-service markdown includes a table of contents with numbered links to Ingredients/Directions before the actual recipe card. The original parser treated those TOC links as instruction steps.

The same page also emits recipe-card ingredients as checkbox bullets:

```text
*   ▢  1 lb.ground chicken or ground turkey
```

The actual directions follow as bullet lists under `####` subheadings such as `#### Prepthe Meat`, rather than under a plain `### Directions` heading in the reader output.

## Fix

- Ignore numbered markdown anchor links when extracting steps.
- Detect contiguous checkbox-style ingredient bullets as the start of a recipe card.
- Treat subsequent bullet lists after checkbox ingredients as directions until the next image block.
- Increase the retained step cap so the finish/rest steps are not truncated.

## Verification

Local browser verification against the URL now extracts:

- title: `Crispy Oven-Fried Chicken Cutlet (Ground Chicken)`
- ingredients: 9
- steps: 20
- first step: `In a bowl, mix the ground meat with salt, garlic powder, and onion powder until just combined.`
- final step: `Let it rest for 1–2 minutes, then slice.`
