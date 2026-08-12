# Finding: TRN cell data needs source-backed mapping

## Example

<https://diningwithskyler.com/ground-chicken-cutlet/>

## Problem

The graphic rendered, but the old TRN model put recipe steps into cells by keyword guessing and by step index fallback. That created incorrect data placements, such as unrelated method steps being assigned to random ingredients or everything collecting under the final ingredient.

## Fix direction

When schema.org `Recipe` JSON-LD contains `HowToSection` / `HowToStep`, the TRN columns should use those actual section names instead of generic `Prep`, `Cook`, `Finish` buckets. Steps that do not name a specific ingredient should go to a `General method` row instead of being forced onto an ingredient row.

## Test

`tests/app.test.js` now asserts that Dining with Skyler schema data produces columns from the recipe card sections:

- `Prep the Meat`
- `Shape the Cutlet`
- `Bread the First Side`
- `Flip + Bread the Second Side`
- `Bake`
- `Broil to Finish`
- `Finish`

The test also asserts unmatched method steps are not assigned to the salt row.
