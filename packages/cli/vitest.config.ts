import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: '@lotos/cli',
        environment: 'node',
        globals: true,
    },
});
