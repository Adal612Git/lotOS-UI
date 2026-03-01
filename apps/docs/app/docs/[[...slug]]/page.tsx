/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { source } from '../../../source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';

type DocHeroProfile = {
  sectionLabel: string;
  heading: string;
  summary: string;
  nextHref: string;
  nextLabel: string;
  proof: string;
  command?: string;
};

function getDocHeroProfile(slug?: string[]): DocHeroProfile {
  const key = slug?.join('/') ?? 'index';

  if (key === 'installation') {
    return {
      sectionLabel: 'Production Setup',
      heading: 'Install the official React arm first.',
      summary: 'Start with the stable surface, then expand into adapters and desktop tracks later.',
      nextHref: '/docs/components/button',
      nextLabel: 'First component',
      proof: 'React stable',
      command: 'pnpm add @lotosui/claude-arm',
    };
  }

  if (key === 'multi-runtime') {
    return {
      sectionLabel: 'Expansion Map',
      heading: 'Keep one visual language across runtime boundaries.',
      summary: 'React stays stable while backend and desktop tracks expose explicit alpha and prototype states.',
      nextHref: '/docs/architecture',
      nextLabel: 'Architecture',
      proof: 'Runtime matrix',
    };
  }

  if (key === 'architecture') {
    return {
      sectionLabel: 'System Model',
      heading: 'Contracts first. Renderers second.',
      summary: 'The docs should feel like the product architecture: layered, deliberate, and audit-friendly.',
      nextHref: '/docs/ai-integration',
      nextLabel: 'AI integration',
      proof: 'Monorepo contract',
    };
  }

  if (key === 'ai-integration') {
    return {
      sectionLabel: 'Agent Surface',
      heading: 'Expose rules your agents can actually follow.',
      summary: 'MCP, schemas, and runtime metadata narrow the gap between prompt intent and valid output.',
      nextHref: '/docs/mcp-spec',
      nextLabel: 'MCP spec',
      proof: 'MCP active',
    };
  }

  if (key.startsWith('components/')) {
    const componentName = key.split('/')[1] ?? 'component';
    return {
      sectionLabel: 'Component Spec',
      heading: `${componentName.replace(/-/g, ' ')} with production discipline.`,
      summary: 'Use this as a contract page: clear states, direct examples, and no filler.',
      nextHref: '/docs/installation',
      nextLabel: 'Install first',
      proof: '27 React components',
    };
  }

  return {
    sectionLabel: 'Docs Surface',
    heading: 'Use the docs like a control surface, not a note dump.',
    summary: 'Every page should point to the next production-safe move.',
    nextHref: '/docs/installation',
    nextLabel: 'Production install',
    proof: 'LotOS dogfood',
  };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as any;
  const MDX = data.body;
  const hero = getDocHeroProfile(params.slug);
  const pageDescription =
    typeof page.data.description === 'string' ? page.data.description : '';

  return (
    <DocsPage
      toc={data.toc}
      full={data.full ?? false}
      className="lotos-doc-page"
      tableOfContent={{
        header: (
          <div className="lotos-toc-box">
            <span className="lotos-toc-box__eyebrow">Flow</span>
            <strong>This page</strong>
            <p>Read top to bottom, then move to the next production-safe step.</p>
          </div>
        ),
        footer: (
          <div className="lotos-toc-box lotos-toc-box--footer">
            <span className="lotos-toc-box__eyebrow">Next</span>
            <Link href={hero.nextHref}>{hero.nextLabel}</Link>
          </div>
        ),
      }}
    >
      <section className="lotos-doc-hero">
        <p className="lotos-doc-hero__eyebrow">{hero.sectionLabel}</p>
        <div className="lotos-doc-hero__badges" aria-label="Page status">
          <span className="lotos-doc-chip lotos-doc-chip--stable">{hero.proof}</span>
          <span className="lotos-doc-chip lotos-doc-chip--active">Built with LotOS style</span>
          <span className="lotos-doc-chip lotos-doc-chip--muted">{page.data.title}</span>
        </div>
        <DocsTitle className="lotos-doc-title">{hero.heading}</DocsTitle>
        <DocsDescription className="lotos-doc-description">
          {hero.summary} {pageDescription}
        </DocsDescription>
        <div className="lotos-doc-actions">
          <Link href="/docs/installation" className="lotos-doc-button lotos-doc-button--primary">
            Production install
          </Link>
          <Link href={hero.nextHref} className="lotos-doc-button lotos-doc-button--ghost">
            {hero.nextLabel}
          </Link>
          <Link href="/docs/multi-runtime" className="lotos-doc-button lotos-doc-button--ghost">
            Runtime guide
          </Link>
        </div>
        <div className="lotos-doc-rail">
          <article>
            <span>Official path</span>
            <strong>React first</strong>
            <p>Stable entry point before adapters, desktop shells, or private delivery layers.</p>
          </article>
          <article>
            <span>Trust signal</span>
            <strong>Exact states</strong>
            <p>Docs expose what is stable, alpha, or prototype instead of inflating readiness.</p>
          </article>
          <article>
            <span>Momentum</span>
            <strong>Next move</strong>
            <p>Every page pushes toward the next useful step instead of ending as passive reference.</p>
          </article>
        </div>
        {hero.command ? (
          <div className="lotos-command-strip" aria-label="Primary command">
            <span>Primary command</span>
            <code>{hero.command}</code>
          </div>
        ) : null}
      </section>
      <DocsBody className="lotos-doc-body">
        <MDX components={{ ...(defaultMdxComponents as any) }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: typeof page.data.description === 'string' ? page.data.description : undefined,
  };
}
