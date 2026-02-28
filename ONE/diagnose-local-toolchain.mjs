import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));

const checks = [];

function addCheck(name, status, detail) {
  checks.push({ name, status, detail });
}

function commandAvailableViaCmd(command) {
  const result = spawnSync("cmd.exe", ["/c", "where", command], { encoding: "utf8", shell: false });
  return result.status === 0;
}

const loopbackProxyValues = new Set(["127.0.0.1", "localhost"]);
const proxyVars = ["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"];

for (const envVar of proxyVars) {
  const value = process.env[envVar];
  if (!value) {
    addCheck(`env:${envVar}`, "ok", "not set");
    continue;
  }

  const lowered = value.toLowerCase();
  const isLoopback = [...loopbackProxyValues].some((token) => lowered.includes(token));
  addCheck(
    `env:${envVar}`,
    isLoopback ? "warning" : "ok",
    isLoopback ? `set to loopback proxy (${value})` : `set (${value})`
  );
}

const noProxy = process.env.NO_PROXY ?? "";
if (noProxy.length === 0) {
  addCheck("env:NO_PROXY", "warning", "not set");
} else {
  const hasRegistry = noProxy.includes("registry.npmjs.org");
  addCheck(
    "env:NO_PROXY",
    hasRegistry ? "ok" : "warning",
    hasRegistry ? noProxy : `missing registry.npmjs.org (${noProxy})`
  );
}

const expectedBins = [
  "node_modules/.bin/storybook.cmd",
  "node_modules/.bin/vitest.cmd",
  "node_modules/.bin/turbo.cmd"
];

for (const relativePath of expectedBins) {
  const fullPath = join(repoRoot, relativePath);
  addCheck(
    `bin:${relativePath}`,
    existsSync(fullPath) ? "ok" : "warning",
    existsSync(fullPath) ? "present" : "missing; local install may be stale"
  );
}

const toolchainChecks = [
  ["node", () => true],
  ["python", () => commandAvailableViaCmd("python") || commandAvailableViaCmd("py")],
  ["dotnet", () => commandAvailableViaCmd("dotnet")],
  ["javac", () => commandAvailableViaCmd("javac")],
  ["cargo", () => commandAvailableViaCmd("cargo")],
  ["go", () => commandAvailableViaCmd("go")]
];

for (const [name, probe] of toolchainChecks) {
  const available = probe();
  addCheck(`tool:${name}`, available ? "ok" : "warning", available ? "available" : "not found");
}

addCheck("runtime:node", "ok", `node ${process.version}`);
const packageManagerProcess = process.env.npm_execpath || process.env.npm_config_user_agent || "";
addCheck(
  "runtime:package-manager-process",
  packageManagerProcess.toLowerCase().includes("pnpm") ? "ok" : "warning",
  packageManagerProcess || "not detected"
);
addCheck(
  "package:pnpm",
  packageJson.packageManager?.startsWith("pnpm@") ? "ok" : "warning",
  packageJson.packageManager ?? "missing packageManager"
);

const localStorePath = join(repoRoot, ".pnpm-store");
addCheck(
  "store:.pnpm-store",
  existsSync(localStorePath) ? "ok" : "ok",
  existsSync(localStorePath) ? "local store present" : "no local store override"
);

const warningCount = checks.filter((check) => check.status === "warning").length;

console.log("LotOS UI local toolchain diagnosis");
console.log("--------------------------------");

for (const check of checks) {
  console.log(`[${check.status.toUpperCase()}] ${check.name} :: ${check.detail}`);
}

console.log("--------------------------------");
console.log(`Warnings: ${warningCount}`);

if (warningCount > 0) {
  console.log("Use ONE/WINDOWS_LOCAL_RECOVERY.md to resolve local blockers.");
}
