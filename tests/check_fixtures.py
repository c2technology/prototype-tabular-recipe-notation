import json
from pathlib import Path

fixture_dir = Path(__file__).parent / "fixtures"
required = {"title", "finalDish", "rows", "columns", "marks"}

for fixture_path in fixture_dir.glob("*.json"):
    fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
    missing = required - fixture.keys()
    assert not missing, f"{fixture_path.name} missing {sorted(missing)}"
    assert fixture["rows"], f"{fixture_path.name} must define rows"
    assert fixture["columns"], f"{fixture_path.name} must define columns"
    row_ids = {row["id"] for row in fixture["rows"]}
    column_ids = {column["id"] for column in fixture["columns"]}
    for mark in fixture["marks"]:
        assert mark["row"] in row_ids, f"{fixture_path.name} mark unknown row {mark['row']}"
        assert mark["column"] in column_ids, f"{fixture_path.name} mark unknown column {mark['column']}"
    for span in fixture.get("spans", []):
        assert span["rows"], f"{fixture_path.name} span {span.get('id')} must reference rows"
        assert span["fromColumn"] in column_ids, f"{fixture_path.name} span unknown fromColumn {span['fromColumn']}"
        assert span["toColumn"] in column_ids, f"{fixture_path.name} span unknown toColumn {span['toColumn']}"
        for row in span["rows"]:
            assert row in row_ids, f"{fixture_path.name} span unknown row {row}"

print("fixture sanity passed")
