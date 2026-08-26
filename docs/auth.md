# Invite-only Cognito Google OAuth

Issue #19 defines the prototype auth boundary for the future AWS-hosted TRN app.

The repository now owns a CloudFormation starting point at:

```text
infra/cognito-auth.template.json
```

This is infrastructure configuration only. It does not deploy AWS resources by itself.

## Auth model

- Cognito User Pool is the invitation source.
- Users are created manually with Cognito `AdminCreateUser` before they can sign in.
- Google OAuth is configured as a Cognito identity provider.
- Public self-signup is blocked with `AdminCreateUserConfig.AllowAdminCreateUserOnly`.
- A Cognito pre-signup Lambda trigger checks the signing-in Google email against existing Cognito users in the same user pool.
- If no existing non-federated Cognito user has that email, the trigger rejects the sign-in.
- No email addresses are committed to the repository.
- No application-code email list controls access.

## Expected user flow

1. Admin creates the tester in Cognito with `AdminCreateUser`.
2. Tester opens the future hosted app.
3. Tester chooses Google sign-in through Cognito Hosted UI.
4. Cognito receives the Google profile with a verified email.
5. The pre-signup trigger queries Cognito for an existing manually created user with that email.
6. Cognito completes authentication only when that Cognito user exists.
7. The frontend receives Cognito tokens and can read the signed-in user's verified email from the id token claims.

## Current user identity contract

Future frontend/client code should treat the Cognito session as the source of signed-in identity. The expected claims are available from the Cognito id token:

```text
sub
email
email_verified
name / given_name / family_name when Google supplies them
```

For app display and audit trails, use the verified email claim only after `email_verified` is true.

## Deploy-time values

The template expects these values at deployment time:

```text
GoogleClientId
GoogleClientSecret
CallbackUrls
LogoutUrls
HostedUiDomainPrefix
```

Do not commit real Google OAuth client IDs, client secrets, callback domains containing private tenant details, or tester addresses. Use deploy-time parameters or a secrets manager path.

## Manual invite example

Use Cognito admin tooling to invite a tester. Replace the placeholder address before running the command:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <user-pool-id> \
  --username user@example.com \
  --user-attributes Name=email,Value=user@example.com Name=email_verified,Value=true
```

`user@example.com` is a documentation placeholder, not a committed tester address.

## Limitations

- This is not deployed yet.
- The IAM policy for the pre-signup trigger allows `cognito-idp:ListUsers` against `*` to avoid a CloudFormation dependency cycle in this prototype template.
- The next deployment story should tighten IAM if practical after the final stack shape is known.
- API Gateway JWT authorizer wiring belongs to the authenticated endpoint story.
