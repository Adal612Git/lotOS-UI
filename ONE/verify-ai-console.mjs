#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { lotosManifest } from '../packages/registry/dist/index.js';

const root = process.cwd();
const failures = [];
const aiPagePath = path.join(root, 'apps/web/app/ai/page.tsx');

function fail(message) {
  failures.push(message);
}

const source = fs.existsSync(aiPagePath) ? fs.readFileSync(aiPagePath, 'utf8') : '';

if (!source.includes("from '@lotosui/registry'")) {
  fail('/ai page must import @lotosui/registry.');
}

for (const marker of ['Template Gallery', 'Runtime Matrix', 'MCP explorer', 'Release readiness', 'Prompt library', 'Validation commands']) {
  if (!source.includes(marker)) {
    fail(`/ai page is missing marker: ${marker}`);
  }
}

for (const file of [
  '.ai/lotos.project-map.json',
  '.ai/lotos.components.json',
  '.ai/lotos.templates.json',
  '.ai/lotos.runtimes.json',
  '.ai/lotos.release-readiness.json',
]) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) {
    fail(`${file} is missing.`);
    continue;
  }
  const json = JSON.parse(fs.readFileSync(target, 'utf8'));
  if (json.generatedFrom !== 'packages/registry/src/lotos.manifest.ts') {
    fail(`${file} is not marked as registry-generated.`);
  }
}

if (lotosManifest.mcpTools.length < 10) {
  fail('Expected at least 10 MCP tools in the registry.');
}

if (failures.length > 0) {
  console.error('verify:ai console failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:ai console OK');
