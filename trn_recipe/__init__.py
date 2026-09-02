from __future__ import annotations

import json
import re
from html import unescape
from typing import Any

JsonObject = dict[str, Any]
NormalizedRecipe = dict[str, Any]

_SCRIPT_PATTERN = re.compile(
    r"<script\b(?=[^>]*\btype\s*=\s*['\"]application/ld\+json['\"])[^>]*>(.*?)</script>",
    re.IGNORECASE | re.DOTALL,
)
_TAG_PATTERN = re.compile(r"<[^>]+>")
_WHITESPACE_PATTERN = re.compile(r"\s+")


def parse_schema_org_recipe(raw_text: str, source_url: str = "Recipe URL") -> NormalizedRecipe | None:
    """Parse schema.org Recipe JSON-LD into a deterministic normalized recipe.

    Returns only source-backed fields needed by downstream TRN generation. Unknown,
    promotional, rating, image, author, nutrition, comment, and page metadata are
    intentionally not copied into the normalized output.
    """

    for block in _extract_json_ld_blocks(raw_text):
        try:
            parsed = json.loads(block)
        except json.JSONDecodeError:
            continue

        recipes = sorted(_find_recipe_nodes(parsed), key=_recipe_score, reverse=True)
        for recipe in recipes:
            ingredients = [_clean_text(item) for item in _as_list(recipe.get("recipeIngredient"))]
            ingredients = [item for item in ingredients if item]
            steps = _instruction_steps(recipe.get("recipeInstructions"))
            if not ingredients and not steps:
                continue
            title = _clean_text(recipe.get("name")) or "Untitled recipe"
            return {
                "title": title,
                "sourceUrl": source_url,
                "basis": "schema.org Recipe JSON-LD",
                "ingredients": ingredients,
                "steps": steps,
                "prepTime": _clean_text(recipe.get("prepTime")),
                "cookTime": _clean_text(recipe.get("cookTime")),
                "totalTime": _clean_text(recipe.get("totalTime")),
                "yield": [_clean_text(item) for item in _as_list(recipe.get("recipeYield")) if _clean_text(item)],
            }
    return None


def _extract_json_ld_blocks(raw_text: str) -> list[str]:
    script_blocks = [unescape(match.group(1)).strip() for match in _SCRIPT_PATTERN.finditer(raw_text)]
    if script_blocks:
        return script_blocks

    stripped = raw_text.strip()
    if stripped.startswith("{") or stripped.startswith("["):
        return [stripped]
    return []


def _as_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def _json_ld_types(node: JsonObject) -> list[str]:
    return [_clean_text(value).lower() for value in _as_list(node.get("@type"))]


def _find_recipe_nodes(node: Any) -> list[JsonObject]:
    found: list[JsonObject] = []
    _walk_recipe_nodes(node, found)
    return found


def _walk_recipe_nodes(node: Any, found: list[JsonObject]) -> None:
    if isinstance(node, list):
        for item in node:
            _walk_recipe_nodes(item, found)
        return

    if not isinstance(node, dict):
        return

    if "recipe" in _json_ld_types(node):
        found.append(node)

    for value in node.values():
        _walk_recipe_nodes(value, found)


def _recipe_score(recipe: JsonObject) -> int:
    return len(_as_list(recipe.get("recipeIngredient"))) * 3 + len(_instruction_steps(recipe.get("recipeInstructions"))) * 5


def _instruction_steps(value: Any, section_name: str = "") -> list[dict[str, str]]:
    steps: list[dict[str, str]] = []
    for item in _as_list(value):
        if isinstance(item, str):
            text = _clean_text(item)
            if text:
                steps.append({"text": text, "section": section_name})
            continue

        if not isinstance(item, dict):
            continue

        types = _json_ld_types(item)
        next_section = _clean_text(item.get("name")) if "howtosection" in types else section_name
        if item.get("itemListElement") is not None:
            steps.extend(_instruction_steps(item.get("itemListElement"), next_section))
            continue

        text = _clean_text(item.get("text")) or _clean_text(item.get("name")) or _clean_text(item.get("description"))
        if text:
            steps.append({"text": text, "section": next_section})
    return steps


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, dict):
        return ""
    text = unescape(str(value))
    text = _TAG_PATTERN.sub(" ", text)
    return _WHITESPACE_PATTERN.sub(" ", text).strip()
