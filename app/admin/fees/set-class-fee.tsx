import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AdminHeader from '../../../src/components/AdminHeader';
import { ADMIN_THEME } from '../../../src/constants/adminTheme';
import { useAuth } from '../../../src/hooks/useAuth';
import { ClassService } from '../../../src/services/class.service';
import { FeesService } from '../../../src/services/fees.service';

export default function SetClassFeeScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [amount, setAmount] = useState('');
    const [feeType, setFeeType] = useState('tuition');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());

    // Load Classes
    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            setLoading(true);
            const data = await ClassService.getAll();
            setClasses(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load classes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedClassId || !amount || !feeType || !dueDate) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await FeesService.createClassFee({
                classId: selectedClassId,
                amount: Number(amount),
                feeType,
                dueDate,
                academicYear,
            });

            Alert.alert('Success', 'Class fee structure saved successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.result?.error || 'Failed to save fee structure');
        } finally {
            setSubmitting(false);
        }
    };

    const feeTypes = [
        { id: 'tuition', label: 'Tuition Fee' },
        { id: 'transport', label: 'Transport Fee' },
        { id: 'uniform', label: 'Uniform Fee' },
        { id: 'exam', label: 'Exam Fee' },
        { id: 'sports', label: 'Sports Fee' },
        { id: 'other', label: 'Other' },
    ];

    return (
        <View style={styles.container}>
            <AdminHeader title="Set Class Fee" showBackButton />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Fee Details</Text>

                    {/* Class Selector */}
                    <Text style={styles.label}>Select Class</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classScroll}>
                        {classes.map((cls) => (
                            <TouchableOpacity
                                key={cls.id}
                                style={[
                                    styles.classChip,
                                    selectedClassId === cls.id && styles.classChipActive
                                ]}
                                onPress={() => setSelectedClassId(cls.id)}
                            >
                                <Text style={[
                                    styles.classChipText,
                                    selectedClassId === cls.id && styles.classChipTextActive
                                ]}>
                                    {cls.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Fee Type Selector */}
                    <Text style={styles.label}>Fee Type</Text>
                    <View style={styles.typeGrid}>
                        {feeTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.typeChip,
                                    feeType === type.id && styles.typeChipActive
                                ]}
                                onPress={() => setFeeType(type.id)}
                            >
                                <Text style={[
                                    styles.typeChipText,
                                    feeType === type.id && styles.typeChipTextActive
                                ]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Amount Input */}
                    <Text style={styles.label}>Amount (₹)</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                    />

                    {/* Due Date Input */}
                    <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
                    <TextInput
                        style={styles.input}
                        value={dueDate}
                        onChangeText={setDueDate}
                        placeholder="YYYY-MM-DD"
                    />

                    {/* Academic Year */}
                    <Text style={styles.label}>Academic Year</Text>
                    <TextInput
                        style={styles.input}
                        value={academicYear}
                        onChangeText={setAcademicYear}
                        placeholder="e.g. 2026"
                        keyboardType="numeric"
                    />

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitBtnText}>Save Fee Structure</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ADMIN_THEME.colors.background.app,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        ...ADMIN_THEME.shadows.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: ADMIN_THEME.colors.text.primary,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: ADMIN_THEME.colors.text.secondary,
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    classScroll: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    classChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    classChipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: ADMIN_THEME.colors.primary,
    },
    classChipText: {
        color: '#4B5563',
        fontWeight: '500',
    },
    classChipTextActive: {
        color: ADMIN_THEME.colors.primary,
        fontWeight: '700',
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    typeChipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: ADMIN_THEME.colors.primary,
    },
    typeChipText: {
        fontSize: 13,
        color: '#4B5563',
    },
    typeChipTextActive: {
        color: ADMIN_THEME.colors.primary,
        fontWeight: '600',
    },
    submitBtn: {
        backgroundColor: ADMIN_THEME.colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
