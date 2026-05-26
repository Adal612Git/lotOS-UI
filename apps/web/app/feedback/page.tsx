import type { Metadata } from 'next';
import Link from 'next/link';
import { buildRouteMetadata } from '../../lib/seo';

export const metadata: Metadata = buildRouteMetadata({
  title: 'Tester feedback | LotOS UI',
  description: 'Feedback prompts for LotOS UI testers reviewing Foundation, Pro Studio, demos, and promotional access.',
  path: '/feedback',
});

const questions = [
  'Que entendiste que vende LotOS UI?',
  'Que pantalla se sintio mas vendible?',
  'Que se sintio todavia plantilla o demasiado free?',
  'Pagarias Pro Studio? Por que?',
  'Que te bloquearia antes de usarlo en un proyecto real?',
];

export default function FeedbackPage() {
  return (
    <main className="landing feedback-page">
      <header className="top">
        <Link href="/" className="brand">LotOS UI</Link>
        <nav aria-label="Principal">
          <Link href="/free">Free</Link>
          <Link href="/demo/student-control">Demo</Link>
          <Link href="/claim">Claim</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <section className="feedback-hero">
        <p className="eyebrow">Tester feedback</p>
        <h1>Ayuda a validar si LotOS UI ya se siente vendible.</h1>
        <p>
          Esta ruta no guarda PII ni envia datos a un proveedor. Usa estas preguntas para mandar feedback por el canal
          acordado con el owner o desde soporte.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" href="/support">Enviar feedback</Link>
          <Link className="btn ghost" href="/account/access">Ver mi acceso</Link>
        </div>
      </section>

      <section className="feedback-question-grid">
        {questions.map((question, index) => (
          <article key={question}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{question}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
