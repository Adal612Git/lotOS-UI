import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '../..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lotosui/core', '@lotosui/claude-arm', '@lotosui/registry'],
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    '/api/download/[asset]': ['./private-assets/**/*'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias['@lotosui/claude-arm'] = path.join(repoRoot, 'packages/claude-arm/dist/index.js');
    config.resolve.alias['@lotosui/claude-arm/styles.css'] = path.join(repoRoot, 'packages/claude-arm/src/styles.css');
    config.resolve.alias['@lotosui/claude-arm/badge'] = path.join(repoRoot, 'packages/claude-arm/dist/components/badge/badge.js');
    config.resolve.alias['@lotosui/claude-arm/card'] = path.join(repoRoot, 'packages/claude-arm/dist/components/card/card.js');
    config.resolve.alias['@lotosui/claude-arm/stat'] = path.join(repoRoot, 'packages/claude-arm/dist/components/stat/stat.js');
    config.resolve.alias['@lotosui/core'] = path.join(repoRoot, 'packages/core/dist/index.js');
    config.resolve.alias['@lotosui/registry'] = path.join(repoRoot, 'packages/registry/dist/index.js');
    return config;
  },
  turbopack: {
    root: repoRoot,
    resolveAlias: {
      '@lotosui/claude-arm': '../../packages/claude-arm/dist/index.js',
      '@lotosui/claude-arm/styles.css': '../../packages/claude-arm/src/styles.css',
      '@lotosui/claude-arm/badge': '../../packages/claude-arm/dist/components/badge/badge.js',
      '@lotosui/claude-arm/card': '../../packages/claude-arm/dist/components/card/card.js',
      '@lotosui/claude-arm/stat': '../../packages/claude-arm/dist/components/stat/stat.js',
      '@lotosui/core': '../../packages/core/dist/index.js',
      '@lotosui/registry': '../../packages/registry/dist/index.js',
    },
  },
};

export default nextConfig;
