import { supabase } from './supabaseConfig';
import { PayrollEntry } from '../types/payroll';

export const PayrollService = {
    /**
     * Fetch payroll for a specific month/year.
     * Uses the 'generate_monthly_payroll' RPC to ensure data exists first.
     */
    async getPayrollForMonth(month: number, year: number): Promise<PayrollEntry[]> {
        try {
            // 1. Ensure payroll records exist for this month
            const { error: rpcError } = await supabase.rpc('generate_monthly_payroll', {
                p_month: month,
                p_year: year
            });

            if (rpcError) {
                console.error('Error generating payroll:', rpcError);
                // Continue anyway, maybe it just failed to insert dupes or something
            }

            // 2. Fetch records
            const { data, error } = await supabase
                .from('staff_payroll')
                .select(`
                    *,
                    staff:staff_id (
                        staff_code,
                        designation:designation_id ( name ),
                        person:person_id (
                            first_name,
                            last_name,
                            photo_url,
                            display_name
                        )
                    )
                `)
                .eq('payroll_month', month)
                .eq('payroll_year', year)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as PayrollEntry[];
        } catch (err) {
            console.error('PayrollService.getPayrollForMonth error:', err);
            return [];
        }
    },

    /**
     * Mark a payroll entry as PAID.
     */
    async markAsPaid(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('staff_payroll')
                .update({
                    status: 'paid',
                    payment_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('PayrollService.markAsPaid error:', err);
            return false;
        }
    }
};
