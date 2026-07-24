#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();

function fullPath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(fullPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(fullPath(relativePath), 'utf8');
}

function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const checks = [];

function check(name, passed, detail, critical = false) {
  checks.push({ name, passed, detail, critical });
}

const files = {
  webDemoPage: 'apps/web/app/home-sections.tsx',
  multiFrameworkPage: 'apps/web/app/multi-framework/page.tsx',
  designLabPage: 'apps/web/app/design-lab/page.tsx',
  docsIndex: 'apps/docs/content/docs/index.mdx',
  docsInstallation: 'apps/docs/content/docs/installation.mdx',
  docsMultiRuntime: 'apps/docs/content/docs/multi-runtime.mdx',
  docsLanding: 'apps/docs/app/page.tsx',
  mcpServer: 'packages/core/src/mcp/server.ts',
  diagramSource: 'LOTOSdiagrama.html',
  diagramWebPublic: 'apps/web/public/architecture-map.html',
  diagramDocsPublic: 'apps/docs/public/architecture-map.html',
};

for (const [name, relativePath] of Object.entries(files)) {
  check(`file:${name}`, exists(relativePath), relativePath, true);
}

if (checks.some((entry) => entry.critical && !entry.passed)) {
  reportAndExit();
}

const multiFrameworkPage = read(files.multiFrameworkPage);
const webDemoPage = read(files.webDemoPage);
const designLabPage = read(files.designLabPage);
const docsIndex = read(files.docsIndex);
const docsInstallation = read(files.docsInstallation);
const docsMultiRuntime = read(files.docsMultiRuntime);
const docsLanding = read(files.docsLanding);
const mcpServer = read(files.mcpServer);
const diagramSource = read(files.diagramSource);
const diagramWebPublic = read(files.diagramWebPublic);
const diagramDocsPublic = read(files.diagramDocsPublic);

const runtimeNames = [
  'React',
  'Web Components',
  'Laravel Blade',
  'Django',
  'Flask',
  'Spring',
  '.NET',
  'Go',
  'C + ncurses',
  'C++',
  'Mojo',
];

for (const runtimeName of runtimeNames) {
  check(
    `runtime:web:${runtimeName}`,
    multiFrameworkPage.includes(runtimeName),
    `apps/web runtime matrix should include ${runtimeName}`,
  );
  check(
    `runtime:docs:${runtimeName}`,
    docsMultiRuntime.includes(runtimeName),
    `apps/docs multi-runtime guide should include ${runtimeName}`,
  );
}

const staleClaims = [
  'The first UI component ecosystem designed for agents',
  'One design system. Five exports',
  '/docs/getting-started/installation',
];

for (const staleClaim of staleClaims) {
  const inLanding = docsLanding.includes(staleClaim);
  const inDocsIndex = docsIndex.includes(staleClaim);
  const inDocsInstall = docsInstallation.includes(staleClaim);

  check(
    `stale-claim:${staleClaim}`,
    !inLanding && !inDocsIndex && !inDocsInstall,
    `should not exist in docs landing/getting-started files`,
  );
}

check(
  'design-lab:link-from-demo',
  webDemoPage.includes('href="/design-lab"'),
  'apps/web home navigation should link to /design-lab',
);

check(
  'design-lab:link-from-runtime',
  multiFrameworkPage.includes('href="/design-lab"'),
  'apps/web runtime page should link to /design-lab',
);

check(
  'design-lab:surface-has-presets',
  designLabPage.includes('Dashboard Bold') &&
  designLabPage.includes('Operator Grid') &&
  designLabPage.includes('Minimal Focus'),
  'apps/web design lab should include multiple preset directions',
);

check(
  'framework-contract:mcp-supported',
  mcpServer.includes("supported: ['react', 'web-component', 'laravel-blade']"),
  'MCP server should expose react/web-component/laravel-blade as supported',
  true,
);

check(
  'framework-contract:mcp-planned',
  mcpServer.includes("planned: ['django-template', 'spring-thymeleaf']"),
  'MCP server should expose django-template/spring-thymeleaf as planned',
  true,
);

check(
  'framework-contract:diagram-supported',
  diagramSource.includes('supported: react, web-component, laravel-blade'),
  'diagram should match supported framework contract',
);

check(
  'framework-contract:diagram-planned',
  diagramSource.includes('planned: django-template, spring-thymeleaf'),
  'diagram should match planned framework contract',
);

check(
  'diagram:sync-web-public',
  hash(diagramSource) === hash(diagramWebPublic),
  'apps/web/public/architecture-map.html must be synced with LOTOSdiagrama.html',
  true,
);

check(
  'diagram:sync-docs-public',
  hash(diagramSource) === hash(diagramDocsPublic),
  'apps/docs/public/architecture-map.html must be synced with LOTOSdiagrama.html',
  true,
);

const passed = checks.filter((entry) => entry.passed).length;
const total = checks.length;
const percent = Math.round((passed / total) * 100);

const criticalFailed = checks.filter((entry) => entry.critical && !entry.passed);
const nonCriticalFailed = checks.filter((entry) => !entry.critical && !entry.passed);

console.log('LotOS UI verify:100');
console.log('-------------------');
console.log(`Checks passed: ${passed}/${total} (${percent}%)`);

if (criticalFailed.length > 0) {
  console.log('\nCritical failures:');
  for (const failure of criticalFailed) {
    console.log(`- ${failure.name}: ${failure.detail}`);
  }
}

if (nonCriticalFailed.length > 0) {
  console.log('\nNon-critical failures:');
  for (const failure of nonCriticalFailed) {
    console.log(`- ${failure.name}: ${failure.detail}`);
  }
}

if (criticalFailed.length > 0 || nonCriticalFailed.length > 0) {
  process.exit(1);
}

console.log('\nStatus: 100% consistency checks passed for web/docs/diagram contracts.');

function reportAndExit() {
  console.log('LotOS UI verify:100');
  console.log('-------------------');
  console.log('Critical files missing:');
  for (const item of checks.filter((entry) => entry.critical && !entry.passed)) {
    console.log(`- ${item.name}: ${item.detail}`);
  }
  process.exit(1);
}
