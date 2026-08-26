import json
import tempfile
from pathlib import Path

from behave import given, when, then
from PIL import Image

from trn_renderer import render_trn_png_bytes, render_trn_png_file, render_trn_manifest

ROOT = Path(__file__).resolve().parents[2]
FIXTURE_DIR = ROOT / "tests" / "fixtures"


@given('the hand-authored TRN matrix fixture "{fixture_file}"')
def step_load_fixture(context, fixture_file):
    context.fixture_file = fixture_file
    context.fixture = json.loads((FIXTURE_DIR / fixture_file).read_text(encoding="utf-8"))
    context.output_dir = Path(tempfile.mkdtemp(prefix="trn-behave-"))
    context.output_path = context.output_dir / fixture_file.replace(".json", ".png")


@when("the Python renderer renders the fixture")
def step_render_fixture(context):
    context.png_bytes = render_trn_png_bytes(context.fixture)
    context.png_path = render_trn_png_file(context.fixture, context.output_path)
    context.manifest = render_trn_manifest(context.fixture)


@then("valid PNG bytes are produced")
def step_valid_png(context):
    assert context.png_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    assert context.png_path.read_bytes().startswith(b"\x89PNG\r\n\x1a\n")
    assert len(context.png_bytes) > 10_000
    with Image.open(context.png_path) as image:
        assert image.format == "PNG"
        assert image.width >= 700
        assert image.height >= 500


@then("the PNG includes ingredient rows")
def step_ingredient_rows(context):
    assert len(context.manifest["ingredient_rows"]) == len(context.fixture["rows"])
    assert context.manifest["ingredient_rows"][0]["label"] == context.fixture["rows"][0]["label"]


@then("the PNG includes action columns")
def step_action_columns(context):
    assert len(context.manifest["action_columns"]) == len(context.fixture["columns"])
    assert context.manifest["action_columns"][0]["label"] == context.fixture["columns"][0]["label"]


@then("the PNG includes participation marks")
def step_participation_marks(context):
    assert len(context.manifest["participation_marks"]) == len(context.fixture["marks"])
    assert len(context.manifest["combination_spans"]) == len(context.fixture.get("spans", []))


@then("the PNG includes the finished dish")
def step_finished_dish(context):
    assert context.manifest["final_dish"] == context.fixture["finalDish"]


@then("the PNG excludes superfluous prose")
def step_excludes_prose(context):
    rendered_text = "\n".join(context.manifest["rendered_text"])
    assert "recipe blog prose" not in rendered_text.lower()
    assert "perfect for parties" not in rendered_text.lower()
    assert "cozy weekends" not in rendered_text.lower()
