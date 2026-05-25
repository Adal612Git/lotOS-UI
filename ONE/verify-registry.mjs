#!/usr/bin/env node
import { lotosManifest } from '../packages/registry/dist/index.js';

const failures = [];

function fail(message) {
  failures.push(message);
}

function uniqueById(label, entries) {
  const seen = new Set();
  for (const entry of entries) {
    if (!entry?.id) {
      fail(`${label} has an entry without id.`);
      continue;
    }
    if (seen.has(entry.id)) {
      fail(`${label} has duplicate id: ${entry.id}`);
    }
    seen.add(entry.id);
  }
}

uniqueById('components', lotosManifest.components);
uniqueById('templates', lotosManifest.templates);
uniqueById('themes', lotosManifest.themes);
uniqueById('runtimes', lotosManifest.runtimes);
uniqueById('mcpTools', lotosManifest.mcpTools);

const componentTotals = {
  free: lotosManifest.components.filter((entry) => entry.tier === 'free').length,
  pro: lotosManifest.components.filter((entry) => entry.tier === 'pro').length,
};

if (componentTotals.free !== 8) {
  fail(`Expected 8 free component contracts, found ${componentTotals.free}.`);
}

if (componentTotals.pro !== 19) {
  fail(`Expected 19 pro component contracts, found ${componentTotals.pro}.`);
}

for (const component of lotosManifest.components) {
  for (const field of ['name', 'description', 'category', 'examplePath', 'aiUsageNotes']) {
    if (!component[field]) {
      fail(`Component ${component.id} is missing ${field}.`);
    }
  }
  if (!component.runtimes.length) {
    fail(`Component ${component.id} has no runtimes.`);
  }
  if (!component.a11y.length) {
    fail(`Component ${component.id} has no a11y notes.`);
  }
}

for (const template of lotosManifest.templates) {
  for (const field of ['name', 'description', 'installCommand', 'aiPrompt']) {
    if (!template[field]) {
      fail(`Template ${template.id} is missing ${field}.`);
    }
  }
}

for (const group of ['public', 'auth', 'entitlementGated', 'ownerOnly']) {
  if (!Array.isArray(lotosManifest.routes[group])) {
    fail(`routes.${group} must be an array.`);
  }
}

if (!lotosManifest.routes.public.includes('/ai')) {
  fail('routes.public must include /ai.');
}

if (!lotosManifest.routes.public.includes('/templates')) {
  fail('routes.public must include /templates.');
}

if (!lotosManifest.validation.includes('pnpm run verify:registry')) {
  fail('validation must include pnpm run verify:registry.');
}

if (!lotosManifest.env.lemon?.includes('LEMON_WEBHOOK_SECRET')) {
  fail('env.lemon must include LEMON_WEBHOOK_SECRET.');
}

if (failures.length > 0) {
  console.error('verify:registry failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:registry OK (${lotosManifest.components.length} components, ${lotosManifest.templates.length} templates, ${lotosManifest.runtimes.length} runtimes)`);
