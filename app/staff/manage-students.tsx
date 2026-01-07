import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StaffHeader from '../../src/components/StaffHeader';
import SwipeableStudentCard from '../../src/components/SwipeableStudentCard';
import { useAuth } from '../../src/hooks/useAuth';
import { StudentService } from '../../src/services/student.service';
import { AttendanceService } from '../../src/services/attendance.service';

interface StudentUI {
    id: string;
    name: string;
    rollNo: string;
    status: 'present' | 'absent' | 'unmarked';
}

export default function ManageStudents() {
    const router = useRouter();
    const { user } = useAuth();
    const [students, setStudents] = useState<StudentUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadStudents();
    }, [user]);

    const loadStudents = async () => {
        try {
            if (user) {
                // Ideally fetch by class ID assigned to teacher
                // For now fetching all students as prototype fallback
                const data = await StudentService.getAll();

                const formatted = data.map((s: any) => ({
                    id: s.id,
                    name: s.name || `${s.firstName} ${s.lastName}`,
                    rollNo: s.rollNo || s.admissionNo || 'N/A',
                    status: 'unmarked' as any
                }));
                setStudents(formatted);
            }
        } catch (error) {
            console.error("Failed to load students", error);
            Alert.alert("Error", "Failed to fetch student list");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = useCallback((id: string, newStatus: 'present' | 'absent' | 'unmarked') => {
        setStudents(prev => prev.map(student =>
            student.id === id ? { ...student, status: newStatus } : student
        ));
    }, []);

    const handleSubmit = async () => {
        const unmarked = students.filter(s => s.status === 'unmarked');
        if (unmarked.length > 0) {
            Alert.alert("Incomplete", `You have ${unmarked.length} unmarked students. Please mark all before submitting.`);
            return;
        }

        try {
            setSubmitting(true);
            const attendanceList = students.map(s => ({
                studentId: s.id,
                status: s.status
            }));

            // Using placeholder classId until Class Management is fully implemented
            const classId = (user as any)?.classId || "class_10_a";
            const date = new Date().toISOString().split('T')[0];

            await AttendanceService.markAttendance({
                classId,
                date,
                students: attendanceList
            });

            Alert.alert(
                'Success',
                `Attendance Submitted Successfully!\nPresent: ${students.filter(s => s.status === 'present').length}\nAbsent: ${students.filter(s => s.status === 'absent').length}`
            );
            router.back();
        } catch (error) {
            console.error("Submission failed", error);
            Alert.alert("Error", "Failed to submit attendance");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />

                <StaffHeader
                    title="Attendance"
                    subtitle="Mark Attendance"
                    showBackButton={true}
                    showMenuButton={false}
                />

                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        Swipe <Text style={{ color: '#10B981', fontWeight: 'bold' }}>Right</Text> for Present, <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Left</Text> for Absent
                    </Text>
                </View>

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text style={{ marginTop: 10, color: '#666' }}>Loading students...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={students}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <SwipeableStudentCard
                                student={item}
                                onStatusChange={handleStatusChange}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitText}>Submit Attendance</Text>
                                <Ionicons name="checkmark-circle" size={24} color="#fff" style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    instructions: {
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 13,
        color: '#6B7280',
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 100, // Space for footer
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
