import { describe, expect, it } from 'vitest';
import {
    getStackTemplate,
    isDatabaseTarget,
    isStackTemplateId,
    listStackTemplates,
} from '../src/index.js';

describe('@lotos/core - runtime stacks', () => {
    it('lists stacks for requested ecosystems', () => {
        const stacks = listStackTemplates();
        const ids = stacks.map((stack) => stack.id);

        expect(ids).toContain('php-laravel-starter');
        expect(ids).toContain('python-django-starter');
        expect(ids).toContain('python-flask-starter');
        expect(ids).toContain('java-spring-starter');
        expect(ids).toContain('dotnet-razor-starter');
        expect(ids).toContain('go-templ-starter');
        expect(ids).toContain('python-pyside-desktop');
        expect(ids).toContain('java-javafx-desktop');
        expect(ids).toContain('c-webview-desktop');
        expect(ids).toContain('cpp-webview-desktop');
    });

    it('filters stacks by mongodb compatibility', () => {
        const mongoStacks = listStackTemplates({ database: 'mongodb' });
        expect(mongoStacks.length).toBeGreaterThan(0);
        expect(mongoStacks.every((stack) => stack.supportedDatabases.includes('mongodb'))).toBe(true);
    });

    it('validates stack/database contracts', () => {
        expect(isDatabaseTarget('mongodb')).toBe(true);
        expect(isDatabaseTarget('mysql')).toBe(false);
        expect(isStackTemplateId('go-templ-starter')).toBe(true);
        expect(isStackTemplateId('unknown-stack')).toBe(false);
    });

    it('returns stack metadata for .NET starter', () => {
        const stack = getStackTemplate('dotnet-razor-starter');
        expect(stack.runtime).toBe('dotnet-razor');
        expect(stack.supportedDatabases).toContain('mongodb');
    });
});
