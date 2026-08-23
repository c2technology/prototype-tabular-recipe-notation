import json
from pathlib import Path

for path in Path('tests/fixtures').glob('*.json'):
    json.loads(path.read_text())
print('fixture sanity passed')
