const { execSync } = require('child_process');
const path = require('path');

const root = __dirname;
const results = [];

function run(label, cmd, cwd) {
    try {
        const out = execSync(cmd, { cwd, encoding: 'utf-8', stdio: 'pipe' });
        results.push({ label, status: 'PASS', output: out.trim().slice(0, 500) });
    } catch (e) {
        results.push({ label, status: 'FAIL', output: (e.stdout + '\n' + e.stderr).trim().slice(0, 800) });
    }
}

// Locate tsc and vitest in the pnpm virtual store
const corePath = path.join(root, 'packages', 'core');
const armPath = path.join(root, 'packages', 'claude-arm');
const sentinelPath = path.join(root, 'packages', 'sentinel');
const webCompPath = path.join(root, 'packages', 'web-components');

// Use pnpm.cmd with --shell-mode to inherit augmented PATH
run('core build', 'pnpm.cmd run build', corePath);
run('core test', 'pnpm.cmd run test', corePath);
run('claude-arm build', 'pnpm.cmd run build', armPath);
run('claude-arm test', 'pnpm.cmd run test', armPath);
run('sentinel build', 'pnpm.cmd run build', sentinelPath);
run('sentinel test', 'pnpm.cmd run test', sentinelPath);
run('web-components build', 'pnpm.cmd run build', webCompPath);

console.log(JSON.stringify(results, null, 2));
