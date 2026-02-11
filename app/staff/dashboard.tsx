import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    StatusBar,
    Pressable,
    Image,
    BackHandler,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import StaffHeader from '@/src/components/StaffHeader';
import StaffFooter from '@/src/components/StaffFooter';
import { useAuth } from '@/src/hooks/useAuth';
import { StudentService } from '@/src/services/studentService';
import { AttendanceService } from '@/src/services/attendanceService';
import { LeaveService, LeaveApplication } from '@/src/services/commonServices';
import type { DailyAttendance } from '@/src/types/schema';
import { useTheme } from '@/src/hooks/useTheme';

// Types
interface DashboardMetrics {
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    pendingLeaves: number;
}

interface GridItemProps {
    item: {
        title: string;
        icon: string;
        library: any;
        route: any;
        color: string[];
    };
    index: number;
    router: any;
}

// Interactive Grid Item with Haptics + Scale Animation
const GridItem = ({ item, index, router, styles }: GridItemProps & { styles: any }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(item.route);
    };

    const IconLib = item.library;

    return (
        <Animated.View
            entering={FadeInDown.delay(300 + (index * 50)).duration(500)}
            style={styles.gridItemWrapper}
        >
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                <Pressable
                    style={({ pressed }) => [styles.gridItem, { opacity: pressed ? 0.9 : 1 }]}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handlePress}
                >
                    <LinearGradient
                        colors={item.color as [string, string]}
                        style={styles.gridGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <IconLib name={item.icon as any} size={32} color="#FFF" />
                        <Text style={styles.gridLabel}>{item.title}</Text>
                        {/* Decorative circle */}
                        <View style={styles.decorativeCircle} />
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

export default function StaffDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme, isDark } = useTheme();

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                // Determine classId from user object safely
                const classId = (user as any)?.classId;

                // Initialize base data (leaves apply to all staff)
                const pendingLeaves = await LeaveService.getAll({ status: 'pending' });

                let studentCount = 0;
                let presentCount = 0;
                let absentCount = 0;

                // Only fetch class-specific data if a valid classId is present
                if (classId) {
                    const studentsResponse = await StudentService.getAll({ class_section_id: classId, limit: 100 });
                    const students = studentsResponse.data;
                    const date = new Date().toISOString().split('T')[0];
                    const todaysAttendance = await AttendanceService.getClassAttendance(classId, date);

                    studentCount = studentsResponse.meta?.total || 0;
                    presentCount = todaysAttendance.filter((a: DailyAttendance) => a.status === 'present').length;
                    absentCount = todaysAttendance.filter((a: DailyAttendance) => a.status === 'absent').length;
                }

                setDashboardData({
                    totalStudents: studentCount,
                    presentToday: presentCount,
                    absentToday: absentCount,
                    pendingLeaves: pendingLeaves.length
                });
            } catch (e) {
                console.error("Error loading dashboard data:", e);
                // Set zero state on error to prevent crash
                setDashboardData({
                    totalStudents: 0,
                    presentToday: 0,
                    absentToday: 0,
                    pendingLeaves: 0
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    // Handle Hardware Back Button
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );

    const menuItems = [
        { title: t('staff_dashboard.attendance'), icon: 'calendar-check', library: FontAwesome5, route: '/staff/manage-students', color: ['#6366f1', '#818cf8'] },
        { title: t('staff_dashboard.timetable'), icon: 'table', library: FontAwesome5, route: '/staff/timetable', color: ['#10b981', '#34d399'] },
        { title: t('staff_dashboard.results'), icon: 'poll', library: MaterialIcons, route: '/staff/results', color: ['#f59e0b', '#fbbf24'] },
        { title: t('staff_dashboard.leaves'), icon: 'calendar-minus', library: FontAwesome5, route: '/staff/leaves', color: ['#ec4899', '#f472b6'] }, // Changed route to leaves page
        { title: "Complaints", icon: "chatbubble-ellipses", library: Ionicons, route: "/staff/complaints", color: ['#8B5CF6', '#A78BFA'] }, // New complaints tile
    ];

    const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

    return (
        <View style={styles.container}>
            <StaffHeader title={t('staff_dashboard.title')} />
            <ScrollView contentContainerStyle={styles.content}>

                {/* Custom Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View>
                        <Text style={styles.welcomeText}>{t('staff_dashboard.welcome')},</Text>
                        <Text style={styles.teacherName}>{user?.display_name || 'Teacher'}</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3429/3429440.png' }}
                        style={styles.avatar}
                    />
                </View>

                {/* Info Cards Row */}
                <View style={styles.infoCardsRow}>
                    <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.card : '#EEF2FF' }]}>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>{dashboardData?.totalStudents || 0}</Text>
                        <Text style={styles.infoLabel}>My Students</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.card : '#ECFDF5' }]}>
                        <Text style={[styles.infoValue, { color: theme.colors.success }]}>{dashboardData?.presentToday || 0}</Text>
                        <Text style={styles.infoLabel}>Present</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.card : '#FEF2F2' }]}>
                        <Text style={[styles.infoValue, { color: theme.colors.danger }]}>{dashboardData?.absentToday || 0}</Text>
                        <Text style={styles.infoLabel}>Absent</Text>
                    </View>
                </View>

                <View style={styles.gridContainer}>
                    {menuItems.map((item, index) => (
                        <GridItem key={index} item={item} index={index} router={router} styles={styles} />
                    ))}
                </View>

            </ScrollView>
            <StaffFooter />
        </View>
    );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    welcomeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: theme.colors.card,
        padding: 20,
        borderRadius: 20,
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    welcomeText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    teacherName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#EFF6FF',
    },
    infoCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    infoCard: {
        width: '31%',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    infoValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItemWrapper: {
        width: '48%',
        height: 140, // Taller cards
        marginBottom: 15,
    },
    gridItem: {
        flex: 1,
        borderRadius: 24, // Rounder corners
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    gridGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        position: 'relative',
    },
    gridLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginTop: 10,
        letterSpacing: 0.5,
    },
    decorativeCircle: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
});


