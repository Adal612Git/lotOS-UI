# Security Policy

## Supported Scope

This policy covers the public LotOS UI packages and public docs. Premium/private source, private bundles, and entitlement-gated assets are handled through private channels.

## Reporting A Vulnerability

Do not open a public GitHub issue for a security vulnerability.

Use the private security contact configured by the project owner before public launch. Until the contact is finalized, treat `<security contact>` as a placeholder and do not publish the repository as security-ready.

Include:

- Affected package or route.
- Reproduction steps without secrets.
- Impact.
- Suggested mitigation if known.

Do not include real credentials, private tokens, buyer personal data, or private asset URLs.

## Secret Handling

Any exposed credential must be rotated in the provider dashboard. Removing a file from the repo is not enough.

## Premium Boundary

Security fixes must not move premium source into public packages or relax entitlement checks.
