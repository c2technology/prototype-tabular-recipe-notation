from pathlib import Path

from behave import given, then, when

from trn_recipe import parse_schema_org_recipe


FIXTURES = Path(__file__).resolve().parents[2] / "tests" / "fixtures"


@given("a Schema.org Recipe JSON-LD fixture")
def given_schema_fixture(context):
    context.recipe_source = (FIXTURES / "schema-org-focaccia.html").read_text()


@given("an HTML document without Schema.org Recipe JSON-LD")
def given_non_recipe_html(context):
    context.recipe_source = '<html><script type="application/ld+json">{"@type":"WebPage","name":"Not a recipe"}</script></html>'


@when("the Python recipe parser normalizes the recipe")
def parse_recipe(context):
    context.normalized_recipe = parse_schema_org_recipe(context.recipe_source, source_url="https://example.com/focaccia")


@when("the Python recipe parser tries to normalize the recipe")
def try_parse_recipe(context):
    context.normalized_recipe = parse_schema_org_recipe(context.recipe_source, source_url="https://example.com/no-recipe")


@then("the normalized recipe contains the source ingredient list")
def assert_source_ingredients(context):
    assert context.normalized_recipe is not None
    assert context.normalized_recipe["ingredients"] == [
        "500 g bread flour",
        "2 tsp kosher salt",
        "1 tsp instant yeast",
        "425 g warm water",
        "3 tbsp olive oil",
        "Flaky salt",
    ]


@then("the normalized recipe contains ordered instruction steps")
def assert_ordered_steps(context):
    assert context.normalized_recipe is not None
    assert [step["text"] for step in context.normalized_recipe["steps"]] == [
        "Stir bread flour, kosher salt, instant yeast, and warm water until no dry spots remain.",
        "Cover and rest until bubbly.",
        "Oil the pan and stretch the dough into it.",
        "Dimple with olive oil, sprinkle flaky salt, and bake until golden.",
    ]


@then("the normalized recipe preserves instruction section names")
def assert_sections(context):
    assert context.normalized_recipe is not None
    assert [step["section"] for step in context.normalized_recipe["steps"]] == [
        "Make the Dough",
        "Make the Dough",
        "Bake",
        "Bake",
    ]


@then("superfluous non-TRN metadata is removed")
def assert_superfluous_removed(context):
    assert context.normalized_recipe is not None
    forbidden = {"aggregateRating", "nutrition", "image", "author", "comments", "description"}
    assert forbidden.isdisjoint(context.normalized_recipe.keys())


@then("no normalized recipe is returned")
def assert_no_recipe(context):
    assert context.normalized_recipe is None
