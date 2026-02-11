import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AdminHeader from '../../src/components/AdminHeader';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/hooks/useAuth'; // Updated hook
import { FeeService as FeesService } from '../../src/services/feeService';
import { useTheme } from '../../src/hooks/useTheme';

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
                        <IconLib name={item.icon as any} size={36} color="#FFF" />
                        <Text style={styles.gridLabel}>{item.title}</Text>
                        <View style={styles.decorativeCircle} />
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

export default function AccountsDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth(); // Use Auth Hook
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await FeesService.getDashboardStats();

            setStatsData({
                totalCollection: `₹${data.monthly_collection.toLocaleString()}`,
                todaysCollection: `₹${data.today_collection.toLocaleString()}`,
                pendingDues: `₹${data.pending_dues.toLocaleString()}`
            });

            // Map transactions to UI format
            const mappedTransactions = data.recent_transactions.map((tx: any) => ({
                id: tx.id,
                name: tx.student_name,
                class: tx.class_name || 'N/A',
                type: tx.fee_type || 'Fee',
                amount: `+₹${tx.amount.toLocaleString()}`,
                time: new Date(tx.collected_at).toLocaleDateString()
            }));

            setTransactions(mappedTransactions);
        } catch (e) {
            console.error("Failed to load accounts data", e);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            id: 'today',
            title: t('accounts_dashboard.todays_collection'),
            value: loading ? '...' : (statsData?.todaysCollection || '₹0'),
            icon: 'wallet',
            color: '#10B981',
        },
        {
            id: 'pending',
            title: t('accounts_dashboard.pending_dues'),
            value: loading ? '...' : (statsData?.pendingDues || '₹0'),
            icon: 'file-invoice-dollar',
            color: '#EF4444',
        },
    ];

    const quickActions = [
        {
            id: 'collect',
            title: t('accounts_dashboard.collect_fees', 'Collect Fees'),
            icon: 'cash',
            color: ['#10B981', '#059669'], // Green
            route: '/accounts/fees',
            library: Ionicons
        },
        {
            id: 'expenses',
            title: t('accounts_dashboard.expenses', 'Expenses'),
            icon: 'receipt', // or document-text
            color: ['#EF4444', '#B91C1C'], // Red
            route: '/accounts/expenses',
            library: Ionicons
        },
        {
            id: 'payroll',
            title: t('accounts_dashboard.payroll', 'Payroll'),
            icon: 'people',
            color: ['#6366F1', '#4338CA'], // Indigo (Payroll)
            route: '/accounts/payroll',
            library: Ionicons
        },
        {
            id: 'defaulters',
            title: t('accounts_dashboard.defaulters', 'Defaulters'),
            icon: 'alert-circle',
            color: ['#F59E0B', '#D97706'], // Orange
            route: '/accounts/defaulters',
            library: Ionicons
        },
        {
            id: 'invoices',
            title: t('accounts_dashboard.invoices', 'Invoices'),
            icon: 'document-text',
            color: ['#3B82F6', '#2563EB'], // Blue
            route: '/accounts/invoices',
            library: Ionicons
        },
        {
            id: 'receipts',
            title: t('accounts_dashboard.receipts', 'Receipts'),
            icon: 'documents',
            color: ['#0EA5E9', '#0284C7'], // Sky Blue
            route: '/accounts/receipts',
            library: Ionicons
        },
        {
            id: 'staff',
            title: t('accounts_dashboard.addStaff', 'Add Staff'),
            icon: 'person-add',
            color: ['#8B5CF6', '#7C3AED'], // Purple
            route: '/accounts/addStaff',
            library: Ionicons
        },
        {
            id: 'student',
            title: t('accounts_dashboard.addStudent', 'Add Student'),
            icon: 'school',
            color: ['#F43F5E', '#E11D48'], // Pink/Red
            route: '/accounts/addStudent',
            library: Ionicons
        },
        {
            id: 'pending_enrollments',
            title: t('accounts_dashboard.pending_enrollments', 'Pending Enrollments'), // New Action
            icon: 'person-add-outline',
            color: ['#8B5CF6', '#7C3AED'], // Violet
            route: '/accounts/pending-enrollments',
            library: Ionicons
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <AdminHeader title="Accounts" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* GREETING */}
                <View style={styles.greetingContainer}>
                    <Text style={styles.greetingText}>Hello, {user?.first_name || 'Admin'} 👋</Text>
                    <Text style={styles.greetingSubText}>{t('accounts_dashboard.welcome_back', 'Here is your financial overview')}</Text>
                </View>

                {/* MAIN STAT */}
                <Animated.View entering={FadeInDown.duration(600)} style={styles.mainCard}>
                    <View style={styles.mainIcon}>
                        <FontAwesome5 name="wallet" size={26} color="#3B82F6" />
                    </View>
                    <View>
                        <Text style={styles.mainValue}>
                            {loading ? '...' : (statsData?.totalCollection || '₹0')}
                        </Text>
                        <Text style={styles.mainLabel}>
                            {t('accounts_dashboard.total_collection_month')}
                        </Text>
                    </View>
                </Animated.View>

                {/* STATS */}
                <View style={styles.statsRow}>
                    {stats.map((item, index) => (
                        <Animated.View
                            key={item.id}
                            entering={FadeInDown.delay(150 + index * 100)}
                            style={styles.statCard}
                        >
                            <View style={[styles.statIcon, { backgroundColor: item.color + '20' }]}>
                                <FontAwesome5 name={item.icon as any} size={18} color={item.color} />
                            </View>
                            <Text style={styles.statValue}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.title}</Text>
                        </Animated.View>
                    ))}
                </View>

                {/* QUICK ACTIONS */}
                <Text style={styles.sectionTitle}>{t('dashboard.quick_actions', 'Quick Actions')}</Text>
                <View style={styles.gridContainer}>
                    {quickActions.map((action, index) => (
                        <GridItem key={action.id} item={action} index={index} router={router} />
                    ))}
                </View>

                {/* TRANSACTIONS */}
                <Text style={styles.sectionTitle}>{t('dashboard.recent_transactions', 'Recent Transactions')}</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                    transactions.map((tx, index) => (
                        <Animated.View
                            key={tx.id}
                            entering={FadeInDown.delay(500 + index * 100)}
                            style={styles.txCard}
                        >
                            <View style={styles.txLeft}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{tx.name[0]}</Text>
                                </View>
                                <View>
                                    <Text style={styles.txName}>{tx.name}</Text>
                                    <Text style={styles.txSub}>{tx.class} • {tx.type}</Text>
                                </View>
                            </View>
                            <View style={styles.txRight}>
                                <Text style={styles.txAmount}>{tx.amount}</Text>
                                <Text style={styles.txTime}>{tx.time}</Text>
                            </View>
                        </Animated.View>
                    ))
                )}
                {!loading && transactions.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#9CA3AF', padding: 20 }}>No recent transactions.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const { theme, isDark } = useTheme();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    mainCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 22,
        height: 120,
        width: '100%',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 4,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    mainIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    mainValue: {
        fontSize: 26,
        fontWeight: '800',
        color: theme.colors.text,
    },
    mainLabel: {
        marginTop: 2,
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    statCard: {
        width: '48%',
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 14,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
        justifyContent: 'center',
    },
    gridItemWrapper: {
        width: '45%',
        height: 150,
        marginBottom: 10,
        marginRight: '2%',
    },
    gridItem: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 6,
    },
    gridGradient: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    gridLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
    },
    decorativeCircle: {
        position: 'absolute',
        right: -20,
        top: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    txCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    txLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: isDark ? 'rgba(79, 70, 229, 0.2)' : '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5', // Keep brand color
    },
    txName: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
    },
    txSub: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: 1,
    },
    txRight: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.success,
    },
    txTime: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    greetingContainer: {
        marginBottom: 24,
        marginTop: 10,
    },
    greetingText: {
        fontSize: 26,
        fontWeight: '800',
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    greetingSubText: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        marginTop: 6,
        fontWeight: '500',
    },
});


