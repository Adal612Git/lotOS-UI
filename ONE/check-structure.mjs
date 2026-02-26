#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredDirectories = [
    'apps',
    'packages',
    'ONE',
];

const strategyExtensions = new Set(['.txt', '.md', '.html', '.pdf', '.docx']);
const noisyBuildDirectories = new Set(['.next', '.turbo', 'dist', 'coverage']);
const requiredOneFiles = [
    'PROJECT_ARCHITECTURE_STATE_2026-02-25.md',
    'DEEPSEEK_FEEDBACK_VERIFIED_2026-02-25.md',
    'MANUAL_OPERATIVO_VICTOR.md',
    'LOTOS_DESIGN_PATTERNS_MULTI_RUNTIME.md',
    'README_STRATEGY.md',
    'README_MARKET_INTEL.md',
    'ESTUDIO_estrategiafinalventas.txt',
    'TEMPLATE_competitor-teardown.md',
    'TEMPLATE_movement-signal-log.md',
    'TEMPLATE_runtime-aesthetic-audit.md',
    'check-structure.mjs',
    'degraded-mode.mjs',
];

function exists(relativePath) {
    return fs.existsSync(path.join(root, relativePath));
}

function getRootFiles() {
    return fs
        .readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name);
}

function isLikelyStrategyFile(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    if (!strategyExtensions.has(ext)) {
        return false;
    }

    const lowered = fileName.toLowerCase();
    return (
        lowered.includes('estrateg') ||
        lowered.includes('market') ||
        lowered.includes('ventas') ||
        lowered.includes('analisis') ||
        lowered.includes('plan')
    );
}

function countNoisyFolders() {
    let count = 0;
    const scanRoots = ['apps', 'packages'];

    for (const scanRoot of scanRoots) {
        const absoluteRoot = path.join(root, scanRoot);
        if (!fs.existsSync(absoluteRoot)) {
            continue;
        }

        const stack = [absoluteRoot];
        while (stack.length > 0) {
            const current = stack.pop();
            if (!current) {
                continue;
            }

            const entries = fs.readdirSync(current, { withFileTypes: true });
            for (const entry of entries) {
                if (!entry.isDirectory()) {
                    continue;
                }

                if (entry.name === 'node_modules') {
                    continue;
                }

                if (noisyBuildDirectories.has(entry.name)) {
                    count += 1;
                    continue;
                }

                stack.push(path.join(current, entry.name));
            }
        }
    }

    return count;
}

const missing = requiredDirectories.filter((directory) => !exists(directory));
const rootFiles = getRootFiles();
const misplacedStrategyFiles = rootFiles.filter((file) => isLikelyStrategyFile(file));
const noisyFolders = countNoisyFolders();
const missingOneFiles = requiredOneFiles.filter((file) => !exists(path.join('ONE', file)));

console.log('LotOS UI structure check');
console.log('-----------------------');

if (missing.length === 0) {
    console.log('OK: required workspace directories exist.');
} else {
    console.log('Missing directories:');
    for (const directory of missing) {
        console.log(`- ${directory}`);
    }
}

if (missingOneFiles.length === 0) {
    console.log('OK: ONE/ contains all canonical strategy and architecture files.');
} else {
    console.log('Missing files inside ONE/:');
    for (const file of missingOneFiles) {
        console.log(`- ONE/${file}`);
    }
}

if (misplacedStrategyFiles.length > 0) {
    console.log('\nSuggested moves (strategy/market files at repo root):');
    for (const file of misplacedStrategyFiles) {
        console.log(`- ${file} -> ONE/${file}`);
    }
} else {
    console.log('\nOK: no loose strategy files detected at repo root.');
}

console.log(`\nAdvisory: detected ${noisyFolders} build/cache directories under apps/packages.`);
console.log('Run cleanup before commits if these are generated artifacts.');
