'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  CommandShell,
  DataGridPro,
  LotOSSelect,
  ReportSurface,
  type DataGridColumn,
  type LotOSSelectOption,
  type ReportCard,
} from '../../product-surface';
import { trackProductEvent } from '../../../lib/product-analytics';

type StudentRisk = 'Low' | 'Watch' | 'High';
type StudentStatus = 'On track' | 'Needs review' | 'Intervention';

type Student = {
  id: string;
  name: string;
  group: string;
  average: number;
  attendance: number;
  subject: string;
  risk: StudentRisk;
  status: StudentStatus;
  guardian: string;
  lastAction: string;
};

type StudentForm = {
  id: string;
  name: string;
  group: string;
  average: string;
  attendance: string;
  subject: string;
  risk: StudentRisk;
  status: StudentStatus;
  guardian: string;
  lastAction: string;
};

const initialStudents: Student[] = [
  { id: 'ALU-1042', name: 'Mariana Lopez', group: '3A', average: 94, attendance: 97, subject: 'Mathematics', risk: 'Low', status: 'On track', guardian: 'Family contact A', lastAction: 'Portfolio reviewed' },
  { id: 'ALU-1088', name: 'Victor Salas', group: '3B', average: 87, attendance: 91, subject: 'Science', risk: 'Watch', status: 'Needs review', guardian: 'Family contact B', lastAction: 'Tutor assigned' },
  { id: 'ALU-1117', name: 'Diana Reyes', group: '2A', average: 91, attendance: 95, subject: 'Language', risk: 'Low', status: 'On track', guardian: 'Family contact C', lastAction: 'Reading plan closed' },
  { id: 'ALU-1194', name: 'Carlos Medina', group: '2C', average: 76, attendance: 82, subject: 'History', risk: 'High', status: 'Intervention', guardian: 'Family contact D', lastAction: 'Parent call pending' },
  { id: 'ALU-1210', name: 'Ana Duarte', group: '1B', average: 89, attendance: 93, subject: 'Mathematics', risk: 'Low', status: 'On track', guardian: 'Family contact E', lastAction: 'Lab project scored' },
  { id: 'ALU-1322', name: 'Mateo Rivera', group: '1A', average: 81, attendance: 87, subject: 'Science', risk: 'Watch', status: 'Needs review', guardian: 'Family contact F', lastAction: 'Attendance note added' },
  { id: 'ALU-1364', name: 'Lucia Prado', group: '2B', average: 96, attendance: 98, subject: 'Language', risk: 'Low', status: 'On track', guardian: 'Family contact G', lastAction: 'Top performer badge' },
];

const groupOptions: LotOSSelectOption[] = [
  { label: 'All groups', value: 'all' },
  { label: '1A', value: '1A' },
  { label: '1B', value: '1B' },
  { label: '2A', value: '2A' },
  { label: '2B', value: '2B' },
  { label: '2C', value: '2C' },
  { label: '3A', value: '3A' },
  { label: '3B', value: '3B' },
];

const riskOptions: LotOSSelectOption[] = [
  { label: 'All risk', value: 'all' },
  { label: 'Low', value: 'Low' },
  { label: 'Watch', value: 'Watch' },
  { label: 'High', value: 'High' },
];

const subjectOptions: LotOSSelectOption[] = [
  { label: 'All subjects', value: 'all' },
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Science', value: 'Science' },
  { label: 'History', value: 'History' },
  { label: 'Language', value: 'Language' },
];

const statusOptions: LotOSSelectOption[] = [
  { label: 'On track', value: 'On track' },
  { label: 'Needs review', value: 'Needs review' },
  { label: 'Intervention', value: 'Intervention' },
];

const storageKey = 'lotos-student-control-demo-v2';

function riskTone(risk: StudentRisk) {
  if (risk === 'High') return 'danger';
  if (risk === 'Watch') return 'warn';
  return 'good';
}

function formFromStudent(student?: Student): StudentForm {
  if (!student) {
    return {
      id: `ALU-${Math.floor(1400 + Math.random() * 500)}`,
      name: '',
      group: '1A',
      average: '86',
      attendance: '92',
      subject: 'Mathematics',
      risk: 'Low',
      status: 'On track',
      guardian: 'Family contact',
      lastAction: 'New record created',
    };
  }

  return {
    ...student,
    average: String(student.average),
    attendance: String(student.attendance),
  };
}

