#!/usr/bin/env node
import { lotosManifest } from '../packages/registry/dist/index.js';

const failures = [];
const allowedCategories = new Set(['web', 'server-rendered', 'mobile', 'desktop', 'terminal', 'agent']);
const allowedMaturity = new Set(['stable', 'beta', 'alpha', 'prototype', 'planned', 'internal']);
const runtimeIds = new Set(lotosManifest.runtimes.map((runtime) => runtime.id));

function fail(message) {
  failures.push(message);
}

for (const runtime of lotosManifest.runtimes) {
  if (!allowedCategories.has(runtime.category)) {
    fail(`${runtime.id} has invalid category ${runtime.category}.`);
  }
  if (!allowedMaturity.has(runtime.maturity)) {
    fail(`${runtime.id} has invalid maturity ${runtime.maturity}.`);
  }
  if (!runtime.label || !runtime.language || !runtime.agentGuidance) {
    fail(`${runtime.id} is missing label, language, or agentGuidance.`);
  }
  if (runtime.maturity === 'stable' && !runtime.packageName) {
    fail(`${runtime.id} is stable but has no packageName.`);
  }
  if (runtime.maturity === 'planned' && runtime.packageName) {
    fail(`${runtime.id} is planned but already claims packageName ${runtime.packageName}.`);
  }
}

for (const component of lotosManifest.components) {
  for (const runtime of component.runtimes) {
    if (!runtimeIds.has(runtime)) {
      fail(`Component ${component.id} references unknown runtime ${runtime}.`);
    }
  }
}

for (const template of lotosManifest.templates) {
  for (const runtime of template.runtimes) {
    if (!runtimeIds.has(runtime)) {
      fail(`Template ${template.id} references unknown runtime ${runtime}.`);
    }
  }
}

if (lotosManifest.runtimes.length < 30) {
  fail(`Expected at least 30 runtimes, found ${lotosManifest.runtimes.length}.`);
}

if (failures.length > 0) {
  console.error('verify:registry-runtimes failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:registry-runtimes OK (${lotosManifest.runtimes.length} runtimes)`);
