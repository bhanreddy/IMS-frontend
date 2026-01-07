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
import { FeesService } from '../../src/services/fees.service'; // Updated Service

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
            // Parallel fetch
            const [sData, tData] = await Promise.all([
                FeesService.getStats(),
                FeesService.getRecentTransactions()
            ]);
            setStatsData(sData);
            setTransactions(tData);
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
            id: 'fees',
            title: t('accounts_dashboard.collect_fees'),
            icon: 'cash',
            color: ['#10B981', '#059669'],
            route: '/accounts/fees', // Ensure this route exists or update to fees logical route
            library: Ionicons
        },
        // ... kept other actions same ...
        {
            id: 'manage',
            title: t('accounts_dashboard.manage_users', 'Manage Users'),
            icon: 'people-circle',
            color: ['#3B82F6', '#2563EB'],
            route: '/accounts/manage-users',
            library: Ionicons
        },
        {
            id: 'student',
            title: t('accounts_dashboard.addStudent'),
            icon: 'school',
            color: ['#F43F5E', '#E11D48'],
            route: '/accounts/addStudent',
            library: Ionicons
        },
        {
            id: 'staff',
            title: t('accounts_dashboard.addStaff'),
            icon: 'person-add',
            color: ['#8B5CF6', '#7C3AED'],
            route: '/accounts/addStaff',
            library: Ionicons
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            <AdminHeader title="Accounts" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        height: 120,
        width: '100%',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 4,
    },
    mainIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    mainValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
    },
    mainLabel: {
        marginTop: 2,
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
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
        color: '#111827',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
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
        shadowColor: '#000',
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
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    txLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
    },
    txName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    txSub: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 1,
    },
    txRight: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#10B981',
    },
    txTime: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
});
