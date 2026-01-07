import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Attendance } from '../types/models';
import { AttendanceSchema } from '../types/schemas';
import { Functions } from './functions';
import { logError } from '../utils/error';

export const AttendanceService = {
    getByDate: async (date: string, classId?: string): Promise<Attendance[]> => {
        try {
            let q = query(
                collection(db, 'attendance'),
                where('date', '==', date)
            );

            // If classId is provided, might need composite index or client-side filter
            // For now, assuming date query is sufficient or we add where clause if index exists
            if (classId) {
                q = query(q, where('classId', '==', classId));
            }

            const snaps = await getDocs(q);
            const attendance = snaps.docs.map(d => ({
                id: d.id,
                ...d.data(),
            }));

            // Validation
            return attendance.filter(a => {
                const res = AttendanceSchema.safeParse(a);
                return res.success;
            }) as Attendance[];

        } catch (error) {
            logError('AttendanceService:getByDate', error);
            throw error;
        }
    },

    getByStudent: async (studentId: string): Promise<Attendance[]> => {
        try {
            const q = query(
                collection(db, 'attendance'),
                where('studentId', '==', studentId),
                // orderBy('date', 'desc') // Requires index
            );
            const snaps = await getDocs(q);
            return snaps.docs.map(d => ({
                id: d.id,
                ...d.data(),
            })) as Attendance[];
        } catch (error) {
            logError('AttendanceService:getByStudent', error);
            return [];
        }
    },

    // Write operation via Function
    markAttendance: async (payload: {
        classId: string;
        date: string;
        students: { studentId: string, status: string }[];
    }) => {
        // The payload structure depends on what the Cloud Function expects.
        // Blueprint said: "markAttendance: (data) => call('markAttendance', data)"
        // I need to match the UI which sends { classId, date, attendanceList }
        return Functions.markAttendance(payload);
    },

    getStudentStats: async (studentId: string) => {
        // Logic for stats might be complex or aggregate. 
        // For now, simple fetch or function call.
        // If aggregate needed, maybe a new Cloud Function `getStudentAttendanceStats`?
        // Or client side calc from recent records.
        // Returning mock or simple calculation for now to keep it running.
        try {
            const q = query(collection(db, 'attendance'), where('studentId', '==', studentId));
            const snaps = await getDocs(q);
            const records = snaps.docs.map(d => d.data());
            // calc logic...
            return {
                present: records.filter(r => r.status === 'present').length,
                absent: records.filter(r => r.status === 'absent').length,
                total: records.length,
                percentage: records.length ? (records.filter(r => r.status === 'present').length / records.length * 100).toFixed(1) : 0
            };
        } catch (e) {
            return { present: 0, absent: 0, total: 0, percentage: 0 };
        }
    }
};
