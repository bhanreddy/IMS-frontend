import { db } from '../config/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { Student } from '../types/models';
import { StudentSchema } from '../types/schemas';
import { logError } from '../utils/error';

export const StudentService = {
    getById: async (studentId: string): Promise<Student> => {
        if (!studentId) throw new Error('studentId required');

        try {
            const snap = await getDoc(doc(db, 'students', studentId));
            if (!snap.exists()) throw new Error('Student not found');

            const data = { id: snap.id, ...snap.data() };
            return StudentSchema.parse(data);
        } catch (error) {
            logError('StudentService:getById', error);
            throw error;
        }
    },

    getByClass: async (classId: string): Promise<Student[]> => {
        try {
            const q = query(
                collection(db, 'students'),
                where('classId', '==', classId)
            );

            const snaps = await getDocs(q);
            const students = snaps.docs.map(d => ({
                id: d.id,
                ...d.data(),
            }));

            // Bulk validate? Or filter invalid?
            // Filtering invalid to prevent entire list crash
            return students.filter(s => {
                const res = StudentSchema.safeParse(s);
                if (!res.success) logError(`StudentService:InvalidStudent:${s.id}`, res.error);
                return res.success;
            }) as Student[];

        } catch (error) {
            logError('StudentService:getByClass', error);
            throw error;
        }
    },

    // getStudents (Legacy support / renamed to getAll?)
    // Blueprint said "getStudentsByClass". 
    // I'll keep the exported name simple or match existing usage if possible, 
    // but strictly speaking I should follow the "Frontend Logic" structure.
    // The provided code snippet used "getStudentById" and "getStudentsByClass" as named exports.
    // The existing app uses "StudentService.getAll(classId)".
    // I will export an object "StudentService" to match existing easy refactor 
    // OR strictly follow named exports as per "Apply this directly".
    // "Apply this directly to your repo" -> I should probably use the named exports for "Read Services".
    // HOWEVER, the existing code imports `StudentService` (default or named object).
    // Changing to named exports `getStudentById` might require changing ALL imports.
    // I will use an Object `StudentService` that *implements* the logic.

    getAll: async (classId?: string) => {
        // Legacy wrapper for getByClass or all
        if (classId) {
            // implementation of getByClass
            const q = query(
                collection(db, 'students'),
                where('classId', '==', classId)
            );
            const snaps = await getDocs(q);
            return snaps.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];
        } else {
            // Fetch all? Might be heavy.
            const snaps = await getDocs(collection(db, 'students'));
            return snaps.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];
        }
    }
};
