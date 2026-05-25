import type { ReactNode } from 'react';
import { buildRouteMetadata } from '../../lib/seo';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI Design Lab',
  description: 'Registry-aligned visual directions and theme exploration for LotOS UI product surfaces.',
  path: '/design-lab',
});

export default function DesignLabLayout({ children }: { children: ReactNode }) {
  return children;
}
