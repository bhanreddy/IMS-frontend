import { z } from 'zod';

export const UserSchema = z.object({
    uid: z.string(),
    role: z.enum(['admin', 'teacher', 'student', 'parent', 'accountant', 'staff']),
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    schoolId: z.string().optional(),
    createdAt: z.any().optional(), // Allow any for Firestore Timestamp
});

export const StudentSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    classId: z.string().min(1, "Class is required"),
    rollNo: z.string(),
    parentId: z.string().optional(),
    dob: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    createdAt: z.any().optional(),
});

export const AttendanceSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    date: z.string(), // YYYY-MM-DD
    status: z.enum(['present', 'absent', 'unmarked']),
});

export const FeeSchema = z.object({
    id: z.string(),
    studentId: z.string(),
    amount: z.number().min(0),
    status: z.enum(['paid', 'due', 'overdue']),
    dueDate: z.string().optional(),
    type: z.string().optional(),
});

export const ComplaintSchema = z.object({
    id: z.string(),
    raisedBy: z.string(),
    message: z.string().min(5, "Message must be at least 5 chars"),
    status: z.enum(['open', 'resolved']),
    createdAt: z.any().optional(),
});
