#!/usr/bin/env node
import { lotosManifest } from '../packages/registry/dist/index.js';

const failures = [];
const runtimeIds = new Set(lotosManifest.runtimes.map((runtime) => runtime.id));
const componentIds = new Set(lotosManifest.components.map((component) => component.id));
const routePrefixes = [
  ...lotosManifest.routes.public,
  ...lotosManifest.routes.auth,
  ...lotosManifest.routes.entitlementGated,
].map((route) => route.replace('[asset]', ''));

function fail(message) {
  failures.push(message);
}

function routeExists(route) {
  return routePrefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));
}

for (const template of lotosManifest.templates) {
  if (!template.industry.length) {
    fail(`${template.id} has no industry tags.`);
  }
  if (!template.runtimes.length) {
    fail(`${template.id} has no runtimes.`);
  }
  if (!template.includedComponents.length) {
    fail(`${template.id} has no included components.`);
  }
  if (!template.installCommand.includes(template.id)) {
    fail(`${template.id} installCommand does not include the template id.`);
  }
  if (!template.deployChecklist.length) {
    fail(`${template.id} has no deploy checklist.`);
  }
  for (const runtime of template.runtimes) {
    if (!runtimeIds.has(runtime)) {
      fail(`${template.id} references unknown runtime ${runtime}.`);
    }
  }
  for (const component of template.includedComponents) {
    if (!componentIds.has(component)) {
      fail(`${template.id} references unknown component ${component}.`);
    }
  }
  if (template.previewRoute && !routeExists(template.previewRoute)) {
    fail(`${template.id} previewRoute ${template.previewRoute} is not represented in route map.`);
  }
  if (!template.aiPrompt.toLowerCase().includes(template.name.toLowerCase())) {
    fail(`${template.id} aiPrompt should mention the template name.`);
  }
}

if (lotosManifest.templates.length < 20) {
  fail(`Expected at least 20 templates, found ${lotosManifest.templates.length}.`);
}

if (failures.length > 0) {
  console.error('verify:templates failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:templates OK (${lotosManifest.templates.length} registry templates)`);
