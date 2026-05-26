import type { Metadata } from 'next';
import './globals.css';
import './product-surface/signature-v2.css';

export const metadata: Metadata = {
  title: 'LotOS UI - AI-native Multi-runtime UI Platform',
  description:
    'Build production-grade interfaces across React, PHP, Python, Java, .NET, Go, and desktop stacks with MCP contracts, schemas, and guardrails.',
  keywords: [
    'react',
    'ui library',
    'design system',
    'components',
    'mcp',
    'ai',
    'desktop ui',
    'multi runtime',
    'lotos',
  ],
  openGraph: {
    title: 'LotOS UI',
    description:
      'AI-native multi-runtime UI platform with stack and desktop generators.',
    type: 'website',
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
