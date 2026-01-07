export interface BaseUser {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'admin' | 'staff' | 'teacher' | 'student' | 'parent' | 'accountant';
    schoolId?: string; // To be removed/ignored but typescript might need it for legacy compat
    createdAt?: any;
    updatedAt?: any;
}

export interface Student extends BaseUser {
    role: 'student';
    firstName: string;
    lastName: string;
    admissionNo: string;
    classId: string;
    section: string;
    rollNo?: string;
    parentName?: string;
    parentPhone?: string;
    dob?: string;
    address?: string;
    isActive: boolean;
}

export interface Staff extends BaseUser {
    role: 'staff' | 'teacher' | 'admin' | 'accountant';
    firstName: string;
    lastName: string;
    employeeId?: string;
    designation?: string;
    department?: string;
    phone?: string;
    classIds?: string[]; // Classes they teach or manage
    isActive: boolean;
}

export interface Class {
    id: string;
    name: string; // e.g. "10"
    section: string; // e.g. "A"
    classTeacherId?: string;
    academicYear: string;
}

export interface Attendance {
    id: string;
    classId: string;
    date: string; // ISO YYYY-MM-DD
    recordedBy: string; // Staff ID
    records: {
        studentId: string;
        status: 'present' | 'absent' | 'late' | 'excused';
        remarks?: string;
    }[];
    createdAt?: any;
}

export interface Fee {
    id: string;
    studentId: string;
    classId: string;
    amount: number;
    dueDate: string;
    type: string; // e.g. "Tuition", "Transport"
    status: 'pending' | 'paid' | 'partial' | 'overdue';
    paidAmount: number;
    transactions?: {
        amount: number;
        date: any;
        method: string;
        transactionId?: string;
    }[];
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    targetRoles: string[]; // ['student', 'staff']
    targetClassIds?: string[]; // Optional specific classes
    authorId: string;
    createdAt?: any;
    expiresAt?: any;
}

export interface Complaint {
    id: string;
    studentId: string;
    title: string;
    description: string;
    status: 'pending' | 'resolved' | 'dismissed';
    priority: 'low' | 'medium' | 'high';
    createdAt?: any;
    updatedAt?: any;
    resolvedBy?: string;
    resolutionNotes?: string;
}
