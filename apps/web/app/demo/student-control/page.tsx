import './student-control.css';
import { StudentControlClient } from './student-control-client';

export const metadata = {
  title: 'Student Control - LotOS UI Flagship Demo',
  description:
    'Flagship academic product surface with students, subjects, grades, reports, metrics, DataGridPro, CommandShell, and before/after proof.',
};

export default function StudentControlDemoPage() {
  return <StudentControlClient />;
}
