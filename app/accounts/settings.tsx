import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, Image, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AdminHeader from '../../src/components/AdminHeader';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/hooks/useTheme';

export default function AccountsSettings() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(true);

    const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(previousState => !previousState);
    };

    const handlePress = (item: string) => {
        Alert.alert(item, "This feature will be available in the next update.");
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            padding: 20,
            paddingBottom: 40,
        },
        profileCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.card,
            padding: 20,
            borderRadius: 20,
            marginBottom: 25,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        avatar: {
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 3,
            borderColor: theme.colors.background,
        },
        profileInfo: {
            marginLeft: 20,
            flex: 1,
        },
        profileName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        profileRole: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        editProfileText: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '600',
        },
        groupContainer: {
            marginBottom: 25,
        },
        groupTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: 10,
            marginLeft: 10,
            textTransform: 'uppercase',
        },
        groupCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 1,
            borderWidth: 1,
            borderColor: theme.colors.border,
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
            backgroundColor: isDark ? theme.colors.background : '#F9FAFB',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        settingLabel: {
            flex: 1,
            fontSize: 16,
            color: theme.colors.text,
            fontWeight: '500',
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginLeft: 70,
        },
        logoutButton: {
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            marginTop: 10,
        },
        logoutText: {
            color: theme.colors.danger,
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <AdminHeader title="Settings" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Section */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileCard}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.display_name || user?.first_name || 'Accountant'}</Text>
                        <Text style={styles.profileRole}>ID: {user?.id?.substring(0, 8).toUpperCase() || 'N/A'}</Text>
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
                                trackColor={{ false: "#E5E7EB", true: "#818CF8" }}
                                thumbColor={isDark ? "#fff" : "#f4f3f4"}
                                onValueChange={() => toggleTheme()}
                                value={isDark}
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
                    </View>
                </View>

                <View style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>Security</Text>
                    <View style={styles.groupCard}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="finger-print" size={20} color="#EC4899" />
                            </View>
                            <Text style={styles.settingLabel}>Biometric Login</Text>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#F472B6" }}
                                thumbColor={biometric ? "#fff" : "#f4f3f4"}
                                onValueChange={() => toggleSwitch(setBiometric)}
                                value={biometric}
                            />
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.settingRow} onPress={() => handlePress("Change Password")}>
                            <View style={styles.settingIconBox}>
                                <Ionicons name="lock-closed" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.settingLabel}>Change Password</Text>
                            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert("Logout", "Are you sure?", [
                    { text: "Cancel" },
                    {
                        text: "Logout", style: "destructive", onPress: async () => {
                            await logout();
                            router.replace('/');
                        }
                    }
                ])}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}


