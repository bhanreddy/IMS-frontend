import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';

const { width } = Dimensions.get('window');

/* ================== MOCK DATA ================== */
const FEE_STRUCTURE = {
    total: 85000,
    paid: 45000,
    due: 40000,
    dueDate: '15th Feb, 2026',
};

const FEE_HEADS = [
    { id: '1', title: 'Tuition Fee', amount: 60000, paid: 30000 },
    { id: '2', title: 'Transport Fee', amount: 15000, paid: 7500 },
    { id: '3', title: 'Hostel Fee', amount: 0, paid: 0, optOut: true },
    { id: '4', title: 'Annual Charges', amount: 10000, paid: 7500 },
];

const TRANSACTIONS = [
    { id: 'tx1', date: '10 Jan, 2026', amount: 15000, mode: 'UPI', status: 'Success' },
    { id: 'tx2', date: '15 Sep, 2025', amount: 30000, mode: 'Bank Transfer', status: 'Success' },
];

export default function FeesScreen() {
    const [activeTab, setActiveTab] = useState<'breakdown' | 'history'>('breakdown');

    const renderFeeItem = ({ item }: { item: typeof FEE_HEADS[0] }) => {
        if (item.optOut) return null;
        const due = item.amount - item.paid;
        const percent = (item.paid / item.amount) * 100;

        return (
            <View style={styles.feeCard}>
                <View style={styles.feeHeader}>
                    <Text style={styles.feeTitle}>{item.title}</Text>
                    <Text style={styles.feeAmount}>₹{item.amount.toLocaleString()}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                </View>

                <View style={styles.feeFooter}>
                    <Text style={styles.paidText}>Paid: ₹{item.paid.toLocaleString()}</Text>
                    <Text style={styles.dueText}>Due: ₹{due.toLocaleString()}</Text>
                </View>
            </View>
        );
    };

    const renderTransaction = ({ item }: { item: typeof TRANSACTIONS[0] }) => (
        <View style={styles.txCard}>
            <View style={styles.txLeft}>
                <View style={styles.txIconBox}>
                    <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                </View>
                <View>
                    <Text style={styles.txMode}>{item.mode}</Text>
                    <Text style={styles.txDate}>{item.date}</Text>
                </View>
            </View>
            <View style={styles.txRight}>
                <Text style={styles.txAmount}>- ₹{item.amount.toLocaleString()}</Text>
                <TouchableOpacity style={styles.downloadBtn}>
                    <Ionicons name="download-outline" size={18} color="#4f46e5" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScreenLayout>
            <StudentHeader title="Fees" />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* SUMMARY CARD */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View>
                            <Text style={styles.summaryLabel}>Total Due</Text>
                            <Text style={styles.summaryValue}>₹{FEE_STRUCTURE.due.toLocaleString()}</Text>
                        </View>
                        <View style={styles.payBtnMock}>
                            <Text style={styles.payBtnText}>Pay Now</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View>
                            <Text style={styles.statLabel}>Total Fee</Text>
                            <Text style={styles.statValue}>₹{FEE_STRUCTURE.total.toLocaleString()}</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View>
                            <Text style={styles.statLabel}>Paid</Text>
                            <Text style={styles.statValueSuccess}>₹{FEE_STRUCTURE.paid.toLocaleString()}</Text>
                        </View>
                    </View>

                    <View style={styles.alertBox}>
                        <Ionicons name="alert-circle" size={16} color="#c2410c" />
                        <Text style={styles.alertText}>Next Due Date: {FEE_STRUCTURE.dueDate}</Text>
                    </View>
                </View>

                {/* TABS */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'breakdown' && styles.activeTab]}
                        onPress={() => setActiveTab('breakdown')}
                    >
                        <Text style={[styles.tabText, activeTab === 'breakdown' && styles.activeTabText]}>
                            Breakdown
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                            History
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CONTENT */}
                <View style={styles.contentSection}>
                    {activeTab === 'breakdown' ? (
                        <View>
                            {FEE_HEADS.map(item => (
                                <View key={item.id}>{renderFeeItem({ item })}</View>
                            ))}
                        </View>
                    ) : (
                        <View>
                            {TRANSACTIONS.map(item => (
                                <View key={item.id}>{renderTransaction({ item })}</View>
                            ))}
                            {TRANSACTIONS.length === 0 && (
                                <Text style={styles.emptyText}>No transactions found</Text>
                            )}
                        </View>
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
    alertBox: {
        marginTop: 16,
        backgroundColor: '#ffedd5',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    alertText: {
        color: '#c2410c',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 6,
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

    /* Transactions */
    txCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    txLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    txIconBox: {
        marginRight: 12,
        opacity: 0.8,
    },
    txMode: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    txDate: {
        fontSize: 12,
        color: '#64748b',
    },
    txRight: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#dc2626',
        marginBottom: 4,
    },
    downloadBtn: {
        padding: 4,
        backgroundColor: '#e0e7ff',
        borderRadius: 6,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#94a3b8',
    },
});
