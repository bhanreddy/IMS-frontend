import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';

// Global variable to store deep link if user is not logged in
let PendingNavigation: string | null = null;

export function useNotificationObserver() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        let isMounted = true;

        // 1. Handle Initial Launch from Killed State
        const checkInitialNotification = async () => {
            const response = await Notifications.getLastNotificationResponseAsync();
            if (response && isMounted) {
                const deepLink = response.notification.request.content.data?.deepLink;
                if (deepLink) {
                    console.log('[NotificationObserver] Found initial deep link:', deepLink);
                    handleDeepLink(deepLink);
                }
            }
        };

        checkInitialNotification();

        // 2. Handle Background/Foreground Taps
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const deepLink = response.notification.request.content.data?.deepLink;
            if (deepLink) {
                console.log('[NotificationObserver] Received deep link tap:', deepLink);
                handleDeepLink(deepLink);
            }
        });

        return () => {
            isMounted = false;
            subscription.remove();
        };
    }, []);

    // 3. Watch for Auth State Changes to process pending links
    useEffect(() => {
        if (!loading && user && PendingNavigation) {
            console.log('[NotificationObserver] Processing pending navigation:', PendingNavigation);
            const target = PendingNavigation;
            PendingNavigation = null;
            // Small delay to ensure router is ready/auth guarded
            setTimeout(() => {
                router.replace(target as any);
            }, 100);
        }
    }, [user, loading]);

    const handleDeepLink = (path: string) => {
        console.log('[NotificationObserver] Handling deep link:', path);

        // Always set pending first
        PendingNavigation = path;

        // If already logged in and not loading, navigate immediately
        // Note: The Effect dependency [user, loading] handles the "wait for login" case.
        // But if we are ALREADY logged in, the effect won't re-trigger just because PendingNavigation changed (it's not a state).
        // So we need to explicit check here.
        if (user && !loading) {
            console.log('[NotificationObserver] User active, navigating immediately.');
            PendingNavigation = null;
            router.replace(path as any);
        } else {
            console.log('[NotificationObserver] User not ready, queuing navigation.');
            // if not logged in, we let the auth guard redirect to login (or user navigates manually),
            // and then the useEffect [user] will fire and see PendingNavigation.
        }
    };
}
