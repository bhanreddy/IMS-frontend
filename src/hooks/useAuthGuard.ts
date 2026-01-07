import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './useAuth';

export function useAuthGuard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        // Cast validation for stricter TS environments
        const segmentGroup = segments[0] as string;
        const inAuthGroup = segmentGroup === '(auth)';

        // If not authenticated and not in auth group, redirect to login
        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)/home');
        }
    }, [user, loading, segments]);
}
