import { api } from './apiClient';
import type { DailyAttendance, AttendanceStatus } from '../types/schema';

export interface MarkAttendanceRequest {
    class_section_id: string;
    attendance_date: string; // YYYY-MM-DD
    records: Array<{
        student_enrollment_id: string;
        status: AttendanceStatus;
    }>;
}

export interface AttendanceSummary {
    total_students: number;
    present: number;
    absent: number;
    late: number;
    half_day: number;
    percentage: number;
}

export interface StudentAttendanceRecord {
    date: string;
    status: AttendanceStatus;
    marked_by?: string;
}

export const AttendanceService = {
    /**
     * Get attendance for a class on a specific date
     */
    getClassAttendance: async (
        classSectionId: string,
        date: string
    ): Promise<DailyAttendance[]> => {
        return api.get<DailyAttendance[]>('/attendance', {
            class_section_id: classSectionId,
            date: date,
        });
    },

    /**
     * Mark attendance (bulk)
     */
    markAttendance: async (data: MarkAttendanceRequest): Promise<{ success: boolean; count: number }> => {
        return api.post<{ success: boolean; count: number }>('/attendance', data);
    },

    /**
     * Update single attendance record
     */
    updateAttendance: async (
        id: string,
        status: AttendanceStatus
    ): Promise<DailyAttendance> => {
        return api.put<DailyAttendance>(`/attendance/${id}`, { status });
    },

    /**
     * Get attendance summary for a class/date
     */
    getSummary: async (
        classSectionId: string,
        date: string
    ): Promise<AttendanceSummary> => {
        return api.get<AttendanceSummary>('/attendance/summary', {
            class_section_id: classSectionId,
            attendance_date: date,
        });
    },

    /**
     * Get student attendance history
     */
    getStudentAttendance: async (
        studentId: string,
        params?: { from_date?: string; to_date?: string }
    ): Promise<StudentAttendanceRecord[]> => {
        return api.get<StudentAttendanceRecord[]>(`/students/${studentId}/attendance`, params);
    },
};
