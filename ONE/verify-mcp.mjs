#!/usr/bin/env node
import { createMCPServer } from '../packages/core/dist/mcp/server.js';
import { lotosMcpTransportSpec } from '../packages/core/dist/mcp/spec.js';
import { lotosManifest } from '../packages/registry/dist/index.js';

const failures = [];

function fail(message) {
  failures.push(message);
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('MCP server did not expose a TCP address.'));
        return;
      }
      resolve(address.port);
    });
  });
}

async function getJson(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    fail(`${path} returned HTTP ${response.status}.`);
    return null;
  }
  return response.json();
}

const specPaths = new Set(lotosMcpTransportSpec.endpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`));
for (const tool of lotosManifest.mcpTools) {
  if (!specPaths.has(tool.endpoint)) {
    fail(`Registry MCP tool ${tool.id} (${tool.endpoint}) is not in transport spec.`);
  }
}

const server = createMCPServer(0);
try {
  const port = await listen(server);
  const baseUrl = `http://127.0.0.1:${port}`;
  const checks = [
    ['/health', (json) => json?.status === 'ok' && json.registryTemplates === lotosManifest.templates.length],
    ['/mcp/spec', (json) => json?.spec?.endpoints?.length >= lotosManifest.mcpTools.length],
    ['/manifest', (json) => json?.manifest?.templates?.length === lotosManifest.templates.length],
    ['/ai/context', (json) => json?.templates?.length === lotosManifest.templates.length && json?.guardrails?.length > 0],
    ['/component-tiers', (json) => json?.totals?.free === 8 && json?.totals?.pro === 19],
    ['/templates', (json) => json?.totalTemplates === lotosManifest.templates.length],
    ['/templates/saas-dashboard', (json) => json?.template?.id === 'saas-dashboard'],
    ['/templates/saas-dashboard/prompt', (json) => json?.id === 'saas-dashboard' && Boolean(json?.aiPrompt)],
    ['/runtime-matrix', (json) => json?.totalRuntimes === lotosManifest.runtimes.length],
    ['/themes', (json) => json?.totalThemes === lotosManifest.themes.length],
    ['/release-readiness', (json) =>
      typeof json?.releaseReadiness?.score === 'number'
      && json?.lifecycleValidation?.wide_sales_ready === false
      && json?.lifecycleValidation?.supabase_remote_validated === false
      && json?.lifecycleValidation?.lemon_remote_validated === false
    ],
    ['/entitlement-flows', (json) => json?.flows?.length === lotosManifest.entitlementFlows.length],
  ];

  for (const [path, predicate] of checks) {
    const json = await getJson(baseUrl, path);
    if (json && !predicate(json)) {
      fail(`${path} returned an unexpected shape.`);
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length > 0) {
  console.error('verify:mcp failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:mcp OK (${lotosMcpTransportSpec.endpoints.length} endpoint specs)`);
