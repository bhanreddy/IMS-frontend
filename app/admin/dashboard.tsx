import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    BackHandler,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import AdminHeader from '../../src/components/AdminHeader';
import { ADMIN_THEME } from '../../src/constants/adminTheme';
import { useAuth } from '../../src/hooks/useAuth';
import { api } from '../../src/services/apiClient';
import { AdminDashboardStats } from '../../src/types/models';
import { AdminService } from '../../src/services/adminService';
import { useTheme } from '../../src/hooks/useTheme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface ActionItem {
    title: string;
    icon: IconName;
    route: string;
    gradient: [string, string];
}

interface StatItem {
    label: string;
    value: string | number;
    icon: IconName;
    color: string;
    bg: string;
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const [dashboardData, setDashboardData] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        // ... rest of file


        (async () => {
            try {
                // Determine logic based on silent?
                const data = await AdminService.getDashboardStats({ silent: true });
                setDashboardData(data);
            } catch (err: any) {
                // Suppress expected error when switching roles
                if (err?.message?.includes('Student profile not found')) {
                    console.warn('[AdminDashboard] Suppressed student profile error during role switch.');
                } else {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

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

    const { theme, isDark } = useTheme();
    const styles = useMemo(() => getStyles(theme, isDark), [theme, isDark]);

    /* --------------------------------- STATS -------------------------------- */

    const stats: StatItem[] = [
        {
            label: 'Total Students',
            value: loading ? '—' : dashboardData?.totalStudents ?? 0,
            icon: 'people-outline',
            color: '#3B82F6',
            bg: '#EFF6FF',
        },
        {
            label: 'Staff Present',
            value: loading
                ? '—'
                : `${dashboardData?.staffPresent ?? 0} / ${dashboardData?.totalStaff ?? 0}`,
            icon: 'id-card-outline',
            color: '#10B981',
            bg: '#ECFDF5',
        },
        {
            label: 'Collection',
            value: loading
                ? '—'
                : `₹${(dashboardData?.collection ?? 0).toLocaleString()}`,
            icon: 'wallet-outline',
            color: '#F59E0B',
            bg: '#FFFBEB',
        },
        {
            label: 'Complaints',
            value: loading ? '—' : dashboardData?.complaints ?? 0,
            icon: 'alert-circle-outline',
            color: '#EF4444',
            bg: '#FEF2F2',
        },
    ];

    /* ------------------------------ QUICK ACTIONS ---------------------------- */

    /* ------------------------------ QUICK ACTIONS ---------------------------- */

    const quickActions: ActionItem[] = [
        { title: 'Manage Staff', icon: 'people-outline', route: '/admin/manage-staff', gradient: ['#A78BFA', '#8B5CF6'] },
        { title: 'Academic Structure', icon: 'school-outline', route: '/admin/academics', gradient: ['#3B82F6', '#2DD4BF'] },
        { title: 'Timetable Manager', icon: 'calendar-outline', route: '/admin/timetable', gradient: ['#EA580C', '#F97316'] },
        { title: 'Fee Structure', icon: 'wallet-outline', route: '/admin/fees/set-class-fee', gradient: ['#6366F1', '#A855F7'] },
        { title: 'Add Accounts Staff', icon: 'person-add-outline', route: '/admin/add-accounts-staff', gradient: ['#FBBF24', '#F59E0B'] },
        { title: 'Transport', icon: 'bus-outline', route: '/admin/transport', gradient: ['#FB923C', '#F97316'] },
        { title: 'Expense Tracker', icon: 'receipt-outline', route: '/admin/expenses', gradient: ['#6366F1', '#4F46E5'] },

        { title: 'Notices', icon: 'megaphone-outline', route: '/admin/notices', gradient: ['#F472B6', '#EC4899'] },
        { title: 'Leaves', icon: 'document-text-outline', route: '/admin/leaves', gradient: ['#818CF8', '#6366F1'] },
        { title: 'Complaints', icon: 'chatbubble-ellipses-outline', route: '/admin/complaints', gradient: ['#F87171', '#EF4444'] },

        { title: 'View Reports', icon: 'bar-chart-outline', route: '/admin/reports', gradient: ['#60A5FA', '#3B82F6'] },
        { title: 'Certificates', icon: 'ribbon-outline', route: '/admin/certificate-generator', gradient: ['#22D3EE', '#06B6D4'] },
        { title: 'Manage Content', icon: 'library-outline', route: '/admin/manage-content', gradient: ['#14B8A6', '#0D9488'] },
        { title: 'Progress Reports', icon: 'stats-chart-outline', route: '/admin/progress-report-generator', gradient: ['#C4B5FD', '#8B5CF6'] },

        // Principal 360 removed (file does not exist)
        { title: 'Smart Insights', icon: 'bulb-outline', route: '/admin/smart-insights', gradient: ['#6EE7B7', '#34D399'] },
    ];

    /* ------------------------------- GRID ITEM ------------------------------- */

    const GridItem = ({ item, index }: { item: ActionItem; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 50).springify().damping(12)}
            style={styles.gridWrapper}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push(item.route as any)}
                style={styles.gridItem}
            >
                <LinearGradient
                    colors={item.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gridGradient}
                >
                    {/* Decorative Circles */}
                    < View style={styles.decorativeCircle1} />
                    <View style={styles.decorativeCircle2} />

                    <View style={styles.gridContent}>
                        <View style={styles.iconBox}>
                            <Ionicons name={item.icon} size={24} color="#fff" />
                        </View>

                        <View style={styles.textContainer}>
                            <Text numberOfLines={2} style={styles.gridTitle}>
                                {item.title}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" style={{ marginTop: 8 }} />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View >
    );

    /* ---------------------------------- UI ---------------------------------- */

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <AdminHeader title={t('Dashboard')} showNotification />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Greeting */}
                <View style={styles.greeting}>
                    <Text style={styles.greetingSub}>Good Morning</Text>
                    <Text style={styles.greetingTitle}>{user?.display_name || 'Principal'}</Text>
                    <Text style={styles.greetingDate}>
                        {new Date().toDateString()}
                    </Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {stats.map((s, i) => (
                        <View key={i} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                                <Ionicons name={s.icon} size={22} color={s.color} />
                            </View>
                            <Text style={styles.statLabel}>{s.label}</Text>
                            <Text style={styles.statValue}>{s.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <View style={styles.grid}>
                    {quickActions.map((item, index) => (
                        <GridItem key={index} item={item} index={index} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */
const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },

    /* Greeting */
    greeting: { marginBottom: 24 },
    greetingSub: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
    greetingTitle: { fontSize: 26, fontWeight: '700', color: theme.colors.text },
    greetingDate: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },

    /* Stats */
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        width: '48%',
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statLabel: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
    statValue: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginTop: 4 },

    /* Section */
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 16,
    },

    /* Grid */
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridWrapper: { width: '48%', marginBottom: 16 },
    gridItem: {
        height: 140, // Taller cards
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000', // Subtle shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    gridGradient: {
        flex: 1,
        padding: 16,
        position: 'relative',
    },
    gridContent: {
        flex: 1,
        justifyContent: 'space-between',
        zIndex: 2,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)', // More transparent/glassy
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        // Pushes content to bottom
    },
    gridTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    /* Decoration */
    decorativeCircle1: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: 1,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: 1,
    },
});
