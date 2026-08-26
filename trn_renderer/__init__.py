from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
import textwrap
from typing import Any

from PIL import Image, ImageDraw, ImageFont


class FixtureValidationError(ValueError):
    """Raised when a TRN matrix fixture is malformed."""


@dataclass(frozen=True)
class Layout:
    margin: int = 28
    title_height: int = 70
    header_height: int = 78
    row_height: int = 48
    ingredient_width: int = 230
    action_width: int = 122
    final_width: int = 138
    bottom_padding: int = 96


def _validate_fixture(fixture: dict[str, Any]) -> None:
    if not isinstance(fixture, dict):
        raise FixtureValidationError("TRN fixture must be an object")
    for key in ("title", "finalDish", "rows", "columns", "marks"):
        if key not in fixture:
            raise FixtureValidationError(f"TRN fixture missing {key}")
    if not isinstance(fixture["rows"], list) or not fixture["rows"]:
        raise FixtureValidationError("TRN fixture rows must be a non-empty list")
    if not isinstance(fixture["columns"], list) or not fixture["columns"]:
        raise FixtureValidationError("TRN fixture columns must be a non-empty list")
    if not isinstance(fixture["marks"], list):
        raise FixtureValidationError("TRN fixture marks must be a list")
    if "spans" in fixture and not isinstance(fixture["spans"], list):
        raise FixtureValidationError("TRN fixture spans must be a list")

    row_ids = {row.get("id") for row in fixture["rows"] if isinstance(row, dict)}
    column_ids = {column.get("id") for column in fixture["columns"] if isinstance(column, dict)}
    if len(row_ids) != len(fixture["rows"]) or None in row_ids:
        raise FixtureValidationError("TRN fixture rows must each have a unique id")
    if len(column_ids) != len(fixture["columns"]) or None in column_ids:
        raise FixtureValidationError("TRN fixture columns must each have a unique id")

    for span in fixture.get("spans", []):
        span_id = span.get("id", "") if isinstance(span, dict) else ""
        if not isinstance(span, dict):
            raise FixtureValidationError("TRN fixture spans must contain objects")
        if not isinstance(span.get("rows"), list) or not span["rows"]:
            raise FixtureValidationError(f"TRN span {span_id} must reference rows")
        for row in span["rows"]:
            if row not in row_ids:
                raise FixtureValidationError(f"TRN span references unknown row {row}")
        if span.get("fromColumn") not in column_ids:
            raise FixtureValidationError(f"TRN span references unknown fromColumn {span.get('fromColumn')}")
        if span.get("toColumn") not in column_ids:
            raise FixtureValidationError(f"TRN span references unknown toColumn {span.get('toColumn')}")

    for mark in fixture["marks"]:
        if not isinstance(mark, dict):
            raise FixtureValidationError("TRN fixture marks must contain objects")
        if mark.get("row") not in row_ids:
            raise FixtureValidationError(f"TRN mark references unknown row {mark.get('row')}")
        if mark.get("column") not in column_ids:
            raise FixtureValidationError(f"TRN mark references unknown column {mark.get('column')}")


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = ["DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf", "Arial Bold.ttf" if bold else "Arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size=size)
        except OSError:
            pass
    return ImageFont.load_default()


def _wrapped_lines(text: str, max_chars: int) -> list[str]:
    return textwrap.wrap(str(text), width=max_chars, break_long_words=False) or [""]


def _draw_text_block(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], max_chars: int, *, font: ImageFont.ImageFont, fill: str, anchor: str = "la", line_height: int | None = None) -> None:
    x, y = xy
    step = line_height if line_height is not None else int(getattr(font, "size", 14) * 1.25)
    for index, line in enumerate(_wrapped_lines(text, max_chars)):
        draw.text((x, y + index * step), line, font=font, fill=fill, anchor=anchor)


def render_trn_manifest(fixture: dict[str, Any]) -> dict[str, Any]:
    _validate_fixture(fixture)
    return {
        "title": fixture["title"],
        "final_dish": fixture["finalDish"],
        "ingredient_rows": [{"id": row["id"], "label": row["label"]} for row in fixture["rows"]],
        "action_columns": [{"id": column["id"], "label": column["label"]} for column in fixture["columns"]],
        "participation_marks": [{"row": mark["row"], "column": mark["column"]} for mark in fixture["marks"]],
        "combination_spans": [
            {
                "id": span.get("id", span.get("label", "")),
                "label": span.get("label", ""),
                "rows": list(span["rows"]),
                "fromColumn": span["fromColumn"],
                "toColumn": span["toColumn"],
            }
            for span in fixture.get("spans", [])
        ],
        "rendered_text": [
            fixture["title"],
            "Read left to right: ingredients combine through actions into the finished dish.",
            "Ingredients",
            *[row["label"] for row in fixture["rows"]],
            *[column["label"] for column in fixture["columns"]],
            "Finished",
            fixture["finalDish"],
        ],
    }


