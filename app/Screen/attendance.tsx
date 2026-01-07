import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';
import { useAuth } from '../../src/hooks/useAuth';
import { AttendanceService } from '../../src/services/attendance.service';
import { Attendance } from '../../src/types/models';

export default function AttendanceScreen() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<Attendance[]>([]);
    const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, percentage: 0 });

    useEffect(() => {
        loadAttendance();
    }, [user]);

    const loadAttendance = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch records and stats
            // In a real app we might paginate or limit to current month
            const [data, statData] = await Promise.all([
                AttendanceService.getByStudent(user.uid),
                AttendanceService.getStudentStats(user.uid)
            ]);

            // Sort manually if index missing
            const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecords(sorted);

            // Map stats or use statData
            // If statData is robust use it, else calc local
            setStats({
                present: statData.present || sorted.filter(r => r.status === 'present').length,
                absent: statData.absent || sorted.filter(r => r.status === 'absent').length,
                leave: sorted.filter(r => r.status === 'leave' || r.status === 'holiday').length, // Assuming 'leave' in enum logic or status
                percentage: statData.percentage || 0
            });

        } catch (error) {
            console.log("Failed to load attendance", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present': return '#16a34a';
            case 'absent': return '#dc2626';
            case 'holiday': return '#9333ea';
            case 'leave': return '#f59e0b';
            case 'late': return '#ca8a04';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
        switch (status.toLowerCase()) {
            case 'present': return 'checkmark-circle';
            case 'absent': return 'close-circle';
            case 'holiday': return 'calendar';
            case 'leave': return 'time';
            default: return 'help-circle';
        }
    };

    const renderItem = ({ item, index }: { item: Attendance, index: number }) => {
        const color = getStatusColor(item.status);
        const dateObj = new Date(item.date);
        const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = dateObj.getDate();

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 100).duration(500)}
                style={styles.card}
            >
                {/* Date Side - Left */}
                <View style={[styles.dateBox, { backgroundColor: color + '15' }]}>
                    <Text style={[styles.dayText, { color: color }]}>{day}</Text>
                    <Text style={[styles.dateText, { color: color }]}>{dayNum}</Text>
                </View>

                {/* Status Content - Right */}
                <View style={styles.cardContent}>
                    <View>
                        <Text style={styles.fullDate}>{dateObj.toDateString()}</Text>
                        <Text style={[styles.statusMain, { color }]}>{item.status.toUpperCase()}</Text>
                    </View>
                    <Ionicons name={getStatusIcon(item.status)} size={28} color={color} />
                </View>
            </Animated.View>
        );
    };

    return (
        <ScreenLayout>
            <StudentHeader showBackButton={true} title={t('attendance_screen.title', 'Attendance')} />

            <View style={styles.container}>
                {/* HEADER STATS */}
                <View style={styles.summaryContainer}>
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.summaryCard}
                    >
                        <Text style={styles.summaryTitle}>{t('attendance_screen.stats', 'Statistics')}</Text>
                        <View style={styles.statRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>{stats.percentage}%</Text>
                                <Text style={styles.statLabel}>{t('attendance_screen.present', 'Present')}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>{stats.absent}</Text>
                                <Text style={styles.statLabel}>{t('attendance_screen.absent', 'Absent')}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>{stats.leave}</Text>
                                <Text style={styles.statLabel}>{t('attendance_screen.leave', 'Leave')}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* LIST */}
                {loading ? (
                    <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={records}
                        keyExtractor={(item) => item.id || item.date}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No attendance records found.</Text>}
                    />
                )}
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    summaryContainer: {
        padding: 20,
        paddingBottom: 10,
    },
    summaryCard: {
        borderRadius: 20,
        padding: 20,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    summaryTitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statVal: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    list: {
        padding: 20,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dateBox: {
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 8,
    },
    fullDate: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    statusMain: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
