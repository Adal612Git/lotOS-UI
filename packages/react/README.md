# @lotosui/react

Prepared React entrypoint for LotOS UI product surfaces.

Status: staged only. This package is intentionally `private: true` and has a blocking `prepublishOnly` script until the release owner approves npm publication.

## Exports

- `LotOSSelect`
- `DataGridPro`
- `CommandShell`
- `ReportSurface`
- `lotosSignatureTokens`
- `./styles.css`

## Publish readiness

Before publishing:

1. Remove the `private` gate only after release approval.
2. Replace staged package components with the audited production implementations or promote the web implementations into a shared source package.
3. Run package build, typecheck, unit tests, and public clean-room verification.
4. Confirm no private vault payload, secrets, or internal-only copy is included in the tarball.
