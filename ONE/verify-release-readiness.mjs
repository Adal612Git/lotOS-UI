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
  "verify:ops",
  "verify:release-readiness",
  "export:commercial"
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
  "ONE/verify-ops-readiness.mjs",
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
  "Verify desktop delivery pipelines",
  "Verify release readiness",
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
