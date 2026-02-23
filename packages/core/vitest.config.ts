import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: '@lotos/core',
        environment: 'node',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});
