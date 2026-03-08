import Link from 'next/link';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '../../source';
import { LangToggle } from '../lang-toggle';

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
              <small>
                <span className="en-only">React-first system</span>
                <span className="es-only">Sistema React-first</span>
              </small>
            </span>
          </span>
        ),
        url: '/',
        transparentMode: 'top',
        children: (
          <>
            <span className="lotos-nav-status">
              <span className="en-only">React stable</span>
              <span className="es-only">React estable</span>
            </span>
            <LangToggle />
          </>
        ),
      }}
      containerProps={{
        className: 'lotos-docs-layout-shell',
      }}
      sidebar={{
        defaultOpenLevel: 1,
        banner: (
          <div className="lotos-sidebar-callout">
            <p className="lotos-sidebar-callout__eyebrow">
              <span className="en-only">Early access</span>
              <span className="es-only">Acceso temprano</span>
            </p>
            <strong>Solo from $149</strong>
            <span>
              <span className="en-only">Private acceleration, proof-first delivery, and no fake volume claims.</span>
              <span className="es-only">Aceleracion privada, entrega enfocada en prueba y sin claims falsos de volumen.</span>
            </span>
            <a
              href="https://lotos-ui.vercel.app/pricing"
              className="lotos-sidebar-callout__link"
              target="_blank"
              rel="noreferrer"
            >
              <span className="en-only">Open pricing</span>
              <span className="es-only">Abrir precios</span>
            </a>
          </div>
        ),
        footer: (
          <div className="lotos-sidebar-footer">
            <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <Link href="/docs/installation">
              <span className="en-only">Start here</span>
              <span className="es-only">Empieza aqui</span>
            </Link>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
