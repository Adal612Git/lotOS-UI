#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { lotosManifest } from '../packages/registry/dist/index.js';
import { lotosMcpTransportSpec } from '../packages/core/dist/mcp/spec.js';

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function toPascalCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const mcpServer = read('packages/core/src/mcp/server.ts');
if (!mcpServer.includes(`const MCP_VERSION = '${lotosMcpTransportSpec.version}'`)) {
  fail(`MCP server version must match transport spec version ${lotosMcpTransportSpec.version}.`);
}

const mcpDocs = read('apps/docs/content/docs/mcp-spec.mdx');
if (!mcpDocs.includes(`Version\`: \`${lotosMcpTransportSpec.version}\``)) {
  fail('MCP docs are missing the current transport version.');
}
for (const endpoint of lotosMcpTransportSpec.endpoints) {
  if (!mcpDocs.includes(`| \`${endpoint.method}\` | \`${endpoint.path}\``)) {
    fail(`MCP docs are missing endpoint: ${endpoint.method} ${endpoint.path}`);
  }
}

const corePackage = readJson('packages/core/package.json');
if (!corePackage.exports?.['./mcp']) {
  fail('package export drift: @lotosui/core must expose ./mcp.');
}

const envSource = read('apps/web/lib/env.ts');
const envKeys = Array.from(envSource.matchAll(/\b([A-Z][A-Z0-9_]+): optionalString/g)).map((match) => match[1]);
const manifestEnvKeys = new Set(Object.values(lotosManifest.env).flat());
for (const key of envKeys) {
  if (!manifestEnvKeys.has(key)) {
    fail(`env drift: apps/web/lib/env.ts uses ${key}, but registry env requirements do not list it.`);
  }
}

const cliSource = read('packages/cli/src/index.ts');
for (const command of ['runtime-matrix', 'templates', 'themes', 'ai-tools']) {
  if (!cliSource.includes(`.command('${command}')`)) {
    fail(`CLI source is missing registry command: ${command}`);
  }
}

const claudeArmComponents = read('packages/claude-arm/src/components/index.ts');
for (const component of lotosManifest.components.filter((entry) => entry.tier === 'pro')) {
  if (claudeArmComponents.includes(`export { ${toPascalCase(component.id)} }`)) {
    fail(`premium export drift: public claude-arm components barrel exports ${component.id}.`);
  }
}

for (const component of lotosManifest.components) {
  const docsPath = path.join(root, component.examplePath);
  if (!fs.existsSync(docsPath)) {
    fail(`component docs drift: ${component.id} examplePath missing at ${component.examplePath}`);
  }
}

const commercialAi = readJson('.ai/lotos.commercial.json');
const publicAssetPaths = lotosManifest.assetPermissions
  .filter((entry) => entry.id === 'public-packages')
  .flatMap((entry) => entry.paths);
for (const privateSurface of commercialAi.privateSurfaces ?? []) {
  if (publicAssetPaths.includes(privateSurface)) {
    fail(`AI commercial drift: privateSurfaces includes public package path ${privateSurface}.`);
  }
}

const freeManifest = read('packages/pro/distribution/free.manifest.json');
if (!freeManifest.includes('8 free exports')) {
  warn('packages/pro/distribution/free.manifest.json should describe @lotosui/claude-arm as 8 free exports.');
}

for (const warning of warnings) {
  console.warn(`verify:registry-consumers warning: ${warning}`);
}

if (failures.length > 0) {
  console.error('verify:registry-consumers failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:registry-consumers OK (${lotosManifest.components.length} components, ${lotosMcpTransportSpec.endpoints.length} MCP endpoints)`);
