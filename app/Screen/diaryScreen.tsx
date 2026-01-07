import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StudentHeader from '../../src/components/StudentHeader';

const DIARY_DATA = [
    {
        id: '1',
        subject: 'English',
        homework: 'Read lesson 3 and write a summary in 150 words.',
        due: 'Tomorrow',
        isComplete: false,
        color: '#F59E0B',
        icon: 'book',
    },
    {
        id: '2',
        subject: 'Telugu',
        homework: 'Practice page no. 45 – Aksharalu.',
        due: 'Tomorrow',
        isComplete: true,
        color: '#EF4444',
        icon: 'language',
    },
    {
        id: '3',
        subject: 'Hindi',
        homework: '',
        due: '',
        isComplete: false,
        color: '#10B981',
        icon: 'translate',
    },
    {
        id: '4',
        subject: 'Mathematics',
        homework: 'Solve problems 1–10 from exercise 6.2.',
        due: 'Wed, 14 Aug',
        isComplete: false,
        color: '#3B82F6',
        icon: 'calculate', // MaterialIcon
    },
    {
        id: '5',
        subject: 'Biology',
        homework: 'Prepare diagram of plant cell.',
        due: 'Thu, 15 Aug',
        isComplete: false,
        color: '#8B5CF6',
        icon: 'biotech', // MaterialIcon
    },
    {
        id: '6',
        subject: 'Social Science',
        homework: 'Learn important points of chapter “Indian Constitution”.',
        due: 'Friday',
        isComplete: true,
        color: '#EC4899',
        icon: 'public', // MaterialIcon
    },
];

import { useTranslation } from 'react-i18next';

export default function DiaryScreen() {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock functionality to toggle check
    const [tasks, setTasks] = useState(DIARY_DATA);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isComplete: !t.isComplete } : t));
    };

    // Calculate progress
    const totalTasks = tasks.filter(t => t.homework).length;
    const completedTasks = tasks.filter(t => t.homework && t.isComplete).length;
    const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <StudentHeader showBackButton={true} title={t("Diary") || "Diary"} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Date Header */}
                <View style={styles.dateHeader}>
                    <View>
                        <Text style={styles.dateTitle}>Today's Homework</Text>
                        <Text style={styles.dateSubtitle}>Monday, 12 August 2024</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>{Math.round(progress * 100)}% Done</Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                    </View>
                </View>

                {/* Student Info Card (Mini) */}
                <LinearGradient
                    colors={['#1F2937', '#111827']}
                    style={styles.studentInfoCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.infoContent}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.studentName}>Rahul Reddy</Text>
                            <Text style={styles.classInfo}>Class 10th A • Roll No: 24</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.calendarButton}>
                        <Ionicons name="calendar-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                </LinearGradient>

                {/* Homework List */}
                <View style={styles.tasksContainer}>
                    {tasks.map((item, index) => {
                        const hasHomework = !!item.homework;
                        return (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.delay(index * 100).duration(600)}
                            >
                                <View style={[styles.taskCard, !hasHomework && styles.noWorkCard]}>
                                    {/* Left Color Strip */}
                                    <View style={[styles.colorStrip, { backgroundColor: item.color }]} />

                                    <View style={styles.cardInner}>
                                        <View style={styles.cardHeader}>
                                            <View style={styles.subjectRow}>
                                                <MaterialIcons name={item.icon as any || 'book'} size={18} color={item.color} />
                                                <Text style={[styles.subjectName, { color: item.color }]}>{item.subject}</Text>
                                            </View>
                                            {hasHomework && (
                                                <View style={styles.dueBadge}>
                                                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                                                    <Text style={styles.dueText}>Due: {item.due}</Text>
                                                </View>
                                            )}
                                        </View>

                                        {hasHomework ? (
                                            <View style={styles.homeworkContent}>
                                                <Text style={[
                                                    styles.homeworkText,
                                                    item.isComplete && styles.completedText
                                                ]}>
                                                    {item.homework}
                                                </Text>

                                                <TouchableOpacity
                                                    style={[styles.checkbox, item.isComplete && styles.checkedBox]}
                                                    onPress={() => toggleTask(item.id)}
                                                    activeOpacity={0.7}
                                                >
                                                    {item.isComplete && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <Text style={styles.noWorkText}>No homework assigned today 🎉</Text>
                                        )}
                                    </View>
                                </View>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* Bottom Spacer */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    // Date Header
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
    },
    dateSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    progressContainer: {
        alignItems: 'flex-end',
    },
    progressText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 4,
    },
    progressBarBg: {
        width: 100,
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 3,
    },

    // Student Info
    studentInfoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    studentName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    classInfo: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    calendarButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },

    // Tasks
    tasksContainer: {
        gap: 15,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        minHeight: 100,
    },
    noWorkCard: {
        opacity: 0.8,
        minHeight: 80,
    },
    colorStrip: {
        width: 6,
        height: '100%',
    },
    cardInner: {
        flex: 1,
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    subjectName: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    dueBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dueText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    homeworkContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
    },
    homeworkText: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 20,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    noWorkText: {
        color: '#9CA3AF',
        fontStyle: 'italic',
        fontSize: 13,
        marginTop: 5,
    },
});
