#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function exists(relativePath) {
    return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const criticalBridgeFiles = [
    'packages/web-components/src/button.ts',
    'packages/web-components/src/input.ts',
    'packages/web-components/src/index.ts',
    'packages/lotos-laravel/composer.json',
    'packages/lotos-laravel/resources/views/components/lotos-button.blade.php',
    'packages/lotos-laravel/resources/views/components/lotos-input.blade.php',
    'packages/lotos-laravel/examples/dashboard.blade.php',
    'apps/web/app/multi-framework/page.tsx',
    'packages/core/src/mcp/server.ts',
];

const missingBridgeFiles = criticalBridgeFiles.filter((entry) => !exists(entry));
const hasTurbo = exists('node_modules/.bin/turbo') || exists('node_modules/turbo');
const hasTypeScript = exists('node_modules/typescript/bin/tsc');
const dependenciesHealthy = hasTurbo && hasTypeScript;

let renderEndpointPresent = false;
if (exists('packages/core/src/mcp/server.ts')) {
    const serverSource = read('packages/core/src/mcp/server.ts');
    renderEndpointPresent =
        serverSource.includes("pathname === '/components/render'") &&
        serverSource.includes("req.method === 'POST'");
}

console.log('LotOS UI degraded-mode verification');
console.log('----------------------------------');
console.log(`Dependencies ready: ${dependenciesHealthy ? 'yes' : 'no (degraded mode)'}`);
console.log(`MCP render endpoint: ${renderEndpointPresent ? 'present' : 'missing'}`);

if (missingBridgeFiles.length === 0) {
    console.log('Bridge files: complete');
} else {
    console.log('Bridge files: missing');
    for (const file of missingBridgeFiles) {
        console.log(`- ${file}`);
    }
}

if (!dependenciesHealthy) {
    console.log('\nRecommended next step when network/cache is available:');
    console.log('- pnpm install');
    console.log('- pnpm build');
}

if (missingBridgeFiles.length > 0 || !renderEndpointPresent) {
    process.exit(1);
}

console.log('\nStatus: architecture bridge is present. Safe to continue in docs/planning mode.');
