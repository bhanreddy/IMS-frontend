import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, Image, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AdminHeader from '../../src/components/AdminHeader';
import { useRouter } from 'expo-router';
import AuthService from '../../src/services/authService';

export default function AdminSettings() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(true);

    const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(previousState => !previousState);
    };

    const handlePress = (item: string) => {
        Alert.alert(item, "This feature will be available in the next update.");
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Settings" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Section */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileCard}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Principal Reddy</Text>
                        <Text style={styles.profileRole}>ID: ADMIN-001</Text>
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
                                thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                                onValueChange={() => toggleSwitch(setIsDarkMode)}
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
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert("Logout", "Are you sure?", [
                    { text: "Cancel" },
                    {
                        text: "Logout",
                        style: "destructive",
                        onPress: async () => {
                            await AuthService.logout();
                            router.replace('/admin-login');
                        }
                    }
                ])}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        borderColor: '#F3F4F6',
    },
    profileInfo: {
        marginLeft: 20,
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    profileRole: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    editProfileText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
    },
    groupContainer: {
        marginBottom: 25,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 10,
        marginLeft: 10,
        textTransform: 'uppercase',
    },
    groupCard: {
        backgroundColor: '#fff',
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
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingLabel: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 70,
    },
    logoutButton: {
        backgroundColor: '#FEE2E2',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