def render_trn_image(fixture: dict[str, Any]) -> Image.Image:
    manifest = render_trn_manifest(fixture)
    layout = Layout()
    row_count = len(manifest["ingredient_rows"])
    column_count = len(manifest["action_columns"])
    width = layout.margin * 2 + layout.ingredient_width + column_count * layout.action_width + layout.final_width
    height = layout.margin * 2 + layout.title_height + layout.header_height + row_count * layout.row_height + layout.bottom_padding

    image = Image.new("RGB", (width, height), "#fbfaf7")
    draw = ImageDraw.Draw(image)
    font_title = _font(26, bold=True)
    font_header = _font(14, bold=True)
    font_cell = _font(13)
    font_note = _font(13)

    grid_x = layout.margin
    grid_y = layout.margin + layout.title_height
    body_y = grid_y + layout.header_height
    final_x = grid_x + layout.ingredient_width + column_count * layout.action_width

    _draw_text_block(draw, manifest["title"], (layout.margin, layout.margin + 8), 56, font=font_title, fill="#111827")
    _draw_text_block(draw, "Read left to right: ingredients combine through actions into the finished dish.", (layout.margin, layout.margin + 44), 90, font=font_note, fill="#5f6b7a")

    draw.rectangle((grid_x, grid_y, grid_x + layout.ingredient_width, grid_y + layout.header_height), fill="#ede7dc", outline="#c9bda9")
    _draw_text_block(draw, "Ingredients", (grid_x + 14, grid_y + 26), 22, font=font_header, fill="#2f302c")

    for column_index, column in enumerate(manifest["action_columns"]):
        x = grid_x + layout.ingredient_width + column_index * layout.action_width
        draw.rectangle((x, grid_y, x + layout.action_width, grid_y + layout.header_height), fill="#efe6d3", outline="#c9bda9")
        _draw_text_block(draw, column["label"], (x + layout.action_width // 2, grid_y + 22), 13, font=font_header, fill="#3a3328", anchor="ma")

    draw.rectangle((final_x, grid_y, final_x + layout.final_width, grid_y + layout.header_height), fill="#dfe8d6", outline="#a9b99d")
    _draw_text_block(draw, "Finished", (final_x + layout.final_width // 2, grid_y + 18), 12, font=font_header, fill="#263322", anchor="ma")
    _draw_text_block(draw, manifest["final_dish"], (final_x + layout.final_width // 2, grid_y + 42), 12, font=font_header, fill="#263322", anchor="ma")

    for row_index, row in enumerate(manifest["ingredient_rows"]):
        y = body_y + row_index * layout.row_height
        fill = "#fffdf8" if row_index % 2 == 0 else "#f7f3eb"
        draw.rectangle((grid_x, y, grid_x + layout.ingredient_width, y + layout.row_height), fill=fill, outline="#ddd3c2")
        _draw_text_block(draw, row["label"], (grid_x + 12, y + 14), 24, font=font_cell, fill="#22272e")
        for column_index in range(column_count):
            x = grid_x + layout.ingredient_width + column_index * layout.action_width
            draw.rectangle((x, y, x + layout.action_width, y + layout.row_height), fill=fill, outline="#ddd3c2")
        draw.rectangle((final_x, y, final_x + layout.final_width, y + layout.row_height), fill="#eef5e9", outline="#c9d6bd")

    row_index_by_id = {row["id"]: index for index, row in enumerate(manifest["ingredient_rows"])}
    column_index_by_id = {column["id"]: index for index, column in enumerate(manifest["action_columns"])}

    for span in manifest["combination_spans"]:
        row_indexes = sorted(row_index_by_id[row] for row in span["rows"])
        first_row, last_row = row_indexes[0], row_indexes[-1]
        first_column = min(column_index_by_id[span["fromColumn"]], column_index_by_id[span["toColumn"]])
        last_column = max(column_index_by_id[span["fromColumn"]], column_index_by_id[span["toColumn"]])
        x = grid_x + layout.ingredient_width + first_column * layout.action_width + 8
        y = body_y + first_row * layout.row_height + 8
        w = (last_column - first_column + 1) * layout.action_width - 16
        h = (last_row - first_row + 1) * layout.row_height - 16
        draw.rounded_rectangle((x, y, x + w, y + h), radius=14, outline="#8f6f35", width=2)

    mark_set = {(mark["row"], mark["column"]) for mark in manifest["participation_marks"]}
    mark_radius = 8
    for row_index, row in enumerate(manifest["ingredient_rows"]):
        y = body_y + row_index * layout.row_height
        for column_index, column in enumerate(manifest["action_columns"]):
            if (row["id"], column["id"]) in mark_set:
                x = grid_x + layout.ingredient_width + column_index * layout.action_width
                cx = x + layout.action_width // 2
                cy = y + layout.row_height // 2
                draw.ellipse((cx - mark_radius, cy - mark_radius, cx + mark_radius, cy + mark_radius), fill="#111827")
        cx = final_x + layout.final_width // 2
        cy = y + layout.row_height // 2
        draw.ellipse((cx - mark_radius, cy - mark_radius, cx + mark_radius, cy + mark_radius), fill="#111827")

    return image


def render_trn_png_bytes(fixture: dict[str, Any]) -> bytes:
    image = render_trn_image(fixture)
    out = BytesIO()
    image.save(out, format="PNG")
    return out.getvalue()


def render_trn_png_file(fixture: dict[str, Any], output_path: str | Path) -> Path:
    out = Path(output_path).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(render_trn_png_bytes(fixture))
    return out


__all__ = [
    "FixtureValidationError",
    "render_trn_image",
    "render_trn_manifest",
    "render_trn_png_bytes",
    "render_trn_png_file",
]
