import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StaffHeader from '../../src/components/StaffHeader';
import SwipeableStudentCard from '../../src/components/SwipeableStudentCard';
import { useAuth } from '../../src/hooks/useAuth';
import { StudentService } from '../../src/services/studentService';
import { AttendanceService } from '../../src/services/attendanceService';
import { StudentWithDetails, AttendanceStatus } from '../../src/types/schema';
import { useTheme } from '../../src/hooks/useTheme';
import { Theme } from '../../src/theme/themes';
interface StudentUI {
  id: string;
  enrollmentId?: string;
  name: string;
  rollNo: string;
  status: 'present' | 'absent' | 'unmarked';
}
export default function ManageStudents() {
  const {
    theme,
    isDark
  } = useTheme();
  const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);
  const router = useRouter();
  const {
    user
  } = useAuth();
  const [students, setStudents] = useState<StudentUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [detectedClassId, setDetectedClassId] = useState<string | null>(null);
  useEffect(() => {
    loadStudents();
  }, [user]);
  const loadStudents = async () => {
    if (!user) return;
    try {
      // Dynamically detect teacher's class
      const myClass = await AttendanceService.getMyClass();

      if (!myClass) {
        setStudents([]);
        setDetectedClassId(null);
        setLoading(false);
        return;
      }

      setDetectedClassId(myClass.class_section_id);

      const formatted = myClass.students.map(s => ({
        id: s.student_id,
        enrollmentId: s.enrollment_id,
        name: s.student_name,
        rollNo: s.admission_no,
        status: (s.status === 'present' || s.status === 'absent' ? s.status : 'unmarked') as 'present' | 'absent' | 'unmarked'
      }));
      setStudents(formatted);
    } catch (error) {
      console.error("Failed to load students", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = useCallback((id: string, newStatus: 'present' | 'absent' | 'unmarked') => {
    setStudents(prev => prev.map(student => student.id === id ? {
      ...student,
      status: newStatus
    } : student));
  }, []);
  const handleSubmit = async () => {
    if (students.length === 0) {
      Alert.alert("No Data", "No students to submit attendance for.");
      return;
    }
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

      // Use dynamically detected classId
      if (!detectedClassId) {
        Alert.alert("Error", "No Class Assigned");
        return;
      }
      const date = new Date().toISOString().split('T')[0];
      await AttendanceService.markAttendance({
        class_section_id: detectedClassId,
        date: date,
        records: attendanceList.filter(item => students.find(s => s.id === item.studentId)?.enrollmentId).map(item => ({
          student_id: item.studentId,
          status: item.status as AttendanceStatus
        }))
      });
      Alert.alert('Success', `Attendance Submitted Successfully!\nPresent: ${students.filter(s => s.status === 'present').length}\nAbsent: ${students.filter(s => s.status === 'absent').length}`);
      router.back();
    } catch (error) {
      console.error("Submission failed", error);
      Alert.alert("Error", "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };
  return <GestureHandlerRootView style={{
    flex: 1
  }}>
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <StaffHeader title="Attendance" subtitle="Mark Attendance" showBackButton={true} showMenuButton={false} />

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe <Text style={{
            color: '#10B981',
            fontWeight: 'bold'
          }}>Right</Text> for Present, <Text style={{
            color: '#EF4444',
            fontWeight: 'bold'
          }}>Left</Text> for Absent
        </Text>
      </View>

      {loading ? <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{
          marginTop: 10,
          color: '#666'
        }}>Loading students...</Text>
      </View> : <FlatList data={students} keyExtractor={item => item.id} renderItem={({
        item
      }) => <SwipeableStudentCard student={item} onStatusChange={handleStatusChange} />} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />}

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submitButton, submitting && {
          opacity: 0.7
        }]} activeOpacity={0.8} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <>
            <Text style={styles.submitText}>Submit Attendance</Text>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={{
              marginLeft: 8
            }} />
          </>}
        </TouchableOpacity>
      </View>
    </View>
  </GestureHandlerRootView>;
}
const getStyles = (theme: Theme, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card
  },
  instructions: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.card,
    marginBottom: 10
  },
  instructionText: {
    fontSize: 13,
    color: theme.colors.textSecondary
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 100 // Space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent'
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  submitText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold'
  }
});