import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

runNodeScript("ONE/export-commercial-bundles.mjs");

const outputRoot = join(repoRoot, ".commercial-dist", "pro-preview");
const sourceRoot = join(repoRoot, "packages", "pro");

const previewPaths = [
  "README.md",
  "LICENSE.proprietary.txt",
  "previews",
  "distribution/pro.manifest.json",
  "admin-starter/manifest.json",
  "layouts/manifest.json",
  "industry-kits/manifest.json"
];

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

for (const relativePath of previewPaths) {
  const source = join(sourceRoot, relativePath);
  const target = join(outputRoot, relativePath);

  if (!existsSync(source)) {
    throw new Error(`Missing premium preview source: ${relativePath}`);
  }

  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
}

const proManifest = JSON.parse(readFileSync(join(sourceRoot, "distribution", "pro.manifest.json"), "utf8"));

writeFileSync(
  join(outputRoot, "preview-manifest.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      tier: "premium-preview",
      evaluationOnly: true,
      purpose: [
        "pre-sale proof",
        "internal QA before delivery",
        "buyer confidence artifact"
      ],
      included: previewPaths,
      excluded: [
        "full private release payload",
        "customer-specific starter output",
        "final .private-dist delivery bundle"
      ],
      derivedFrom: proManifest,
      delivery: {
        allowedChannels: ["private-link", "demo call", "screen-share", "controlled zip"],
        note: "This preview is for evaluation only and is not the final paid payload."
      }
    },
    null,
    2
  )
);

writeFileSync(
  join(outputRoot, "README.preview.txt"),
  [
    "LotOS UI Premium Preview",
    "",
    "This package is the evaluation-only proof bundle.",
    "Use it before payment to demonstrate premium value without shipping the full private payload.",
    "",
    "Suggested flow:",
    "1. Generate this preview bundle.",
    "2. Show the buyer the previews and manifests.",
    "3. After payment, run `pnpm prep:first-sale` for the final private delivery."
  ].join("\n")
);

console.log("Premium preview bundle staged at .commercial-dist/pro-preview");
