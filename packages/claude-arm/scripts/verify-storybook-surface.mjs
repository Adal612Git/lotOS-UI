import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const packageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

const requiredDeps = [
  "storybook",
  "@storybook/react-vite",
  "@storybook/addon-essentials",
  "@storybook/addon-a11y",
  "@storybook/addon-interactions"
];

const requiredFiles = [
  ".storybook/main.ts",
  ".storybook/preview.ts",
  "stories/button.stories.tsx",
  "stories/surface.stories.tsx",
  "stories/data.stories.tsx"
];

const failures = [];

for (const dep of requiredDeps) {
  if (!packageJson.devDependencies?.[dep]) {
    failures.push(`Missing Storybook dependency: ${dep}`);
  }
}

if (!packageJson.scripts?.storybook) {
  failures.push("Missing script: storybook");
}

if (!packageJson.scripts?.["build-storybook"]) {
  failures.push("Missing script: build-storybook");
}

for (const relativePath of requiredFiles) {
  if (!existsSync(join(packageRoot, relativePath))) {
    failures.push(`Missing Storybook file: ${relativePath}`);
  }
}

if (failures.length > 0) {
  console.error("Storybook surface verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log("Storybook surface verification passed.");
