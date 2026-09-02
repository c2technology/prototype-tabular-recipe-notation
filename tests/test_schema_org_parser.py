import json
import unittest
from pathlib import Path

from trn_recipe import parse_schema_org_recipe


FIXTURES = Path(__file__).parent / "fixtures"


class SchemaOrgParserTests(unittest.TestCase):
    def test_parses_recipe_node_from_json_ld_graph(self):
        html = (FIXTURES / "schema-org-focaccia.html").read_text()

        recipe = parse_schema_org_recipe(html, source_url="https://example.com/focaccia")

        self.assertIsNotNone(recipe)
        assert recipe is not None
        self.assertEqual(recipe["basis"], "schema.org Recipe JSON-LD")
        self.assertEqual(recipe["sourceUrl"], "https://example.com/focaccia")
        self.assertEqual(recipe["title"], "No-Knead Focaccia")
        self.assertEqual(
            recipe["ingredients"],
            [
                "500 g bread flour",
                "2 tsp kosher salt",
                "1 tsp instant yeast",
                "425 g warm water",
                "3 tbsp olive oil",
                "Flaky salt",
            ],
        )
        self.assertEqual(
            recipe["steps"],
            [
                {"text": "Stir bread flour, kosher salt, instant yeast, and warm water until no dry spots remain.", "section": "Make the Dough"},
                {"text": "Cover and rest until bubbly.", "section": "Make the Dough"},
                {"text": "Oil the pan and stretch the dough into it.", "section": "Bake"},
                {"text": "Dimple with olive oil, sprinkle flaky salt, and bake until golden.", "section": "Bake"},
            ],
        )
        self.assertEqual(recipe["prepTime"], "PT20M")
        self.assertEqual(recipe["cookTime"], "PT25M")
        self.assertEqual(recipe["totalTime"], "PT4H45M")
        self.assertEqual(recipe["yield"], ["1 pan", "8 servings"])

    def test_ignores_non_trn_metadata(self):
        html = (FIXTURES / "schema-org-focaccia.html").read_text()

        recipe = parse_schema_org_recipe(html)

        assert recipe is not None
        serialized = json.dumps(recipe)
        self.assertNotIn("aggregateRating", serialized)
        self.assertNotIn("nutrition", serialized)
        self.assertNotIn("image", serialized)
        self.assertNotIn("author", serialized)
        self.assertNotIn("Comments", serialized)

    def test_finds_best_recipe_when_multiple_nodes_exist(self):
        raw = json.dumps(
            [
                {"@type": "Recipe", "name": "Empty Recipe"},
                {
                    "@type": "Recipe",
                    "name": "Real Recipe",
                    "recipeIngredient": ["1 cup flour"],
                    "recipeInstructions": ["Mix flour with water."],
                },
            ]
        )

        recipe = parse_schema_org_recipe(raw)

        assert recipe is not None
        self.assertEqual(recipe["title"], "Real Recipe")
        self.assertEqual(recipe["ingredients"], ["1 cup flour"])
        self.assertEqual(recipe["steps"], [{"text": "Mix flour with water.", "section": ""}])

    def test_returns_none_when_no_recipe_node_exists(self):
        self.assertIsNone(parse_schema_org_recipe('<html><script type="application/ld+json">{"@type":"WebPage"}</script></html>'))

    def test_returns_none_when_recipe_node_has_no_trn_fields(self):
        raw = json.dumps({"@type": "Recipe", "name": "Empty Recipe"})
        self.assertIsNone(parse_schema_org_recipe(raw))

    def test_returns_none_when_no_json_ld_blocks_exist(self):
        self.assertIsNone(parse_schema_org_recipe("<html><p>No structured data here.</p></html>"))

    def test_skips_empty_recipe_nodes_and_noisy_instruction_items(self):
        raw = json.dumps(
            [
                {"@type": "Recipe", "name": "Empty Recipe", "recipeInstructions": ["", 12, {"@type": "HowToStep"}]},
                {
                    "@type": "Recipe",
                    "recipeIngredient": [{"name": "ignored dict"}, "<b>sugar</b>"],
                    "recipeInstructions": [
                        "",
                        7,
                        {"@type": "HowToStep"},
                        {"@type": "HowToStep", "text": "<p>Whisk sugar.</p>"},
                    ],
                },
            ]
        )

        recipe = parse_schema_org_recipe(raw)

        assert recipe is not None
        self.assertEqual(recipe["title"], "Untitled recipe")
        self.assertEqual(recipe["ingredients"], ["sugar"])
        self.assertEqual(recipe["steps"], [{"text": "Whisk sugar.", "section": ""}])

    def test_skips_invalid_json_ld_blocks(self):
        raw = """
        <script type="application/ld+json">not-json</script>
        <script type="application/ld+json">{"@type":"Recipe","name":"Valid","recipeIngredient":["salt"]}</script>
        """

        recipe = parse_schema_org_recipe(raw)

        assert recipe is not None
        self.assertEqual(recipe["title"], "Valid")
        self.assertEqual(recipe["ingredients"], ["salt"])


if __name__ == "__main__":
    unittest.main()
