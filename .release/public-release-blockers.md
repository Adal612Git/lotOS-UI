# Public Release Blockers

- Local secrets must be removed or rotated before public sharing.
- Premium source and private assets must move out of the public repo before public launch.
- Public clean-room gate must pass: `pnpm run verify:public-clean-room`.
- Public docs, public AI/MCP context, premium stubs, npm tarballs, package exports, packages, drift, and generated AI must all pass as one release gate.
- Public release remains separate from wide-sales readiness.
- Wide sales remain blocked until Supabase and Lemon staging validation evidence exists.

Public clean-room evidence: `.release/public-clean-room-report.json`
Public tree evidence: `.release/public-tree-report.json`
npm tarball evidence: `.release/npm-tarball-report.json`
AI context evidence: `.release/public-ai-context-report.json`
Lifecycle evidence: `.release/lifecycle-validation.json`
Staging runbook: `docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md`
