import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AdminHeader from '../../src/components/AdminHeader';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/hooks/useAuth';
import { StudentService } from '../../src/services/student.service';
import { Functions } from '../../src/services/functions';

// Force bundle update
// Add Student Screen
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

export default function AddStudentScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        parentName: '',
        parentPhone: '',
        classId: '',
        section: '',
        admissionNo: '',
        dob: '',
    });

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            loadUserData(id as string);
        }
    }, [id]);

    const loadUserData = async (userId: string) => {
        try {
            // Read-only service call
            const data: any = await StudentService.getById(userId);
            if (data) {
                setFormData({
                    firstName: data.name ? data.name.split(' ')[0] : (data.firstName || ''),
                    lastName: data.name ? data.name.split(' ').slice(1).join(' ') : (data.lastName || ''),
                    email: data.email || '',
                    password: '', // Password not editable
                    parentName: data.parentName || '',
                    parentPhone: data.phone || '',
                    classId: data.classId || '',
                    section: data.section || '',
                    admissionNo: data.rollNo || '', // Mapping admissionNo to rollNo if needed? model has rollNo.
                    dob: data.dob || '',
                });
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to load student data");
        }
    };

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || (!isEditMode && !formData.password)) {
            Alert.alert("Error", "Please fill required fields");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
                role: 'student',
                // schoolId removed or inferred by backend creation function if needed. 
                // We'll pass it if we have it in user context, or let backend handle it.
                // Assuming single tenant for now or 'default'.
                schoolId: user?.schoolId || 'default',
                admissionNo: formData.admissionNo,
                rollNo: formData.admissionNo, // Mapping
                classId: formData.classId,
                section: formData.section,
                parentName: formData.parentName,
                phone: formData.parentPhone,
                dob: formData.dob,
            };

            if (isEditMode) {
                // Update Student via Functions
                // Note: updateStudent function signature expects { studentId, ...data }?
                // functions.ts wrapper calls 'updateStudent'.
                await Functions.updateStudent({ studentId: id, ...userData });
                Alert.alert("Success", "Student Account Updated!", [{ text: "OK", onPress: () => router.back() }]);
            } else {
                // Create Student via Functions
                await Functions.createStudent({
                    email: formData.email,
                    password: formData.password,
                    displayName: userData.name,
                    role: 'student',
                    studentProfile: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        classId: formData.classId,
                        rollNo: formData.admissionNo,
                        phone: formData.parentPhone,
                        dob: formData.dob,
                        parentName: formData.parentName
                    }
                });

                Alert.alert("Success", "Student Account Created!", [{ text: "OK", onPress: () => router.back() }]);
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message || "Failed to save student account";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title={t('accounts.add_student', 'Create Student Account')} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                        <Text style={styles.sectionTitle}>Personal Details</Text>
                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <InputField
                                    label="First Name"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChangeText={(t: string) => setFormData({ ...formData, firstName: t })}
                                    icon="person-outline"
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <InputField
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChangeText={(t: string) => setFormData({ ...formData, lastName: t })}
                                    icon="person-outline"
                                />
                            </View>
                        </View>

                        <InputField
                            label="Date of Birth"
                            placeholder="YYYY-MM-DD"
                            value={formData.dob}
                            onChangeText={(t: string) => setFormData({ ...formData, dob: t })}
                            icon="calendar-outline"
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                        <Text style={styles.sectionTitle}>Academic Info</Text>
                        <InputField
                            label="Admission No"
                            placeholder="ADM-001"
                            value={formData.admissionNo}
                            onChangeText={(t: string) => setFormData({ ...formData, admissionNo: t })}
                            icon="card-outline"
                        />
                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <InputField
                                    label="Class ID"
                                    placeholder="class_10_a"
                                    value={formData.classId}
                                    onChangeText={(t: string) => setFormData({ ...formData, classId: t })}
                                    icon="school-outline"
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <InputField
                                    label="Section"
                                    placeholder="A"
                                    value={formData.section}
                                    onChangeText={(t: string) => setFormData({ ...formData, section: t })}
                                    icon="grid-outline"
                                />
                            </View>
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                        <Text style={styles.sectionTitle}>Login Credentials</Text>
                        <InputField
                            label="Email Address"
                            placeholder="student@school.com"
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
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                        <Text style={styles.sectionTitle}>Parent Info</Text>
                        <InputField
                            label="Parent Name"
                            placeholder="Guardian Name"
                            value={formData.parentName}
                            onChangeText={(t: string) => setFormData({ ...formData, parentName: t })}
                            icon="people-outline"
                        />
                        <InputField
                            label="Parent Phone"
                            placeholder="+1 234 567 890"
                            value={formData.parentPhone}
                            onChangeText={(t: string) => setFormData({ ...formData, parentPhone: t })}
                            keyboardType="phone-pad"
                            icon="call-outline"
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
                            <Text style={styles.saveButtonText}>{isEditMode ? "Update Account" : "Create Account"}</Text>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 20,
        marginBottom: 15,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
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
