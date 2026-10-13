import { createClient, processLock } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { SecureTokenStore } from './secureTokenStore';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/school';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: SecureTokenStore,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // Native has no browser Web Locks. Serialize SDK session mutations so
        // foreground recovery cannot race an automatic token rotation.
        ...(Platform.OS !== 'web' ? { lock: processLock } : {}),
    },
});

