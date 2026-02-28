import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const runNodeScript = (relativePath) => {
  execFileSync(process.execPath, [join(repoRoot, relativePath)], {
    cwd: repoRoot,
    stdio: "inherit"
  });
};

runNodeScript("ONE/verify-ops-readiness.mjs");
runNodeScript("ONE/export-commercial-bundles.mjs");
runNodeScript("packages/pro/scripts/prepare-private-release.mjs");
runNodeScript("ONE/verify-commercial-readiness.mjs");
runNodeScript("packages/pro/scripts/verify-private-bundle.mjs");

const commercialDist = join(repoRoot, ".commercial-dist");
mkdirSync(commercialDist, { recursive: true });

const freeBundle = join(commercialDist, "free");
const proBundle = join(commercialDist, "pro");
const privateBundle = join(repoRoot, "packages", "pro", ".private-dist");

const summary = {
  generatedAt: new Date().toISOString(),
  status: "ready-for-private-delivery",
  deliverables: {
    freeBundle: existsSync(freeBundle) ? ".commercial-dist/free" : null,
    proBundle: existsSync(proBundle) ? ".commercial-dist/pro" : null,
    privateBundle: existsSync(privateBundle) ? "packages/pro/.private-dist" : null
  },
  nextSteps: [
    "Take payment outside the repository using your chosen checkout flow.",
    "Zip packages/pro/.private-dist for the proprietary payload.",
    "Optionally attach a customer-specific starter generated with the CLI.",
    "Deliver through a private link or private repository.",
    "Do not publish the proprietary payload to a public package registry."
  ]
};

const commercialModelPath = join(repoRoot, "ONE", "COMMERCIAL_DELIVERY_MODEL.md");
if (existsSync(commercialModelPath)) {
  summary.reference = "ONE/COMMERCIAL_DELIVERY_MODEL.md";
  summary.deliveryModelExcerpt = readFileSync(commercialModelPath, "utf8")
    .split("\n")
    .slice(0, 18)
    .join("\n");
}

writeFileSync(join(commercialDist, "first-sale-summary.json"), JSON.stringify(summary, null, 2));

console.log("First sale package prepared.");
console.log("Deliverables:");
console.log(`- ${summary.deliverables.freeBundle}`);
console.log(`- ${summary.deliverables.proBundle}`);
console.log(`- ${summary.deliverables.privateBundle}`);
