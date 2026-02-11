import { supabase } from './supabaseConfig';

export interface FinancialAnalytics {
    total_collected: number;
    outstanding_dues: number;
    collection_efficiency: number;
    trend: { label: string; value: number }[];
}

export interface AttendanceAnalytics {
    avg_attendance: number;
    chronic_absentees: number;
    trend: { label: string; value: number }[];
}

export interface Insight {
    type: string;
    message: string;
    severity: 'info' | 'medium' | 'high';
}

export const AnalyticsService = {
    /**
     * Fetch Financial KPIs and Trend
     */
    async getFinancials(fromDate: string, toDate: string, groupBy: 'month' | 'week' = 'month'): Promise<FinancialAnalytics> {
        const { data, error } = await supabase
            .rpc('get_financial_analytics', {
                p_from_date: fromDate,
                p_to_date: toDate,
                p_group_by: groupBy
            });

        if (error) throw error;
        return data as FinancialAnalytics;
    },

    /**
     * Fetch Attendance KPIs and Trend
     */
    async getAttendance(fromDate: string, toDate: string): Promise<AttendanceAnalytics> {
        const { data, error } = await supabase
            .rpc('get_attendance_analytics', {
                p_from_date: fromDate,
                p_to_date: toDate
            });

        if (error) throw error;
        return data as AttendanceAnalytics;
    },

    /**
     * Fetch AI Insights
     */
    async getInsights(): Promise<Insight[]> {
        const { data, error } = await supabase
            .rpc('get_dashboard_insights');

        if (error) throw error;
        return data as Insight[];
    }
};
