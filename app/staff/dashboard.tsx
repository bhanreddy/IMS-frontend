import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import StaffHeader from '@/src/components/StaffHeader';
import StaffFooter from '@/src/components/StaffFooter';
import { useAuth } from '@/src/hooks/useAuth';
import { StudentService } from '@/src/services/student.service';
import { AttendanceService } from '@/src/services/attendance.service';

// Interactive Grid Item with Haptics + Scale Animation
const GridItem = ({ item, index, router }: { item: any, index: number, router: any }) => {
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
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                // If user has a class assigned (e.g. user.classId or specific field)
                // Assuming user object has 'classId' if they are a class teacher
                // If not, fetch all related students?
                // For now, assuming classId is stored in user profile.

                // Mock classId if missing for dev
                const classId = (user as any).classId || 'class_10_a';

                const students = await StudentService.getByClass(classId);
                const todaysAttendance = await AttendanceService.getByDate(new Date().toISOString().split('T')[0], classId);

                setDashboardData({
                    totalStudents: students.length,
                    presentToday: todaysAttendance.filter(a => a.status === 'present').length,
                    absentToday: todaysAttendance.filter(a => a.status === 'absent').length,
                    pendingLeaves: 2 // Mock/Placeholder until LeaveService
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const menuItems = [
        { title: t('staff_dashboard.attendance'), icon: 'calendar-check', library: FontAwesome5, route: '/staff/manage-students', color: ['#6366f1', '#818cf8'] },
        { title: t('staff_dashboard.timetable'), icon: 'table', library: FontAwesome5, route: '/staff/timetable', color: ['#10b981', '#34d399'] },
        { title: t('staff_dashboard.results'), icon: 'poll', library: MaterialIcons, route: '/staff/results', color: ['#f59e0b', '#fbbf24'] },
        { title: t('staff_dashboard.leaves'), icon: 'calendar-minus', library: FontAwesome5, route: '/staff/leaves', color: ['#ec4899', '#f472b6'] }, // Changed route to leaves page
        { title: "Complaints", icon: "chatbubble-ellipses", library: Ionicons, route: "/staff/complaints", color: ['#8B5CF6', '#A78BFA'] }, // New complaints tile
    ];

    return (
        <View style={styles.container}>
            <StaffHeader title={t('staff_dashboard.title')} />
            <ScrollView contentContainerStyle={styles.content}>

                {/* Custom Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View>
                        <Text style={styles.welcomeText}>{t('staff_dashboard.welcome')},</Text>
                        <Text style={styles.teacherName}>{user?.name || 'Teacher'}</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3429/3429440.png' }}
                        style={styles.avatar}
                    />
                </View>

                {/* Info Cards Row */}
                <View style={styles.infoCardsRow}>
                    <View style={[styles.infoCard, { backgroundColor: '#EEF2FF' }]}>
                        <Text style={styles.infoValue}>{dashboardData?.totalStudents || 0}</Text>
                        <Text style={styles.infoLabel}>My Students</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.infoValue, { color: '#059669' }]}>{dashboardData?.presentToday || 0}</Text>
                        <Text style={styles.infoLabel}>Present</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: '#FEF2F2' }]}>
                        <Text style={[styles.infoValue, { color: '#DC2626' }]}>{dashboardData?.absentToday || 0}</Text>
                        <Text style={styles.infoLabel}>Absent</Text>
                    </View>
                </View>

                <View style={styles.gridContainer}>
                    {menuItems.map((item, index) => (
                        <GridItem key={index} item={item} index={index} router={router} />
                    ))}
                </View>

            </ScrollView>
            <StaffFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 3,
    },
    welcomeText: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 4,
    },
    teacherName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EFF6FF',
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
    },
    infoValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
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
