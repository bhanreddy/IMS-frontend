import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, Image, Alert, Linking } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StaffHeader from '../../src/components/StaffHeader';

import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/hooks/useTheme';
import { useBiometric } from '../../src/hooks/useBiometric';
import { ThemeColors } from '../../src/theme/themes';

export default function StaffSettings() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const isDarkMode = isDark;
    const styles = React.useMemo(() => getStyles(theme.colors), [theme.colors]);
    const [notifications, setNotifications] = useState(true);
    const [dataSaving, setDataSaving] = useState(false);
    const { isBiometricAvailable, isBiometricEnabled, isLoading: biometricLoading, toggleBiometric } = useBiometric();

    const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(previousState => !previousState);
    };

    const handlePress = (item: string) => {
        Alert.alert(item, "This feature will be available in the next update.");
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "Logout", style: "destructive", onPress: async () => {
                    await logout();
                    router.replace('/');
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <StaffHeader title="Settings" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Section */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileCard}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.display_name || user?.first_name || 'Staff Member'}</Text>
                        <Text style={styles.profileRole}>ID: {user?.id || 'N/A'}</Text>
                        <TouchableOpacity onPress={() => handlePress("Edit Profile")}>
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Settings Groups */}
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>General</Text>
                    <View style={styles.groupCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="moon" size={20} color="#6366F1" />
                            </View>
                            <Text style={styles.settingLabel}>Dark Mode</Text>
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
                            <Text style={styles.settingLabel}>Notifications</Text>
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
                            <Text style={styles.settingLabel}>Data Saving Mode</Text>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#34D399" }}
                                thumbColor={dataSaving ? "#fff" : "#f4f3f4"}
                                onValueChange={() => toggleSwitch(setDataSaving)}
                                value={dataSaving}
                            />
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Language")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="language" size={20} color="#10B981" />
                            </View>
                            <Text style={styles.settingLabel}>Language</Text>
                            <View style={styles.rowRight}>
                                <Text style={styles.valueText}>English</Text>
                                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>Security</Text>
                    <View style={styles.groupCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="finger-print" size={20} color="#EC4899" />
                            </View>
                            <Text style={styles.settingLabel}>
                                {isBiometricAvailable ? 'Biometric Login' : 'Biometric (Not Available)'}
                            </Text>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#F472B6" }}
                                thumbColor={isBiometricEnabled ? "#fff" : "#f4f3f4"}
                                onValueChange={toggleBiometric}
                                value={isBiometricEnabled}
                                disabled={!isBiometricAvailable || biometricLoading}
                            />
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/change-password')}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="lock-closed" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.settingLabel}>Change Password</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>Support</Text>
                    <View style={styles.groupCard}>
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Help Center")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="help-buoy" size={20} color="#8B5CF6" />
                            </View>
                            <Text style={styles.settingLabel}>Help Center</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL('https://nexsyrus.com/privacy')}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="shield-checkmark" size={20} color="#06B6D4" />
                            </View>
                            <Text style={styles.settingLabel}>Privacy Policy</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Why do we show Ads")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="information-circle" size={20} color="#F59E0B" />
                            </View>
                            <Text style={styles.settingLabel}>Why do we show Ads</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Contact Us")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="call" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.settingLabel}>Contact Us</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Dev Contact")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="code-slash" size={20} color="#8B5CF6" />
                            </View>
                            <Text style={styles.settingLabel}>Dev Contact</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Account Actions */}
                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>Danger Zone</Text>
                    <View style={[styles.groupCard, { borderColor: '#FECACA' }]}>
                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => Alert.alert(
                                "Delete Account",
                                "This action is permanent and cannot be undone. Are you sure you want to proceed?",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Delete",
                                        style: "destructive",
                                        onPress: () => {
                                            // Open Web URL for deletion request as per Play Store Policy
                                            Linking.openURL('https://example.com/delete-account');
                                        }
                                    }
                                ]
                            )}
                        >
                            <View style={[styles.settingIconBox, { backgroundColor: '#FEF2F2' }]}>
                                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                            </View>
                            <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Delete Account</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView >

        </View >
    );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space for footer
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
        marginLeft: 70, // Align with text
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


