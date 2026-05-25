import { mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();

const targets = [
    { dir: 'packages/registry', env: 'PUBLISH_REGISTRY' },
    { dir: 'packages/core', env: 'PUBLISH_CORE' },
    { dir: 'packages/sentinel', env: 'PUBLISH_SENTINEL' },
    { dir: 'packages/cli', env: 'PUBLISH_CLI' },
    { dir: 'packages/claude-arm', env: 'PUBLISH_CLAUDE_ARM' },
    { dir: 'packages/web-components', env: 'PUBLISH_WEB_COMPONENTS' },
];

const allowedPublicPackageNames = new Set([
    '@lotosui/registry',
    '@lotosui/core',
    '@lotosui/sentinel',
    '@lotosui/cli',
    '@lotosui/claude-arm',
    '@lotosui/web-components',
]);

function run(cmd, args, cwd = rootDir) {
    const result = spawnSync(cmd, args, {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: process.env,
    });

    if (result.status !== 0) {
        throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
    }
}

function runCapture(cmd, args, cwd = rootDir) {
    return spawnSync(cmd, args, {
        cwd,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        env: process.env,
    });
}

function isEnabled(value) {
    return ['1', 'true', 'yes', 'on'].includes((value ?? '').toLowerCase());
}

function readPackageMeta(pkgDir) {
    const manifestPath = resolve(rootDir, pkgDir, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    return { name: manifest.name, version: manifest.version, access: manifest.publishConfig?.access, privatePackage: manifest.private === true };
}

function findLatestTarball(packDir) {
    const tarballs = readdirSync(packDir)
        .filter((name) => name.endsWith('.tgz'))
        .map((name) => ({
            name,
            mtimeMs: statSync(resolve(packDir, name)).mtimeMs,
        }))
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

    if (tarballs.length === 0) {
        throw new Error(`No tarballs found in ${packDir}`);
    }

    return resolve(packDir, tarballs[0].name);
}

function isVersionPublished(name, version) {
    const lookup = runCapture('npm', ['view', `${name}@${version}`, 'version']);
    if (lookup.status === 0) {
        return true;
    }

    const combined = `${lookup.stdout ?? ''}\n${lookup.stderr ?? ''}`.toLowerCase();
    if (combined.includes('e404') || combined.includes('not found')) {
        return false;
    }

    throw new Error(`Unable to check npm registry for ${name}@${version}`);
}

for (const target of targets) {
    if (!isEnabled(process.env[target.env])) {
        // eslint-disable-next-line no-console
        console.log(`Skip ${target.dir} (${target.env}=false)`);
        continue;
    }

    const { name, version, access, privatePackage } = readPackageMeta(target.dir);
    // eslint-disable-next-line no-console
    console.log(`\n=== ${name}@${version} ===`);

    if (!allowedPublicPackageNames.has(name) || privatePackage || access !== 'public') {
        throw new Error(`Refusing to publish non-public package target: ${target.dir}`);
    }

    if (isVersionPublished(name, version)) {
        // eslint-disable-next-line no-console
        console.log(`Already published: ${name}@${version}`);
        continue;
    }

    const packDir = resolve(rootDir, '.tmp-packs');
    mkdirSync(packDir, { recursive: true });

    run('pnpm', ['pack', '--pack-destination', packDir], resolve(rootDir, target.dir));
    const tarball = findLatestTarball(packDir);
    const publishArgs = ['publish', tarball, '--access', 'public'];
    run('npm', publishArgs);
    // eslint-disable-next-line no-console
    console.log(`Published: ${name}@${version}`);
}
