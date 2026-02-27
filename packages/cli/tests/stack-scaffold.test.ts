import path from 'node:path';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import { describe, expect, it } from 'vitest';
import {
    listStackTemplateSummaries,
    scaffoldStackStarter,
} from '../src/stack-scaffold.js';

describe('@lotos/cli stack scaffold', () => {
    it('lists stack templates including java and dotnet', () => {
        const stacks = listStackTemplateSummaries();
        const ids = stacks.map((entry) => entry.id);
        expect(ids).toContain('java-spring-starter');
        expect(ids).toContain('dotnet-razor-starter');
    });

    it('creates a Go stack with mongodb configuration', async () => {
        const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'lotos-stack-'));
        const outDir = path.join(tempRoot, 'go-mongo');
        try {
            const result = await scaffoldStackStarter({
                stackId: 'go-templ-starter',
                database: 'mongodb',
                outDir,
            });

            expect(result.database).toBe('mongodb');
            expect(result.files).toContain('cmd/server/main.go');
            expect(result.files).toContain('lotos-stack.json');

            const mainGo = await readFile(path.join(outDir, 'cmd', 'server', 'main.go'), 'utf8');
            expect(mainGo).toContain('mongo.Connect');

            const manifest = await readFile(path.join(outDir, 'lotos-stack.json'), 'utf8');
            expect(manifest).toContain('"stackId": "go-templ-starter"');
            expect(manifest).toContain('"database": "mongodb"');
        } finally {
            await rm(tempRoot, { recursive: true, force: true });
        }
    });

    it('rejects unknown database values', async () => {
        await expect(
            scaffoldStackStarter({
                stackId: 'java-spring-starter',
                database: 'postgres',
                outDir: path.join(os.tmpdir(), 'lotos-invalid-db'),
                force: true,
            }),
        ).rejects.toThrow('Invalid database');
    });
});
