import path from 'node:path';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import { describe, expect, it } from 'vitest';
import {
    componentToPascalCase,
    normalizeComponentName,
} from '../src/catalog.js';
import {
    getComponentTemplate,
    scaffoldComponent,
} from '../src/scaffold.js';

describe('@lotos/cli catalog', () => {
    it('normalizes component names', () => {
        expect(normalizeComponentName('radio-group')).toBe('radio-group');
        expect(normalizeComponentName('RadioGroup')).toBe('radio-group');
        expect(normalizeComponentName('RADIO_GROUP')).toBe('radio-group');
        expect(normalizeComponentName('unknown')).toBeNull();
    });

    it('converts names to PascalCase', () => {
        expect(componentToPascalCase('button')).toBe('Button');
        expect(componentToPascalCase('radio-group')).toBe('RadioGroup');
    });

    it('generates a component template', () => {
        const template = getComponentTemplate('button');
        expect(template).toContain('LotosButton');
        expect(template).toContain('export function Button');
    });
});

describe('@lotos/cli scaffold', () => {
    it('creates a wrapper component file', async () => {
        const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'lotos-cli-'));
        try {
            const result = await scaffoldComponent({
                component: 'button',
                outDir: tempRoot,
            });
            expect(result.component).toBe('button');
            expect(result.overwritten).toBe(false);

            const file = await readFile(result.filePath, 'utf8');
            expect(file).toContain('export function Button');
        } finally {
            await rm(tempRoot, { recursive: true, force: true });
        }
    });

    it('throws when file exists and force is false', async () => {
        const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'lotos-cli-'));
        try {
            await scaffoldComponent({ component: 'button', outDir: tempRoot });
            await expect(
                scaffoldComponent({ component: 'button', outDir: tempRoot }),
            ).rejects.toThrow('File already exists');
        } finally {
            await rm(tempRoot, { recursive: true, force: true });
        }
    });
});
