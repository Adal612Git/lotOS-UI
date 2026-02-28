import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(repoRoot, ".commercial-dist");
const failures = [];

const rootPackage = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));

if (!rootPackage.scripts?.["export:commercial"]) {
  failures.push("Missing root script: export:commercial");
}

const requiredPaths = [
  ".commercial-dist/export-summary.json",
  ".commercial-dist/free/bundle-manifest.json",
  ".commercial-dist/pro/bundle-manifest.json",
  ".commercial-dist/free/packages/core/package.json",
  ".commercial-dist/free/packages/cli/package.json",
  ".commercial-dist/free/packages/claude-arm/README.md",
  ".commercial-dist/free/apps/desktop-python-demo/README.md",
  ".commercial-dist/free/apps/desktop-java-demo/README.md",
  ".commercial-dist/pro/packages/pro/LICENSE.proprietary.txt",
  ".commercial-dist/pro/packages/pro/admin-starter/manifest.json",
  ".commercial-dist/pro/packages/pro/layouts/manifest.json",
  ".commercial-dist/pro/packages/pro/industry-kits/manifest.json",
  ".commercial-dist/pro/packages/pro/industry-kits/excel-lotus-grid-kit.json",
  ".commercial-dist/pro/packages/pro/industry-kits/openoffice-calc-command-kit.json",
  ".commercial-dist/pro/packages/pro/previews/sales-preview.html",
  ".commercial-dist/pro/packages/pro/previews/license-matrix.html",
  ".commercial-dist/pro/packages/pro/previews/excel-lotus-grid-preview.html",
  ".commercial-dist/pro/packages/pro/previews/openoffice-calc-command-preview.html",
  "ONE/COMMERCIAL_DELIVERY_MODEL.md",
  "packages/pro/previews/sales-preview.html",
  "packages/pro/previews/license-matrix.html",
  "packages/pro/previews/excel-lotus-grid-preview.html",
  "packages/pro/previews/openoffice-calc-command-preview.html"
];

for (const relativePath of requiredPaths) {
  if (!existsSync(join(repoRoot, relativePath))) {
    failures.push(`Missing commercial readiness path: ${relativePath}`);
  }
}

if (existsSync(join(outputRoot, "export-summary.json"))) {
  const exportSummary = JSON.parse(readFileSync(join(outputRoot, "export-summary.json"), "utf8"));
  const bundleIds = new Set((exportSummary.bundles ?? []).map((bundle) => bundle.tier));
  if (!bundleIds.has("free") || !bundleIds.has("pro")) {
    failures.push("Commercial export summary must include free and pro bundles.");
  }
}

if (existsSync(join(outputRoot, "free", "bundle-manifest.json"))) {
  const freeBundle = JSON.parse(readFileSync(join(outputRoot, "free", "bundle-manifest.json"), "utf8"));
  if (freeBundle.tier !== "free") {
    failures.push("Free commercial bundle manifest tier mismatch.");
  }
  if (freeBundle.manifest?.notForSaleAsExclusive !== true) {
    failures.push("Free commercial bundle must mark notForSaleAsExclusive=true.");
  }
}

if (existsSync(join(outputRoot, "pro", "bundle-manifest.json"))) {
  const proBundle = JSON.parse(readFileSync(join(outputRoot, "pro", "bundle-manifest.json"), "utf8"));
  if (proBundle.tier !== "pro") {
    failures.push("Pro commercial bundle manifest tier mismatch.");
  }
  const distribution = proBundle.manifest?.distribution ?? [];
  if (!Array.isArray(distribution) || !distribution.includes("private-zip")) {
    failures.push("Pro commercial bundle must preserve private-zip distribution.");
  }
}

if (failures.length > 0) {
  console.error("Commercial readiness verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  if (failures.some((failure) => failure.includes(".commercial-dist/"))) {
    console.error("Run `pnpm export:commercial` before `pnpm verify:commercial` when local bundles are missing.");
  }
  process.exit(1);
}

console.log("Commercial readiness verification passed.");
