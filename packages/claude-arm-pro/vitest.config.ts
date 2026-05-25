import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        name: '@lotos/claude-arm',
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/components/**/*.tsx'],
            exclude: ['src/components/index.ts'],
            thresholds: {
                autoUpdate: false,
                lines: 85,
                functions: 85,
                statements: 85,
                branches: 70,
            },
        },
    },
});
