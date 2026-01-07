
export type Role =
    | 'admin'
    | 'staff'
    | 'teacher'
    | 'student'
    | 'parent'
    | 'accountant';

// Extensibility for existing app logic
export type AppRole = Role | 'staff';

export interface User {
    uid: string;
    id?: string; // Often aliased
    role: AppRole;
    name: string;
    phone?: string;
    email?: string;
    schoolId?: string;
    classId?: string; // For students
    rollNo?: string; // For students
    admissionNo?: string; // For students
    photoUrl?: string; // Common
    createdAt?: any; // Made optional
}

export interface Student {
    id: string;
    name: string;
    classId: string;
    rollNo: string;
    parentId?: string;
    dob?: string;
    email?: string;
    phone?: string;
    createdAt?: any; // Made optional
}

export interface Attendance {
    id: string;
    studentId: string;
    date: string; // YYYY-MM-DD
    status: 'present' | 'absent' | 'unmarked';
}

export interface Fee {
    id: string;
    studentId: string;
    amount: number;
    status: 'paid' | 'due' | 'overdue';
    dueDate?: string;
    type?: string;
}

export interface Complaint {
    id: string;
    raisedBy: string;
    message: string;
    status: 'open' | 'resolved';
    createdAt?: any; // Made optional
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
    targetAudience?: Role[]; // e.g. ['student', 'parent']
}
