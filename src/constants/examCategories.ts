// Canonical exam taxonomy shared by the admin exam-timetable screen and the
// staff marks-entry screen. `key` is stored as exams.exam_type and `subExams`
// are the conventional exam names (exams.name) — keeping these identical
// across screens is what links admin-created timetables, teacher marks entry,
// and student results to the same exam rows.

export interface ExamCategory {
    key: string;
    title: string;
    icon: any;
    color: string;
    description: string;
    examPrefix: string;
    subExams?: string[];
}

export const EXAM_CATEGORIES: ExamCategory[] = [
    {
        key: 'slip_test',
        title: 'Slip Tests',
        icon: 'document-text',
        color: '#1565C0', // Logo royal blue ribbon
        description: 'Weekly slip tests and unit tests',
        examPrefix: 'ST',
        subExams: ['ST-1', 'ST-2', 'ST-3', 'ST-4', 'ST-5'],
    },
    {
        key: 'fa_results',
        title: 'Formative Assessment',
        icon: 'analytics',
        color: '#1B5E20', // Logo tree green
        description: 'FA-1 to FA-4 Internal Exams',
        examPrefix: 'FA',
        subExams: ['FA-1', 'FA-2', 'FA-3', 'FA-4'],
    },
    {
        key: 'sa_results',
        title: 'Summative Assessment',
        icon: 'school',
        color: '#D4AF37', // Logo gold stars & trim
        description: 'Half-yearly and Annual Exams',
        examPrefix: 'SA',
        subExams: ['SA-1', 'SA-2'],
    },
    {
        key: 'special',
        title: 'Special Exams',
        icon: 'star',
        color: '#D42B2B', // Logo red ring
        description: 'Talent tests and special evaluations',
        examPrefix: 'Special',
        subExams: ['Special-1', 'Special-2'],
    },
    {
        key: 'weekend',
        title: 'Weekend Exams',
        icon: 'calendar',
        color: '#8B1A1A', // Deep maroon ring depth
        description: 'Weekly practice (IIT/NEET)',
        examPrefix: 'W',
        subExams: ['W-1', 'W-2', 'W-3', 'W-4'],
    },
];

/** Look up a category by its exam_type key (falls back to a neutral entry). */
export function examCategoryFor(examType: string): ExamCategory {
    return (
        EXAM_CATEGORIES.find((c) => c.key === examType) || {
            key: examType,
            title: examType,
            icon: 'document-text',
            color: '#64748B',
            description: '',
            examPrefix: examType,
        }
    );
}