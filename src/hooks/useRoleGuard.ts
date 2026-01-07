import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import { Role } from '../types/models';

export function useRoleGuard(allowedRoles: Role[]) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace('/login');
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            // Unauthorized
            // Redirect to unauthorized page or back to their dashboard
            console.warn(`User ${user.uid} with role ${user.role} tried to access restricted area. Allowed: ${allowedRoles}`);
            router.replace('/(tabs)/home'); // Fallback to safe home
        }
    }, [user, loading]);
}
