import path from 'node:path';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import { describe, expect, it } from 'vitest';
import {
    normalizeDesktopLanguage,
    scaffoldDesktopStarter,
} from '../src/desktop-scaffold.js';

describe('@lotos/cli desktop scaffold', () => {
    it('normalizes desktop language aliases', () => {
        expect(normalizeDesktopLanguage('py')).toBe('python');
        expect(normalizeDesktopLanguage('cplusplus')).toBe('cpp');
        expect(normalizeDesktopLanguage('unknown')).toBeNull();
    });

    it('creates a Python desktop starter with shell and bridge files', async () => {
        const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'lotos-desktop-'));
        const outDir = path.join(tempRoot, 'starter');
        try {
            const result = await scaffoldDesktopStarter({
                language: 'python',
                templateId: 'control-center-desktop',
                outDir,
            });

            expect(result.language).toBe('python');
            expect(result.files).toContain('ui/shell.html');
            expect(result.files).toContain('app.py');
            expect(result.files).toContain('desktop-template.json');

            const shell = await readFile(path.join(outDir, 'ui', 'shell.html'), 'utf8');
            expect(shell).toContain('LotOS Desktop');
            expect(shell).toContain('Control Center Desktop');

            const manifestRaw = await readFile(path.join(outDir, 'desktop-template.json'), 'utf8');
            expect(manifestRaw).toContain('"language": "python"');
            expect(manifestRaw).toContain('"templateId": "control-center-desktop"');
        } finally {
            await rm(tempRoot, { recursive: true, force: true });
        }
    });
});
