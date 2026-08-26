import base64
import json
import tempfile
from pathlib import Path

from behave import given, when, then
from PIL import Image

from trn_api.handler import handler

ROOT = Path(__file__).resolve().parents[2]
FIXTURE_DIR = ROOT / "tests" / "fixtures"


@given("a valid TRN matrix JSON request")
def step_valid_api_request(context):
    fixture = json.loads((FIXTURE_DIR / "hand-authored-trn-matrix.json").read_text(encoding="utf-8"))
    context.api_event = {"body": json.dumps(fixture), "isBase64Encoded": False}


@given("a TRN matrix request missing ingredient rows")
def step_invalid_api_request(context):
    fixture = json.loads((FIXTURE_DIR / "hand-authored-trn-matrix.json").read_text(encoding="utf-8"))
    fixture.pop("rows")
    context.api_event = {"body": json.dumps(fixture), "isBase64Encoded": False}


@when("the local API handler processes the request")
def step_process_api_request(context):
    context.api_response = handler(context.api_event, None)


@then("the API response status is {status_code:d}")
def step_api_status(context, status_code):
    assert context.api_response["statusCode"] == status_code


@then("the API response content type is image/png")
def step_api_png_content_type(context):
    assert context.api_response["headers"]["Content-Type"] == "image/png"
    assert context.api_response["isBase64Encoded"] is True


@then("the API response body contains a valid PNG")
def step_api_valid_png(context):
    png_bytes = base64.b64decode(context.api_response["body"])
    assert png_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    with tempfile.NamedTemporaryFile(suffix=".png") as handle:
        handle.write(png_bytes)
        handle.flush()
        with Image.open(handle.name) as image:
            assert image.format == "PNG"
            assert image.width >= 700
            assert image.height >= 500


@then("the API response explains the validation error")
def step_api_validation_error(context):
    assert context.api_response["headers"]["Content-Type"] == "application/json"
    assert context.api_response["isBase64Encoded"] is False
    payload = json.loads(context.api_response["body"])
    assert payload["error"] == "invalid_trn_matrix"
    assert "rows" in payload["message"]
