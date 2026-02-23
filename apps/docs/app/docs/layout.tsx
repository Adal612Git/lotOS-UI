import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '../../source';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.pageTree}
            nav={{
                title: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                        <span style={{ color: '#E94560', fontSize: '1.2rem' }}>⬡</span>
                        LotOS UI
                    </span>
                ),
                url: '/',
            }}
            sidebar={{
                banner: (
                    <div style={{
                        background: 'rgba(233, 69, 96, 0.12)',
                        border: '1px solid rgba(233, 69, 96, 0.25)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        fontSize: '0.8rem',
                        color: '#E94560',
                        textAlign: 'center',
                    }}>
                        🚀 Early Access · Solo $149
                    </div>
                ),
            }}
        >
            {children}
        </DocsLayout>
    );
}
