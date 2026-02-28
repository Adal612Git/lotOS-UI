import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(repoRoot, ".commercial-dist");

const tiers = [
  {
    id: "free",
    manifestPath: "packages/pro/distribution/free.manifest.json",
    paths: [
      "packages/core/package.json",
      "packages/core/examples/mcp-render-demo.mjs",
      "packages/claude-arm/README.md",
      "packages/cli/package.json",
      "packages/web-components/README.md",
      "packages/sentinel/package.json",
      "apps/desktop-python-demo/README.md",
      "apps/desktop-dotnet-demo/README.md",
      "apps/desktop-java-demo/README.md",
      "apps/desktop-rust-demo/README.md"
    ]
  },
  {
    id: "pro",
    manifestPath: "packages/pro/distribution/pro.manifest.json",
    paths: [
      "packages/pro/LICENSE.proprietary.txt",
      "packages/pro/README.md",
      "packages/pro/admin-starter",
      "packages/pro/layouts",
      "packages/pro/industry-kits",
      "packages/pro/previews"
    ]
  }
];

const normalizeRepoPath = (path) => path.split("/").join("\\");

const toAbsolute = (repoPath) => join(repoRoot, normalizeRepoPath(repoPath));

const ensureDirectory = (path) => mkdirSync(path, { recursive: true });

const copyPath = (repoPath, bundleRoot, inventory) => {
  const source = toAbsolute(repoPath);
  if (!existsSync(source)) {
    throw new Error(`Missing source path: ${repoPath}`);
  }

  const target = join(bundleRoot, normalizeRepoPath(repoPath));
  ensureDirectory(dirname(target));
  cpSync(source, target, { recursive: true });

  inventory.push({
    source: repoPath,
    target: relative(bundleRoot, target).split("\\").join("/"),
    type: statSync(source).isDirectory() ? "directory" : "file"
  });
};

rmSync(outputRoot, { recursive: true, force: true });
ensureDirectory(outputRoot);

for (const tier of tiers) {
  const bundleRoot = join(outputRoot, tier.id);
  ensureDirectory(bundleRoot);

  const inventory = [];
  for (const repoPath of tier.paths) {
    copyPath(repoPath, bundleRoot, inventory);
  }

  const manifestSource = toAbsolute(tier.manifestPath);
  const manifestTarget = join(bundleRoot, "bundle-manifest.json");
  const manifest = JSON.parse(readFileSync(manifestSource, "utf8"));

  writeFileSync(
    manifestTarget,
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        tier: tier.id,
        manifest,
        inventory
      },
      null,
      2
    )
  );
}

const summarizeTree = (path, depth = 0) => {
  const entries = readdirSync(path, { withFileTypes: true });
  const lines = [];

  for (const entry of entries) {
    const prefix = "  ".repeat(depth);
    lines.push(`${prefix}${entry.isDirectory() ? "[D]" : "[F]"} ${entry.name}`);

    if (entry.isDirectory()) {
      lines.push(...summarizeTree(join(path, entry.name), depth + 1));
    }
  }

  return lines;
};

const summary = {
  outputRoot: relative(repoRoot, outputRoot).split("\\").join("/"),
  bundles: tiers.map((tier) => ({
    tier: tier.id,
    path: relative(repoRoot, join(outputRoot, tier.id)).split("\\").join("/")
  }))
};

writeFileSync(join(outputRoot, "export-summary.json"), JSON.stringify(summary, null, 2));

console.log("LotOS UI commercial bundles exported.");
for (const line of summarizeTree(outputRoot)) {
  console.log(line);
}
