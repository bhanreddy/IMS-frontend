import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StudentHeader from '../../src/components/StudentHeader';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/hooks/useAuth';

// WatermelonDB
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from '@nozbe/watermelondb'
import database from '../../src/database'
import DiaryEntry from '../../src/database/models/DiaryEntry'
import { sync } from '../../src/database/sync'

// --- Diary List Component (Enhanced) ---

const DiaryListRaw = ({ tasks }: { tasks: DiaryEntry[] }) => {
    const { t } = useTranslation();

    const getSubjectStyle = (subject: string = '') => {
        const s = subject.toLowerCase();
        if (s.includes('math')) return { color: '#3B82F6', icon: 'calculate' };
        if (s.includes('science') || s.includes('bio')) return { color: '#8B5CF6', icon: 'biotech' };
        if (s.includes('telugu') || s.includes('hindi') || s.includes('english')) return { color: '#F59E0B', icon: 'book' };
        if (s.includes('social')) return { color: '#EC4899', icon: 'public' };
        return { color: '#6366F1', icon: 'description' };
    };

    if (tasks.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cafe-outline" size={64} color="#E5E7EB" />
                <Text style={styles.noWorkText}>No homework assigned today 🎉</Text>
            </View>
        );
    }

    return (
        <View style={styles.tasksContainer}>
            {tasks.map((item, index) => {
                const style = getSubjectStyle(item.subjectName || item.title);
                return (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(index * 100).duration(600)}
                    >
                        <View style={styles.taskCard}>
                            <View style={[styles.colorStrip, { backgroundColor: style.color }]} />
                            <View style={styles.cardInner}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.subjectRow}>
                                        <MaterialIcons name={style.icon as any} size={18} color={style.color} />
                                        <Text style={[styles.subjectName, { color: style.color }]}>{item.subjectName || 'General'}</Text>
                                    </View>
                                    {item.homeworkDueDate && (
                                        <View style={styles.dueBadge}>
                                            <Ionicons name="time-outline" size={12} color="#6B7280" />
                                            <Text style={styles.dueText}>Due: {new Date(item.homeworkDueDate).toLocaleDateString()}</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.homeworkContent}>
                                    <Text style={styles.homeworkText}>{item.content}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                );
            })}
        </View>
    );
};

const enhance = withObservables(['date', 'classId'], ({ date, classId }) => ({
    tasks: database.collections.get<DiaryEntry>('diary_entries').query(
        Q.where('entry_date', date),
        // Q.where('class_section_id', classId) // Optional: strict class filtering
    )
}))

const DiaryList = enhance(DiaryListRaw);


// --- Main Screen ---

export default function DiaryScreen() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        triggerSync();
    }, [user]);

    const triggerSync = async () => {
        if (!user) return;
        setSyncing(true);
        try {
            await sync();
        } catch (e) {
            console.warn('Sync failed', e);
        } finally {
            setSyncing(false);
        }
    };

    const dateStr = selectedDate.toISOString().split('T')[0];

    return (
        <View style={styles.container}>
            <StudentHeader showBackButton={true} title={t('home.diary', 'Diary')} />

            <ScrollView style={styles.scrollContent}>
                {/* Date Header */}
                <View style={styles.dateHeader}>
                    <View>
                        <Text style={styles.dateSubtitle}>{selectedDate.toDateString()}</Text>
                        <Text style={styles.dateTitle}>{t('diary.today_tasks', 'Today\'s Homework')}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        {syncing && <ActivityIndicator size="small" color="#6366F1" />}
                    </View>
                </View>

                {/* Enhanced List with Observables */}
                {user && (
                    <DiaryList
                        date={dateStr}
                        classId={(user as any).classId || ''}
                    />
                )}

            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        opacity: 0.5,
    },
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
        justifyContent: 'center',
        height: 30
    },
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
    noWorkText: {
        color: '#9CA3AF',
        fontStyle: 'italic',
        fontSize: 13,
        marginTop: 5,
    },
});


