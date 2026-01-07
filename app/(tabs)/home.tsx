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
import { AttendanceService } from '../../src/services/attendance.service';
import { StaffService } from '../../src/services/staff.service';
import { NoticeService } from '../../src/services/notice.service';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                // Assuming 'default_school_id' for now 
                const classId = user.classId || (user as any).class || '';

                // Parallel fetch
                const [attStats, classTeacher, notices] = await Promise.all([
                    AttendanceService.getStudentStats(user.uid),
                    classId ? StaffService.getClassTeacher(classId) : Promise.resolve(null),
                    NoticeService.getRecent()
                ]);

                setDashboardData({
                    attendancePercentage: attStats?.percentage || 0,
                    attendanceToday: 'Present', // Mock or fetch daily
                    classTeacher: classTeacher ? classTeacher.name : 'Not Assigned',
                    notices: notices
                });
            } catch (e) {
                console.log("Failed to load dashboard data", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const homeTabs = [
        { key: 'profile', title: 'Profile', link: 'https://cdn-icons-png.flaticon.com/512/9203/9203764.png', colors: ['#EEF2FF', '#C7D2FE', '#EEF2FF'] },
        { key: 'complaints', title: 'Complaints', link: 'https://cdn-icons-png.flaticon.com/128/7867/7867551.png', colors: ['#FEF2F2', '#FECACA', '#FEF2F2'] },
        { key: 'busmap', title: 'BusMap', link: 'https://cdn-icons-png.flaticon.com/512/4287/4287661.png', colors: ['#F0FDF4', '#BBF7D0', '#F0FDF4'] },
        { key: 'hostel', title: 'Hostel', link: 'https://cdn-icons-png.flaticon.com/512/101/101859.png', colors: ['#FFF1F2', '#FECDD3', '#FFF1F2'] },
        { key: 'messages', title: 'Imp Messages', link: 'https://cdn-icons-png.flaticon.com/512/5875/5875271.png', colors: ['#F5F3FF', '#DDD6FE', '#F5F3FF'] },
        { key: 'values', title: 'Life Values', link: 'https://cdn-icons-png.flaticon.com/512/18333/18333845.png', colors: ['#FFFBEB', '#FDE68A', '#FFFBEB'] },
        { key: 'projects', title: 'Science Projects', link: 'https://cdn-icons-png.flaticon.com/512/10963/10963786.png', colors: ['#ECFEFF', '#A5F3FC', '#ECFEFF'] },
        { key: 'test', title: 'Weekend Test', link: 'https://cdn-icons-png.flaticon.com/512/2995/2995440.png', colors: ['#FDF2F8', '#FBCFE8', '#FDF2F8'] },
    ];

    // ✅ ROUTE MAP (single source of truth)
    const routeMap: Record<string, string> = {
        profile: '/Screen/profile',
        complaints: '/Screen/complaints',
        busmap: '/Screen/busMap',
        hostel: '/Screen/hostel',
        idcard: '/Screen/dcgd',
        messages: '/Screen/announcements',
        values: '/Screen/lifeValues',
        projects: '/Screen/scienceProjects',
        test: '/Screen/weekendTest',
    };

    const handleNavigation = (key: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const route = routeMap[key];
        if (route) {
            router.push(route as any);
        }
    };

    return (
        <ScreenLayout>
            <StudentHeader />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                <HeaderCard
                    schoolName={t('common.school_name', 'School Name')}
                    studentName={user?.name || "Student Name"}
                    classSec={user?.classId || "Class"}
                    rollNo={user?.rollNo || user?.admissionNo || "Roll No"}
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
                                            <Image source={{ uri: item.link }} style={styles.icon} />
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
                    {/* ATTENDANCE */}
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
                                        <Text style={styles.attPercent}>{dashboardData?.attendancePercentage || 0}%</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.attLabel}>{t('home.today', 'Today')}</Text>
                                        <Text style={[styles.attValue, { color: '#16A34A' }]}>{t('home.present', 'Present')}</Text>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* TEACHER */}
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

                        {loading ? (
                            <ActivityIndicator size="small" color="#2563EB" />
                        ) : (
                            <View style={styles.teacherContent}>
                                <Image
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                                    style={styles.teacherAvatar}
                                />
                                <View>
                                    <Text style={styles.teacherName}>{dashboardData?.classTeacher || "Not Assigned"}</Text>
                                    <Text style={styles.teacherSub}>{t('common.class_teacher', 'Class Teacher')}</Text>
                                </View>
                            </View>
                        )}
                    </Animated.View>

                    {/* NOTICE */}
                    {dashboardData?.notices && dashboardData.notices.length > 0 && (
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
                            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{dashboardData.notices[0].title}</Text>
                            <Text numberOfLines={2} style={{ color: '#666' }}>{dashboardData.notices[0].content}</Text>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 40,
        backgroundColor: '#F9FAFB',
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
        shadowColor: '#6366F1',
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
    icon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
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
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
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
        color: '#1F2937',
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
        borderColor: '#16A34A',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
    },
    attPercent: {
        fontSize: 18,
        fontWeight: '800',
        color: '#16A34A',
    },
    attLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    attValue: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    teacherContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    teacherAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    teacherName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    teacherSub: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
});
