import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const claudeArmPackage = JSON.parse(readFileSync(join(repoRoot, "packages", "claude-arm", "package.json"), "utf8"));
const proPackage = JSON.parse(readFileSync(join(repoRoot, "packages", "pro", "package.json"), "utf8"));
const ciWorkflow = readFileSync(join(repoRoot, ".github", "workflows", "ci.yml"), "utf8");
const lockfile = readFileSync(join(repoRoot, "pnpm-lock.yaml"), "utf8");

const failures = [];

const rootScripts = [
  "verify:runtimes",
  "verify:runtime-examples",
  "verify:runtime-contracts",
  "verify:desktop",
  "verify:sales",
  "verify:go-live",
  "verify:commercial",
  "verify:ops",
  "verify:release-readiness",
  "verify:release-candidate",
  "verify:public-release",
  "verify:private-workspace",
  "verify:drift",
  "verify:packages",
  "verify:routes",
  "verify:entitlement-boundary",
  "verify:webhook-lifecycle",
  "verify:webhook-contracts",
  "verify:entitlement-state-machine",
  "verify:supabase-migrations",
  "verify:entitlement-audit",
  "verify:admin-lifecycle",
  "verify:vault-lifecycle",
  "verify:rls-policy-plan",
  "verify:commercial-lifecycle",
  "verify:public-clean-room",
  "verify:public-docs",
  "verify:public-ai-context",
  "verify:npm-tarballs",
  "verify:premium-stubs",
  "release:public-tree:check",
  "release:notes",
  "export:commercial",
  "prep:first-sale"
];

for (const scriptName of rootScripts) {
  if (!packageJson.scripts?.[scriptName]) {
    failures.push(`Missing root script: ${scriptName}`);
  }
}

const claudeScripts = [
  "storybook",
  "build-storybook",
  "verify:storybook",
  "test:coverage",
  "coverage:components",
  "visual:check"
];

for (const scriptName of claudeScripts) {
  if (!claudeArmPackage.scripts?.[scriptName]) {
    failures.push(`Missing claude-arm script: ${scriptName}`);
  }
}

const storybookDeps = [
  "storybook",
  "@storybook/react-vite",
  "@storybook/addon-essentials",
  "@storybook/addon-a11y",
  "@storybook/addon-interactions"
];

for (const dep of storybookDeps) {
  if (!claudeArmPackage.devDependencies?.[dep]) {
    failures.push(`Missing claude-arm Storybook dependency: ${dep}`);
  }
}

if (!proPackage.private) {
  failures.push("The pro package must remain private.");
}

