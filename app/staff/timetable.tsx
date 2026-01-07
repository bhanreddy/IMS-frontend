import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StaffHeader from '../../src/components/StaffHeader';
import StaffFooter from '../../src/components/StaffFooter';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock Data
interface TimetableEntry {
    id: string;
    time: string;
    subject: string;
    class: string;
    room: string;
}

const TIMETABLE_DATA: { [key: string]: TimetableEntry[] } = {
    'Mon': [
        { id: '1', time: '09:00 AM - 09:45 AM', subject: 'English', class: '10-A', room: '101' },
        { id: '2', time: '10:00 AM - 10:45 AM', subject: 'Grammar', class: '9-B', room: '204' },
        { id: '3', time: '11:00 AM - 11:45 AM', subject: 'English Lit', class: '10-C', room: '103' },
    ],
    'Tue': [
        { id: '1', time: '09:00 AM - 09:45 AM', subject: 'English', class: '10-B', room: '102' },
        { id: '2', time: '11:00 AM - 11:45 AM', subject: 'Library', class: '8-A', room: 'Lib' },
    ],
    'Wed': [
        { id: '1', time: '09:00 AM - 09:45 AM', subject: 'English', class: '10-A', room: '101' },
        { id: '2', time: '12:00 PM - 12:45 PM', subject: 'Grammar', class: '9-A', room: '201' },
        { id: '3', time: '02:00 PM - 02:45 PM', subject: 'Spoken English', class: '11-A', room: 'Lab' },
    ],
    'Thu': [
        { id: '1', time: '10:00 AM - 10:45 AM', subject: 'English', class: '10-A', room: '101' },
        { id: '2', time: '11:00 AM - 11:45 AM', subject: 'English Lit', class: '10-C', room: '103' },
    ],
    'Fri': [
        { id: '1', time: '09:00 AM - 09:45 AM', subject: 'Test', class: '10-A', room: '101' },
    ],
    'Sat': [
        { id: '1', time: '09:00 AM - 12:00 PM', subject: 'Extra Classes', class: '10-A', room: 'Hall' },
    ]
};

export default function TimeTable() {
    const [selectedDay, setSelectedDay] = useState('Mon');
    const todayClasses = TIMETABLE_DATA[selectedDay] || [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <StaffHeader title="My Timetable" showBackButton={true} />

            {/* Day Selector */}
            <View style={styles.daySelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelector}>
                    {DAYS.map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
                            onPress={() => setSelectedDay(day)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Timeline */}
            <ScrollView contentContainerStyle={styles.timelineContent} showsVerticalScrollIndicator={false}>
                {todayClasses.length > 0 ? (
                    todayClasses.map((item, index) => (
                        <Animated.View
                            key={item.id}
                            entering={FadeInDown.delay(index * 100).duration(500)}
                            style={styles.classCard}
                        >
                            <View style={styles.timeLineIndicator}>
                                <View style={styles.circle} />
                                <View style={styles.line} />
                            </View>

                            <View style={styles.cardContent}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.timeText}>{item.time}</Text>
                                    <View style={styles.roomBadge}>
                                        <Text style={styles.roomText}>Rm {item.room}</Text>
                                    </View>
                                </View>
                                <Text style={styles.subjectText}>{item.subject}</Text>
                                <Text style={styles.classText}>Class: {item.class}</Text>
                            </View>
                        </Animated.View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="sunny" size={48} color="#9CA3AF" />
                        <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
                    </View>
                )}
            </ScrollView>
            <StaffFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    daySelectorContainer: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    daySelector: {
        paddingHorizontal: 20,
        gap: 10,
    },
    dayChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dayChipActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    dayText: {
        fontWeight: '600',
        color: '#6B7280',
    },
    dayTextActive: {
        color: '#fff',
    },
    timelineContent: {
        padding: 20,
        paddingBottom: 100, // Space for footer
    },
    classCard: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeLineIndicator: {
        alignItems: 'center',
        marginRight: 15,
        marginTop: 5,
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3B82F6',
        borderWidth: 2,
        borderColor: '#EFF6FF',
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: '#E5E7EB',
        marginTop: 5,
    },
    cardContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeText: {
        fontSize: 13,
        color: '#3B82F6',
        fontWeight: '600',
    },
    roomBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roomText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: 'bold',
    },
    subjectText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    classText: {
        fontSize: 14,
        color: '#6B7280',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280',
    },
});
