#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const expectedFiles = [
  '.ai/lotos.assets.json',
  '.ai/lotos.commercial.json',
  '.ai/lotos.components.json',
  '.ai/lotos.entitlements.json',
  '.ai/lotos.env.json',
  '.ai/lotos.pricing.json',
  '.ai/lotos.project-map.json',
  '.ai/lotos.public-context.json',
  '.ai/lotos.prompts.json',
  '.ai/lotos.release-readiness.json',
  '.ai/lotos.runtimes.json',
  '.ai/lotos.templates.json',
  '.ai/lotos.themes.json',
];

function fail(message) {
  failures.push(message);
}

const actualFiles = fs.existsSync(path.join(root, '.ai'))
  ? fs.readdirSync(path.join(root, '.ai'))
      .filter((file) => file.startsWith('lotos.') && file.endsWith('.json'))
      .map((file) => `.ai/${file}`)
      .sort()
  : [];

for (const expectedFile of expectedFiles) {
  const absolutePath = path.join(root, expectedFile);
  if (!fs.existsSync(absolutePath)) {
    fail(`Missing generated AI artifact: ${expectedFile}`);
    continue;
  }
  const raw = fs.readFileSync(absolutePath, 'utf8');
  if (!raw.endsWith('\n')) {
    fail(`${expectedFile} must end with a newline for reproducible generation.`);
  }
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    fail(`${expectedFile} is not valid JSON.`);
    continue;
  }
  if (json.generatedFrom !== 'packages/registry/src/lotos.manifest.ts') {
    fail(`${expectedFile} has invalid generatedFrom.`);
  }
  if (json.generatedAt !== 'static') {
    fail(`${expectedFile} must use generatedAt=static.`);
  }
}

for (const actualFile of actualFiles) {
  if (!expectedFiles.includes(actualFile)) {
    fail(`Unexpected generated AI artifact: ${actualFile}`);
  }
}

if (failures.length > 0) {
  console.error('verify:generated-ai failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:generated-ai OK (${expectedFiles.length} registry-generated artifacts)`);
