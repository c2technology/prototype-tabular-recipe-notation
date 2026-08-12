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
      .replace(/\s+/g, " ")
      .trim();
  }

  function titleFromLines(lines) {
    const markdownTitle = lines.find((line) => /^#\s+[^#]/.test(line));
    if (markdownTitle) return markdownTitle.replace(/^#\s+/, "").trim();
    const htmlTitle = lines.find((line) => /^Title:/i.test(line));
    if (htmlTitle) return htmlTitle.replace(/^Title:\s*/i, "").trim();
    return lines[0]?.slice(0, 90) || "Untitled recipe";
  }

  function findSection(lines, headingPatterns, stopPatterns) {
    const start = lines.findIndex((line) => headingPatterns.some((pattern) => pattern.test(line)));
    if (start === -1) return [];
    const collected = [];
    for (let index = start + 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (/^#{1,4}\s+/.test(line) && stopPatterns.some((pattern) => pattern.test(line))) break;
      if (/^#{1,4}\s+/.test(line) && collected.length > 0) break;
      collected.push(line);
    }
    return collected;
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
    const lines = normalizeLines(text);
    const ingredientLines = findSection(
      lines,
      [/^#{1,4}\s*ingredients?\b/i, /^ingredients?$/i],
      [/^#{1,4}\s*(instructions?|directions?|method|steps?)\b/i],
    );
    const stepLines = findSection(
      lines,
      [/^#{1,4}\s*(instructions?|directions?|method|steps?)\b/i, /^(instructions?|directions?|method|steps?)$/i],
      [/^#{1,4}\s*(notes?|nutrition|ingredients?)\b/i],
    );

    let ingredients = ingredientLines
      .map(cleanListMarker)
      .filter((line) => line && !/^#{1,4}/.test(line))
      .slice(0, 18);
    let steps = stepLines
      .map(cleanListMarker)
      .filter((line) => line && !/^#{1,4}/.test(line))
      .slice(0, 12);

    if (ingredients.length === 0) {
      ingredients = lines
        .filter((line) => /^[-*•]\s+/.test(line) && /\d|cup|tsp|tbsp|ounce|gram|salt|oil/i.test(line))
        .map(cleanListMarker)
        .slice(0, 18);
    }

    if (steps.length === 0) {
      steps = lines
        .filter((line) => /^\d+[.)]\s+/.test(line))
        .map(cleanListMarker)
        .slice(0, 12);
    }

    const times = parseTimes(lines);
    return {
      title: titleFromLines(lines),
      sourceUrl,
      ingredients,
      steps,
      ...times,
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

  function buildTrnModel(recipe) {
    const ingredients = recipe.ingredients.length ? recipe.ingredients : ["Ingredient list not found"];
    const steps = recipe.steps.length ? recipe.steps : ["Instruction steps not found"];
    const rows = ingredients.slice(0, 12).map((ingredient) => ({
      ingredient,
      key: ingredientKey(ingredient),
      cells: { Prep: [], Cook: [], Finish: [] },
    }));

    steps.forEach((step, index) => {
      const phase = classifyPhase(step, index, steps.length);
      const lower = step.toLowerCase();
      const matches = rows.filter((row) => row.key && lower.includes(row.key));
      const targets = matches.length ? matches : [rows[Math.min(index, rows.length - 1)]];
      targets.forEach((row) => row.cells[phase].push(`${index + 1}. ${step}`));
    });

    return { phases: PHASES, rows };
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
    const rowHeight = 104;
    const headerHeight = 128;
    const ingredientWidth = 210;
    const phaseWidth = 210;
    const width = ingredientWidth + phaseWidth * model.phases.length + 48;
    const height = headerHeight + rowHeight * model.rows.length + 36;
    const colors = { Prep: "#edf4dc", Cook: "#f6dfb7", Finish: "#f7d6c4" };

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 ${width} ${height}">`;
    svg += `<title id="title">${escapeXml(recipe.title)} as Tabular Recipe Notation</title>`;
    svg += `<desc id="desc">A table with ingredients as rows and cooking phases as columns.</desc>`;
    svg += `<rect width="100%" height="100%" rx="24" fill="#fffdf8"/>`;
    svg += textBlock(recipe.title, 24, 34, width - 48, { size: 24, weight: 800 });
    svg += textBlock(`Source: ${recipe.sourceUrl}`, 24, 72, width - 48, { size: 12, fill: "#6a665f" });
    svg += textBlock(`Prep ${recipe.prep} · Cook ${recipe.cook} · Total ${recipe.total} · Servings ${recipe.servings}`, 24, 94, width - 48, { size: 13, weight: 700, fill: "#9f3d20" });

    const tableY = headerHeight;
    svg += `<rect x="24" y="${tableY - 32}" width="${ingredientWidth}" height="32" fill="#263238" rx="8"/>`;
    svg += `<text x="40" y="${tableY - 11}" font-size="14" font-weight="800" fill="white">Ingredient</text>`;
    model.phases.forEach((phase, phaseIndex) => {
      const x = 24 + ingredientWidth + phaseIndex * phaseWidth;
      svg += `<rect x="${x}" y="${tableY - 32}" width="${phaseWidth}" height="32" fill="#263238" rx="8"/>`;
      svg += `<text x="${x + 16}" y="${tableY - 11}" font-size="14" font-weight="800" fill="white">${phase}</text>`;
    });

    model.rows.forEach((row, rowIndex) => {
      const y = tableY + rowIndex * rowHeight;
      const fill = rowIndex % 2 === 0 ? "#fff8ea" : "#ffffff";
      svg += `<rect x="24" y="${y}" width="${ingredientWidth}" height="${rowHeight}" fill="#edf4dc" stroke="#ded5c4"/>`;
      svg += textBlock(row.ingredient, 40, y + 26, ingredientWidth - 28, { size: 13, weight: 750 });
      model.phases.forEach((phase, phaseIndex) => {
        const x = 24 + ingredientWidth + phaseIndex * phaseWidth;
        svg += `<rect x="${x}" y="${y}" width="${phaseWidth}" height="${rowHeight}" fill="${row.cells[phase].length ? colors[phase] : fill}" stroke="#ded5c4"/>`;
        const cellText = row.cells[phase].join(" • ");
        svg += cellText
          ? textBlock(cellText, x + 12, y + 24, phaseWidth - 22, { size: 11, weight: 600 })
          : `<text x="${x + 12}" y="${y + 24}" font-size="11" fill="#b2aa9f">—</text>`;
      });
    });
    svg += `</svg>`;
    return svg;
  }

  async function fetchRecipeText(url) {
    const response = await fetch(readerUrl(url), { headers: { Accept: "text/plain" } });
    if (!response.ok) throw new Error(`Recipe fetch failed (${response.status})`);
    return response.text();
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
      setStatus("Fetching recipe page text through the static-page reader service…");
      const text = await fetchRecipeText(url);
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

  const api = { parseRecipeText, buildTrnModel, renderTrnSvg, readerUrl, DEMO_RECIPE_TEXT };
  if (typeof window !== "undefined") window.TRN = api;
  if (typeof module !== "undefined") module.exports = api;
})();
