import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "infra" / "cognito-auth.template.json"
DOC = ROOT / "docs" / "auth.md"


class CognitoInviteOnlyAuthConfigTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.template = json.loads(TEMPLATE.read_text(encoding="utf-8"))
        cls.resources = cls.template["Resources"]
        cls.doc = DOC.read_text(encoding="utf-8")

    def test_user_pool_blocks_public_self_signup_and_uses_email_identity(self):
        user_pool = self.resources["TrnUserPool"]["Properties"]
        self.assertTrue(user_pool["AdminCreateUserConfig"]["AllowAdminCreateUserOnly"])
        self.assertEqual(user_pool["UsernameAttributes"], ["email"])
        self.assertIn("email", user_pool["AutoVerifiedAttributes"])

    def test_google_oauth_provider_and_client_are_configured_without_inline_secrets(self):
        provider = self.resources["GoogleIdentityProvider"]["Properties"]
        client = self.resources["TrnUserPoolClient"]["Properties"]
        self.assertEqual(provider["ProviderType"], "Google")
        self.assertEqual(provider["ProviderName"], "Google")
        self.assertEqual(provider["ProviderDetails"]["client_id"], {"Ref": "GoogleClientId"})
        self.assertEqual(provider["ProviderDetails"]["client_secret"], {"Ref": "GoogleClientSecret"})
        self.assertEqual(sorted(client["SupportedIdentityProviders"]), ["COGNITO", "Google"])
        self.assertEqual(client["AllowedOAuthFlows"], ["code"])
        self.assertTrue(client["AllowedOAuthFlowsUserPoolClient"])
        for scope in ["openid", "email", "profile"]:
            self.assertIn(scope, client["AllowedOAuthScopes"])

    def test_pre_signup_lambda_trigger_enforces_invited_cognito_users(self):
        user_pool = self.resources["TrnUserPool"]["Properties"]
        function = self.resources["InviteOnlyPreSignUpFunction"]["Properties"]
        self.assertEqual(user_pool["LambdaConfig"]["PreSignUp"], {"Fn::GetAtt": ["InviteOnlyPreSignUpFunction", "Arn"]})
        self.assertEqual(function["Runtime"], "python3.11")
        code = function["Code"]["ZipFile"]
        self.assertIn("list_users", code)
        self.assertIn("User is not invited", code)
        self.assertIn("event[\"userPoolId\"]", code)
        self.assertNotIn("jim@example.com", code)
        self.assertNotIn("stranger@example.com", code)

    def test_no_hardcoded_email_allowlist_in_template_or_docs(self):
        combined = TEMPLATE.read_text(encoding="utf-8") + "\n" + self.doc
        emails = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", combined)
        allowed_placeholders = {"user@example.com"}
        self.assertEqual(set(emails) - allowed_placeholders, set())
        self.assertNotIn("allowlist", combined.lower().replace("no hardcoded email allowlist", ""))

    def test_docs_explain_manual_invite_and_current_user_contract(self):
        self.assertIn("AdminCreateUser", self.doc)
        self.assertIn("Google", self.doc)
        self.assertIn("verified email", self.doc)
        self.assertIn("id token", self.doc)
        self.assertIn("No email addresses are committed", self.doc)


if __name__ == "__main__":
    unittest.main()
