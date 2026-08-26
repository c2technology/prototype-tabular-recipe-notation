import json
from pathlib import Path

from behave import given, when, then

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = ROOT / "infra" / "cognito-auth.template.json"
DOC = ROOT / "docs" / "auth.md"


@given("the Cognito auth infrastructure is configured")
def step_load_cognito_config(context):
    context.template = json.loads(TEMPLATE.read_text(encoding="utf-8"))
    context.resources = context.template["Resources"]
    context.doc = DOC.read_text(encoding="utf-8")


@when("the invite-only auth configuration is inspected")
def step_inspect_invite_config(context):
    context.user_pool = context.resources["TrnUserPool"]["Properties"]
    context.provider = context.resources["GoogleIdentityProvider"]["Properties"]
    context.client = context.resources["TrnUserPoolClient"]["Properties"]
    context.trigger = context.resources["InviteOnlyPreSignUpFunction"]["Properties"]


@then("Google OAuth is an enabled identity provider")
def step_google_enabled(context):
    assert context.provider["ProviderType"] == "Google"
    assert "Google" in context.client["SupportedIdentityProviders"]


@then("public self-signup is blocked")
def step_signup_blocked(context):
    assert context.user_pool["AdminCreateUserConfig"]["AllowAdminCreateUserOnly"] is True


@then("a pre-signup trigger enforces Cognito-backed invitations")
def step_invite_trigger(context):
    assert context.user_pool["LambdaConfig"]["PreSignUp"] == {"Fn::GetAtt": ["InviteOnlyPreSignUpFunction", "Arn"]}
    code = context.trigger["Code"]["ZipFile"]
    assert "list_users" in code
    assert "User is not invited" in code


@then("no tester email allowlist is hardcoded")
def step_no_hardcoded_allowlist(context):
    combined = json.dumps(context.template) + "\n" + context.doc
    assert "jim@example.com" not in combined
    assert "stranger@example.com" not in combined


@when("the client auth contract is inspected")
def step_inspect_client_contract(context):
    context.user_pool = context.resources["TrnUserPool"]["Properties"]
    context.client = context.resources["TrnUserPoolClient"]["Properties"]


@then("OAuth scopes include openid, email, and profile")
def step_oauth_scopes(context):
    scopes = context.client["AllowedOAuthScopes"]
    for scope in ["openid", "email", "profile"]:
        assert scope in scopes


@then("the user pool uses email as the user identity attribute")
def step_email_identity(context):
    assert context.user_pool["UsernameAttributes"] == ["email"]
    assert "email" in context.user_pool["AutoVerifiedAttributes"]
