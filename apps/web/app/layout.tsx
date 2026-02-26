import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NeuroTask — Built with LotOS UI',
  description: 'Interactive demo of @lotosui/claude-arm: 15 accessible React components, WCAG 2.2 AAA, MCP Server integrated, 158 tests passing. Built for AI-first development.',
  keywords: ['react', 'ui library', 'accessibility', 'wcag', 'components', 'lotos', 'mcp', 'ai'],
  openGraph: {
    title: 'NeuroTask × LotOS UI',
    description: '15 accessible React components in action. Built with @lotosui/claude-arm.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
