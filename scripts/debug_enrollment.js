
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runEnrollment() {
    console.log('Running ensure_student_enrollment...');
    const userId = '87ae5cc1-dfd2-484f-9463-753af9da0b86';

    try {
        const { data, error } = await supabase.rpc('ensure_student_enrollment', {
            p_user_id: userId
        });

        if (error) {
            console.error('RPC Error:', JSON.stringify(error, null, 2));
            if (error.details) console.error('Error Details:', error.details);
            if (error.hint) console.error('Error Hint:', error.hint);
            if (error.message) console.error('Error Message:', error.message);
        } else {
            console.log('Success:', data);
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

runEnrollment();
