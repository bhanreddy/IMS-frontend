import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import { Role } from '../types/models';

const getRoleHome = (role: string) => {
    switch (role) {
        case 'admin': return '/admin/dashboard';
        case 'accountant': return '/accounts/dashboard';
        case 'staff':
        case 'teacher': return '/staff/dashboard';
        case 'driver': return '/driver/dashboard';
        default: return '/(tabs)/home';
    }
};

export function useRoleGuard(allowedRoles: Role[]) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace('/');
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            // Unauthorized — redirect to their own dashboard
            console.warn(`User ${user.id} with role ${user.role} tried to access restricted area. Allowed: ${allowedRoles}`);
            router.replace(getRoleHome(user.role));
        }
    }, [user, loading]);
}
