import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const outputRoot = join(packageRoot, ".private-dist");

const payloadPaths = [
  "LICENSE.proprietary.txt",
  "package.json",
  "README.md",
  "admin-starter",
  "layouts",
  "industry-kits",
  "launch-exclusive",
  "previews",
  "distribution/pro.manifest.json"
];

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

for (const relativePath of payloadPaths) {
  const source = join(packageRoot, relativePath);
  const target = join(outputRoot, relativePath);

  if (!existsSync(source)) {
    throw new Error(`Missing private payload source: ${relativePath}`);
  }

  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
}

const releaseManifest = JSON.parse(readFileSync(join(packageRoot, "distribution", "pro.manifest.json"), "utf8"));

writeFileSync(
  join(outputRoot, "release-manifest.json"),
  JSON.stringify(
    {
      package: "@lotosui/pro-private",
      exportedAt: new Date().toISOString(),
      releaseManifest,
      delivery: {
        intendedChannels: ["private-zip", "private-repository"],
        note: "Do not publish this payload to a public package registry."
      }
    },
    null,
    2
  )
);

console.log("Private pro bundle staged at packages/pro/.private-dist");
