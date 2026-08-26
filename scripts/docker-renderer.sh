#!/bin/sh
set -eu

case "${1:-verify}" in
  verify)
    python -m unittest tests/test_trn_renderer.py tests/test_trn_api_handler.py tests/test_cognito_auth_config.py
    python -m behave features
    python -m coverage run --branch --source=trn_renderer --omit='trn_renderer/__main__.py' -m unittest tests/test_trn_renderer.py
    python -m coverage report --fail-under=100 --show-missing
    python -m coverage run --branch --source=trn_api -m unittest tests/test_trn_api_handler.py
    python -m coverage report --fail-under=100 --show-missing
    python tests/check_fixtures.py
    ;;
  render-fixtures)
    mkdir -p artifacts
    python -m trn_renderer tests/fixtures/hand-authored-trn-matrix.json artifacts/fudgy-brownies-trn.png
    python -m trn_renderer tests/fixtures/toll-house-cookie-trn-matrix.json artifacts/toll-house-cookie-trn.png
    ;;
  shell)
    shift
    exec /bin/sh "$@"
    ;;
  *)
    exec "$@"
    ;;
esac
