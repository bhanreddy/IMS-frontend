
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './apiClient';


// Configure Foreground Behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

class NotificationManager {

    private notificationListener?: Notifications.Subscription;

    async registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            // 1. Default Voice Channel
            await Notifications.setNotificationChannelAsync('default_voice', {
                name: 'Voice Alerts',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'voice_alert.wav', // Explicitly including extension though often omitted in Expo, better safe if file exists as such in raw
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });

            // 2. Emergency Channel
            await Notifications.setNotificationChannelAsync('emergency', {
                name: 'Emergency Alerts',
                importance: Notifications.AndroidImportance.MAX,
                sound: 'emergency.wav',
                vibrationPattern: [0, 500, 500, 500],
                lightColor: '#FF0000',
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            });

            // 3. Exam Channel
            await Notifications.setNotificationChannelAsync('exam', {
                name: 'Exam Updates',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'exam.wav',
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });

            // 4. Fees Channel
            await Notifications.setNotificationChannelAsync('fees', {
                name: 'Fee Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'fee_reminder.wav',
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });

            // 5. Attendance Channel
            await Notifications.setNotificationChannelAsync('attendance', {
                name: 'Attendance Alerts',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'attendance_absent_alert.wav',
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.warn('Failed to get push token for push notification!');
                return;
            }

            try {
                // Must use getDevicePushTokenAsync for FCM backend interaction
                const tokenData = await Notifications.getDevicePushTokenAsync();
                token = tokenData.data;
            } catch (e) {
                console.error("Error getting Device Push Token:", e);
            }
        } else {
            console.warn('Must use physical device for Push Notifications');
        }

        if (token) {
            await this.syncToken(token);
        }

        return token;
    }

    async syncToken(token: string) {
        try {
            await api.post('/notifications/register', {
                fcm_token: token,
                platform: Platform.OS
            });

        } catch (error) {
            console.error('Failed to sync token:', error);
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
        // 1. Foreground Notification Received
        this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
            // Frontend does NOT manipulate sound or override title/body
            // System handles sound based on channelId in notification.request.content
            const data = notification.request.content.data;
            console.log('Notification Received:', data);
        });




    }

    cleanupListeners() {
        if (this.notificationListener) this.notificationListener.remove();

    }
}

export const notificationManager = new NotificationManager();