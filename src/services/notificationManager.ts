
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken, onMessage, onTokenRefresh, requestPermission, AuthorizationStatus } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { Platform } from 'react-native';
import { api } from './apiClient';


class NotificationManager {

    private unsubscribeOnMessage?: () => void;
    private unsubscribeOnTokenRefresh?: () => void;

    /**
     * Create all Android notification channels.
     * Must be called before any notification is displayed.
     */
    async createChannels() {
        if (Platform.OS !== 'android') return;

        // 1. Emergency Channel
        await notifee.createChannel({
            id: 'emergency',
            name: 'Emergency Alerts',
            importance: AndroidImportance.HIGH,
            sound: 'emergency',
            vibration: true,
            vibrationPattern: [1, 500, 500, 500],
            lights: true,
            lightColor: '#FF0000',
            visibility: AndroidVisibility.PUBLIC,
        });

        // 2. Exam Channel (leaves, payroll, expenses)
        await notifee.createChannel({
            id: 'exam',
            name: 'Exam & Admin Updates',
            importance: AndroidImportance.HIGH,
            sound: 'exam',
            vibration: true,
            vibrationPattern: [1, 250, 250, 250],
            lights: true,
            lightColor: '#FF231F7C',
        });

        // 3. Fee Reminder Channel
        await notifee.createChannel({
            id: 'fee_reminder',
            name: 'Fee Reminders',
            importance: AndroidImportance.HIGH,
            sound: 'fee_reminder',
            vibration: true,
            vibrationPattern: [1, 250, 250, 250],
            lights: true,
            lightColor: '#FF231F7C',
        });

        // 4. Voice Alert Channel (diary, results, LMS, timetable, notices, fee collected, attendance present)
        await notifee.createChannel({
            id: 'voice_alert',
            name: 'General Alerts',
            importance: AndroidImportance.HIGH,
            sound: 'voice_alert',
            vibration: true,
            vibrationPattern: [1, 250, 250, 250],
            lights: true,
            lightColor: '#FF231F7C',
        });

        // 5. Attendance Absent Alert Channel
        await notifee.createChannel({
            id: 'attendance_absent_alert',
            name: 'Absent Alerts',
            importance: AndroidImportance.HIGH,
            sound: 'attendance_absent_alert',
            vibration: true,
            vibrationPattern: [1, 500, 500, 500],
            lights: true,
            lightColor: '#FF0000',
        });
    }

    async registerForPushNotificationsAsync() {
        let token: string | undefined;

        try {
            // 1. Create channels first
            if (Platform.OS === 'android') {
                await this.createChannels();
            }

            if (Platform.OS === 'web') {
                console.log('Push notifications not supported on web yet.');
                return;
            }

            // 2. Request permission (iOS requires explicit permission; Android auto-grants on API < 33)
            const app = getApp();
            const msg = getMessaging(app);
            const authStatus = await requestPermission(msg);
            const enabled =
                authStatus === AuthorizationStatus.AUTHORIZED ||
                authStatus === AuthorizationStatus.PROVISIONAL;

            if (!enabled) {
                console.warn('Push notification permission not granted!');
                return;
            }

            // 3. Get FCM Token
            token = await getToken(msg);

            if (token) {
                await this.syncToken(token);
            }

            return token;
        } catch (e) {
            console.error('Error in registerForPushNotificationsAsync (safe suppression):', e);
            return undefined; // Gracefully suppress so it doesn't crash the app thread
        }
    }

    async syncToken(token: string) {
        try {
            await api.post('/notifications/register', {
                fcm_token: token,
                platform: Platform.OS
            });
        } catch (error) {
            console.warn('Failed to sync FCM token:', error);
        }
    }

    async unregisterPushToken() {
        try {
            await api.post('/notifications/unregister', {}, { silent: true });
        } catch (error) {
            // Silently fail - we are logging out anyway
        }
    }

    setupListeners() {
        if (Platform.OS === 'web') return;

        const app = getApp();
        const msg = getMessaging(app);

        // 1. Foreground: FCM suppresses notification payloads in foreground.
        //    We use notifee to display them manually.
        this.unsubscribeOnMessage = onMessage(msg, async remoteMessage => {
            console.log('FCM Foreground Message:', remoteMessage);

            const channelId = remoteMessage.notification?.android?.channelId || 'voice_alert';

            await notifee.displayNotification({
                title: remoteMessage.notification?.title,
                body: remoteMessage.notification?.body,
                data: remoteMessage.data,
                android: {
                    channelId,
                    smallIcon: 'notification_icon',
                    pressAction: { id: 'default' },
                },
            });
        });

        // 2. Token Refresh: Re-sync whenever FCM rotates the token
        this.unsubscribeOnTokenRefresh = onTokenRefresh(msg, async newToken => {
            console.log('FCM Token Refreshed:', newToken);
            await this.syncToken(newToken);
        });
    }

    cleanupListeners() {
        if (this.unsubscribeOnMessage) this.unsubscribeOnMessage();
        if (this.unsubscribeOnTokenRefresh) this.unsubscribeOnTokenRefresh();
    }
}

export const notificationManager = new NotificationManager();