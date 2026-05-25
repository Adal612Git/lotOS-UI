#!/usr/bin/env node
import { createMCPServer } from '../packages/core/dist/mcp/server.js';
import { lotosMcpTransportSpec } from '../packages/core/dist/mcp/spec.js';

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

function samplePath(specPath) {
  if (specPath === '/patterns/:id') {
    return '/patterns/saas-control-center';
  }
  if (specPath === '/desktop/templates/:id') {
    return '/desktop/templates/control-center-desktop';
  }
  if (specPath === '/stacks/:id') {
    return '/stacks/php-laravel-starter';
  }
  if (specPath === '/templates/:id') {
    return '/templates/saas-dashboard';
  }
  if (specPath === '/templates/:id/prompt') {
    return '/templates/saas-dashboard/prompt';
  }
  return specPath
    .replace(':id', 'saas-dashboard')
    .replace(':name', 'button');
}

async function getJson(baseUrl, endpoint) {
  const response = await fetch(`${baseUrl}${samplePath(endpoint.path)}`);
  if (!response.ok) {
    fail(`${endpoint.method} ${endpoint.path} returned HTTP ${response.status}.`);
    return null;
  }
  return response.json();
}

const server = createMCPServer(0);
try {
  const port = await listen(server);
  const baseUrl = `http://127.0.0.1:${port}`;

  for (const endpoint of lotosMcpTransportSpec.endpoints) {
    if (endpoint.method !== 'GET') {
      continue;
    }
    const json = await getJson(baseUrl, endpoint);
    if (!json || typeof json !== 'object') {
      fail(`${endpoint.method} ${endpoint.path} did not return a JSON object.`);
    }
  }

  const renderResponse = await fetch(`${baseUrl}/components/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      framework: 'react',
      component: 'button',
      props: { variant: 'primary' },
      children: 'Launch',
    }),
  });

  if (!renderResponse.ok) {
    fail(`POST /components/render returned HTTP ${renderResponse.status}.`);
  } else {
    const payload = await renderResponse.json();
    if (!payload?.code || !String(payload.code).includes('@lotosui/claude-arm')) {
      fail('POST /components/render returned an unexpected snippet.');
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length > 0) {
  console.error('verify:mcp-smoke failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:mcp-smoke OK (${lotosMcpTransportSpec.endpoints.length} endpoint specs checked)`);
