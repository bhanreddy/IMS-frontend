import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';
import { StudentService } from '../../src/services/studentService';
import { StudentFee } from '../../src/types/models';
import { useAuth } from '../../src/hooks/useAuth';
import * as Haptics from 'expo-haptics';

export default function FeesScreen() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'breakdown' | 'history'>('breakdown');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [fees, setFees] = useState<StudentFee[]>([]);
    const [summary, setSummary] = useState({
        total_due: 0,
        total_paid: 0,
        balance: 0
    });

    useEffect(() => {
        loadData();
    }, [user?.id]);

    const loadData = async () => {
        if (!user?.id || user.role !== 'student') return;
        try {
            // Get Student Profile first to get the correct Student ID
            const student = await StudentService.getProfile();
            if (!student?.id) return;

            const feeData = await StudentService.getFees(student.id);
            setFees(feeData.fees || []);
            setSummary(feeData.summary || { total_due: 0, total_paid: 0, balance: 0 });

        } catch (error) {
            console.error('Failed to load fees:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        loadData();
    };

    const renderFeeItem = ({ item }: { item: StudentFee }) => {
        const dueAmount = item.amount_due - item.discount;
        const percent = dueAmount > 0 ? (item.amount_paid / dueAmount) * 100 : 0;

        return (
            <View style={styles.feeCard}>
                <View style={styles.feeHeader}>
                    <Text style={styles.feeTitle}>{item.fee_type}</Text>
                    <Text style={styles.feeAmount}>₹{dueAmount.toLocaleString()}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(percent, 100)}%` }]} />
                </View>

                <View style={styles.feeFooter}>
                    <Text style={styles.paidText}>Paid: ₹{item.amount_paid.toLocaleString()}</Text>
                    <Text style={styles.dueText}>Due: ₹{(dueAmount - item.amount_paid).toLocaleString()}</Text>
                </View>
                <Text style={[styles.statusText, { color: item.status === 'paid' ? '#22c55e' : '#f59e0b' }]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <ScreenLayout>
                <StudentHeader title="Fees" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>
            <StudentHeader title="Fees" />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />}
            >
                {/* SUMMARY CARD */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View>
                            <Text style={styles.summaryLabel}>Total Due</Text>
                            <Text style={styles.summaryValue}>₹{summary.balance.toLocaleString()}</Text>
                        </View>
                        {summary.balance > 0 && (
                            <View style={styles.payBtnMock}>
                                <Text style={styles.payBtnText}>Pay Now</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View>
                            <Text style={styles.statLabel}>Total Fee</Text>
                            <Text style={styles.statValue}>₹{summary.total_due.toLocaleString()}</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View>
                            <Text style={styles.statLabel}>Paid</Text>
                            <Text style={styles.statValueSuccess}>₹{summary.total_paid.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* TABS (Visual only for now) */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'breakdown' && styles.activeTab]}
                        onPress={() => setActiveTab('breakdown')}
                    >
                        <Text style={[styles.tabText, activeTab === 'breakdown' && styles.activeTabText]}>
                            Breakdown
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CONTENT */}
                <View style={styles.contentSection}>
                    {fees.length === 0 ? (
                        <Text style={styles.emptyText}>No fee records found.</Text>
                    ) : (
                        fees.map(item => (
                            <View key={item.id}>{renderFeeItem({ item })}</View>
                        ))
                    )}
                </View>

            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    /* Summary Card */
    summaryCard: {
        backgroundColor: '#1e293b', // Dark slate blue
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        elevation: 8,
        shadowColor: '#1e293b',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
    },
    summaryValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        marginTop: 4,
    },
    payBtnMock: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    payBtnText: {
        color: '#1e293b',
        fontWeight: '700',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500',
    },
    statValue: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    statValueSuccess: {
        color: '#4ade80',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#334155',
    },
    /* Tabs */
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#e0e7ff',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    activeTabText: {
        color: '#4338ca',
        fontWeight: '700',
    },
    /* Fee Item */
    contentSection: {
        flex: 1,
    },
    feeCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    feeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    feeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    feeAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4f46e5',
        borderRadius: 3,
    },
    feeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paidText: {
        fontSize: 12,
        color: '#22c55e', // green
        fontWeight: '600',
    },
    dueText: {
        fontSize: 12,
        color: '#ef4444', // red
        fontWeight: '600',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#94a3b8',
    },
});


