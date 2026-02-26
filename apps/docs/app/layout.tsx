import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'LotOS UI — Docs',
    template: '%s | LotOS UI',
  },
  description:
    'Design and functional contracts for AI-assisted UI teams. React stable, multi-runtime expansion with explicit status.',
  metadataBase: new URL('https://lotos-ui.dev'),
  openGraph: {
    title: 'LotOS UI',
    description: 'Design + functional contracts for AI-assisted UI teams.',
    url: 'https://lotos-ui.dev',
    siteName: 'LotOS UI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LotOS UI',
    description: 'Design + functional contracts for AI-assisted UI teams.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
