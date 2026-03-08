import Link from 'next/link';
import { commercialFooterGroups, commercialSite } from '../lib/commercial-site';

export function CommercialFooter() {
  return (
    <footer className="footer commercial-footer">
      <div className="commercial-footer__brand">
        <p>{commercialSite.brandName} | 2026</p>
        <span>Software, acceso digital y assets privados con entrega y soporte visibles.</span>
      </div>
      <div className="commercial-footer__grid">
        {commercialFooterGroups.map((group) => (
          <div key={group.title} className="commercial-footer__column">
            <strong>{group.title}</strong>
            {group.links.map((link) =>
              link.external ? (
                <a key={`${group.title}-${link.label}`} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link key={`${group.title}-${link.label}`} href={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
