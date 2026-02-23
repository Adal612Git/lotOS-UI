import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: '@lotos/sentinel',
        environment: 'node',
        globals: true,
    },
});
