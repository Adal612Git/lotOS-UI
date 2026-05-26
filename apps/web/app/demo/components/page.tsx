import Link from 'next/link';
import '../../demo/demo.css';
import { ComponentsCatalogClient } from './components-catalog-client';

export const metadata = {
  title: 'Component Catalog - LotOS UI Demo',
  description: 'Premium product-surface catalog with real DataGridPro, CommandShell, ReportSurface, and LotOSSelect previews.',
};

export default function ComponentsDemoPage() {
  return (
    <main className="demo-shell lotos-signature lotos-theme-obsidian">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS UI Component Catalog
        </div>
        <div className="demo-header-center">
          <span className="demo-badge green">Stable surfaces</span>
          <span className="demo-badge amber">Honest matrix</span>
          <span className="demo-badge violet">React ready</span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo">All demos</Link>
          <Link href="/demo/student-control">Flagship</Link>
          <Link href="/">Home</Link>
        </nav>
      </header>
      <ComponentsCatalogClient />
    </main>
  );
}
