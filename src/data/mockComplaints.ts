export interface Complaint {
    id: string;
    type: 'DISCIPLINARY' | 'FACILITY'; // Disciplinary = against student, Facility = infrastructure issues
    severity: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'Resolved' | 'Escalated';
    title: string;
    description: string;
    date: string;

    // Who filed it?
    filedBy: string; // e.g., "Mrs. Sarah Jenkins" or "Rahul Reddy"
    reporterRole: 'STAFF' | 'STUDENT';

    // Who/What is it about?
    target: string; // e.g., "Rahul Reddy (Class 10-A)" or "Canteen"
    targetID?: string; // e.g. Roll No for students

    // Visual helpers
    icon?: string;
    color?: string;
}

export const MOCK_COMPLAINTS: Complaint[] = [
    // STUDENT REPORTS (Filed by Staff against Student)
    {
        id: '1',
        type: 'DISCIPLINARY',
        severity: 'High',
        status: 'Pending',
        title: 'Disruptive Behaviour',
        description: 'Repeated talking during class despite multiple warnings.',
        date: 'Today • 10:30 AM',
        filedBy: 'Mrs. Sarah Jenkins',
        reporterRole: 'STAFF',
        target: 'Rahul Reddy',
        targetID: '24RR123',
        icon: 'alert-circle',
        color: '#EF4444' // Red
    },
    {
        id: '2',
        type: 'DISCIPLINARY',
        severity: 'Medium',
        status: 'Escalated',
        title: 'Assignment Not Submitted',
        description: 'Missed assignment submission for the third time.',
        date: 'Yesterday • 2:15 PM',
        filedBy: 'Mr. Robert Smith',
        reporterRole: 'STAFF',
        target: 'Rahul Reddy',
        targetID: '24RR123',
        icon: 'document-text',
        color: '#F59E0B' // Amber
    },

    // FACILITY REPORTS (Filed by Student/Staff about School)
    {
        id: '3',
        type: 'FACILITY',
        severity: 'Medium',
        status: 'Resolved',
        title: 'Canteen Hygiene Issue',
        description: 'Found unclean plates in the serving area.',
        date: '2 Days Ago',
        filedBy: 'Rahul Reddy',
        reporterRole: 'STUDENT',
        target: 'Canteen',
        icon: 'restaurant',
        color: '#8B5CF6' // Violet
    },
    {
        id: '4',
        type: 'FACILITY',
        severity: 'Low',
        status: 'Pending',
        title: 'Projector Malfunction',
        description: 'Smart board in Lab 2 is flickering.',
        date: '3 Days Ago',
        filedBy: 'Mr. Robert Smith',
        reporterRole: 'STAFF',
        target: 'Computer Lab 2',
        icon: 'tv',
        color: '#3B82F6' // Blue
    }
];
