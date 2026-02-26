import {
    createPatternBlueprint,
    isPatternId,
    listDesignPatterns,
    listRuntimeProfiles,
    normalizeRuntimeId,
} from '../src/index.js';
import { describe, expect, it } from 'vitest';

describe('@lotos/core - runtime catalog', () => {
    it('contains core expansion runtimes', () => {
        const runtimeIds = listRuntimeProfiles().map((entry) => entry.id);

        expect(runtimeIds).toContain('php-laravel');
        expect(runtimeIds).toContain('python-django');
        expect(runtimeIds).toContain('java-spring');
        expect(runtimeIds).toContain('dotnet-razor');
        expect(runtimeIds).toContain('go-templ');
        expect(runtimeIds).toContain('c-ncurses');
        expect(runtimeIds).toContain('cpp-qt');
        expect(runtimeIds).toContain('mojo-experimental');
    });

    it('normalizes aliases for runtimes', () => {
        expect(normalizeRuntimeId('php')).toBe('php-laravel');
        expect(normalizeRuntimeId('django')).toBe('python-django');
        expect(normalizeRuntimeId('moho')).toBe('mojo-experimental');
        expect(normalizeRuntimeId('unknown-runtime')).toBeNull();
    });
});

describe('@lotos/core - design patterns', () => {
    it('lists patterns for a runtime target', () => {
        const patterns = listDesignPatterns('php-laravel');
        expect(patterns.length).toBeGreaterThan(0);
    });

    it('builds a blueprint with quality guardrails', () => {
        const blueprint = createPatternBlueprint({
            patternId: 'saas-control-center',
            runtime: 'python-django',
        });

        expect(blueprint.runtime.id).toBe('python-django');
        expect(blueprint.qualityChecklist.length).toBeGreaterThan(3);
        expect(blueprint.integration.length).toBeGreaterThan(10);
    });

    it('validates pattern ids', () => {
        expect(isPatternId('workflow-kanban-studio')).toBe(true);
        expect(isPatternId('random-pattern')).toBe(false);
    });
});
