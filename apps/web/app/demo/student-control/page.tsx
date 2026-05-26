import './student-control.css';
import { StudentControlClient } from './student-control-client';
import { buildRouteMetadata } from '../../../lib/seo';

export const metadata = buildRouteMetadata({
  title: 'Student Control - LotOS UI Flagship Demo',
  description:
    'Flagship academic product surface with students, subjects, grades, reports, metrics, DataGridPro, CommandShell, and before/after proof.',
  path: '/demo/student-control',
});

export default function StudentControlDemoPage() {
  return <StudentControlClient />;
}
