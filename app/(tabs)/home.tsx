import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Pressable,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';
import HeaderCard from '../../src/components/HeaderCard';
import { useAuth } from '../../src/hooks/useAuth';
import { NoticeService } from '../../src/services/commonServices';
import { StudentService } from '../../src/services/studentService';
import { Student, AttendanceSummary } from '../../src/types/models';
import { useTheme } from '../../src/hooks/useTheme';

const { width } = Dimensions.get('window');

const homeTabs = [
    { key: 'profile', title: 'Profile', icon: 'person', colors: ['#EEF2FF', '#C7D2FE', '#EEF2FF'] },
    { key: 'fees', title: 'My Fees', icon: 'wallet', colors: ['#ECFDF5', '#6EE7B7', '#ECFDF5'] },
    { key: 'complaints', title: 'Complaints', icon: 'alert-circle', colors: ['#FEF2F2', '#FECACA', '#FEF2F2'] },
    { key: 'busmap', title: 'BusMap', icon: 'bus', colors: ['#F0FDF4', '#BBF7D0', '#F0FDF4'] },
    { key: 'hostel', title: 'Hostel', icon: 'bed', colors: ['#FFF1F2', '#FECDD3', '#FFF1F2'] },
    // { key: 'idcard', title: 'ID Card', icon: 'card', colors: ['#EFF6FF', '#BFDBFE', '#EFF6FF'] },
    { key: 'messages', title: 'Imp Messages', icon: 'chatbubble', colors: ['#F5F3FF', '#DDD6FE', '#F5F3FF'] },
    { key: 'values', title: 'Life Values', icon: 'heart', colors: ['#FFFBEB', '#FDE68A', '#FFFBEB'] },
    { key: 'projects', title: 'Science Projects', icon: 'flask', colors: ['#ECFEFF', '#A5F3FC', '#ECFEFF'] },
    { key: 'money', title: 'Money Science', icon: 'cash', colors: ['#FFF7ED', '#FFEDD5', '#FFF7ED'] },
    { key: 'test', title: 'Weekend Test', icon: 'document-text', colors: ['#FDF2F8', '#FBCFE8', '#FDF2F8'] },
];

const routeMap: Record<string, string> = {
    profile: '/Screen/profile',
    fees: '/(tabs)/fees',
    complaints: '/Screen/complaints',
    busmap: '/Screen/busMap',
    hostel: '/Screen/hostel',
    idcard: '/Screen/dcgd',
    messages: '/Screen/announcements',
    values: '/Screen/lifeValues',
    projects: '/Screen/scienceProjects',
    money: '/Screen/moneyScience',
    test: '/Screen/weekendTest',
};

const HomeScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Data States
    const [student, setStudent] = useState<Student | null>(null);
    const [attendanceStats, setAttendanceStats] = useState<AttendanceSummary | null>(null);
    const [notices, setNotices] = useState<any[]>([]);

    const loadData = async () => {
        if (!user || user.role !== 'student') return;
        try {
            // 1. Fetch Student Profile (Critical for Header)
            // We need this because User object (from Auth) doesn't have class/roll info
            const profileData = await StudentService.getProfile();
            setStudent(profileData);

            // 2. Parallel Fetch for Dashboard Widgets
            // Use profileData.id if available, or user.id fallback
            const studentId = profileData?.id || user.id;

            const [noticesData, attendanceData] = await Promise.all([
                NoticeService.getAll({ audience: 'students' }).catch(() => []),
                StudentService.getAttendance(studentId, { limit: 1 }).catch(() => ({ summary: null, records: [] }))
            ]);

            setNotices(noticesData || []);
            setAttendanceStats(attendanceData.summary);

        } catch (e) {
            console.error("Failed to load dashboard data", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        loadData();
    };

    const handleNavigation = (key: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const route = routeMap[key];
        if (route) {
            router.push(route as any);
        }
    };

    // Derived Attendance Stats
    const attPercentage = attendanceStats?.total
        ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
        : 0;

    return (
        <ScreenLayout>
            <StudentHeader />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
            >
                {/* Header Card with Real Data */}
                <HeaderCard
                    // schoolName is now internal to HeaderCard
                    studentName={student?.display_name || user?.display_name || "Student"}
                    classSec={student?.current_enrollment ? `${student.current_enrollment.class_code} - ${student.current_enrollment.section_name}` : "Class N/A"}
                    rollNo={student?.current_enrollment?.roll_number || "N/A"}
                />

                <View style={styles.gridContainer}>
                    {homeTabs.map((item, index) => (
                        <Animated.View
                            key={item.key}
                            style={styles.gridItemWrapper}
                            entering={ZoomIn.delay(150 + index * 60).duration(450)}
                        >
                            <View style={{ flex: 1 }}>
                                <Pressable
                                    onPress={() => handleNavigation(item.key)}
                                    style={({ pressed }) => [
                                        {
                                            flex: 1,
                                            transform: [{ scale: pressed ? 0.96 : 1 }],
                                        },
                                    ]}
                                >
                                    <LinearGradient
                                        colors={item.colors as [string, string, ...string[]]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.gridCard}
                                    >
                                        <View style={styles.iconBadge}>
                                            <Ionicons name={item.icon as any} size={28} color="#000" style={{ opacity: 0.6 }} />
                                        </View>
                                        <Text style={styles.gridTitle} numberOfLines={2}>
                                            {item.title}
                                        </Text>
                                    </LinearGradient>
                                </Pressable>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* WIDGETS */}
                <View style={styles.widgetsContainer}>
                    {/* ATTENDANCE WIDGET */}
                    <Animated.View
                        style={[styles.widgetCard]}
                        entering={FadeInUp.delay(600).duration(600)}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push('/Screen/attendance');
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.widgetHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                                    <Ionicons name="calendar" size={18} color="#16A34A" />
                                </View>
                                <Text style={styles.widgetTitle}>{t('home.attendance', 'Attendance')}</Text>
                            </View>

                            {loading ? (
                                <ActivityIndicator size="small" color="#16A34A" />
                            ) : (
                                <View style={styles.attContent}>
                                    <View style={styles.attCircle}>
                                        <Text style={styles.attPercent}>{attPercentage}%</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.attLabel}>Academic Year</Text>
                                        <Text style={[styles.attValue, { color: '#16A34A' }]}>
                                            {attendanceStats?.present || 0} / {attendanceStats?.total || 0} Days
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* TEACHER WIDGET (Static for now, backend pending) */}
                    <Animated.View
                        style={[styles.widgetCard]}
                        entering={FadeInUp.delay(700).duration(600)}
                    >
                        <View style={styles.widgetHeader}>
                            <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="person" size={18} color="#2563EB" />
                            </View>
                            <Text style={styles.widgetTitle}>{t('home.class_teacher', 'Class Teacher')}</Text>
                        </View>

                        <View style={styles.teacherContent}>
                            <Ionicons name="person-circle" size={56} color="#CBD5E1" />
                            <View>
                                <Text style={styles.teacherName}>Not Assigned</Text>
                                <Text style={styles.teacherSub}>{t('common.class_teacher', 'Class Teacher')}</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* NOTICE WIDGET */}
                    {notices && notices.length > 0 && (
                        <Animated.View
                            style={[styles.widgetCard]}
                            entering={FadeInUp.delay(800).duration(600)}
                        >
                            <View style={styles.widgetHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#FECACA' }]}>
                                    <Ionicons name="notifications" size={18} color="#DC2626" />
                                </View>
                                <Text style={styles.widgetTitle}>{t('staff_dashboard.important_notice', 'Notice')}</Text>
                            </View>
                            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{notices[0].title}</Text>
                            <Text numberOfLines={2} style={{ color: '#666' }}>{notices[0].content}</Text>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

export default HomeScreen;

const { theme, isDark } = useTheme();

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 40,
        backgroundColor: theme.colors.background,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        marginTop: 14,
    },
    gridItemWrapper: {
        width: '50%',
        padding: 8,
    },
    gridCard: {
        height: 120,
        width: '100%',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 6,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    gridTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        textAlign: 'center',
        lineHeight: 16,
        letterSpacing: 0.2,
    },
    widgetsContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
        gap: 20,
    },
    widgetCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    widgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    widgetTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: theme.colors.text,
        letterSpacing: 0.5,
    },
    attContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    attCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 6,
        borderColor: theme.colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? 'rgba(22, 163, 74, 0.1)' : '#F0FDF4',
    },
    attPercent: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.success,
    },
    attLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    attValue: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.5,
        color: theme.colors.success,
    },
    teacherContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    teacherName: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 2,
    },
    teacherSub: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
});