function toStudent(form: StudentForm): Student {
  const average = Math.max(0, Math.min(100, Number.parseInt(form.average, 10) || 0));
  const attendance = Math.max(0, Math.min(100, Number.parseInt(form.attendance, 10) || 0));
  return {
    ...form,
    average,
    attendance,
  };
}

export function StudentControlClient() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [groupFilter, setGroupFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [studentForm, setStudentForm] = useState<StudentForm | null>(null);
  const [gradeForm, setGradeForm] = useState<Student | null>(null);
  const [notice, setNotice] = useState('Local QA mode. Changes stay in this browser.');

  useEffect(() => {
    trackProductEvent('demo_student_control_opened');
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Student[];
      if (Array.isArray(parsed) && parsed.length > 0) setStudents(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(students));
  }, [students]);

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const groupOk = groupFilter === 'all' || student.group === groupFilter;
        const riskOk = riskFilter === 'all' || student.risk === riskFilter;
        const subjectOk = subjectFilter === 'all' || student.subject === subjectFilter;
        return groupOk && riskOk && subjectOk;
      }),
    [groupFilter, riskFilter, students, subjectFilter],
  );

  const metrics = useMemo(() => {
    const count = students.length || 1;
    const average = students.reduce((sum, student) => sum + student.average, 0) / count;
    const attendance = students.reduce((sum, student) => sum + student.attendance, 0) / count;
    const riskCases = students.filter((student) => student.risk !== 'Low').length;
    const urgent = students.filter((student) => student.risk === 'High').length;
    return {
      active: students.length,
      average: Number(average.toFixed(1)),
      attendance: Number(attendance.toFixed(1)),
      riskCases,
      urgent,
    };
  }, [students]);

  const subjectStats = useMemo(
    () =>
      subjectOptions
        .filter((option) => option.value !== 'all')
        .map((option) => {
          const scoped = students.filter((student) => student.subject === option.value);
          const count = scoped.length || 1;
          const average = scoped.reduce((sum, student) => sum + student.average, 0) / count;
          const attendance = scoped.reduce((sum, student) => sum + student.attendance, 0) / count;
          return {
            name: option.label,
            average: Number(average.toFixed(1)),
            attendance: Number(attendance.toFixed(1)),
            count: scoped.length,
          };
        }),
    [students],
  );

  const topStudents = [...students].sort((a, b) => b.average - a.average).slice(0, 4);
  const riskStudents = students.filter((student) => student.risk !== 'Low').sort((a, b) => a.average - b.average).slice(0, 4);

  const reportCards: ReportCard[] = [
    {
      id: 'attendance',
      title: 'Attendance health',
      summary: 'Average attendance across the active academic roster.',
      kpi: `${metrics.attendance}%`,
      trend: metrics.attendance >= 90 ? '+3.4 pts' : '-1.8 pts',
      confidence: metrics.attendance >= 90 ? 'High' : 'Medium',
      threshold: metrics.attendance,
      tone: metrics.attendance >= 90 ? 'good' : 'watch',
      sparkline: [78, 82, 84, 88, metrics.attendance, metrics.attendance + 2, metrics.attendance],
      recommendation: metrics.attendance >= 90 ? 'Keep weekly rhythm and publish the attendance proof in parent summaries.' : 'Open a follow-up queue for groups below 88 percent attendance.',
    },
    {
      id: 'performance',
      title: 'Academic performance',
      summary: 'Average grade after local create, edit, delete, and grade updates.',
      kpi: String(metrics.average),
      trend: metrics.average >= 86 ? '+2.8 pts' : '-2.1 pts',
      confidence: metrics.average >= 86 ? 'High' : 'Medium',
      threshold: metrics.average,
      tone: metrics.average >= 86 ? 'good' : 'watch',
      sparkline: [72, 76, 80, 84, metrics.average, metrics.average + 1, metrics.average],
      recommendation: metrics.average >= 86 ? 'Promote this as the baseline flagship demo for academic operations.' : 'Use subject intervention cards before presenting the surface to buyers.',
    },
    {
      id: 'risk',
      title: 'Risk concentration',
      summary: 'Students in Watch or High state that need action.',
      kpi: String(metrics.riskCases),
      trend: `${metrics.urgent} urgent`,
      confidence: metrics.urgent > 0 ? 'Medium' : 'High',
      threshold: Math.max(0, 100 - metrics.riskCases * 12),
      tone: metrics.urgent > 0 ? 'risk' : 'good',
      sparkline: [44, 38, 32, 28, 24, 20, Math.max(10, 40 - metrics.riskCases * 4)],
      recommendation: metrics.urgent > 0 ? 'Schedule intervention review and export the filtered grid for coordinators.' : 'Keep watchlist small and use ReportSurface for weekly summary.',
    },
  ];

  const columns: DataGridColumn<Student>[] = [
    {
      id: 'id',
      header: 'ID',
      accessor: 'id',
      sortable: true,
      hideOnMobile: true,
      width: '94px',
    },
    {
      id: 'name',
      header: 'Student',
      accessor: 'name',
      sortable: true,
      cell: (student) => (
        <span>
          <strong style={{ display: 'block', color: 'var(--surface-ink)' }}>{student.name}</strong>
          <small style={{ color: 'var(--surface-muted)' }}>{student.guardian}</small>
        </span>
      ),
    },
    {
      id: 'group',
      header: 'Group',
      accessor: 'group',
      sortable: true,
      filterOptions: groupOptions.filter((option) => option.value !== 'all'),
    },
    {
      id: 'subject',
      header: 'Subject',
      accessor: 'subject',
      sortable: true,
      filterOptions: subjectOptions.filter((option) => option.value !== 'all'),
    },
    {
      id: 'average',
      header: 'Avg',
      accessor: 'average',
      sortable: true,
      align: 'right',
      value: (student) => student.average,
      cell: (student) => <strong>{student.average}</strong>,
    },
    {
      id: 'attendance',
      header: 'Attend',
      accessor: 'attendance',
      sortable: true,
      align: 'right',
      value: (student) => student.attendance,
      cell: (student) => `${student.attendance}%`,
    },
    {
      id: 'risk',
      header: 'Risk',
      accessor: 'risk',
      sortable: true,
      filterOptions: riskOptions.filter((option) => option.value !== 'all'),
      cell: (student) => (
        <span className="lotos-badge" data-tone={riskTone(student.risk)}>
          {student.risk}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      hideOnMobile: true,
    },
  ];

  function saveStudent() {
    if (!studentForm) return;
    const next = toStudent(studentForm);
    setStudents((current) => {
      const exists = current.some((student) => student.id === next.id);
      if (exists) return current.map((student) => (student.id === next.id ? next : student));
      return [next, ...current];
    });
    setNotice(`${next.name || next.id} saved in local QA state.`);
    setStudentForm(null);
  }

  function deleteStudent(row: Student) {
    setStudents((current) => current.filter((student) => student.id !== row.id));
    setNotice(`${row.name} removed from this browser session.`);
  }

  function saveGrade() {
    if (!gradeForm) return;
    setStudents((current) =>
      current.map((student) => (student.id === gradeForm.id ? { ...student, average: gradeForm.average, attendance: gradeForm.attendance, risk: gradeForm.risk, status: gradeForm.status, lastAction: 'Grade review updated' } : student)),
    );
    setNotice(`Grade review updated for ${gradeForm.name}.`);
    setGradeForm(null);
  }

  return (
    <main className="student-product-demo lotos-signature lotos-theme-academic">
      <header className="student-product-header">
        <div className="student-product-brand">
          <span className="student-product-mark" />
          LotOS Student Control
        </div>
        <nav className="student-product-nav">
          <Link href="/demo">All demos</Link>
          <Link href="/demo/components">Components</Link>
          <Link href="/free">Free</Link>
          <Link href="/claim">Claim</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/">Home</Link>
        </nav>
      </header>

      <div className="student-product-body">
        <section className="student-product-hero">
          <div className="student-product-hero-copy">
            <p className="student-product-kicker">Student Control: flagship product surface</p>
            <span className="lotos-badge" data-tone="info">Built with LotOS Product Surfaces</span>
            <h1>Student Control is the proof that LotOS sells finished surfaces.</h1>
            <p className="student-product-lead">
              A generated CRUD becomes a client-ready school system with CommandShell, DataGridPro, custom filters,
              report cards, local actions, and a before/after story buyers can understand fast.
            </p>
            <div className="student-product-actions">
              <a className="lotos-btn lotos-btn--primary" href="#surface">
                Open product surface
              </a>
              <a className="lotos-btn" href="#before-after">
                View before/after
              </a>
              <Link className="lotos-btn" href="/demo/components">
                Component catalog
              </Link>
            </div>
          </div>
          <aside className="student-product-proof">
            <div className="student-product-switch" aria-label="Before and after view">
              <button type="button" data-active={mode === 'before'} onClick={() => setMode('before')}>
                Before
              </button>
              <button type="button" data-active={mode === 'after'} onClick={() => setMode('after')}>
                After
              </button>
            </div>
            <div className="student-product-proof-grid">
              <div className="student-product-proof-card">
                <strong>{metrics.active}</strong>
                <span>Local student records with create, edit, delete, and grade review actions.</span>
              </div>
              <div className="student-product-proof-card">
                <strong>{metrics.attendance}%</strong>
                <span>Attendance and average grade recompute as the QA tester changes data.</span>
              </div>
              <div className="student-product-proof-card">
                <strong>{metrics.riskCases}</strong>
                <span>Watchlist cases are visible in grid filters, reports, and side panels.</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="student-product-before" id="before-after" hidden={mode === 'after'}>
          <div className="student-product-before-copy">
            <p className="student-product-section-kicker">Before: generated output</p>
            <h2>It works, but it still smells like a prototype.</h2>
            <p>
              This is the arena LotOS should escape: raw fields, unclear status, no operational hierarchy,
              and no report surface for a buyer to believe in.
            </p>
          </div>
          <div className="student-product-raw-window">
            <h3>Student list</h3>
            <input placeholder="search" />
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mariana</td>
                  <td>94</td>
                  <td>ok</td>
                </tr>
                <tr>
                  <td>Carlos</td>
                  <td>76</td>
                  <td>bad</td>
                </tr>
              </tbody>
            </table>
            <button>Export</button>
          </div>
        </section>

        <section id="surface" hidden={mode === 'before'}>
          <CommandShell
            productName="Student Control"
            subtitle="Academic operations suite"
            title="Academic command surface"
            description={notice}
            breadcrumbs={['Demo', 'Student Control', 'After']}
            theme="academic"
            activeItemId="dashboard"
            navItems={[
              { id: 'dashboard', label: 'Dashboard', icon: '01', badge: 'Live' },
              { id: 'students', label: 'Students', icon: '02', badge: String(students.length) },
              { id: 'reports', label: 'Reports', icon: '03' },
              { id: 'risk', label: 'Risk review', icon: '04', badge: String(metrics.riskCases) },
            ]}
            workspaces={[
              { label: 'Cycle 2026', value: 'cycle-2026', description: 'Current academic cycle' },
              { label: 'Admissions QA', value: 'admissions-qa', description: 'Preview workspace' },
            ]}
            defaultWorkspace="cycle-2026"
            user={{ name: 'QA Reviewer', role: 'Full Signature QA', initials: 'QA' }}
            quickActions={[
              { id: 'new-student', label: 'New student', icon: '+', description: 'Create a local record', onSelect: () => setStudentForm(formFromStudent()) },
              { id: 'export-view', label: 'Export registry', icon: 'CSV', description: 'Use DataGridPro CSV export' },
              { id: 'risk-review', label: 'Risk review', icon: 'R', description: `${metrics.riskCases} active cases` },
            ]}
            activities={[
              { label: 'QA action', body: notice },
              { label: 'Coverage', body: 'Grid, filters, modals, reports, and mobile cards are active.' },
            ]}
            actions={
              <button className="lotos-btn lotos-btn--primary" type="button" onClick={() => setStudentForm(formFromStudent())}>
                New student
              </button>
            }
          >
            <div className="student-product-shell-grid">
              <div className="student-product-kpis">
                {[
                  ['Active students', metrics.active, '+ local CRUD'],
                  ['Attendance', `${metrics.attendance}%`, '+ live average'],
                  ['Average grade', metrics.average, '+ recomputed'],
                  ['Risk cases', metrics.riskCases, `${metrics.urgent} urgent`],
                ].map(([label, value, meta]) => (
                  <article key={label} className="student-product-kpi">
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{meta}</small>
                  </article>
                ))}
              </div>

              <div className="student-product-workspace">
                <div className="student-product-panel">
                  <div className="student-product-panel-head">
                    <div>
                      <p className="student-product-section-kicker">Registry powered by DataGridPro</p>
                      <h2>Students, filters, density, actions, export.</h2>
                      <p>Search, sort, filter, export, edit, grade review, delete, and mobile card mode in one surface.</p>
                    </div>
                  </div>
                  <div className="student-product-filter-row">
                    <LotOSSelect label="Group" value={groupFilter} options={groupOptions} onChange={setGroupFilter} />
                    <LotOSSelect label="Risk" value={riskFilter} options={riskOptions} onChange={setRiskFilter} />
                    <LotOSSelect label="Subject" value={subjectFilter} options={subjectOptions} onChange={setSubjectFilter} />
                  </div>
                  <DataGridPro
                    title="Student registry"
                    rows={filteredStudents}
                    columns={columns}
                    getRowId={(student) => student.id}
                    searchPlaceholder="Search by student, group, subject, status..."
                    csvFilename="student-control-registry.csv"
                    emptyTitle="No students match this view"
                    emptyDescription="Clear filters or create a local record for this QA session."
                    initialDensity="compact"
                    rowActions={[
                      { label: 'Edit', tone: 'primary', onClick: (student) => setStudentForm(formFromStudent(student)) },
                      { label: 'Grade', onClick: (student) => setGradeForm(student) },
                      { label: 'Delete', tone: 'danger', onClick: deleteStudent },
                    ]}
                    bulkActions={[
                      {
                        label: 'Mark reviewed',
                        onClick: (rows) => {
                          setNotice(`${rows.length} selected records marked reviewed.`);
                        },
                      },
                    ]}
                  />
                </div>

                <aside className="student-product-panel">
                  <div className="student-product-panel-head">
                    <div>
                      <p className="student-product-section-kicker">Academic signal</p>
                      <h2>Subjects and watchlist</h2>
                    </div>
                  </div>
                  <div className="student-product-subjects">
                    {subjectStats.map((subject) => (
                      <article key={subject.name} className="student-product-subject-card">
                        <div>
                          <h4>{subject.name}</h4>
                          <span className="lotos-badge" data-tone={subject.average >= 88 ? 'good' : subject.average >= 82 ? 'warn' : 'danger'}>
                            {subject.average}
                          </span>
                        </div>
                        <div className="student-product-progress" aria-hidden="true">
                          <span style={{ width: `${subject.attendance}%` }} />
                        </div>
                        <p>
                          {subject.count} records. {subject.attendance}% attendance coverage.
                        </p>
                      </article>
                    ))}
                  </div>
                  <div className="student-product-top-list">
                    <h3>Risk queue</h3>
                    {riskStudents.length === 0 ? (
                      <p style={{ color: 'rgba(244, 251, 255, 0.58)', margin: 0 }}>No active risk cases.</p>
                    ) : (
                      riskStudents.map((student, index) => (
                        <article key={student.id}>
                          <span className="student-product-rank">{index + 1}</span>
                          <div>
                            <strong>{student.name}</strong>
                            <span>{student.lastAction}</span>
                          </div>
                          <span className="lotos-badge" data-tone={riskTone(student.risk)}>
                            {student.risk}
                          </span>
                        </article>
                      ))
                    )}
                  </div>
                  <div className="student-product-top-list">
                    <h3>Top performers</h3>
                    {topStudents.map((student, index) => (
                      <article key={student.id}>
                        <span className="student-product-rank">{index + 1}</span>
                        <div>
                          <strong>{student.name}</strong>
                          <span>
                            {student.group} - {student.subject}
                          </span>
                        </div>
                        <span className="lotos-badge" data-tone="good">
                          {student.average}
                        </span>
                      </article>
                    ))}
                  </div>
                </aside>
              </div>

              <ReportSurface
                title="Academic ReportSurface"
                summary="Report cards turn local data into a buyer-facing decision surface: KPI, trend, confidence, threshold, and recommendation."
                reports={reportCards}
                footerTitle="Export and print friendly"
                footerBody="The print action keeps this surface useful for weekly summaries, parent meetings, and executive demos."
              />

              <section className="student-product-lab">
                <div className="student-product-surface-intro">
                  <p className="student-product-section-kicker">Why this matters</p>
                  <h2>CRUD plus metrics, reports, states, and actions is what makes the screen sellable.</h2>
                  <p>
                    The raw version has data, but no confidence. The LotOS surface adds navigation, state,
                    filtering, action density, reports, and a handoff shape an AI agent can reuse.
                  </p>
                </div>
                <div className="student-product-quality">
                  {[
                    ['CommandShell', 'Navigation, workspace, quick actions, command palette, and activity feed.'],
                    ['DataGridPro', 'Sorting, filters, density, mobile cards, CSV export, row and bulk actions.'],
                    ['ReportSurface', 'KPI cards, thresholds, confidence, recommendations, and print view.'],
                    ['LotOSSelect', 'Custom dropdowns replace the native browser select in the premium path.'],
                  ].map(([title, body]) => (
                    <article key={title}>
                      <i />
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </CommandShell>
        </section>
      </div>

      {studentForm ? (
        <div className="lotos-modal-backdrop" role="dialog" aria-modal="true" aria-label="Student form">
          <div className="lotos-modal lotos-theme-academic">
            <h2>{students.some((student) => student.id === studentForm.id) ? 'Edit student' : 'Create student'}</h2>
            <div className="lotos-modal__grid">
              <label className="lotos-field">
                <span className="lotos-field__label">Student name</span>
                <input className="lotos-input" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} />
              </label>
              <label className="lotos-field">
                <span className="lotos-field__label">ID</span>
                <input className="lotos-input" value={studentForm.id} onChange={(event) => setStudentForm({ ...studentForm, id: event.target.value })} />
              </label>
              <LotOSSelect label="Group" value={studentForm.group} options={groupOptions.filter((option) => option.value !== 'all')} onChange={(group) => setStudentForm({ ...studentForm, group })} />
              <LotOSSelect label="Subject" value={studentForm.subject} options={subjectOptions.filter((option) => option.value !== 'all')} onChange={(subject) => setStudentForm({ ...studentForm, subject })} />
              <label className="lotos-field">
                <span className="lotos-field__label">Average</span>
                <input className="lotos-input" type="number" min="0" max="100" value={studentForm.average} onChange={(event) => setStudentForm({ ...studentForm, average: event.target.value })} />
              </label>
              <label className="lotos-field">
                <span className="lotos-field__label">Attendance</span>
                <input className="lotos-input" type="number" min="0" max="100" value={studentForm.attendance} onChange={(event) => setStudentForm({ ...studentForm, attendance: event.target.value })} />
              </label>
              <LotOSSelect label="Risk" value={studentForm.risk} options={riskOptions.filter((option) => option.value !== 'all')} onChange={(risk) => setStudentForm({ ...studentForm, risk: risk as StudentRisk })} />
              <LotOSSelect label="Status" value={studentForm.status} options={statusOptions} onChange={(status) => setStudentForm({ ...studentForm, status: status as StudentStatus })} />
              <label className="lotos-field" style={{ gridColumn: '1 / -1' }}>
                <span className="lotos-field__label">Last action</span>
                <input className="lotos-input" value={studentForm.lastAction} onChange={(event) => setStudentForm({ ...studentForm, lastAction: event.target.value })} />
              </label>
            </div>
            <div className="lotos-modal__actions">
              <button className="lotos-btn" type="button" onClick={() => setStudentForm(null)}>
                Cancel
              </button>
              <button className="lotos-btn lotos-btn--primary" type="button" onClick={saveStudent}>
                Save student
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {gradeForm ? (
        <div className="lotos-modal-backdrop" role="dialog" aria-modal="true" aria-label="Grade form">
          <div className="lotos-modal lotos-theme-academic">
            <h2>Grade review - {gradeForm.name}</h2>
            <div className="lotos-modal__grid">
              <label className="lotos-field">
                <span className="lotos-field__label">Average</span>
                <input className="lotos-input" type="number" min="0" max="100" value={gradeForm.average} onChange={(event) => setGradeForm({ ...gradeForm, average: Number(event.target.value) })} />
              </label>
              <label className="lotos-field">
                <span className="lotos-field__label">Attendance</span>
                <input className="lotos-input" type="number" min="0" max="100" value={gradeForm.attendance} onChange={(event) => setGradeForm({ ...gradeForm, attendance: Number(event.target.value) })} />
              </label>
              <LotOSSelect label="Risk" value={gradeForm.risk} options={riskOptions.filter((option) => option.value !== 'all')} onChange={(risk) => setGradeForm({ ...gradeForm, risk: risk as StudentRisk })} />
              <LotOSSelect label="Status" value={gradeForm.status} options={statusOptions} onChange={(status) => setGradeForm({ ...gradeForm, status: status as StudentStatus })} />
            </div>
            <div className="lotos-modal__actions">
              <button className="lotos-btn" type="button" onClick={() => setGradeForm(null)}>
                Cancel
              </button>
              <button className="lotos-btn lotos-btn--primary" type="button" onClick={saveGrade}>
                Save grade review
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
