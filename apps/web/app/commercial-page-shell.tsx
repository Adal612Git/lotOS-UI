import Link from 'next/link';
import type { ReactNode } from 'react';
import './lotos-landing.css';
import { CommercialFooter } from './commercial-footer';
import { commercialPrimaryLinks } from '../lib/commercial-site';

export function CommercialPageShell({
  eyebrow,
  title,
  lead,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="landing pricing-page commercial-shell">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          {commercialPrimaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
          <a href="https://github.com/Adal612Git/lotOS-UI" target="_blank" rel="noreferrer" className="nav-link">
            GitHub
          </a>
        </nav>
      </header>

      <section className="hero compact commercial-hero">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="lead">{lead}</div>
        {actions}
      </section>

      {children}

      <CommercialFooter />
    </main>
  );
}
