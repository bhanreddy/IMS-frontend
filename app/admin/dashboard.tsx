import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons, Feather } from '@expo/vector-icons';

import AdminHeader from '../../src/components/AdminHeader';
import { ADMIN_THEME } from '../../src/constants/adminTheme';
import { useAuth } from '../../src/hooks/useAuth';
import { StudentService } from '../../src/services/student.service';
import { StaffService } from '../../src/services/staff.service';
import { ComplaintService } from '../../src/services/complaint.service';

interface ActionItem {
    title: string;
    icon: any;
    route: any;
    gradient: [string, string, ...string[]];
    iconBg: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();
    const [chartTab, setChartTab] = useState<'attendance' | 'finance'>('attendance');
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                // Parallel fetch for speed
                // Note: ComplaintService not yet fully implemented in previous steps? 
                // Ensuring it exists or mocking if I missed it.
                // I created it in step 853.

                // Using Promise.allSettled to avoid complete failure if one fails
                const results = await Promise.allSettled([
                    StudentService.getAll(),
                    StaffService.getAll(),
                    ComplaintService.getAll()
                ]);

                const students = results[0].status === 'fulfilled' ? results[0].value : [];
                const staff = results[1].status === 'fulfilled' ? results[1].value : [];
                const complaints = results[2].status === 'fulfilled' ? results[2].value : [];

                setDashboardData({
                    studentCount: students.length,
                    staffCount: staff.length,
                    complaints: complaints
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    /* ---------------- STATS ---------------- */
    const stats = [
        {
            label: t('admin_dashboard.total_students'),
            value: loading ? '...' : (dashboardData?.studentCount ? `${dashboardData.studentCount}` : '0'),
            icon: 'people',
            color: ADMIN_THEME.colors.primary,
            trend: '+12%',
            positive: true,
        },
        {
            label: t('admin_dashboard.staff_present'),
            value: loading ? '...' : (dashboardData?.staffCount ? `${dashboardData.staffCount}` : '0'),
            icon: 'id-card',
            color: ADMIN_THEME.colors.success,
            trend: '92%',
            positive: true,
        },
        {
            label: t('admin_dashboard.collection'),
            value: 'N/A', // Placeholder for now
            icon: 'wallet',
            color: ADMIN_THEME.colors.warning,
            trend: '+5.4%',
            positive: true,
        },
        {
            label: t('admin_dashboard.complaints'),
            value: loading ? '...' : (dashboardData?.complaints ? `${dashboardData.complaints.length}` : '0'),
            icon: 'alert-circle',
            color: ADMIN_THEME.colors.danger,
            trend: '-2',
            positive: false,
        },
    ];

    /* ---------------- QUICK ACTIONS (GRID) ---------------- */
    const quickActions: ActionItem[] = [
        {
            title: t('admin_dashboard.manage_staff'),
            icon: 'people-outline',
            route: '/admin/manage-staff',
            gradient: ['#7C3AED', '#A78BFA'], // Deeper Violet -> Light Violet
            iconBg: 'rgba(124, 58, 237, 0.2)',
        },
        {
            title: t('admin_dashboard.transport'),
            icon: 'bus-outline',
            route: '/admin/transport',
            gradient: ['#EA580C', '#FB923C'], // Burnt Orange -> Light Orange
            iconBg: 'rgba(234, 88, 12, 0.2)',
        },
        {
            title: t('admin_dashboard.events'),
            icon: 'calendar-outline',
            route: '/admin/events',
            gradient: ['#059669', '#34D399'], // Green -> Light Green
            iconBg: 'rgba(5, 150, 105, 0.2)',
        },
        {
            title: "Principal Tracker",
            icon: "analytics-outline",
            route: "/admin/principal-tracker",
            gradient: ['#2563EB', '#60A5FA'],
            iconBg: 'rgba(37, 99, 235, 0.2)',
        },
        {
            title: t('admin_dashboard.fees'),
            icon: 'cash-outline',
            route: '/admin/fees/set-class-fee', // Updated route
            gradient: ['#DC2626', '#F87171'],
            iconBg: 'rgba(220, 38, 38, 0.2)',
        },
        {
            title: "Complaints",
            icon: "chatbubble-ellipses-outline",
            route: "/admin/complaints",
            gradient: ['#D946EF', '#F0ABFC'], // Fuchsia
            iconBg: 'rgba(217, 70, 239, 0.2)',
        },
        {
            title: t('admin_dashboard.manage_users'),
            icon: 'people-circle-outline',
            route: '/accounts/manage-users',
            gradient: ['#4F46E5', '#818CF8'],
            iconBg: 'rgba(79, 70, 229, 0.2)',
        }
    ];

    // Grid Item Component (Internal)
    const GridItem = ({ item, index }: { item: ActionItem, index: number }) => (
        <Animated.View exiting={FadeInDown} entering={FadeInDown.delay(index * 100)}>
            <TouchableOpacity onPress={() => router.push(item.route)} style={styles.gridItem}>
                <LinearGradient
                    colors={item.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gridGradient}
                >
                    <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                        <Ionicons name={item.icon as any} size={28} color="#FFF" />
                    </View>
                    <Text style={styles.gridTitle}>{item.title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={ADMIN_THEME.colors.primary} />
            <AdminHeader title={t('admin_dashboard.title')} showNotification />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statsCard}>
                            <View style={[styles.statsIcon, { backgroundColor: stat.color + '15' }]}>
                                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <View>
                                <Text style={styles.statsLabel}>{stat.label}</Text>
                                <Text style={styles.statsValue}>{stat.value}</Text>
                                <Text style={[styles.statsTrend, { color: stat.positive ? 'green' : 'red' }]}>{stat.trend}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>{t('admin_dashboard.quick_actions')}</Text>
                <View style={styles.gridContainer}>
                    {quickActions.map((action, index) => (
                        <GridItem key={index} item={action} index={index} />
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ADMIN_THEME.colors.background.app,
    },
    content: {
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statsCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    statsIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statsLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    statsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374151',
    },
    statsTrend: {
        fontSize: 12,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        height: 120,
        marginBottom: 15,
        borderRadius: 20,
        overflow: 'hidden',
    },
    gridGradient: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
