import type { Metadata } from 'next';

const fallbackSiteUrl = 'https://lotos-ui.vercel.app';

function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
  }

  return fallbackSiteUrl;
}

export function buildRouteMetadata(input: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const siteUrl = getSiteUrl();
  const path = input.path ?? '/';
  const url = new URL(path, siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: 'LotOS UI',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: input.title,
      description: input.description,
    },
  };
}
