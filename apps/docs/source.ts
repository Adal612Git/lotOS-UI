// source.ts - Fumadocs source loader
// We import directly from generated .source/server.ts output.
import { loader, type Source } from 'fumadocs-core/source';
import { docs } from './.source/server';

type GeneratedDocsSource = {
    toFumadocsSource: () => Source;
};

export const source = loader({
    baseUrl: '/docs',
    source: (docs as GeneratedDocsSource).toFumadocsSource(),
});
