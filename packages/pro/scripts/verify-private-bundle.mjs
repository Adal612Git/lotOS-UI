import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const bundleRoot = join(packageRoot, ".private-dist");

const requiredBundlePaths = [
  "LICENSE.proprietary.txt",
  "package.json",
  "README.md",
  "admin-starter/manifest.json",
  "layouts/manifest.json",
  "industry-kits/manifest.json",
  "launch-exclusive/manifest.json",
  "launch-exclusive/google-sheets-command-kit.json",
  "launch-exclusive/microsoft-365-excel-web-kit.json",
  "launch-exclusive/outlook-approval-console.json",
  "launch-exclusive/executive-boardroom-surface.json",
  "launch-exclusive/power-bi-executive-visual-pack.json",
  "launch-exclusive/figma-token-sync-plugin.json",
  "previews/sales-preview.html",
  "distribution/pro.manifest.json",
  "release-manifest.json"
];

const missing = requiredBundlePaths.filter((relativePath) => !existsSync(join(bundleRoot, relativePath)));

if (missing.length > 0) {
  console.error(`Missing private bundle files: ${missing.join(", ")}`);
  process.exit(1);
}

const releaseManifest = JSON.parse(readFileSync(join(bundleRoot, "release-manifest.json"), "utf8"));

if (releaseManifest.package !== "@lotosui/pro-private") {
  console.error("Invalid package name in private bundle release manifest.");
  process.exit(1);
}

if (!Array.isArray(releaseManifest.delivery?.intendedChannels)) {
  console.error("Private bundle must declare delivery channels.");
  process.exit(1);
}

if (!releaseManifest.delivery.intendedChannels.includes("private-zip")) {
  console.error("Private bundle must support private-zip delivery.");
  process.exit(1);
}

console.log("Private pro bundle verified.");
