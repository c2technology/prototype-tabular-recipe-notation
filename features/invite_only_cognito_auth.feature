Feature: Invite-only Google authentication

  Scenario: Invited user can authenticate through Cognito Google OAuth
    Given the Cognito auth infrastructure is configured
    When the invite-only auth configuration is inspected
    Then Google OAuth is an enabled identity provider
    And public self-signup is blocked
    And a pre-signup trigger enforces Cognito-backed invitations
    And no tester email allowlist is hardcoded

  Scenario: Signed-in user identity can be read by clients
    Given the Cognito auth infrastructure is configured
    When the client auth contract is inspected
    Then OAuth scopes include openid, email, and profile
    And the user pool uses email as the user identity attribute
