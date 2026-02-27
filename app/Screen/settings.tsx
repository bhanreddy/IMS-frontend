import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, Image, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StudentHeader from '../../src/components/StudentHeader';
import ScreenLayout from '../../src/components/ScreenLayout';
import { useAuth } from '../../src/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { ThemeColors } from '../../src/theme/themes';
import { useTranslation } from 'react-i18next';

export default function Settings() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { theme, isDark, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const isDarkMode = isDark;
    const styles = React.useMemo(() => getStyles(theme.colors), [theme.colors]);
    const [notifications, setNotifications] = useState(true);
    const [dataSaving, setDataSaving] = useState(false);

    const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(previousState => !previousState);
    };

    const handlePress = (item: string) => {
        Alert.alert(item, "This feature will be available in the next update.");
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            {/* Using the generic Header component */}
            <StudentHeader
                title={t('settings.title', 'Settings')}
                showBackButton={true}
                showSettingsButton={false}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Section */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileCard}>
                    <Image
                        source={{ uri: user?.photo_url || 'https://cdn-icons-png.flaticon.com/512/2922/2922506.png' }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.display_name || user?.first_name || 'Student Name'}</Text>
                        <Text style={styles.profileRole}>ID: {user?.admission_no || user?.id || 'N/A'}</Text>
                        <TouchableOpacity onPress={() => handlePress("Edit Profile")}>
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ... Settings Groups ... */}
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>{t('settings.general', 'General')}</Text>
                    <View style={styles.groupCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="moon" size={20} color="#6366F1" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.dark_mode', 'Dark Mode')}</Text>
                            <Switch
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={"#fff"}
                                onValueChange={toggleTheme}
                                value={isDarkMode}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="notifications" size={20} color="#F59E0B" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.notifications', 'Notifications')}</Text>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#FCD34D" }}
                                thumbColor={notifications ? "#fff" : "#f4f3f4"}
                                onValueChange={() => toggleSwitch(setNotifications)}
                                value={notifications}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="cellular" size={20} color="#10B981" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.data_saving', 'Data Saving Mode')}</Text>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#34D399" }}
                                thumbColor={dataSaving ? "#fff" : "#f4f3f4"}
                                onValueChange={() => toggleSwitch(setDataSaving)}
                                value={dataSaving}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="language" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.language_telugu', 'Language (Telugu)')}</Text>
                            <Switch
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={"#fff"}
                                onValueChange={(val) => { i18n.changeLanguage(val ? 'te' : 'en'); }}
                                value={i18n.language === 'te'}
                            />
                        </View>
                    </View>
                </View>

                {/* ... Security & Support Groups ... */}
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>{t('settings.security', 'Security')}</Text>
                    <View style={styles.groupCard}>
                        <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/change-password')}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="lock-closed" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.change_password', 'Change Password')}</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>{t('settings.support', 'Support')}</Text>
                    <View style={styles.groupCard}>
                        {/* Shorter list for brevity, can keep full list if needed */}
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Help Center")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="help-buoy" size={20} color="#8B5CF6" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.help_center', 'Help Center')}</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Privacy Policy")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="shield-checkmark" size={20} color="#06B6D4" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.privacy_policy', 'Privacy Policy')}</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Contact Us")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="call" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.settingLabel}>{t('settings.contact_us', 'Contact Us')}</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => Alert.alert(
                        "Logout",
                        "Are you sure you want to logout?",
                        [
                            { text: "Cancel" },
                            { text: "Logout", style: "destructive", onPress: handleLogout }
                        ]
                    )}
                >
                    <Text style={styles.logoutText}>{t('settings.log_out', 'Log Out')}</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 20,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: colors.borderLight,
    },
    profileInfo: {
        marginLeft: 20,
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textStrong,
    },
    profileRole: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    editProfileText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    groupContainer: {
        marginBottom: 25,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textTertiary,
        marginBottom: 10,
        marginLeft: 10,
        textTransform: 'uppercase',
    },
    groupCard: {
        backgroundColor: colors.card,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    settingIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.alertBgInfo,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginRight: 5,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 70,
    },
    logoutButton: {
        backgroundColor: colors.alertBgDanger,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutText: {
        color: colors.alertTextDanger,
        fontSize: 16,
        fontWeight: 'bold',
    },
});


