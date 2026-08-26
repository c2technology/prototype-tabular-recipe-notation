import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

import trn_renderer
from trn_renderer import FixtureValidationError, render_trn_manifest, render_trn_png_bytes, render_trn_png_file

ROOT = Path(__file__).resolve().parents[1]
FIXTURE_DIR = ROOT / "tests" / "fixtures"


class TrnRendererTests(unittest.TestCase):
    def load_fixture(self, name):
        return json.loads((FIXTURE_DIR / name).read_text(encoding="utf-8"))

    def assert_valid_png(self, png_bytes):
        self.assertTrue(png_bytes.startswith(b"\x89PNG\r\n\x1a\n"))
        self.assertGreater(len(png_bytes), 10_000)
        with tempfile.NamedTemporaryFile(suffix=".png") as handle:
            handle.write(png_bytes)
            handle.flush()
            with Image.open(handle.name) as image:
                self.assertEqual(image.format, "PNG")
                self.assertGreaterEqual(image.width, 700)
                self.assertGreaterEqual(image.height, 500)

    def test_renders_brownies_fixture_to_png_bytes(self):
        fixture = self.load_fixture("hand-authored-trn-matrix.json")
        self.assert_valid_png(render_trn_png_bytes(fixture))

    def test_renders_toll_house_fixture_to_png_file(self):
        fixture = self.load_fixture("toll-house-cookie-trn-matrix.json")
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp) / "cookie.png"
            returned = render_trn_png_file(fixture, output)
            self.assertEqual(returned, output.resolve())
            self.assert_valid_png(output.read_bytes())

    def test_manifest_reflects_semantic_rendering_contract(self):
        fixture = self.load_fixture("toll-house-cookie-trn-matrix.json")
        manifest = render_trn_manifest(fixture)
        self.assertEqual(manifest["title"], fixture["title"])
        self.assertEqual(manifest["final_dish"], fixture["finalDish"])
        self.assertEqual(len(manifest["ingredient_rows"]), len(fixture["rows"]))
        self.assertEqual(len(manifest["action_columns"]), len(fixture["columns"]))
        self.assertEqual(len(manifest["participation_marks"]), len(fixture["marks"]))
        self.assertEqual(len(manifest["combination_spans"]), len(fixture["spans"]))
        rendered_text = "\n".join(manifest["rendered_text"])
        self.assertNotIn("perfect for parties", rendered_text.lower())

    def test_validation_rejects_malformed_fixtures(self):
        invalid_cases = [
            (None, "TRN fixture must be an object"),
            ({"title": "Invalid"}, "TRN fixture missing finalDish"),
            ({"title": "Invalid", "finalDish": "X", "rows": [], "columns": [{"id": "c", "label": "C"}], "marks": []}, "rows must be a non-empty list"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [], "marks": []}, "columns must be a non-empty list"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "marks": "bad"}, "marks must be a list"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "spans": "bad", "marks": []}, "spans must be a list"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "spans": [{"id": "s", "rows": [], "fromColumn": "c", "toColumn": "c"}], "marks": []}, "span s must reference rows"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}, {"id": "r", "label": "Duplicate"}], "columns": [{"id": "c", "label": "C"}], "marks": []}, "rows must each have a unique id"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"label": "No id"}], "columns": [{"id": "c", "label": "C"}], "marks": []}, "rows must each have a unique id"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}, {"id": "c", "label": "Duplicate"}], "marks": []}, "columns must each have a unique id"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"label": "No id"}], "marks": []}, "columns must each have a unique id"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "spans": ["bad"], "marks": []}, "spans must contain objects"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "spans": [{"id": "s", "rows": ["missing"], "fromColumn": "c", "toColumn": "c"}], "marks": []}, "span references unknown row missing"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "spans": [{"id": "s", "rows": ["r"], "fromColumn": "missing", "toColumn": "c"}], "marks": []}, "span references unknown fromColumn missing"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "spans": [{"id": "s", "rows": ["r"], "fromColumn": "c", "toColumn": "missing"}], "marks": []}, "span references unknown toColumn missing"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "marks": ["bad"]}, "marks must contain objects"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "marks": [{"row": "missing", "column": "c"}]}, "mark references unknown row missing"),
            ({"title": "Invalid", "finalDish": "X", "rows": [{"id": "r", "label": "R"}], "columns": [{"id": "c", "label": "C"}], "marks": [{"row": "r", "column": "missing"}]}, "mark references unknown column missing"),
        ]
        for fixture, message in invalid_cases:
            with self.subTest(message=message):
                with self.assertRaisesRegex(FixtureValidationError, message):
                    render_trn_png_bytes(fixture)

    def test_font_fallback_when_truetype_unavailable(self):
        original_truetype = trn_renderer.ImageFont.truetype
        try:
            trn_renderer.ImageFont.truetype = lambda *args, **kwargs: (_ for _ in ()).throw(OSError("no font"))
            font = trn_renderer._font(12)
            self.assertIsNotNone(font)
        finally:
            trn_renderer.ImageFont.truetype = original_truetype

    def test_cli_usage_error(self):
        result = subprocess.run([sys.executable, "-m", "trn_renderer"], cwd=ROOT, capture_output=True, text=True, check=False)
        self.assertEqual(result.returncode, 2)
        self.assertIn("Usage:", result.stderr)

    def test_cli_writes_png(self):
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp) / "brownies.png"
            result = subprocess.run([
                sys.executable,
                "-m",
                "trn_renderer",
                str(FIXTURE_DIR / "hand-authored-trn-matrix.json"),
                str(output),
            ], cwd=ROOT, capture_output=True, text=True, check=False)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(Path(result.stdout.strip()), output.resolve())
            self.assert_valid_png(output.read_bytes())


if __name__ == "__main__":
    unittest.main()
