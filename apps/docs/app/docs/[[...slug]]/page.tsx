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
  sectionLabelEs: string;
  heading: string;
  headingEs: string;
  summary: string;
  summaryEs: string;
  nextHref: string;
  nextLabel: string;
  nextLabelEs: string;
  proof: string;
  proofEs: string;
  command?: string;
};

function getDocHeroProfile(slug?: string[]): DocHeroProfile {
  const key = slug?.join('/') ?? 'index';

  if (key === 'installation') {
    return {
      sectionLabel: 'Production Setup',
      sectionLabelEs: 'Setup de Produccion',
      heading: 'Install the official React arm first.',
      headingEs: 'Instala primero el brazo oficial de React.',
      summary: 'Start with the stable surface, then expand into adapters and desktop tracks later.',
      summaryEs: 'Empieza con la superficie estable y despues expande a adaptadores y rutas desktop.',
      nextHref: '/docs/components/button',
      nextLabel: 'First component',
      nextLabelEs: 'Primer componente',
      proof: 'React stable',
      proofEs: 'React estable',
      command: 'pnpm add @lotosui/claude-arm',
    };
  }

  if (key === 'multi-runtime') {
    return {
      sectionLabel: 'Expansion Map',
      sectionLabelEs: 'Mapa de Expansion',
      heading: 'Keep one visual language across runtime boundaries.',
      headingEs: 'Mantiene un solo lenguaje visual entre runtimes.',
      summary: 'React stays stable while backend and desktop tracks expose explicit alpha and prototype states.',
      summaryEs: 'React sigue estable mientras las rutas backend y desktop muestran estados explicitos alpha y prototype.',
      nextHref: '/docs/architecture',
      nextLabel: 'Architecture',
      nextLabelEs: 'Arquitectura',
      proof: 'Runtime matrix',
      proofEs: 'Matriz de runtimes',
    };
  }

  if (key === 'architecture') {
    return {
      sectionLabel: 'System Model',
      sectionLabelEs: 'Modelo del Sistema',
      heading: 'Contracts first. Renderers second.',
      headingEs: 'Contratos primero. Renderers despues.',
      summary: 'The docs should feel like the product architecture: layered, deliberate, and audit-friendly.',
      summaryEs: 'Los docs deben sentirse como la arquitectura del producto: por capas, deliberada y facil de auditar.',
      nextHref: '/docs/ai-integration',
      nextLabel: 'AI integration',
      nextLabelEs: 'Integracion AI',
      proof: 'Monorepo contract',
      proofEs: 'Contrato del monorepo',
    };
  }

  if (key === 'ai-integration') {
    return {
      sectionLabel: 'Agent Surface',
      sectionLabelEs: 'Superficie para Agentes',
      heading: 'Expose rules your agents can actually follow.',
      headingEs: 'Expone reglas que tus agentes realmente puedan seguir.',
      summary: 'MCP, schemas, and runtime metadata narrow the gap between prompt intent and valid output.',
      summaryEs: 'MCP, schemas y metadata de runtime reducen la brecha entre la intencion del prompt y una salida valida.',
      nextHref: '/docs/mcp-spec',
      nextLabel: 'MCP spec',
      nextLabelEs: 'Especificacion MCP',
      proof: 'MCP active',
      proofEs: 'MCP activo',
    };
  }

  if (key.startsWith('components/')) {
    const componentName = key.split('/')[1] ?? 'component';
    return {
      sectionLabel: 'Component Spec',
      sectionLabelEs: 'Especificacion del Componente',
      heading: `${componentName.replace(/-/g, ' ')} with production discipline.`,
      headingEs: `${componentName.replace(/-/g, ' ')} con disciplina de produccion.`,
      summary: 'Use this as a contract page: clear states, direct examples, and no filler.',
      summaryEs: 'Usa esto como pagina de contrato: estados claros, ejemplos directos y sin relleno.',
      nextHref: '/docs/installation',
      nextLabel: 'Install first',
      nextLabelEs: 'Instala primero',
      proof: '27 React components',
      proofEs: '27 componentes React',
    };
  }

  return {
    sectionLabel: 'Docs Surface',
    sectionLabelEs: 'Superficie de Docs',
    heading: 'Use the docs like a control surface, not a note dump.',
    headingEs: 'Usa los docs como superficie de control, no como deposito de notas.',
    summary: 'Every page should point to the next production-safe move.',
    summaryEs: 'Cada pagina debe apuntar al siguiente movimiento seguro para produccion.',
    nextHref: '/docs/installation',
    nextLabel: 'Production install',
    nextLabelEs: 'Instalacion productiva',
    proof: 'LotOS dogfood',
    proofEs: 'LotOS en uso propio',
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
            <span className="lotos-toc-box__eyebrow">
              <span className="en-only">Flow</span>
              <span className="es-only">Flujo</span>
            </span>
            <strong>
              <span className="en-only">This page</span>
              <span className="es-only">Esta pagina</span>
            </strong>
            <p>
              <span className="en-only">Read top to bottom, then move to the next production-safe step.</span>
              <span className="es-only">Lee de arriba hacia abajo y luego pasa al siguiente paso seguro para produccion.</span>
            </p>
          </div>
        ),
        footer: (
          <div className="lotos-toc-box lotos-toc-box--footer">
            <span className="lotos-toc-box__eyebrow">
              <span className="en-only">Next</span>
              <span className="es-only">Siguiente</span>
            </span>
            <Link href={hero.nextHref}>
              <span className="en-only">{hero.nextLabel}</span>
              <span className="es-only">{hero.nextLabelEs}</span>
            </Link>
          </div>
        ),
      }}
    >
      <section className="lotos-doc-hero">
        <p className="lotos-doc-hero__eyebrow">
          <span className="en-only">{hero.sectionLabel}</span>
          <span className="es-only">{hero.sectionLabelEs}</span>
        </p>
        <div className="lotos-doc-hero__badges" aria-label="Page status">
          <span className="lotos-doc-chip lotos-doc-chip--stable">
            <span className="en-only">{hero.proof}</span>
            <span className="es-only">{hero.proofEs}</span>
          </span>
          <span className="lotos-doc-chip lotos-doc-chip--active">
            <span className="en-only">Built with LotOS style</span>
            <span className="es-only">Hecho con estilo LotOS</span>
          </span>
          <span className="lotos-doc-chip lotos-doc-chip--muted">{page.data.title}</span>
        </div>
        <DocsTitle className="lotos-doc-title">
          <span className="en-only">{hero.heading}</span>
          <span className="es-only">{hero.headingEs}</span>
        </DocsTitle>
        <DocsDescription className="lotos-doc-description">
          <span className="en-only">{hero.summary} {pageDescription}</span>
          <span className="es-only">{hero.summaryEs}</span>
        </DocsDescription>
        <div className="lotos-doc-actions">
          <Link href="/docs/installation" className="lotos-doc-button lotos-doc-button--primary">
            <span className="en-only">Production install</span>
            <span className="es-only">Instalacion productiva</span>
          </Link>
          <Link href={hero.nextHref} className="lotos-doc-button lotos-doc-button--ghost">
            <span className="en-only">{hero.nextLabel}</span>
            <span className="es-only">{hero.nextLabelEs}</span>
          </Link>
          <Link href="/docs/multi-runtime" className="lotos-doc-button lotos-doc-button--ghost">
            <span className="en-only">Runtime guide</span>
            <span className="es-only">Guia de runtimes</span>
          </Link>
        </div>
        <div className="lotos-doc-rail">
          <article>
            <span><span className="en-only">Official path</span><span className="es-only">Ruta oficial</span></span>
            <strong><span className="en-only">React first</span><span className="es-only">React primero</span></strong>
            <p><span className="en-only">Stable entry point before adapters, desktop shells, or private delivery layers.</span><span className="es-only">Punto de entrada estable antes de adaptadores, shells desktop o capas privadas de entrega.</span></p>
          </article>
          <article>
            <span><span className="en-only">Trust signal</span><span className="es-only">Senal de confianza</span></span>
            <strong><span className="en-only">Exact states</span><span className="es-only">Estados exactos</span></strong>
            <p><span className="en-only">Docs expose what is stable, alpha, or prototype instead of inflating readiness.</span><span className="es-only">Los docs exponen que esta estable, alpha o prototype en lugar de inflar madurez.</span></p>
          </article>
          <article>
            <span><span className="en-only">Momentum</span><span className="es-only">Momentum</span></span>
            <strong><span className="en-only">Next move</span><span className="es-only">Siguiente movimiento</span></strong>
            <p><span className="en-only">Every page pushes toward the next useful step instead of ending as passive reference.</span><span className="es-only">Cada pagina empuja hacia el siguiente paso util en lugar de terminar como referencia pasiva.</span></p>
          </article>
        </div>
        <div className="lotos-command-strip" aria-label="Language support note">
          <span><span className="en-only">Language support</span><span className="es-only">Soporte de idioma</span></span>
          <code className="en-only">The shell is bilingual. Deep technical references remain in English while translations are expanded.</code>
          <code className="es-only">La capa de navegacion es bilingue. La referencia tecnica profunda sigue en ingles mientras se amplian las traducciones.</code>
        </div>
        {hero.command ? (
          <div className="lotos-command-strip" aria-label="Primary command">
            <span><span className="en-only">Primary command</span><span className="es-only">Comando principal</span></span>
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
