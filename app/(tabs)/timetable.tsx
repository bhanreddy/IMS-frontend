import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';

const { width } = Dimensions.get('window');

// --- Mock Data ---
type ScheduleItem = {
    id: string;
    type: 'class' | 'break' | 'lunch';
    time: string;
    subject?: string;
    teacher?: string;
    room?: string;
    icon?: string;
    duration?: string;
};

const TIMETABLE_DATA: Record<string, ScheduleItem[]> = {
    Mon: [
        { id: '1', type: 'class', time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'Ravi Kumar', room: 'Room 101', icon: 'calculator' },
        { id: '2', type: 'class', time: '09:45 - 10:30', subject: 'Physics', teacher: 'Sita Verma', room: 'Lab 2', icon: 'atom' },
        { id: '3', type: 'break', time: '10:30 - 10:45', duration: '15 Mins' },
        { id: '4', type: 'class', time: '10:45 - 11:30', subject: 'Chemistry', teacher: 'Dr. Rao', room: 'Lab 1', icon: 'flask' },
        { id: '5', type: 'class', time: '11:30 - 12:15', subject: 'English', teacher: 'John Doe', room: 'Room 101', icon: 'book' },
        { id: '6', type: 'lunch', time: '12:15 - 01:00', duration: '45 Mins' },
        { id: '7', type: 'class', time: '01:00 - 01:45', subject: 'Computer Sci', teacher: 'Alice Smith', room: 'Comp Lab', icon: 'laptop-code' },
    ],
    Tue: [
        { id: '1', type: 'class', time: '09:00 - 09:45', subject: 'Biology', teacher: 'Dr. Anjali', room: 'Bio Lab', icon: 'dna' },
        { id: '2', type: 'class', time: '09:45 - 10:30', subject: 'Mathematics', teacher: 'Ravi Kumar', room: 'Room 101', icon: 'calculator' },
        { id: '3', type: 'break', time: '10:30 - 10:45', duration: '15 Mins' },
        { id: '4', type: 'class', time: '10:45 - 11:30', subject: 'History', teacher: 'Mr. Khan', room: 'Room 102', icon: 'landmark' },
        { id: '5', type: 'lunch', time: '12:15 - 01:00', duration: '45 Mins' },
        { id: '6', type: 'class', time: '01:00 - 02:30', subject: 'Physical Edu', teacher: 'Coach Singh', room: 'Ground', icon: 'running' },
    ],
    Wed: [
        { id: '1', type: 'class', time: '09:00 - 09:45', subject: 'English', teacher: 'John Doe', room: 'Room 101', icon: 'book' },
        { id: '2', type: 'class', time: '09:45 - 10:30', subject: 'Hindi', teacher: 'Mrs. Sharma', room: 'Room 101', icon: 'language' },
        { id: '3', type: 'break', time: '10:30 - 10:45', duration: '15 Mins' },
        { id: '4', type: 'class', time: '10:45 - 11:30', subject: 'Social Studies', teacher: 'Mr. Khan', room: 'Room 102', icon: 'globe' },
        { id: '5', type: 'lunch', time: '12:15 - 01:00', duration: '45 Mins' },
        { id: '6', type: 'class', time: '01:00 - 01:45', subject: 'Physics', teacher: 'Sita Verma', room: 'Lab 2', icon: 'atom' },
    ],
    Thu: [
        { id: '1', type: 'class', time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'Ravi Kumar', room: 'Room 101', icon: 'calculator' },
        { id: '2', type: 'class', time: '09:45 - 10:30', subject: 'Chemistry', teacher: 'Dr. Rao', room: 'Lab 1', icon: 'flask' },
        { id: '3', type: 'break', time: '10:30 - 10:45', duration: '15 Mins' },
        { id: '4', type: 'class', time: '10:45 - 11:30', subject: 'Biology', teacher: 'Dr. Anjali', room: 'Bio Lab', icon: 'dna' },
        { id: '5', type: 'lunch', time: '12:15 - 01:00', duration: '45 Mins' },
        { id: '6', type: 'class', time: '01:00 - 01:45', subject: 'Library', teacher: 'Librarian', room: 'Library', icon: 'book-reader' },
    ],
    Fri: [
        { id: '1', type: 'class', time: '09:00 - 09:45', subject: 'Economics', teacher: 'Mr. Das', room: 'Room 103', icon: 'chart-line' },
        { id: '2', type: 'class', time: '09:45 - 10:30', subject: 'Mathematics', teacher: 'Ravi Kumar', room: 'Room 101', icon: 'calculator' },
        { id: '3', type: 'break', time: '10:30 - 10:45', duration: '15 Mins' },
        { id: '4', type: 'class', time: '10:45 - 11:30', subject: 'Computer Sci', teacher: 'Alice Smith', room: 'Comp Lab', icon: 'laptop-code' },
        { id: '5', type: 'lunch', time: '12:15 - 01:00', duration: '45 Mins' },
        { id: '6', type: 'class', time: '01:00 - 02:00', subject: 'Art & Craft', teacher: 'Mrs. Roy', room: 'Art Room', icon: 'palette' },
    ],
    Sat: [
        { id: '1', type: 'class', time: '09:00 - 10:00', subject: 'Weekend Test', teacher: 'All Faculty', room: 'Exam Hall', icon: 'file-alt' },
        { id: '2', type: 'break', time: '10:00 - 10:15', duration: '15 Mins' },
        { id: '3', type: 'class', time: '10:15 - 12:00', subject: 'Extra Curricular', teacher: 'Various', room: 'Ground', icon: 'futbol' },
        { id: '4', type: 'class', time: '12:00 - 12:30', subject: 'Early Departure', teacher: '-', room: '-', icon: 'home' },
    ],
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TimeTableScreen = () => {
    const { t } = useTranslation();
    const [selectedDay, setSelectedDay] = useState('Mon');

    const renderScheduleItem = ({ item, index }: { item: ScheduleItem; index: number }) => {
        if (item.type === 'break' || item.type === 'lunch') {
            return (
                <Animated.View
                    entering={FadeInDown.delay(index * 100).springify()}
                    style={styles.breakCard}
                >
                    <View style={styles.breakLine} />
                    <View style={styles.breakContent}>
                        <Ionicons
                            name={item.type === 'lunch' ? 'restaurant' : 'cafe'}
                            size={18}
                            color="#F59E0B"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.breakText}>
                            {item.type === 'lunch' ? t('timetable.lunch') : t('timetable.interval')} ({item.duration})
                        </Text>
                        <Text style={styles.breakTime}>{item.time}</Text>
                    </View>
                    <View style={styles.breakLine} />
                </Animated.View>
            );
        }

        return (
            <Animated.View
                entering={FadeInRight.delay(index * 100).springify()}
                style={styles.classCard}
            >
                <View style={styles.timeStripe}>
                    <Text style={styles.startTime}>{item.time.split(' - ')[0]}</Text>
                    <Text style={styles.endTime}>{item.time.split(' - ')[1]}</Text>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.subjectName}>{item.subject}</Text>
                        <View style={styles.iconContainer}>
                            <FontAwesome5 name={item.icon || 'book'} size={16} color="#4F46E5" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
                            <Text style={styles.detailText}>{item.teacher}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="location-outline" size={16} color="#6B7280" />
                            <Text style={styles.detailText}>{item.room}</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <ScreenLayout>
            <StudentHeader title={t('timetable.title')} />

            <View style={styles.container}>
                {/* --- Date Selection Strip --- */}
                <View style={styles.daySelectorContainer}>
                    <FlatList
                        data={DAYS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dayList}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            const isSelected = selectedDay === item;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setSelectedDay(item)}
                                    style={styles.dayItemWrapper}
                                >
                                    {isSelected ? (
                                        <LinearGradient
                                            colors={['#4F46E5', '#7C3AED']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.selectedDayGradient}
                                        >
                                            <Text style={styles.dayTextSelected}>{t(`common.days.${item}`)}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={styles.dayItem}>
                                            <Text style={styles.dayText}>{t(`common.days.${item}`)}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                {/* --- Timeline --- */}
                <View style={styles.timelineContainer}>
                    <FlatList
                        data={TIMETABLE_DATA[selectedDay] || []}
                        keyExtractor={(item) => item.id}
                        renderItem={renderScheduleItem}
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light gray background
    },
    daySelectorContainer: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
        zIndex: 10,
    },
    dayList: {
        paddingHorizontal: 20,
        gap: 12,
    },
    dayItemWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    dayItem: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedDayGradient: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    dayTextSelected: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    timelineContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    /* --- Class Card --- */
    classCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 4,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    timeStripe: {
        width: 70,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        paddingVertical: 10,
    },
    startTime: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4F46E5',
    },
    endTime: {
        fontSize: 11,
        color: '#818CF8',
        marginTop: 2,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subjectName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F3FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 6,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    /* --- Break Card --- */
    breakCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
        opacity: 0.8,
    },
    breakContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    breakText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#B45309',
        marginRight: 6,
    },
    breakTime: {
        fontSize: 11,
        color: '#D97706',
    },
    breakLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
});

export default TimeTableScreen;
