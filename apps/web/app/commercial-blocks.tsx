import Link from 'next/link';
import type { ReactNode } from 'react';

export function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="card commercial-card">
      <p className="section-label">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="commercial-copy">{children}</div>
    </article>
  );
}

export function InfoTable({
  rows,
}: {
  rows: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="info-table">
      {rows.map((row) => (
        <div key={row.label} className="info-table__row">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CommercialLinkGrid({
  links,
}: {
  links: Array<{ href: string; label: string; external?: boolean }>;
}) {
  return (
    <div className="hero-actions compact">
      {links.map((link) =>
        link.external ? (
          <a
            key={`${link.href}-${link.label}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="btn ghost"
          >
            {link.label}
          </a>
        ) : (
          <Link key={`${link.href}-${link.label}`} href={link.href} className="btn ghost">
            {link.label}
          </Link>
        )
      )}
    </div>
  );
}
