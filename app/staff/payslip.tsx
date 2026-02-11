import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import StaffHeader from '../../src/components/StaffHeader';
import { StaffService } from '../../src/services/staffService';
import { useAuth } from '../../src/hooks/useAuth';

interface Payslip {
    id: string;
    month: string;
    status: string;
    earnings: string;
    deductions: string;
    net: string;
}

export default function PaySlip() {
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.id) {
            StaffService.getPayslips(user.id).then(data => setPayslips(data)).catch(console.error);
        }
    }, [user]);

    // Calculate totals or use first entry for summary
    const totalEarnings = '₹3,61,600'; // Could be dynamic
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <StaffHeader title="My Pay Slips" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Summary Card */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.summaryCard}>
                    <LinearGradient
                        colors={['#EC4899', '#BE185D']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View>
                            <Text style={styles.summaryLabel}>Total Earnings (YTD)</Text>
                            <Text style={styles.summaryValue}>₹3,61,600</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <FontAwesome5 name="coins" size={24} color="#fff" />
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Payslip List */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Payslips</Text>
                </View>

                <View style={styles.listContainer}>
                    {payslips.map((item, index) => (
                        <Animated.View
                            key={item.id}
                            entering={FadeInDown.delay(300 + (index * 100)).duration(600)}
                            style={styles.payslipCard}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.monthText}>{item.month}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.detailsRow}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Earnings</Text>
                                    <Text style={styles.earningsValue}>{item.earnings}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Deductions</Text>
                                    <Text style={styles.deductionsValue}>{item.deductions}</Text>
                                </View>
                                <View style={[styles.detailItem, { alignItems: 'flex-end' }]}>
                                    <Text style={styles.detailLabel}>Net Pay</Text>
                                    <Text style={styles.netValue}>{item.net}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.downloadButton}>
                                <Text style={styles.downloadText}>Download PDF</Text>
                                <Ionicons name="download-outline" size={18} color="#EC4899" />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: 20,
    },
    summaryCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: "#EC4899",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    gradient: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    summaryValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContainer: {
        gap: 15,
        paddingBottom: 20,
    },
    payslipCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statusBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 15,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    earningsValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
    },
    deductionsValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
    },
    netValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    downloadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#FDF2F8',
        borderRadius: 12,
        gap: 8,
    },
    downloadText: {
        color: '#EC4899',
        fontWeight: '600',
        fontSize: 14,
    },
});


