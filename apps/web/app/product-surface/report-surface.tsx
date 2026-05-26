'use client';

export type ReportTone = 'good' | 'watch' | 'risk' | 'neutral';

export type ReportCard = {
  id: string;
  title: string;
  summary: string;
  kpi: string;
  trend: string;
  confidence: string;
  threshold: number;
  tone?: ReportTone;
  sparkline?: number[];
  recommendation: string;
};

export type ReportSurfaceProps = {
  title: string;
  summary: string;
  reports: ReportCard[];
  footerTitle?: string;
  footerBody?: string;
  loading?: boolean;
  empty?: boolean;
};

function toneToBadge(tone: ReportTone = 'neutral') {
  if (tone === 'good') return 'good';
  if (tone === 'risk') return 'danger';
  if (tone === 'watch') return 'warn';
  return undefined;
}

export function ReportSurface({
  title,
  summary,
  reports,
  footerTitle,
  footerBody,
  loading,
  empty,
}: ReportSurfaceProps) {
  if (loading) {
    return (
      <section className="lotos-report-surface">
        <div className="lotos-report-surface__header">
          <div>
            <h2>{title}</h2>
            <p>{summary}</p>
          </div>
        </div>
        <div className="lotos-grid-pro__state">
          <strong>Preparing report surface</strong>
          <div className="lotos-grid-pro__skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    );
  }

  if (empty || reports.length === 0) {
    return (
      <section className="lotos-report-surface">
        <div className="lotos-report-surface__header">
          <div>
            <h2>{title}</h2>
            <p>{summary}</p>
          </div>
        </div>
        <div className="lotos-grid-pro__state">
          <strong>No report cards yet</strong>
          <span>Add data to generate recommendations, thresholds, and export-ready summaries.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="lotos-report-surface">
      <div className="lotos-report-surface__header">
        <div>
          <h2>{title}</h2>
          <p>{summary}</p>
        </div>
        <button className="lotos-btn" type="button" onClick={() => window.print()}>
          Print report
        </button>
      </div>
      <div className="lotos-report-surface__grid">
        {reports.map((report) => (
          <article key={report.id} className="lotos-report-card">
            <div className="lotos-report-card__kpi">
              <strong>{report.kpi}</strong>
              <span>{report.trend}</span>
            </div>
            <div>
              <h3>{report.title}</h3>
              <p>{report.summary}</p>
            </div>
            <div className="lotos-report-card__sparkline" aria-label={`${report.title} trend`}>
              {(report.sparkline ?? [34, 48, 42, 58, 64, 72, 76]).map((value, index) => (
                <i key={`${report.id}-${index}`} style={{ height: `${Math.max(12, Math.min(100, value))}%` }} />
              ))}
            </div>
            <div className="lotos-report-card__threshold">
              <span className="lotos-badge" data-tone={toneToBadge(report.tone)}>
                {report.confidence} confidence
              </span>
              <div className="lotos-report-card__track" aria-hidden="true">
                <div className="lotos-report-card__fill" style={{ width: `${Math.max(0, Math.min(100, report.threshold))}%` }} />
              </div>
            </div>
            <div className="lotos-report-card__recommendation">
              <strong>Recommendation: </strong>
              {report.recommendation}
            </div>
          </article>
        ))}
      </div>
      {footerTitle || footerBody ? (
        <div className="lotos-report-surface__footer">
          {footerTitle ? <strong>{footerTitle}</strong> : null}
          {footerBody ? <p>{footerBody}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
