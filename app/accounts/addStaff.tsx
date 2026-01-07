import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AdminHeader from '../../src/components/AdminHeader';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/hooks/useAuth';
import { StaffService } from '../../src/services/staff.service';
import { Functions } from '../../src/services/functions';

const InputField = ({ label, placeholder, value, onChangeText, keyboardType = 'default', icon, secureTextEntry = false }: any) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
            <Ionicons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType as any}
                secureTextEntry={secureTextEntry}
            />
        </View>
    </View>
);

export default function AddStaffScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        department: '',
        salary: '',
    });

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            loadUserData(id as string);
        }
    }, [id]);

    const loadUserData = async (userId: string) => {
        try {
            const data: any = await StaffService.getById(userId);
            if (data) {
                setFormData({
                    fullName: data.name || (data.firstName + ' ' + data.lastName),
                    email: data.email || '',
                    password: '', // Password not editable/viewable
                    phone: data.phone || '',
                    designation: data.designation || '',
                    department: data.department || '',
                    salary: data.salary ? data.salary.toString() : '',
                });
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to load staff data");
        }
    };

    const handleSave = async () => {
        if (!formData.email || (!isEditMode && !formData.password) || !formData.fullName) {
            Alert.alert("Error", "Please fill required fields");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                email: formData.email,
                name: formData.fullName,
                role: 'staff',
                schoolId: user?.schoolId || 'default',
                phone: formData.phone,
                designation: formData.designation,
                department: formData.department,
                salary: formData.salary,
            };

            if (isEditMode) {
                // Update Staff
                await Functions.updateStaff({ id: id, ...userData });
                Alert.alert("Success", "Staff Account Updated!", [{ text: "OK", onPress: () => router.back() }]);
            } else {
                // Create Staff
                // Note: user.schoolId usage for automatic school assignment
                await Functions.createStaff({
                    ...userData,
                    password: formData.password
                });

                Alert.alert("Success", "Staff Account Created!", [{ text: "OK", onPress: () => router.back() }]);
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message || "Failed to save staff account";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title={isEditMode ? "Edit Staff" : "Add Staff"} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                        <InputField
                            label="Full Name"
                            placeholder="Jane Doe"
                            value={formData.fullName}
                            onChangeText={(t: string) => setFormData({ ...formData, fullName: t })}
                            icon="person-outline"
                        />
                        <InputField
                            label="Email Address"
                            placeholder="staff@school.com"
                            value={formData.email}
                            onChangeText={(t: string) => setFormData({ ...formData, email: t })}
                            keyboardType="email-address"
                            icon="mail-outline"
                        />
                        {!isEditMode && (
                            <InputField
                                label="Password"
                                placeholder="******"
                                value={formData.password}
                                onChangeText={(t: string) => setFormData({ ...formData, password: t })}
                                secureTextEntry={true}
                                icon="lock-closed-outline"
                            />
                        )}
                        <InputField
                            label="Phone Number"
                            placeholder="+1 234 567"
                            value={formData.phone}
                            onChangeText={(t: string) => setFormData({ ...formData, phone: t })}
                            keyboardType="phone-pad"
                            icon="call-outline"
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                        <InputField
                            label="Designation"
                            placeholder="Math Teacher"
                            value={formData.designation}
                            onChangeText={(t: string) => setFormData({ ...formData, designation: t })}
                            icon="briefcase-outline"
                        />
                        <InputField
                            label="Department"
                            placeholder="Mathematics"
                            value={formData.department}
                            onChangeText={(t: string) => setFormData({ ...formData, department: t })}
                            icon="layers-outline"
                        />
                        <InputField
                            label="Salary (Optional)"
                            placeholder="50000"
                            value={formData.salary}
                            onChangeText={(t: string) => setFormData({ ...formData, salary: t })}
                            keyboardType="numeric"
                            icon="cash-outline"
                        />
                    </Animated.View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.8}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>{isEditMode ? "Update" : "Create Staff"}</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        padding: 20,
        paddingBottom: 50,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    saveButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
