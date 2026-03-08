import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));

if (!packageJson.scripts?.["prep:first-sale"]) {
  failures.push("Missing root script: prep:first-sale");
}

if (!packageJson.scripts?.["prep:paid-preview"]) {
  failures.push("Missing root script: prep:paid-preview");
}

if (!packageJson.scripts?.["verify:commercial"]) {
  failures.push("Missing root script: verify:commercial");
}

if (!packageJson.scripts?.["verify:paid-preview"]) {
  failures.push("Missing root script: verify:paid-preview");
}

const requiredFiles = [
  "apps/web/app/sales-config.ts",
  "apps/web/app/pricing/page.tsx",
  "ONE/FIRST_REVENUE_RUNBOOK.md",
  "ONE/PREMIUM_PREVIEW_RUNBOOK.md",
  "ONE/prepare-paid-preview.mjs",
  "ONE/verify-paid-preview.mjs",
  "ONE/prepare-first-sale.mjs",
  "ONE/verify-commercial-readiness.mjs",
  "packages/pro/scripts/prepare-private-release.mjs",
  "packages/pro/scripts/verify-private-bundle.mjs",
  "packages/pro/distribution/pro.manifest.json",
];

for (const relativePath of requiredFiles) {
  if (!existsSync(join(repoRoot, relativePath))) {
    failures.push(`Missing sales surface file: ${relativePath}`);
  }
}

const webHome = readFileSync(join(repoRoot, "apps", "web", "app", "page.tsx"), "utf8");
if (!webHome.includes('href="/pricing"')) {
  failures.push("Web home must link to /pricing.");
}

const pricingPage = readFileSync(join(repoRoot, "apps", "web", "app", "pricing", "page.tsx"), "utf8");
const salesConfig = readFileSync(join(repoRoot, "apps", "web", "app", "sales-config.ts"), "utf8");
const privateReleaseScript = readFileSync(join(repoRoot, "packages", "pro", "scripts", "prepare-private-release.mjs"), "utf8");
const proManifest = readFileSync(join(repoRoot, "packages", "pro", "distribution", "pro.manifest.json"), "utf8");

for (const marker of ["salesPlans", "checkoutEnvKeys", "prep:first-sale", "prep:paid-preview", "Premium Preview"]) {
  if (!pricingPage.includes(marker)) {
    failures.push(`Pricing page missing marker: ${marker}`);
  }
}

for (const marker of ["Buy Solo", "Buy Pro", "Book Launch Pack", "LOTOS_SOLO_CHECKOUT_URL", "LOTOS_PREMIUM_PREVIEW_URL"]) {
  if (!salesConfig.includes(marker)) {
    failures.push(`Sales config missing marker: ${marker}`);
  }
}

if (!privateReleaseScript.includes('"launch-exclusive"')) {
  failures.push("Private release script must include launch-exclusive payload for Full Signature delivery.");
}

if (!proManifest.includes('"packages/pro/launch-exclusive"')) {
  failures.push("Pro distribution manifest must declare packages/pro/launch-exclusive.");
}

if (failures.length > 0) {
  console.error("Sales surface verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log("Sales surface verification passed.");
