import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const packageRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const componentsDir = join(packageRoot, "src", "components");
const testsDir = join(packageRoot, "tests");
const threshold = 0.85;

const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const testNames = new Set(
  readdirSync(testsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".test.tsx"))
    .map((entry) => entry.name.replace(/\.test\.tsx$/, ""))
);

const covered = components.filter((name) => testNames.has(name));
const missing = components.filter((name) => !testNames.has(name));
const ratio = components.length === 0 ? 1 : covered.length / components.length;

console.log(`Component test coverage surface: ${covered.length}/${components.length} (${(ratio * 100).toFixed(1)}%)`);

if (missing.length > 0) {
  console.log(`Missing component tests: ${missing.join(", ")}`);
}

if (ratio < threshold) {
  console.error(`Component coverage gate failed. Required ${(threshold * 100).toFixed(0)}% or greater.`);
  process.exit(1);
}

console.log("Component coverage gate passed.");
