import { existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const previewRoot = join(repoRoot, ".commercial-dist", "pro-preview");
const failures = [];

const requiredPaths = [
  ".commercial-dist/pro-preview/README.preview.txt",
  ".commercial-dist/pro-preview/preview-manifest.json",
  ".commercial-dist/pro-preview/previews/sales-preview.html",
  ".commercial-dist/pro-preview/previews/license-matrix.html",
  ".commercial-dist/pro-preview/previews/excel-lotus-grid-preview.html",
  ".commercial-dist/pro-preview/previews/openoffice-calc-command-preview.html",
  ".commercial-dist/pro-preview/admin-starter/manifest.json",
  ".commercial-dist/pro-preview/layouts/manifest.json",
  ".commercial-dist/pro-preview/industry-kits/manifest.json",
  ".commercial-dist/pro-preview/industry-kits/excel-lotus-grid-kit.json",
  ".commercial-dist/pro-preview/industry-kits/openoffice-calc-command-kit.json"
];

for (const relativePath of requiredPaths) {
  if (!existsSync(join(repoRoot, relativePath))) {
    failures.push(`Missing premium preview path: ${relativePath}`);
  }
}

if (existsSync(join(previewRoot, "preview-manifest.json"))) {
  const manifest = JSON.parse(readFileSync(join(previewRoot, "preview-manifest.json"), "utf8"));
  if (manifest.tier !== "premium-preview") {
    failures.push("Premium preview tier mismatch.");
  }
  if (manifest.evaluationOnly !== true) {
    failures.push("Premium preview must remain evaluationOnly=true.");
  }
}

if (failures.length > 0) {
  console.error("Premium preview verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log("Premium preview verification passed.");