const requiredFiles = [
  "packages/claude-arm/scripts/verify-storybook-surface.mjs",
  "packages/claude-arm/scripts/component-test-coverage.mjs",
  "packages/claude-arm/scripts/visual-regression.mjs",
  "ONE/verify-runtime-surface.mjs",
  "ONE/verify-runtime-examples.mjs",
  "ONE/verify-runtime-contracts.mjs",
  "ONE/verify-desktop-pipelines.mjs",
  "ONE/verify-sales-surface.mjs",
  "ONE/verify-go-live-checkout.mjs",
  "ONE/verify-commercial-readiness.mjs",
  "ONE/verify-ops-readiness.mjs",
  "ONE/verify-release-candidate.mjs",
  "ONE/verify-release-gate.mjs",
  "ONE/verify-generated-ai.mjs",
  "ONE/verify-registry-consumers.mjs",
  "ONE/verify-routes.mjs",
  "ONE/verify-entitlement-boundary.mjs",
  "ONE/verify-webhook-lifecycle.mjs",
  "ONE/verify-webhook-contracts.mjs",
  "ONE/verify-entitlement-state-machine.mjs",
  "ONE/verify-supabase-migrations.mjs",
  "ONE/verify-entitlement-audit.mjs",
  "ONE/verify-admin-lifecycle.mjs",
  "ONE/verify-vault-lifecycle.mjs",
  "ONE/verify-rls-policy-plan.mjs",
  "ONE/verify-commercial-lifecycle.mjs",
  "ONE/check-public-tree.mjs",
  "ONE/verify-public-clean-room.mjs",
  "ONE/verify-public-docs.mjs",
  "ONE/verify-public-ai-context.mjs",
  "ONE/verify-npm-tarballs.mjs",
  "ONE/verify-premium-stubs.mjs",
  "ONE/verify-web-smoke.mjs",
  "ONE/verify-mcp-smoke.mjs",
  "ONE/verify-cli-smoke.mjs",
  "ONE/verify-package-exports.mjs",
  "ONE/verify-packages.mjs",
  "ONE/verify-ci.mjs",
  "ONE/generate-release-notes.mjs",
  "docs/PREMIUM_SPLIT_PLAN.md",
  "docs/SECRET_ROTATION.md",
  "docs/SECURITY_RELEASE_CHECKLIST.md",
  "docs/RELEASE_PROCESS.md",
  "docs/AI_ONBOARDING.md",
  "docs/MCP_REFERENCE.md",
  "docs/ENTITLEMENT_AUDIT.md",
  "docs/SUPABASE_ENTITLEMENT_SCHEMA.md",
  "docs/SUPABASE_LOCAL_DRY_RUN.md",
  "docs/SUPABASE_RLS_POLICY_PLAN.md",
  "docs/WEBHOOK_LIFECYCLE.md",
  "docs/LEMON_FIXTURES.md",
  "docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md",
  "docs/PUBLIC_REPO_STRUCTURE.md",
  "docs/SECRET_EVACUATION_RUNBOOK.md",
  "docs/PUBLIC_DOCS_SANITIZATION.md",
  "docs/NPM_TARBALL_AUDIT.md",
  "docs/GITHUB_PUBLIC_LAUNCH.md",
  "docs/RELEASE_DECISION_MATRIX.md",
  ".release/lifecycle-validation.json",
  ".release/public-tree-plan.json",
  ".release/secret-evacuation-plan.json",
  ".release/release-decision-matrix.json",
  ".release/public-clean-room-report.json",
  ".release/public-tree-report.json",
  ".release/npm-tarball-report.json",
  ".release/public-ai-context-report.json",
  ".release/public-docs-report.json",
  ".release/premium-stubs-report.json",
  ".release/human-actions.json",
  ".release/public-release-blockers.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  ".github/pull_request_template.md",
  ".github/ISSUE_TEMPLATE/01-bug.yml",
  ".github/ISSUE_TEMPLATE/02-feature.yml",
  "ONE/prepare-first-sale.mjs",
  "ONE/FIRST_REVENUE_RUNBOOK.md",
  "packages/pro/scripts/verify-private-surface.mjs",
  "packages/pro/scripts/prepare-private-release.mjs",
  "packages/pro/scripts/verify-private-bundle.mjs",
  "apps/desktop-python-demo/build.ps1",
  "apps/desktop-dotnet-demo/build.ps1",
  "apps/desktop-java-demo/App.java",
  "apps/desktop-java-demo/build.ps1",
  "apps/desktop-rust-demo/src/main.rs"
,
  "apps/desktop-rust-demo/build.ps1"
];

for (const relativePath of requiredFiles) {
  if (!existsSync(join(repoRoot, relativePath))) {
    failures.push(`Missing required file: ${relativePath}`);
  }
}

const requiredCiMarkers = [
  "Build Storybook",
  "Enforce execution coverage",
  "Build desktop Java demo",
  "Build desktop Rust demo",
  "Verify runtime adapter surface",
  "Verify runtime example coverage",
  "Verify runtime contract guards",
  "Verify sales surface",
  "Verify desktop delivery pipelines",
  "Verify release readiness",
  "Verify release candidate",
  "Verify package exports",
  "Verify private pro surface",
  "Verify private pro bundle"
];

for (const marker of requiredCiMarkers) {
  if (!ciWorkflow.includes(marker)) {
    failures.push(`Missing CI step: ${marker}`);
  }
}

const requiredLockMarkers = [
  "@storybook/react-vite@8.6.14",
  "@storybook/addon-essentials@8.6.14",
  "@storybook/addon-a11y@8.6.14",
  "@storybook/addon-interactions@8.6.14",
  "@vitest/coverage-v8@2.1.9"
];

for (const marker of requiredLockMarkers) {
  if (!lockfile.includes(marker)) {
    failures.push(`Missing lockfile marker: ${marker}`);
  }
}

if (failures.length > 0) {
  console.error("Release readiness verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log("Release readiness verification passed.");
