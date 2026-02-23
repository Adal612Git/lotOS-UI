import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const docs: any = defineDocs({
    dir: 'content/docs',
});

export default defineConfig();
