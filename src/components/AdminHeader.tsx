import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ADMIN_THEME } from '../constants/adminTheme';
import { SCHOOL_CONFIG } from '../constants/schoolConfig';

interface AdminHeaderProps {
    title: string;
    showMenuButton?: boolean;
    showProfileButton?: boolean;
    showBackButton?: boolean;
    showNotification?: boolean;
}

import { useAuth } from '../hooks/useAuth';

const AdminHeader: React.FC<AdminHeaderProps> = ({
    title = SCHOOL_CONFIG.name,
    showMenuButton = true,
    showProfileButton = true,
    showBackButton = false,
    showNotification = false
}) => {
    const router = useRouter();
    const { user } = useAuth();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // Fallback based on role
            if (user?.role === 'accountant') router.push('/accounts/dashboard');
            else router.push('/admin/dashboard');
        }
    };

    const handleSettings = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (user?.role === 'accountant') {
            router.push('/accounts/settings');
        } else if (user?.role === 'staff' || user?.role === 'teacher') {
            // Assuming staff has a settings or profile page, otherwise dashboard
            router.push('/staff/dashboard');
        } else {
            router.push('/admin/settings');
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Left: Back or Menu */}
                    <View style={styles.leftContainer}>
                        {showBackButton ? (
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    handleBack();
                                }}
                                style={styles.iconButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={22} color={ADMIN_THEME.colors.text.primary} />
                            </TouchableOpacity>
                        ) : (
                            showMenuButton && (
                                <TouchableOpacity
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    style={styles.iconButton}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="menu" size={22} color={ADMIN_THEME.colors.text.primary} />
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    {/* Center: Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Right: Settings/Profile */}
                    <View style={styles.rightContainer}>
                        {showNotification && (
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push('/admin/notifications' as any);
                                }}
                                style={[styles.iconButton, { marginRight: 8 }]}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="notifications-outline" size={22} color={ADMIN_THEME.colors.text.secondary} />
                            </TouchableOpacity>
                        )}
                        {showProfileButton && (
                            <TouchableOpacity
                                onPress={handleSettings}
                                style={styles.iconButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="settings-outline" size={22} color={ADMIN_THEME.colors.text.secondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: ADMIN_THEME.colors.background.surface,
        borderBottomWidth: 1,
        borderBottomColor: ADMIN_THEME.colors.border,
        ...ADMIN_THEME.shadows.sm,
        paddingBottom: ADMIN_THEME.spacing.s,
    },
    safeArea: {
        backgroundColor: ADMIN_THEME.colors.background.surface,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ADMIN_THEME.spacing.m,
        height: 50, // Fixed height for consistent navbar feel
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: ADMIN_THEME.borderRadius.m,
        backgroundColor: ADMIN_THEME.colors.background.subtle,
    },
    title: {
        fontSize: ADMIN_THEME.typography.size.m,
        fontWeight: '600',
        color: ADMIN_THEME.colors.text.primary,
        letterSpacing: 0.3,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    leftContainer: {
        width: 40,
        alignItems: 'flex-start',
    }
});

export default AdminHeader;
