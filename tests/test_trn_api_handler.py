import base64
import json
import unittest

from PIL import Image

from trn_api.handler import handler


class TrnApiHandlerTests(unittest.TestCase):
    def valid_fixture(self):
        with open("tests/fixtures/hand-authored-trn-matrix.json", encoding="utf-8") as handle:
            return json.load(handle)

    def assert_png_response(self, response):
        self.assertEqual(response["statusCode"], 200)
        self.assertTrue(response["isBase64Encoded"])
        self.assertEqual(response["headers"]["Content-Type"], "image/png")
        self.assertEqual(response["headers"]["Cache-Control"], "no-store")
        png_bytes = base64.b64decode(response["body"])
        self.assertTrue(png_bytes.startswith(b"\x89PNG\r\n\x1a\n"))
        with open("/tmp/trn-api-handler-test.png", "wb") as handle:
            handle.write(png_bytes)
        with Image.open("/tmp/trn-api-handler-test.png") as image:
            self.assertEqual(image.format, "PNG")
            self.assertGreaterEqual(image.width, 700)
            self.assertGreaterEqual(image.height, 500)

    def test_returns_png_for_valid_matrix_body(self):
        response = handler({"body": json.dumps(self.valid_fixture()), "isBase64Encoded": False}, None)
        self.assert_png_response(response)

    def test_accepts_base64_encoded_json_body(self):
        body = base64.b64encode(json.dumps(self.valid_fixture()).encode("utf-8")).decode("ascii")
        response = handler({"body": body, "isBase64Encoded": True}, None)
        self.assert_png_response(response)

    def test_rejects_non_object_event(self):
        response = handler(None, None)
        payload = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 400)
        self.assertEqual(payload["error"], "invalid_request")
        self.assertIn("event", payload["message"])

    def test_rejects_missing_body(self):
        response = handler({}, None)
        payload = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 400)
        self.assertFalse(response["isBase64Encoded"])
        self.assertEqual(response["headers"]["Content-Type"], "application/json")
        self.assertEqual(payload["error"], "invalid_request")
        self.assertIn("body", payload["message"])

    def test_rejects_invalid_json(self):
        response = handler({"body": "not-json", "isBase64Encoded": False}, None)
        payload = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 400)
        self.assertEqual(payload["error"], "invalid_json")

    def test_rejects_invalid_base64(self):
        response = handler({"body": "not-base64@@@", "isBase64Encoded": True}, None)
        payload = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 400)
        self.assertEqual(payload["error"], "invalid_request")
        self.assertIn("base64", payload["message"].lower())

    def test_rejects_invalid_matrix(self):
        fixture = self.valid_fixture()
        fixture.pop("rows")
        response = handler({"body": json.dumps(fixture), "isBase64Encoded": False}, None)
        payload = json.loads(response["body"])
        self.assertEqual(response["statusCode"], 400)
        self.assertEqual(payload["error"], "invalid_trn_matrix")
        self.assertIn("rows", payload["message"])


if __name__ == "__main__":
    unittest.main()
