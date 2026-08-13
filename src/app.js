(() => {
  const DEMO_RECIPE_TEXT = `# Weeknight Tomato Pasta

Prep Time: 10 minutes
Cook Time: 20 minutes
Total Time: 30 minutes
Servings: 4

## Ingredients
- 12 ounces dry pasta
- 2 tablespoons olive oil
- 3 cloves garlic, minced
- 1 can crushed tomatoes
- 1 teaspoon kosher salt
- 1/2 teaspoon black pepper
- 1/4 cup grated parmesan
- Fresh basil leaves

## Instructions
1. Bring a large pot of salted water to a boil and cook pasta until al dente.
2. Warm olive oil in a skillet over medium heat, then cook garlic for 30 seconds.
3. Add crushed tomatoes, salt, and pepper; simmer for 12 minutes.
4. Drain pasta, reserving 1/2 cup pasta water, then toss pasta with sauce.
5. Fold in parmesan, loosen with pasta water if needed, and finish with basil.`;

  const SKYLER_READER_SAMPLE = `Title: Crispy Oven-Fried Chicken Cutlet (Ground Chicken)

### Common mistakes & how to avoid them
*   **The “Soggy Bottom” Syndrome:** If you don’t lightly oil the sheet pan before transferring the cutlet, the bottom won’t “fry” against the metal.
*   **Skipping the Rest:** Cutting into the meat the second it comes out of the oven is tempting.
*   ▢  1 lb.ground chicken or ground turkey
*   ▢  1 tsp kosher salt
*   ▢  1 tsp garlic powder
*   ▢  1 tsp onion powder
*   ▢  All-purpose flour eyeball for dusting + shaping
*   ▢  2 eggs whisked
*   ▢  1 full box panko breadcrumbs use as needed—don’t skimp
*   ▢  Avocado oil spray
*   ▢  Flaky sea salt for finishing
#### Prepthe Meat
*   In a bowl, mix the ground meat with salt, garlic powder, and onion powder until just combined.
*   Let it sit for a few minutes while you prep.
#### Shape the Cutlet
*   Lay out a large sheet of parchment paper and generously sprinkle it with flour.
*   Place the meat on top and press into a very thin, large oval—like a pounded chicken cutlet.
#### Bread the First Side
*   Brush the surface with egg wash.
*   Cover completely with panko breadcrumbs—press gently so they adhere.
*   Spray with avocado oil until the breadcrumbs are fully hydrated.
#### Bake
*   Bake at 450°F in a convection oven or air fry for 15 minutes.
#### Broilto Finish
*   Broil for 4–5 minutes, until deeply golden brown and crispy. Watch it closely.
#### Finish
*   Remove from the oven and immediately sprinkle with flaky sea salt.
*   Let it rest for 1–2 minutes, then slice.
![Image 3](https://example.com/image.png)`;

  const SKYLER_JSON_LD_SAMPLE = `{
  "@type": "Recipe",
  "name": "Giant Crispy Oven-Fried Ground Chicken Cutlet",
  "author": {
    "@id": "https://diningwithskyler.com/#/schema/person/8c24a1178bbf4719397e4b165cb353c1"
  },
  "description": "A giant, ultra-thin ground chicken cutlet coated in crispy panko and baked on a sheet pan until deeply golden and crunchy\u2014no frying required. It delivers all the shatteringly crisp, golden-brown satisfaction of fried chicken, but on a single sheet pan, without the oily mess, making it perfect for an easy, high-impact weeknight dinner.",
  "datePublished": "2026-04-06T13:14:51+00:00",
  "image": [
    "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-scaled.jpeg",
    "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-500x500.jpeg",
    "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-500x375.jpeg",
    "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-480x270.jpeg"
  ],
  "recipeYield": [
    "2"
  ],
  "recipeIngredient": [
    "1 lb. ground chicken or ground turkey",
    "1 tsp kosher salt",
    "1 tsp garlic powder",
    "1 tsp onion powder",
    "All-purpose flour (eyeball for dusting + shaping)",
    "2  eggs (whisked)",
    "1  full box panko breadcrumbs (use as needed\u2014don\u2019t skimp)",
    "Avocado oil spray",
    "Flaky sea salt (for finishing)"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToSection",
      "name": "Prepthe Meat",
      "itemListElement": [
        {
          "@type": "HowToStep",
          "text": "In a bowl, mix the ground meat with salt, garlic powder, and onion powder until just combined.",
          "name": "In a bowl, mix the ground meat with salt, garlic powder, and onion powder until just combined.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-0-0"
        },
        {
          "@type": "HowToStep",
          "text": "Let it sit for a few minutes while you prep.",
          "name": "Let it sit for a few minutes while you prep.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-0-1"
        }
      ]
    },
    {
      "@type": "HowToSection",
      "name": "Shape the Cutlet",
      "itemListElement": [
        {
          "@type": "HowToStep",
          "text": "Lay out a large sheet of parchment paper and generously sprinkle it with flour.",
          "name": "Lay out a large sheet of parchment paper and generously sprinkle it with flour.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-1-0"
        },
        {
          "@type": "HowToStep",
          "text": "Place the meat on top and press into a very thin, large oval\u2014like a pounded chicken cutlet.",
          "name": "Place the meat on top and press into a very thin, large oval\u2014like a pounded chicken cutlet.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-1-1"
        },
        {
          "@type": "HowToStep",
          "text": "It should be big enough to nearly fill a sheet pan.",
          "name": "It should be big enough to nearly fill a sheet pan.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-1-2"
        },
        {
          "@type": "HowToStep",
          "text": "Lightly sprinkle flour over the top surface.",
          "name": "Lightly sprinkle flour over the top surface.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-1-3"
        }
      ]
    },
    {
      "@type": "HowToSection",
      "name": "Bread the First Side",
      "itemListElement": [
        {
          "@type": "HowToStep",
          "text": "Brush the surface with egg wash.",
          "name": "Brush the surface with egg wash.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-2-0"
        },
        {
          "@type": "HowToStep",
          "text": "Cover completely with panko breadcrumbs\u2014press gently so they adhere.",
          "name": "Cover completely with panko breadcrumbs\u2014press gently so they adhere.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-2-1"
        },
        {
          "@type": "HowToStep",
          "text": "Spray with avocado oil until the breadcrumbs are fully hydrated.",
          "name": "Spray with avocado oil until the breadcrumbs are fully hydrated.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-2-2"
        },
        {
          "@type": "HowToStep",
          "text": "Not lightly coated\u2014fully coated so they can \u201cfry\u201d in the oven.",
          "name": "Not lightly coated\u2014fully coated so they can \u201cfry\u201d in the oven.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-2-3"
        }
      ]
    },
    {
      "@type": "HowToSection",
      "name": "Flip+ Bread the Second Side",
      "itemListElement": [
        {
          "@type": "HowToStep",
          "text": "Place another large sheet of parchment on top and carefully flip.",
          "name": "Place another large sheet of parchment on top and carefully flip.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-3-0"
        },
        {
          "@type": "HowToStep",
          "text": "Remove the top parchment so the uncoated side is facing up.",
          "name": "Remove the top parchment so the uncoated side is facing up.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-3-1"
        },
        {
          "@type": "HowToStep",
          "text": "Brush with egg wash, then fully coat with panko, pressing gently.",
          "name": "Brush with egg wash, then fully coat with panko, pressing gently.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-3-2"
        },
        {
          "@type": "HowToStep",
          "text": "Spray again with avocado oil until the breadcrumbs are fully hydrated.",
          "name": "Spray again with avocado oil until the breadcrumbs are fully hydrated.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-3-3"
        }
      ]
    },
    {
      "@type": "HowToSection",
      "name": "Bake",
      "itemListElement": [
        {
          "@type": "HowToStep",
          "text": "Lightly spray or brush a large sheet pan with avocado oil.",
          "name": "Lightly spray or brush a large sheet pan with avocado oil.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-4-0"
        },
        {
          "@type": "HowToStep",
          "text": "Carefully transfer the cutlet from the parchment onto the sheet pan.",
          "name": "Carefully transfer the cutlet from the parchment onto the sheet pan.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-4-1"
        },
        {
          "@type": "HowToStep",
          "text": "Bake at 450\u00b0F in a convection oven or air fry for 15 minutes.",
          "name": "Bake at 450\u00b0F in a convection oven or air fry for 15 minutes.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-4-2"
        }
      ]
    },
    {
      "@type": "HowToSection",
      "name": "Broilto Finish",
      "itemListElement": [
        {
          "@type": "HowToStep",
          "text": "Broil for 4\u20135 minutes, until deeply golden brown and crispy. Watch it closely.",
          "name": "Broil for 4\u20135 minutes, until deeply golden brown and crispy. Watch it closely.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-5-0"
        }
      ]
    },
    {
      "@type": "HowToSection",
      "name": "Finish",
      "itemListElement": [
        {
          "@type": "HowToStep",
          "text": "Remove from the oven and immediately sprinkle with flaky sea salt.",
          "name": "Remove from the oven and immediately sprinkle with flaky sea salt.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-6-0"
        },
        {
          "@type": "HowToStep",
          "text": "Let it rest for 1\u20132 minutes, then slice.",
          "name": "Let it rest for 1\u20132 minutes, then slice.",
          "url": "https://diningwithskyler.com/ground-chicken-cutlet/#wprm-recipe-20934-step-6-1"
        }
      ]
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.98",
    "ratingCount": "34",
    "reviewCount": "8"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Absolute winner winner chicken dinner! Both the wife &amp; teenager love it! Thank you, Skyler!!",
      "author": {
        "@type": "Person",
        "name": "Brian"
      },
      "datePublished": "2026-08-05"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "WOW. An instant classic!!!",
      "author": {
        "@type": "Person",
        "name": "Audrey"
      },
      "datePublished": "2026-07-28"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Easy to make, yummy and no frying and no messy stove to clean up afterwards",
      "author": {
        "@type": "Person",
        "name": "Amy"
      },
      "datePublished": "2026-06-09"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "I made this for a couple of crunchy chicken wraps this evening for dinner for my wife and me. It was very good and oh so filling. Tomorrow, I will reheat the leftovers for Chicken Parmesan. Fingers crossed \ud83e\udd1e.",
      "author": {
        "@type": "Person",
        "name": "Scott"
      },
      "datePublished": "2026-06-03"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "I used ground chicken thigh meat. It was perfect!! Really easy from start to finish. I paired it with a pesto roasted garlic mayo and the next day I paired it with a Chick Fil A sauce and that was perfect too.",
      "author": {
        "@type": "Person",
        "name": "Elisa"
      },
      "datePublished": "2026-05-22"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Have never tried anything better, i seasoned with paprika, garlic powder, onion powder, salt, pepper, and Trader Joes dill seasoning. I seasoned the bread crumbs, chicken mince, and egg wash!!",
      "author": {
        "@type": "Person",
        "name": "Clio Anesti"
      },
      "datePublished": "2026-05-22"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "here to say this was perfection!! and I truly appreciate how thorough you are and how you anticipate any questions I might have had about prepping ahead etc. this was my first recipe from this blog and now I trust you completely!! \ud83d\ude4f\ud83c\udffc",
      "author": {
        "@type": "Person",
        "name": "kat"
      },
      "datePublished": "2026-05-21"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Delicious! I used ground turkey because it\u2019s what I had on hand and everyone in the family loved it.",
      "author": {
        "@type": "Person",
        "name": "Beth Mathers"
      },
      "datePublished": "2026-05-20"
    }
  ],
  "recipeCategory": [
    "Main Course"
  ],
  "video": {
    "@type": "VideoObject",
    "name": "Giant Crispy Oven-Fried Ground Chicken Cutlet Recipe Video",
    "description": "A giant, ultra-thin ground chicken cutlet coated in crispy panko and baked on a sheet pan until deeply golden and crunchy\u2014no frying required. It delivers all the shatteringly crisp, golden-brown satisfaction of fried chicken, but on a single sheet pan, without the oily mess, making it perfect for an easy, high-impact weeknight dinner.",
    "thumbnailUrl": [
      "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-scaled.jpeg",
      "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-500x500.jpeg",
      "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-500x375.jpeg",
      "https://diningwithskyler.com/wp-content/uploads/2026/03/easy-chicken-cutlet-recipe-480x270.jpeg"
    ],
    "uploadDate": "2026-04-06T13:14:51+00:00",
    "embedUrl": "https://www.instagram.com/reel/DYNQBMmKo0y/embed"
  },
  "@id": "https://diningwithskyler.com/ground-chicken-cutlet/#recipe",
  "isPartOf": {
    "@id": "https://diningwithskyler.com/ground-chicken-cutlet/#article"
  },
  "mainEntityOfPage": "https://diningwithskyler.com/ground-chicken-cutlet/"
}`;

  const STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "black",
    "chopped",
    "clove",
    "cloves",
    "cup",
    "cups",
    "dry",
    "fresh",
    "grated",
    "ground",
    "kosher",
    "large",
    "medium",
    "minced",
    "of",
    "or",
    "ounce",
    "ounces",
    "small",
    "tablespoon",
    "tablespoons",
    "teaspoon",
    "teaspoons",
    "the",
    "to",
    "with",
  ]);

  const PHASES = ["Prep", "Cook", "Finish"];

  function readerUrl(inputUrl) {
    const url = new URL(inputUrl);
    // r.jina.ai turns arbitrary web pages into CORS-friendly markdown for static sites.
    // Prefixing the full URL keeps this prototype backend-free on GitHub Pages.
    return `https://r.jina.ai/http://r.jina.ai/http://${url.href}`;
  }

  function metadataUrl(inputUrl) {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(inputUrl)}`;
  }

  function normalizeLines(text) {
    return text
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function cleanListMarker(line) {
    return line
      .replace(/^[-*•]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .replace(/^▢\s*/, "")
      .replace(/^\[|\]$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isMarkdownHeading(line) {
    return /^#{1,6}\s*/.test(line);
  }

  function headingText(line) {
    return line.replace(/^#{1,6}\s*/, "").trim();
  }

  function isTocLink(line) {
    return /^\d+[.)]\s+\[[^\]]+\]\([^)]*#[^)]+\)\s*$/.test(line);
  }

  function isImageLine(line) {
    return /^!\[[^\]]*\]/.test(line);
  }


  function htmlDecode(value) {
    const text = String(value ?? "");
    if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = text;
      return textarea.value;
    }
    return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function stripHtml(value) {
    return htmlDecode(String(value ?? "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
  }

  function findBalancedJsonEnd(text, start) {
    const open = text[start];
    const close = open === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
      const char = text[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') inString = true;
      else if (char === open) depth += 1;
      else if (char === close) {
        depth -= 1;
        if (depth === 0) return index + 1;
      }
    }
    return -1;
  }

  function extractJsonLdBlocks(rawText) {
    const blocks = [];
    const scriptPattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptPattern.exec(rawText))) {
      blocks.push(htmlDecode(match[1]).trim());
    }

    if (blocks.length === 0 && /"@type"\s*:\s*"Recipe"/.test(rawText)) {
      let searchIndex = 0;
      while (searchIndex < rawText.length) {
        const typeIndex = rawText.indexOf('"@type"', searchIndex);
        if (typeIndex === -1) break;
        const recipeType = rawText.slice(typeIndex, typeIndex + 80);
        if (!/"Recipe"/.test(recipeType)) {
          searchIndex = typeIndex + 7;
          continue;
        }
        const objectStart = rawText.lastIndexOf("{", typeIndex);
        const objectEnd = objectStart === -1 ? -1 : findBalancedJsonEnd(rawText, objectStart);
        if (objectStart !== -1 && objectEnd !== -1) blocks.push(rawText.slice(objectStart, objectEnd));
        searchIndex = typeIndex + 7;
      }
    }
    return blocks;
  }

  function asArray(value) {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  }

  function jsonLdTypes(node) {
    return asArray(node?.["@type"]).map((type) => String(type).toLowerCase());
  }

  function findRecipeNodes(node, found = []) {
    if (Array.isArray(node)) {
      node.forEach((item) => findRecipeNodes(item, found));
    } else if (node && typeof node === "object") {
      if (jsonLdTypes(node).includes("recipe")) found.push(node);
      Object.values(node).forEach((value) => findRecipeNodes(value, found));
    }
    return found;
  }

  function instructionStepsFromJsonLd(value, sectionName = "") {
    const steps = [];
    asArray(value).forEach((item) => {
      if (typeof item === "string") {
        const text = stripHtml(item);
        if (text) steps.push({ text, section: sectionName });
        return;
      }
      if (!item || typeof item !== "object") return;
      const types = jsonLdTypes(item);
      const nextSection = types.includes("howtosection") ? stripHtml(item.name || sectionName) : sectionName;
      if (item.itemListElement) {
        steps.push(...instructionStepsFromJsonLd(item.itemListElement, nextSection));
        return;
      }
      const text = stripHtml(item.text || item.name || item.description || "");
      if (text) steps.push({ text, section: nextSection });
    });
    return steps;
  }

  function formatDuration(isoDuration) {
    const value = String(isoDuration || "").trim();
    if (!value) return "Unknown";
    const match = value.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i);
    if (!match) return value;
    const [, days, hours, minutes, seconds] = match.map((part) => Number(part || 0));
    const pieces = [];
    if (days) pieces.push(`${days} day${days === 1 ? "" : "s"}`);
    if (hours) pieces.push(`${hours} hr${hours === 1 ? "" : "s"}`);
    if (minutes) pieces.push(`${minutes} min${minutes === 1 ? "" : "s"}`);
    if (seconds && pieces.length === 0) pieces.push(`${seconds} sec${seconds === 1 ? "" : "s"}`);
    return pieces.join(" ") || "Unknown";
  }

  function parseRecipeFromJsonLd(rawText, sourceUrl = "Recipe URL") {
    for (const block of extractJsonLdBlocks(rawText)) {
      let parsed;
      try {
        parsed = JSON.parse(block);
      } catch (_error) {
        continue;
      }
      const recipes = findRecipeNodes(parsed).sort((a, b) => {
        const score = (recipe) => asArray(recipe.recipeIngredient).length * 3 + instructionStepsFromJsonLd(recipe.recipeInstructions).length * 5;
        return score(b) - score(a);
      });
      for (const recipe of recipes) {
        const ingredients = asArray(recipe.recipeIngredient).map(stripHtml).filter(Boolean);
        const instructionObjects = instructionStepsFromJsonLd(recipe.recipeInstructions);
        const steps = instructionObjects.map((step) => step.text).filter(Boolean);
        if (!ingredients.length && !steps.length) continue;
        return {
          title: stripHtml(recipe.name) || titleFromLines(normalizeLines(rawText)),
          sourceUrl,
          ingredients,
          steps,
          instructionSections: instructionObjects,
          prep: formatDuration(recipe.prepTime),
          cook: formatDuration(recipe.cookTime),
          total: formatDuration(recipe.totalTime),
          servings: asArray(recipe.recipeYield).map(stripHtml).filter(Boolean).join(", ") || "Unknown",
          basis: "schema.org Recipe JSON-LD",
        };
      }
    }
    return null;
  }

  function detectRecipeMarkup(sources) {
    for (const source of sources) {
      if (!source?.text) continue;
      const recipe = parseRecipeFromJsonLd(source.text, source.url || "Recipe URL");
      if (recipe) {
        return {
          standard: "schema.org Recipe JSON-LD",
          confidence: 1,
          source,
          parsedRecipe: recipe,
        };
      }
    }
    return { standard: "none", confidence: 0, source: null, parsedRecipe: null };
  }

  function extractRecipeFromMarkup(detection) {
    if (detection?.standard === "schema.org Recipe JSON-LD" && detection.parsedRecipe) return detection.parsedRecipe;
    throw new Error("No supported recipe markup detected");
  }

  function runRecipePipeline(sources) {
    const detection = detectRecipeMarkup(sources);
    const recipe = extractRecipeFromMarkup(detection);
    const trn = buildTrnModel(recipe);
    const svg = renderTrnSvg(recipe);
    return { detection, recipe, trn, svg };
  }

  function titleFromLines(lines) {
    const markdownTitle = lines.find((line) => /^#\s+[^#]/.test(line));
    if (markdownTitle) return markdownTitle.replace(/^#\s+/, "").trim();
    const htmlTitle = lines.find((line) => /^Title:/i.test(line));
    if (htmlTitle) return htmlTitle.replace(/^Title:\s*/i, "").trim();
    return lines[0]?.slice(0, 90) || "Untitled recipe";
  }

  function findSection(lines, headingPatterns, stopPatterns) {
    const starts = [];
    lines.forEach((line, index) => {
      if (isTocLink(line)) return;
      if (headingPatterns.some((pattern) => pattern.test(line))) starts.push(index);
    });
    if (starts.length === 0) return [];

    let best = [];
    for (const start of starts) {
      const collected = [];
      for (let index = start + 1; index < lines.length; index += 1) {
        const line = lines[index];
        if (isTocLink(line) || isImageLine(line)) continue;
        if (isMarkdownHeading(line)) {
          if (stopPatterns.some((pattern) => pattern.test(line))) break;
          if (collected.length > 0) break;
          continue;
        }
        collected.push(line);
      }
      const usefulCount = collected.filter((line) => /^[-*•]\s+/.test(line) || /^\d+[.)]\s+/.test(line)).length;
      const score = usefulCount * 10 + collected.length;
      const bestScore = best.filter((line) => /^[-*•]\s+/.test(line) || /^\d+[.)]\s+/.test(line)).length * 10 + best.length;
      if (score > bestScore) best = collected;
    }
    return best;
  }

  function extractStructuredRecipe(lines) {
    const candidates = [];
    lines.forEach((line, index) => {
      if (!isMarkdownHeading(line)) return;
      const text = headingText(line);
      const score = [
        /ingredients?/i.test(text) ? 3 : 0,
        /directions?|instructions?|method|steps?/i.test(text) ? 4 : 0,
        /recipe/i.test(text) ? 1 : 0,
      ].reduce((sum, value) => sum + value, 0);
      if (score > 0) candidates.push({ index, text, score });
    });

    let best = null;
    for (let i = 0; i < candidates.length; i += 1) {
      for (let j = i + 1; j < candidates.length; j += 1) {
        const first = candidates[i];
        const second = candidates[j];
        const firstIsIngredient = /ingredients?/i.test(first.text);
        const secondIsDirection = /directions?|instructions?|method|steps?/i.test(second.text);
        if (!firstIsIngredient || !secondIsDirection) continue;
        const ingredientBlock = lines.slice(first.index + 1, second.index);
        const nextHeading = candidates.find((candidate) => candidate.index > second.index)?.index ?? lines.length;
        const stepBlock = lines.slice(second.index + 1, nextHeading);
        const ingredients = ingredientBlock
          .filter((line) => /^[-*•]\s+/.test(line))
          .map(cleanListMarker)
          .filter(Boolean);
        const steps = stepBlock
          .flatMap((line) => (isMarkdownHeading(line) ? [] : [line]))
          .filter((line) => /^[-*•]\s+|^\d+[.)]\s+/.test(line))
          .map(cleanListMarker)
          .filter(Boolean);
        const score = ingredients.length * 3 + steps.length * 5 - Math.max(0, ingredientBlock.length - ingredients.length * 2);
        if (!best || score > best.score) best = { ingredients, steps, score };
      }
    }

    if (best && (best.ingredients.length || best.steps.length)) return best;

    const checkboxIngredientIndex = lines.findIndex((line) => /^[-*•]\s+▢/.test(line));
    if (checkboxIngredientIndex !== -1) {
      const ingredients = [];
      let index = checkboxIngredientIndex;
      while (index < lines.length && /^[-*•]\s+▢/.test(lines[index])) {
        ingredients.push(cleanListMarker(lines[index]));
        index += 1;
      }
      const instructionSections = [];
      let currentSection = "Method";
      for (; index < lines.length; index += 1) {
        const line = lines[index];
        if (isImageLine(line)) break;
        if (isMarkdownHeading(line)) {
          currentSection = headingText(line);
          continue;
        }
        if (/^[-*•]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
          const text = cleanListMarker(line);
          if (text) instructionSections.push({ text, section: currentSection });
        }
      }
      const steps = instructionSections.map((step) => step.text);
      if (ingredients.length || steps.length) {
        return { ingredients, steps, instructionSections, score: ingredients.length * 3 + steps.length * 5 };
      }
    }

    return null;
  }

  function parseTimes(lines) {
    const labelPattern = (label) => new RegExp(`^(?:[*_\\s-]*)${label}\\s*(?:Time)?\\s*:?\\s*(.*)$`, "i");
    const isMetadataLabel = /^(?:[*_\s-]*)(Prep|Cook|Total)\s*(?:Time)?\s*:?\s*$/i;
    const lookup = (label) => {
      const pattern = labelPattern(label);
      const index = lines.findIndex((line) => pattern.test(line));
      if (index === -1) return "Unknown";
      let value = lines[index].match(pattern)?.[1]?.replace(/[*_:]/g, "").trim() || "";
      if (!value && lines[index + 1] && !isMetadataLabel.test(lines[index + 1])) {
        value = lines[index + 1].replace(/[*_:]/g, "").trim();
      }
      return value || "Unknown";
    };
    const servingsIndex = lines.findIndex((line) => /^(?:[*_\s-]*)Servings?\s*:?/i.test(line));
    let servings = "Unknown";
    if (servingsIndex !== -1) {
      servings = lines[servingsIndex].replace(/^(?:[*_\s-]*)Servings?\s*:?\s*/i, "").replace(/[*_:]/g, "").trim();
      if (!servings && lines[servingsIndex + 1]) servings = lines[servingsIndex + 1].replace(/[*_:]/g, "").trim();
    }
    return {
      prep: lookup("Prep"),
      cook: lookup("Cook"),
      total: lookup("Total"),
      servings: servings || "Unknown",
    };
  }

  function parseRecipeText(text, sourceUrl = "Demo") {
    const schemaRecipe = parseRecipeFromJsonLd(text, sourceUrl);
    if (schemaRecipe) return schemaRecipe;

    const lines = normalizeLines(text);
    const structured = extractStructuredRecipe(lines);
    const ingredientLines = structured?.ingredients?.length
      ? structured.ingredients
      : findSection(
          lines,
          [/^#{1,6}\s*ingredients?\b/i, /^ingredients?$/i],
          [/^#{1,6}\s*(directions?|instructions?|method|steps?)\b/i],
        );
    const stepLines = structured?.steps?.length
      ? structured.steps
      : findSection(
          lines,
          [/^#{1,6}\s*(directions?|instructions?|method|steps?)\b/i, /^(directions?|instructions?|method|steps?)$/i],
          [/^#{1,6}\s*(notes?|nutrition|ingredients?|recipe)\b/i],
        );

    let ingredients = ingredientLines
      .map(cleanListMarker)
      .filter((line) => line && !isMarkdownHeading(line) && !isTocLink(line) && !isImageLine(line))
      .slice(0, 18);
    let steps = stepLines
      .map(cleanListMarker)
      .filter((line) => line && !isMarkdownHeading(line) && !isTocLink(line) && !isImageLine(line))
      .slice(0, 24);

    if (ingredients.length === 0) {
      ingredients = lines
        .filter((line) => /^[-*•]\s+/.test(line) && /\d|cup|tsp|tbsp|ounce|gram|salt|oil|▢/i.test(line))
        .map(cleanListMarker)
        .filter((line) => !isTocLink(line) && !isImageLine(line))
        .slice(0, 18);
    }

    if (steps.length === 0) {
      steps = lines
        .filter((line) => /^\d+[.)]\s+/.test(line) && !isTocLink(line))
        .map(cleanListMarker)
        .slice(0, 18);
    }

    const times = parseTimes(lines);
    return {
      title: titleFromLines(lines),
      sourceUrl,
      ingredients,
      steps,
      ...times,
      basis: structured?.instructionSections?.length
        ? "reader markdown section-aware recipe-card heuristic"
        : structured
          ? "reader markdown recipe-card heuristic"
          : "reader markdown fallback",
      instructionSections: structured?.instructionSections || null,
    };
  }

  function ingredientKey(ingredient) {
    const words = ingredient
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/[^a-z\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
    return words.slice(-2).join(" ") || ingredient.toLowerCase().slice(0, 18);
  }

  function classifyPhase(step, index, total) {
    const lower = step.toLowerCase();
    if (/serve|finish|garnish|top|fold|stir in|plate|cool|rest/.test(lower) || index >= total - 2) return "Finish";
    if (/bake|boil|cook|simmer|saute|sauté|roast|fry|grill|heat|warm|melt|toast/.test(lower)) return "Cook";
    return "Prep";
  }

  function normalizePhaseName(sectionName) {
    return String(sectionName || "Method")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s*\+\s*/g, " + ")
      .replace(/\bPrep(?=the\b)/i, "Prep ")
      .replace(/\bBroil(?=to\b)/i, "Broil ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (char) => char.toUpperCase());
  }

  function buildSchemaTrnModel(recipe) {
    const sections = recipe.instructionSections || [];
    const phases = sections.length
      ? sections
          .map((step) => normalizePhaseName(step.section || "Procedure"))
          .filter((phase, index, all) => phase && all.indexOf(phase) === index)
      : ["Procedure"];
    const rows = recipe.ingredients.map((ingredient) => ({
      type: "ingredient",
      label: ingredient,
      ingredient,
      cells: Object.fromEntries(phases.map((phase) => [phase, []])),
    }));
    const procedure = (sections.length ? sections : recipe.steps.map((text) => ({ text, section: "Procedure" }))).map((step, index) => ({
      type: "procedure",
      section: normalizePhaseName(step.section || "Procedure"),
      stepNumber: index + 1,
      text: step.text,
    }));
    return { phases, rows, procedure };
  }

  function buildTrnModel(recipe) {
    if (recipe.instructionSections?.length) return buildSchemaTrnModel(recipe);

    const ingredients = recipe.ingredients.length ? recipe.ingredients : ["Ingredient list not found"];
    const steps = recipe.steps.length ? recipe.steps : ["Instruction steps not found"];
    const phases = PHASES;
    const rows = ingredients.slice(0, 12).map((ingredient) => ({
      type: "ingredient",
      label: ingredient,
      ingredient,
      cells: Object.fromEntries(phases.map((phase) => [phase, []])),
    }));
    const procedure = steps.map((text, index) => ({
      type: "procedure",
      section: classifyPhase(text, index, steps.length),
      stepNumber: index + 1,
      text,
    }));
    return { phases, rows, procedure };
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function wrapText(text, maxChars) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = "";
    for (const word of words) {
      if ((current + " " + word).trim().length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = `${current} ${word}`.trim();
      }
    }
    if (current) lines.push(current);
    return lines.slice(0, 4);
  }

  function textBlock(text, x, y, width, options = {}) {
    const lines = wrapText(text, Math.max(14, Math.floor(width / 7.2)));
    const size = options.size || 13;
    const weight = options.weight || 500;
    return lines
      .map((line, index) => `<text x="${x}" y="${y + index * (size + 4)}" font-size="${size}" font-weight="${weight}" fill="${options.fill || "#20201d"}">${escapeXml(line)}</text>`)
      .join("");
  }

  function renderTrnSvg(recipe) {
    const model = buildTrnModel(recipe);
    const rowHeight = 72;
    const procedureRowHeight = 72;
    const headerHeight = 128;
    const ingredientWidth = 260;
    const procedureWidth = 640;
    const width = ingredientWidth + procedureWidth + 48;
    const procedureHeight = Math.max(procedureRowHeight, procedureRowHeight * (model.procedure?.length || 1));
    const height = headerHeight + 36 + rowHeight * model.rows.length + 52 + procedureHeight + 36;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 ${width} ${height}">`;
    svg += `<title id="title">${escapeXml(recipe.title)} as Tabular Recipe Notation</title>`;
    svg += `<desc id="desc">A deterministic translation of recipe markup with ingredient inventory and ordered procedure.</desc>`;
    svg += `<rect width="100%" height="100%" rx="24" fill="#fffdf8"/>`;
    svg += textBlock(recipe.title, 24, 34, width - 48, { size: 24, weight: 800 });
    svg += textBlock(`Source: ${recipe.sourceUrl}`, 24, 72, width - 48, { size: 12, fill: "#6a665f" });
    svg += textBlock(`Prep ${recipe.prep} · Cook ${recipe.cook} · Total ${recipe.total} · Servings ${recipe.servings}`, 24, 94, width - 48, { size: 13, weight: 700, fill: "#9f3d20" });

    const inventoryY = headerHeight;
    svg += `<rect x="24" y="${inventoryY - 32}" width="${ingredientWidth}" height="32" fill="#263238" rx="8"/>`;
    svg += `<text x="40" y="${inventoryY - 11}" font-size="14" font-weight="800" fill="white">Ingredient inventory</text>`;
    model.rows.forEach((row, rowIndex) => {
      const y = inventoryY + rowIndex * rowHeight;
      svg += `<rect x="24" y="${y}" width="${ingredientWidth}" height="${rowHeight}" fill="${rowIndex % 2 === 0 ? "#edf4dc" : "#f7fbef"}" stroke="#ded5c4"/>`;
      svg += textBlock(row.label || row.ingredient, 40, y + 25, ingredientWidth - 28, { size: 13, weight: 750 });
    });

    const procedureY = inventoryY + rowHeight * model.rows.length + 52;
    svg += `<rect x="24" y="${procedureY - 32}" width="${procedureWidth}" height="32" fill="#263238" rx="8"/>`;
    svg += `<text x="40" y="${procedureY - 11}" font-size="14" font-weight="800" fill="white">Procedure</text>`;
    (model.procedure || []).forEach((unit, index) => {
      const y = procedureY + index * procedureRowHeight;
      svg += `<rect x="24" y="${y}" width="${procedureWidth}" height="${procedureRowHeight}" fill="${index % 2 === 0 ? "#fff8ea" : "#ffffff"}" stroke="#ded5c4"/>`;
      svg += textBlock(`${unit.stepNumber}. [${unit.section}] ${unit.text}`, 40, y + 24, procedureWidth - 28, { size: 12, weight: 600 });
    });
    svg += `</svg>`;
    return svg;
  }

  async function fetchRecipeText(url) {
    const response = await fetch(readerUrl(url), { headers: { Accept: "text/plain" } });
    if (!response.ok) throw new Error(`Recipe fetch failed (${response.status})`);
    return response.text();
  }

  function timeoutAfter(ms, message) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    });
  }

  async function fetchRecipeHtml(url, options = {}) {
    const response = await Promise.race([
      fetch(metadataUrl(url), { headers: { Accept: "text/html,text/plain" } }),
      timeoutAfter(options.metadataTimeoutMs ?? 5000, "Recipe metadata fetch timed out"),
    ]);
    if (!response.ok) throw new Error(`Recipe metadata fetch failed (${response.status})`);
    return response.text();
  }

  async function fetchRecipeSource(url, options = {}) {
    try {
      const htmlText = await fetchRecipeHtml(url, options);
      if (parseRecipeFromJsonLd(htmlText, url)) return htmlText;
    } catch (_error) {
      // Public metadata proxies can hang/fail CORS/rate-limit checks; fall back to reader markdown.
    }
    return fetchRecipeText(url);
  }

  function setStatus(message, isError = false) {
    const status = document.querySelector("#status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("error", isError);
  }

  function renderSummary(recipe) {
    const summary = document.querySelector("#recipe-summary");
    const template = document.querySelector("#summary-row-template");
    summary.replaceChildren();
    const rows = [
      ["Title", recipe.title],
      ["Basis", recipe.basis || "Unknown"],
      ["Prep", recipe.prep],
      ["Cook", recipe.cook],
      ["Total", recipe.total],
      ["Servings", recipe.servings],
      ["Ingredients", String(recipe.ingredients.length)],
      ["Steps", String(recipe.steps.length)],
    ];
    rows.forEach(([label, value]) => {
      const node = template.content.cloneNode(true);
      node.querySelector("dt").textContent = label;
      node.querySelector("dd").textContent = value;
      summary.appendChild(node);
    });
  }

  function renderSteps(recipe) {
    const steps = document.querySelector("#steps");
    steps.replaceChildren();
    recipe.steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      steps.appendChild(li);
    });
  }

  function renderRecipe(recipe) {
    const graphic = document.querySelector("#graphic");
    const svg = renderTrnSvg(recipe);
    graphic.classList.remove("empty");
    graphic.innerHTML = svg;
    graphic.dataset.svg = svg;
    document.querySelector("#download-svg").disabled = false;
    renderSummary(recipe);
    renderSteps(recipe);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const input = document.querySelector("#recipe-url");
    const url = input.value.trim();
    if (!url) {
      setStatus("Paste a recipe URL first.", true);
      return;
    }
    try {
      setStatus("Fetching recipe metadata, then falling back to readable recipe text if needed…");
      const text = await fetchRecipeSource(url);
      const recipe = parseRecipeText(text, url);
      renderRecipe(recipe);
      setStatus("Rendered TRN graphic from the linked recipe.");
    } catch (error) {
      setStatus(`${error.message}. Load the demo to see the rendering path, or try another recipe page.`, true);
    }
  }

  function loadDemo() {
    const recipe = parseRecipeText(DEMO_RECIPE_TEXT, "Built-in demo recipe");
    renderRecipe(recipe);
    setStatus("Rendered demo TRN graphic.");
  }

  function downloadSvg() {
    const svg = document.querySelector("#graphic").dataset.svg;
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "recipe.trn.svg";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function boot() {
    document.querySelector("#recipe-form")?.addEventListener("submit", handleSubmit);
    document.querySelector("#load-demo")?.addEventListener("click", loadDemo);
    document.querySelector("#download-svg")?.addEventListener("click", downloadSvg);
  }

  if (typeof document !== "undefined") boot();

  const api = { parseRecipeText, parseRecipeFromJsonLd, detectRecipeMarkup, extractRecipeFromMarkup, runRecipePipeline, fetchRecipeSource, buildTrnModel, renderTrnSvg, readerUrl, metadataUrl, DEMO_RECIPE_TEXT, SKYLER_READER_SAMPLE, SKYLER_JSON_LD_SAMPLE };
  if (typeof window !== "undefined") window.TRN = api;
  if (typeof module !== "undefined") module.exports = api;
})();
