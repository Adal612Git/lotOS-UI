import type { Metadata } from 'next';
import './globals.css';
import './product-surface/signature-v2.css';

export const metadata: Metadata = {
  title: 'LotOS UI - Product surfaces for AI-generated screens',
  description:
    'LotOS UI turns AI-generated screens into product-ready interfaces with premium dashboards, CRUDs, reports and product surfaces.',
  keywords: [
    'react',
    'ui library',
    'design system',
    'components',
    'mcp',
    'ai',
    'desktop ui',
    'multi runtime',
    'product surfaces',
    'lotos',
  ],
  openGraph: {
    title: 'LotOS UI',
    description:
      'Turn AI-generated screens into product-ready interfaces with premium dashboards, CRUDs, reports and product surfaces.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'LotOS UI',
    description:
      'Product surfaces for AI-generated screens, dashboards, CRUDs and reports.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
