import Link from 'next/link';
import '../../demo/demo.css';
import { OperatorDemoClient } from './operator-demo-client';

export const metadata = {
  title: 'Operator Cockpit - LotOS UI Demo',
  description: 'Operations product surface using CommandShell, DataGridPro, and ReportSurface.',
};

export default function OperatorDemoPage() {
  return (
    <main className="demo-shell lotos-signature lotos-theme-obsidian">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS Operator Cockpit
        </div>
        <div className="demo-header-center">
          <span className="demo-badge red">7 active alerts</span>
          <span className="demo-badge green">CommandShell</span>
          <span className="demo-badge blue">DataGridPro</span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo">All demos</Link>
          <Link href="/demo/student-control">Student Control</Link>
          <Link href="/">Home</Link>
        </nav>
      </header>
      <OperatorDemoClient />
    </main>
  );
}
