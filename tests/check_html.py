from html.parser import HTMLParser
from pathlib import Path

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'script' and 'src' in attrs:
            self.scripts.append(attrs['src'])

html = Path('index.html').read_text()
parser = Parser()
parser.feed(html)
required_ids = {'recipe-form', 'recipe-url', 'load-demo', 'download-svg', 'status', 'graphic', 'recipe-summary', 'steps'}
missing = required_ids - parser.ids
assert not missing, f'missing ids: {sorted(missing)}'
assert 'src/app.js' in ' '.join(parser.scripts)
print('html sanity passed')
