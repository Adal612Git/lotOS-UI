#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();

function run(commandLine) {
    const result = spawnSync(commandLine, {
        cwd: root,
        stdio: 'inherit',
        shell: true,
    });

    if (result.error) {
        console.error(`[build] Failed command: ${commandLine}`);
        console.error(`[build] Error: ${result.error.code ?? result.error.message}`);
        return { ok: false, code: 1, error: result.error };
    }

    return { ok: result.status === 0, code: result.status ?? 1 };
}

function canSpawnWithPipes() {
    const probe = spawnSync(
        process.execPath,
        ['-e', 'process.stdout.write("ok")'],
        {
            cwd: root,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
        },
    );

    return !probe.error && probe.stdout === 'ok';
}

const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const turboBin = process.platform === 'win32'
    ? path.join('node_modules', '.bin', 'turbo.cmd')
    : path.join('node_modules', '.bin', 'turbo');

if (canSpawnWithPipes()) {
    const turboResult = run(`"${turboBin}" run build`);
    process.exit(turboResult.code);
}

console.log('[build] Detected constrained spawn environment (EPERM with piped child processes).');
console.log('[build] Running degraded build pipeline: core build + verify:100 + verify:degraded.');

const coreBuild = run(`${pnpmCmd} --filter @lotosui/core build`);
if (!coreBuild.ok) {
    process.exit(coreBuild.code);
}

const verify100 = run(`${pnpmCmd} run verify:100`);
if (!verify100.ok) {
    process.exit(verify100.code);
}

const verifyDegraded = run(`${pnpmCmd} run verify:degraded`);
if (!verifyDegraded.ok) {
    process.exit(verifyDegraded.code);
}

console.log('[build] Degraded build pipeline completed successfully.');
