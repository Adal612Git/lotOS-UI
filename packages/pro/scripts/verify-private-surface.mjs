import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));

const requiredPaths = [
  "LICENSE.proprietary.txt",
  "admin-starter/manifest.json",
  "admin-starter/dashboard-shell.html",
  "layouts/manifest.json",
  "layouts/executive-briefing-layout.html",
  "layouts/operator-triad-layout.html",
  "industry-kits/manifest.json",
  "industry-kits/finance-ops-kit.json",
  "industry-kits/health-ops-kit.json",
  "launch-exclusive/manifest.json",
  "launch-exclusive/google-sheets-command-kit.json",
  "launch-exclusive/microsoft-365-excel-web-kit.json",
  "launch-exclusive/outlook-approval-console.json",
  "launch-exclusive/executive-boardroom-surface.json",
  "launch-exclusive/power-bi-executive-visual-pack.json",
  "launch-exclusive/figma-token-sync-plugin.json",
  "previews/sales-preview.html",
  "previews/license-matrix.html",
  "distribution/pro.manifest.json"
];

const missing = requiredPaths.filter((relativePath) => !existsSync(join(packageRoot, relativePath)));

if (missing.length > 0) {
  console.error(`Missing private surface files: ${missing.join(", ")}`);
  process.exit(1);
}

const proManifest = JSON.parse(readFileSync(join(packageRoot, "distribution", "pro.manifest.json"), "utf8"));

if (proManifest.tier !== "pro") {
  console.error("Invalid pro manifest tier.");
  process.exit(1);
}

if (!Array.isArray(proManifest.distribution) || !proManifest.distribution.includes("private-zip")) {
  console.error("Pro manifest must declare private-zip distribution.");
  process.exit(1);
}

console.log("Private pro surface verified.");
