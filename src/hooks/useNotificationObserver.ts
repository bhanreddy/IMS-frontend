import { useEffect } from 'react';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getInitialNotification, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from './useAuth';

// Global variable to store deep link if user is not logged in
let PendingNavigation: string | null = null;

export function useNotificationObserver() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (Platform.OS === 'web') return;

        let isMounted = true;
        const app = getApp();
        const msg = getMessaging(app);

        // 1. Handle Initial Launch from Killed State
        const checkInitialNotification = async () => {
            const remoteMessage = await getInitialNotification(msg);
            if (remoteMessage && isMounted) {
                const deepLink = remoteMessage.data?.deepLink as string | undefined;
                if (deepLink) {
                    console.log('[NotificationObserver] Found initial deep link:', deepLink);
                    handleDeepLink(deepLink);
                }
            }
        };

        checkInitialNotification();

        // 2. Handle Background Taps (app was in background, user tapped notification)
        const unsubscribe = onNotificationOpenedApp(msg, (remoteMessage) => {
            const deepLink = remoteMessage.data?.deepLink as string | undefined;
            if (deepLink) {
                console.log('[NotificationObserver] Received deep link tap:', deepLink);
                handleDeepLink(deepLink);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
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
        if (user && !loading) {
            console.log('[NotificationObserver] User active, navigating immediately.');
            PendingNavigation = null;
            router.replace(path as any);
        } else {
            console.log('[NotificationObserver] User not ready, queuing navigation.');
        }
    };
}
