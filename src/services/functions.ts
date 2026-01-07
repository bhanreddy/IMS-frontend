import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { logError } from '../utils/error';

/**
 * Generic wrapper for calling Cloud Functions.
 * Now includes centralized error logging.
 */
async function call<T>(name: string, payload: any): Promise<T> {
    try {
        const fn = httpsCallable(functions, name);
        const res = await fn(payload);
        return res.data as T;
    } catch (error) {
        logError(`CloudFunction:${name}`, error);
        throw error;
    }
}

export const Functions = {
    // Students
    createStudent: (data: any) => call('createStudent', data),
    updateStudent: (data: any) => call('updateStudent', data),
    deleteStudent: (studentId: string) => call('deleteStudent', { studentId }),

    // Staff
    createStaff: (data: any) => call('createStaff', data),
    updateStaff: (data: any) => call('updateStaff', data),

    // Attendance
    markAttendance: (data: any) => call('markAttendance', data),

    // Fees
    createFee: (data: any) => call('createFee', data),
    collectFee: (data: any) => call('collectFee', data), // Assuming this exists or will exist

    // Notices / Complaints if needed
    // ...

    // Universal Caller (for flexibility)
    call: (name: string, data: any) => call(name, data),
};
