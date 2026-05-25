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
import { createProgram } from '../src/index.js';

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

describe('@lotos/cli registry commands', () => {
    it('prints registry templates', async () => {
        const lines: string[] = [];
        const program = createProgram((message) => lines.push(message), (message) => lines.push(message));

        await program.parseAsync(['node', 'lotos-ui', 'templates']);

        expect(lines.some((line) => line.includes('ai-agent-console'))).toBe(true);
        expect(lines.some((line) => line.includes('saas-dashboard'))).toBe(true);
    });

    it('prints registry themes and AI tools', async () => {
        const themeLines: string[] = [];
        const toolLines: string[] = [];
        const themeProgram = createProgram((message) => themeLines.push(message), (message) => themeLines.push(message));
        const toolProgram = createProgram((message) => toolLines.push(message), (message) => toolLines.push(message));

        await themeProgram.parseAsync(['node', 'lotos-ui', 'themes']);
        await toolProgram.parseAsync(['node', 'lotos-ui', 'ai-tools']);

        expect(themeLines.some((line) => line.includes('operator-grid'))).toBe(true);
        expect(toolLines.some((line) => line.includes('/project-map'))).toBe(true);
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
