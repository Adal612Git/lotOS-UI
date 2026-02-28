# Windows Local Recovery

Use this when the repository is healthy in CI but Windows local execution fails because of `EPERM`, stale `node_modules`, or dead proxy settings.

## 1. Clear loopback proxies for the current shell

```powershell
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:ALL_PROXY = ""
$env:NO_PROXY = "registry.npmjs.org,github.com"
```

If you are in `cmd.exe`:

```bat
set HTTP_PROXY=
set HTTPS_PROXY=
set ALL_PROXY=
set NO_PROXY=registry.npmjs.org,github.com
```

## 2. Run the local diagnosis

```bat
pnpm.cmd run diagnose:local-env
```

This reports:

- proxy variables
- expected local binaries (`storybook`, `vitest`, `turbo`)
- toolchains (`python`, `dotnet`, `javac`, `cargo`, `go`)

## 3. Refresh local dependencies

If `node_modules/.bin/storybook.cmd` or `node_modules/.bin/vitest.cmd` is missing:

```bat
pnpm.cmd install --no-frozen-lockfile --offline=false
```

If pnpm still fails because the store is corrupted or locked, retry with a local store:

```bat
pnpm.cmd install --no-frozen-lockfile --offline=false --store-dir .pnpm-store
```

## 4. Recheck critical surfaces

```bat
pnpm.cmd run verify:release-readiness
pnpm.cmd run verify:desktop
pnpm.cmd --filter @lotosui/pro-private run bundle
pnpm.cmd --filter @lotosui/pro-private run verify:bundle
```

## 5. Re-test Vite / Storybook paths

```bat
pnpm.cmd --filter @lotosui/claude-arm run verify:storybook
pnpm.cmd --filter @lotosui/claude-arm run build-storybook
pnpm.cmd --filter @lotosui/claude-arm run test:coverage
```

If these still fail with `spawn EPERM`, the usual cause is OS-level file locking from antivirus/indexing or a stale pnpm store. Restart the shell, ensure no editor process is locking `node_modules`, and retry using the local store override.
