import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const proPackage = JSON.parse(readFileSync(join(repoRoot, "packages", "pro", "package.json"), "utf8"));
const ciWorkflow = readFileSync(join(repoRoot, ".github", "workflows", "ci.yml"), "utf8");

const failures = [];

const requiredRootScripts = [
  "diagnose:local-env",
  "verify:runtimes",
  "verify:runtime-examples",
  "verify:runtime-contracts",
  "verify:desktop",
  "verify:sales",
  "verify:go-live",
  "verify:commercial",
  "verify:ops",
  "verify:release-readiness",
  "verify:100",
  "export:commercial"
];

for (const scriptName of requiredRootScripts) {
  if (!packageJson.scripts?.[scriptName]) {
    failures.push(`Missing root operational script: ${scriptName}`);
  }
}

if (!proPackage.private) {
  failures.push("The pro package must remain private for operational readiness.");
}

const requiredFiles = [
  "ONE/WINDOWS_LOCAL_RECOVERY.md",
  "ONE/diagnose-local-toolchain.mjs",
  "ONE/verify-runtime-surface.mjs",
  "ONE/verify-runtime-examples.mjs",
  "ONE/verify-runtime-contracts.mjs",
  "ONE/verify-desktop-pipelines.mjs",
  "ONE/verify-sales-surface.mjs",
  "ONE/verify-go-live-checkout.mjs",
  "ONE/verify-commercial-readiness.mjs",
  "ONE/verify-ops-readiness.mjs",
  "ONE/verify-release-readiness.mjs",
  "packages/claude-arm/.storybook/main.ts",
  "packages/claude-arm/.storybook/preview.ts",
  "packages/claude-arm/scripts/verify-storybook-surface.mjs",
  "packages/claude-arm/scripts/component-test-coverage.mjs",
  "packages/claude-arm/scripts/visual-regression.mjs",
  "packages/claude-arm/visual-baselines/signals.html",
  "packages/pro/.private-dist/release-manifest.json",
  "packages/pro/scripts/verify-private-surface.mjs",
  "packages/pro/scripts/prepare-private-release.mjs",
  "packages/pro/scripts/verify-private-bundle.mjs",
  "apps/desktop-python-demo/build.ps1",
  "apps/desktop-dotnet-demo/build.ps1",
  "apps/desktop-java-demo/build.ps1",
  "apps/desktop-rust-demo/build.ps1"
];

for (const relativePath of requiredFiles) {
  if (!existsSync(join(repoRoot, relativePath))) {
    failures.push(`Missing operational file: ${relativePath}`);
  }
}

const requiredCiMarkers = [
  "Build Storybook",
  "Enforce execution coverage",
  "Verify sales surface",
  "Export commercial bundles",
  "Verify commercial readiness",
  "Verify desktop delivery pipelines",
  "Build private pro bundle",
  "Verify private pro bundle",
  "Verify release readiness"
];

for (const marker of requiredCiMarkers) {
  if (!ciWorkflow.includes(marker)) {
    failures.push(`Missing CI operational marker: ${marker}`);
  }
}

if (failures.length > 0) {
  console.error("Operational readiness verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log("Operational readiness verification passed.");
