import Link from 'next/link';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '../../source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="lotos-nav-brand">
            <span className="lotos-nav-brand__mark" aria-hidden="true" />
            <span className="lotos-nav-brand__text">
              <strong>LotOS UI</strong>
              <small>React-first system</small>
            </span>
          </span>
        ),
        url: '/',
        transparentMode: 'top',
        children: <span className="lotos-nav-status">React stable</span>,
      }}
      containerProps={{
        className: 'lotos-docs-layout-shell',
      }}
      sidebar={{
        defaultOpenLevel: 1,
        banner: (
          <div className="lotos-sidebar-callout">
            <p className="lotos-sidebar-callout__eyebrow">Early access</p>
            <strong>Solo from $149</strong>
            <span>Private acceleration, proof-first delivery, and no fake volume claims.</span>
            <a
              href="https://lotos-ui.vercel.app/pricing"
              className="lotos-sidebar-callout__link"
              target="_blank"
              rel="noreferrer"
            >
              Open pricing
            </a>
          </div>
        ),
        footer: (
          <div className="lotos-sidebar-footer">
            <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <Link href="/docs/installation">Start here</Link>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
