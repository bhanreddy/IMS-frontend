import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StaffHeader from '../../src/components/StaffHeader';
import { useAuth } from '../../src/hooks/useAuth';
import { LeaveService, LeaveApplication } from '../../src/services/commonServices';

export default function ApplyLeave() {
    const { user } = useAuth();
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [reason, setReason] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLeaves();
    }, [user]);

    const loadLeaves = async () => {
        try {
            if (user) {
                // Assuming getAll returns all leaves, we might need a filter for "my leaves"
                // but usually the backend filters based on token.
                const data = await LeaveService.getAll();
                // Map to UI
                const formatted = data.map((l: LeaveApplication) => ({
                    id: l.id,
                    type: l.leave_type || 'Leave',
                    range: `${new Date(l.start_date).toLocaleDateString()} - ${new Date(l.end_date).toLocaleDateString()}`,
                    days: calculateDays(l.start_date, l.end_date),
                    status: l.status,
                    color: getStatusColor(l.status)
                }));
                setLeaves(formatted);
            }
        } catch (error) {
            console.error("Failed to load leaves", error);
        }
    };

    const calculateDays = (start: string, end: string) => {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diff = Math.abs(d2.getTime() - d1.getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // Inclusive
        return `${Math.max(1, days)} Day${days !== 1 ? 's' : ''}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return '#10B981';
            case 'Rejected': return '#EF4444';
            default: return '#F59E0B';
        }
    };

    const handleApply = async () => {
        if (!fromDate || !toDate || !reason) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            if (user) {
                const typeMap: Record<string, string> = {
                    'Sick Leave': 'sick',
                    'Casual Leave': 'casual',
                    'Emergency': 'other'
                };

                await LeaveService.create({
                    leave_type: typeMap[leaveType] || 'other',
                    start_date: fromDate,
                    end_date: toDate,
                    reason,
                });
                Alert.alert("Success", "Leave application submitted successfully!");
                loadLeaves();
                setReason('');
                setFromDate('');
                setToDate('');
            }
        } catch (error) {
            Alert.alert("Error", "Failed to apply leave");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <StaffHeader title="Apply Leave" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Apply Form */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.formCard}>
                    <Text style={styles.cardTitle}>New Application</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Leave Type</Text>
                        <View style={styles.typeSelector}>
                            {['Sick Leave', 'Casual Leave', 'Emergency'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.typeChip, leaveType === type && styles.typeChipActive]}
                                    onPress={() => setLeaveType(type)}
                                >
                                    <Text style={[styles.typeText, leaveType === type && styles.typeTextActive]}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>From Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                value={fromDate}
                                onChangeText={setFromDate}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>To Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                value={toDate}
                                onChangeText={setToDate}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Reason</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your reason..."
                            multiline
                            numberOfLines={3}
                            value={reason}
                            onChangeText={setReason}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.applyButton, loading && { opacity: 0.7 }]}
                        activeOpacity={0.8}
                        onPress={handleApply}
                        disabled={loading}
                    >
                        <Text style={styles.applyButtonText}>{loading ? "Submitting..." : "Submit Application"}</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* History */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Leave History</Text>
                </View>

                <View style={styles.historyList}>
                    {leaves.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>No leave history found.</Text>
                    ) : (
                        leaves.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.delay(300 + (index * 100)).duration(600)}
                                style={styles.historyCard}
                            >
                                <View style={styles.historyLeft}>
                                    <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
                                        <MaterialIcons name="event-note" size={24} color={item.color} />
                                    </View>
                                    <View>
                                        <Text style={styles.historyType}>{item.type}</Text>
                                        <Text style={styles.historyDate}>{item.range} • {item.days}</Text>
                                    </View>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: `${item.color}20` }]}>
                                    <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
                                </View>
                            </Animated.View>
                        ))
                    )}
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
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    typeSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    typeChipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    typeText: {
        fontSize: 12,
        color: '#6B7280',
    },
    typeTextActive: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#111827',
    },
    textArea: {
        height: 100,
    },
    row: {
        flexDirection: 'row',
    },
    applyButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    historyList: {
        gap: 15,
        paddingBottom: 50,
    },
    historyCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    historyDate: {
        fontSize: 12,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});


