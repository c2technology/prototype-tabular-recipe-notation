from __future__ import annotations

import json
import sys
from pathlib import Path

from . import render_trn_png_file


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if len(args) != 2:
        print("Usage: python -m trn_renderer <fixture.json> <output.png>", file=sys.stderr)
        return 2
    fixture_path = Path(args[0])
    output_path = Path(args[1])
    fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
    out = render_trn_png_file(fixture, output_path)
    print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
