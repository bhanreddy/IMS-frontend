import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TimetableService, TimetableSlot } from '../../src/services/timetableService';
import StudentHeader from '../../src/components/StudentHeader';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const PERIOD_TIMES: Record<number, { start: string, end: string }> = {
    1: { start: '09:00', end: '09:45' },
    2: { start: '09:45', end: '10:30' },
    3: { start: '10:45', end: '11:30' },
    4: { start: '11:30', end: '12:15' },
    5: { start: '13:00', end: '13:45' },
    6: { start: '13:45', end: '14:30' },
    7: { start: '14:30', end: '15:15' },
    8: { start: '15:15', end: '16:00' }, // Simplified display
};

export default function StudentTimetable() {
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState<TimetableSlot[]>([]);

    useEffect(() => {
        loadTimetable();
    }, []);

    const loadTimetable = async () => {
        try {
            const data = await TimetableService.getMyTimetable();
            setSlots(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getSlot = (day: string, period: number) => {
        return slots.find(s => s.day_of_week === day && s.period_number === period);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

            <StudentHeader title="My Timetable" showBackButton />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <ScrollView style={styles.content}>
                    {/* Compact List View for Mobile (Better than Grid for Students check) */}
                    {/* Actually, user asked for "Timetable", grid is standard but list by day is easier on phone. */}
                    {/* I'll stick to Grid to match requirements "Timetable" visual. But maybe vertical Day sections? */}
                    {/* Let's do a vertical Day list with periods inside. */}

                    {DAYS.map(day => {
                        const daySlots = slots.filter(s => s.day_of_week === day).sort((a, b) => a.period_number - b.period_number);
                        if (daySlots.length === 0) return null;

                        return (
                            <View key={day} style={styles.dayCard}>
                                <View style={styles.dayHeader}>
                                    <Text style={styles.dayTitle}>{day.toUpperCase()}</Text>
                                </View>
                                {daySlots.map(slot => (
                                    <View key={slot.period_number} style={styles.periodRow}>
                                        <View style={styles.timeBadge}>
                                            <Text style={styles.periodNum}>{slot.period_number}</Text>
                                            <Text style={styles.timeText}>{slot.start_time.substring(0, 5)}</Text>
                                        </View>
                                        <View style={styles.details}>
                                            <Text style={styles.subject}>{slot.subject_name}</Text>
                                            <Text style={styles.teacher}>{slot.teacher_name || 'No Teacher'}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })}

                    {slots.length === 0 && (
                        <Text style={styles.empty}>No timetable assigned yet.</Text>
                    )}
                    <View style={{ height: 50 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, paddingTop: 50, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

    content: { flex: 1, padding: 16 },
    dayCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 2 },
    dayHeader: { backgroundColor: '#EEF2FF', padding: 10, borderBottomWidth: 1, borderBottomColor: '#E0E7FF' },
    dayTitle: { fontWeight: 'bold', color: '#4F46E5' },

    periodRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', alignItems: 'center' },
    timeBadge: { width: 50, alignItems: 'center', marginRight: 12 },
    periodNum: { fontSize: 16, fontWeight: 'bold', color: '#6B7280' },
    timeText: { fontSize: 10, color: '#9CA3AF' },

    details: { flex: 1 },
    subject: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    teacher: { fontSize: 12, color: '#6B7280', marginTop: 2 },

    empty: { textAlign: 'center', marginTop: 50, color: '#9CA3AF' }
});
