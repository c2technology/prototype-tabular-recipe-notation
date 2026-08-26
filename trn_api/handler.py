from __future__ import annotations

import base64
import json
from typing import Any

from trn_renderer import FixtureValidationError, render_trn_png_bytes


def _json_response(status_code: int, error: str, message: str) -> dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "isBase64Encoded": False,
        "body": json.dumps({"error": error, "message": message}, separators=(",", ":")),
    }


def _png_response(png_bytes: bytes) -> dict[str, Any]:
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "image/png", "Cache-Control": "no-store"},
        "isBase64Encoded": True,
        "body": base64.b64encode(png_bytes).decode("ascii"),
    }


def _request_body(event: dict[str, Any]) -> str:
    if "body" not in event or event["body"] in (None, ""):
        raise ValueError("request body is required")

    body = event["body"]
    if event.get("isBase64Encoded") is True:
        try:
            return base64.b64decode(str(body), validate=True).decode("utf-8")
        except Exception as exc:  # noqa: BLE001 - keep Lambda-shaped handler dependency-free
            raise ValueError("request body must be valid base64-encoded UTF-8 JSON") from exc

    return str(body)


def handler(event: Any, context: Any) -> dict[str, Any]:
    """Lambda/API Gateway-shaped local handler for TRN matrix to PNG rendering."""
    del context

    if not isinstance(event, dict):
        return _json_response(400, "invalid_request", "event must be an object")

    try:
        raw_body = _request_body(event)
    except ValueError as exc:
        return _json_response(400, "invalid_request", str(exc))

    try:
        fixture = json.loads(raw_body)
    except json.JSONDecodeError as exc:
        return _json_response(400, "invalid_json", f"request body must be JSON: {exc.msg}")

    try:
        return _png_response(render_trn_png_bytes(fixture))
    except FixtureValidationError as exc:
        return _json_response(400, "invalid_trn_matrix", str(exc))
