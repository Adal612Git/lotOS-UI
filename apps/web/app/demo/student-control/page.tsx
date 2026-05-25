import Link from 'next/link';
import '../demo.css';

export const metadata = {
  title: 'Student Control - LotOS UI Flagship Demo',
  description:
    'Flagship academic product surface with students, subjects, grades, reports, metrics, and before/after proof.',
};

const students = [
  { id: 'ALU-1042', name: 'Mariana Lopez', group: '3A', avg: 94, risk: 'Low', status: 'On track' },
  { id: 'ALU-1088', name: 'Victor Salas', group: '3B', avg: 87, risk: 'Watch', status: 'Needs review' },
  { id: 'ALU-1117', name: 'Diana Reyes', group: '2A', avg: 91, risk: 'Low', status: 'On track' },
  { id: 'ALU-1194', name: 'Carlos Medina', group: '2C', avg: 76, risk: 'High', status: 'Intervention' },
  { id: 'ALU-1210', name: 'Ana Duarte', group: '1B', avg: 89, risk: 'Low', status: 'On track' },
];

const subjects = [
  { name: 'Mathematics', avg: 86, trend: '+4.2%', coverage: 92 },
  { name: 'Science', avg: 90, trend: '+2.1%', coverage: 88 },
  { name: 'History', avg: 83, trend: '-1.3%', coverage: 79 },
  { name: 'Language', avg: 91, trend: '+5.0%', coverage: 94 },
];

const reports = [
  'At-risk students by group',
  'Monthly attendance summary',
  'Grade distribution by subject',
  'Parent follow-up checklist',
];

function RiskBadge({ risk }: { risk: string }) {
  const tone = risk === 'High' ? 'red' : risk === 'Watch' ? 'amber' : 'green';
  return <span className={`demo-badge ${tone}`}>{risk}</span>;
}

export default function StudentControlDemoPage() {
  return (
    <main className="demo-shell student-demo">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS Student Control
        </div>
        <div className="demo-header-center">
          <span className="demo-badge green">Flagship</span>
          <span className="demo-badge blue">SQLite / Prisma proof</span>
          <span className="demo-badge violet">Product Surface</span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo">All Demos</Link>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </header>

      <div className="demo-body student-body">
        <section className="student-hero">
          <div>
            <p className="demo-section-label">Flagship demo - academic operations</p>
            <h1 className="student-title">Student Control turns a basic generated screen into a client-ready school system.</h1>
            <p className="student-lead">
              This surface shows the complete product promise: records, filters, metrics, report cards,
              grade trends, and operational follow-up in one coherent interface.
            </p>
            <div className="demo-btn-row">
              <a href="#surface" className="demo-btn primary">Open product surface</a>
              <a href="#comparison" className="demo-btn ghost">See before/after</a>
              <Link href="/demo/components" className="demo-btn ghost">Component catalog</Link>
            </div>
          </div>
          <aside className="student-proof-card">
            <span>Proof scope</span>
            <strong>Students + subjects + grades + reports</strong>
            <p>
              Built to demonstrate dense CRUD, academic reporting, and delivery polish without
              asking the buyer to imagine the value from isolated buttons.
            </p>
          </aside>
        </section>

        <section className="student-kpis" aria-label="Academic metrics">
          {[
            ['428', 'Active students', '+18 this month', 'green'],
            ['91.2%', 'Attendance', '+3.4%', 'blue'],
            ['86.7', 'Average grade', '+2.8 pts', 'violet'],
            ['14', 'Risk cases', '6 urgent', 'amber'],
          ].map(([value, label, meta, tone]) => (
            <article key={label} className={`demo-kpi-card ${tone}`}>
              <p className="demo-kpi-label">{label}</p>
              <p className="demo-kpi-value">{value}</p>
              <p className="demo-kpi-meta">{meta}</p>
            </article>
          ))}
        </section>

        <section className="student-layout" id="surface">
          <aside className="student-sidebar">
            <strong>Student Control</strong>
            {['Dashboard', 'Students', 'Subjects', 'Grades', 'Reports', 'Settings'].map((item, index) => (
              <span key={item} className={index === 0 ? 'active' : undefined}>{item}</span>
            ))}
          </aside>

          <div className="student-main-panel">
            <div className="student-toolbar">
              <div>
                <p className="demo-section-label">Academic command surface</p>
                <h2>Live student overview</h2>
              </div>
              <div className="student-filters">
                <span>Cycle 2026</span>
                <span>All groups</span>
                <span>Risk: all</span>
              </div>
            </div>

            <div className="student-content-grid">
              <section className="demo-card">
                <div className="demo-card-head">
                  <p className="demo-card-title">Student registry</p>
                  <span className="demo-badge blue">DataGridPro target</span>
                </div>
                <table className="demo-table student-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Group</th>
                      <th>Avg</th>
                      <th>Risk</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="mono">{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.group}</td>
                        <td>{student.avg}</td>
                        <td><RiskBadge risk={student.risk} /></td>
                        <td>{student.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <aside className="student-report-panel">
                <div className="demo-card">
                  <p className="demo-card-title">Report queue</p>
                  <div className="student-report-list">
                    {reports.map((report, index) => (
                      <div key={report}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{report}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="demo-card">
                  <p className="demo-card-title">Next action</p>
                  <h3 className="student-card-title">Schedule intervention review</h3>
                  <p className="student-card-copy">
                    Four students need follow-up. The surface keeps the operator inside the workflow
                    instead of forcing them to search through separate pages.
                  </p>
                </div>
              </aside>
            </div>

            <section className="student-subject-grid">
              {subjects.map((subject) => (
                <article key={subject.name} className="student-subject-card">
                  <div>
                    <h3>{subject.name}</h3>
                    <span>{subject.trend}</span>
                  </div>
                  <strong>{subject.avg}</strong>
                  <div className="demo-progress-track">
                    <div className="demo-progress-fill blue" style={{ width: `${subject.coverage}%` }} />
                  </div>
                  <p>{subject.coverage}% evaluation coverage</p>
                </article>
              ))}
            </section>
          </div>
        </section>

        <section className="student-comparison" id="comparison">
          <div className="student-before">
            <p className="demo-section-label">Before: generated screen</p>
            <h2>Works, but feels unfinished.</h2>
            <div className="raw-window">
              <div className="raw-row raw-title">Student list</div>
              <div className="raw-row">Name | Grade | Status</div>
              <div className="raw-row">Mariana | 94 | ok</div>
              <div className="raw-row">Carlos | 76 | bad</div>
              <button>Export</button>
            </div>
          </div>
          <div className="student-after">
            <p className="demo-section-label">After: LotOS Product Surface</p>
            <h2>Ready to show, operate, and sell.</h2>
            <ul>
              <li>Clear hierarchy for metrics, registry, reports, and follow-up.</li>
              <li>Designed states for risk, trend, coverage, actions, and empty paths.</li>
              <li>Enough product structure for a client to understand the delivery immediately.</li>
            </ul>
          </div>
        </section>

        <section className="student-quality">
          {[
            ['CRUD density', 'Tables, filters, records, and review workflows.'],
            ['ReportSurface', 'Academic reports with trends and decision context.'],
            ['AI handoff', 'A clear target for agents to generate real screens.'],
            ['Premium signal', 'The demo sells transformation, not component count.'],
          ].map(([title, body]) => (
            <article key={title}>
              <span />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
