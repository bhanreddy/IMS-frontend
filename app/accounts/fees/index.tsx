import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminHeader from '../../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../../src/hooks/useAuth';
import { FeesService } from '../../../src/services/fees.service';

export default function AccountsFees() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await FeesService.getAllFees();
            // Map data to UI
            // Data is Fee[], we need to aggregate or list.
            // Screen seems to expect 'students' with name, class, status, etc.
            // If API returns fees, we might need grouping.
            // For now assuming getAllFees returns populated fee objects or we map properties
            // If data is just Fees, we might see duplicates per student if not grouped.
            // Prototype assumption: backend returns student-centric fee summary.
            // If getAllFees returns Fee documents, we might just list them.

            const uiData = data.map((d: any) => ({
                id: d.studentId || d.id, // Grouping key
                name: d.studentName || 'Student Name',
                class: d.classId || 'Class',
                status: d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : 'Pending',
                total: d.amount || 0,
                paid: d.paidAmount || 0,
                due: (d.amount || 0) - (d.paidAmount || 0),
                rawId: d.id // fee ID
            }));
            setStudents(uiData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCollect = (student: any) => {
        router.push({
            pathname: '/accounts/fees/collect',
            params: {
                studentId: student.id, // Assuming studentId
                name: student.name,
                due: student.due.toString()
            }
        });
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <TouchableOpacity style={styles.card} onPress={() => handleCollect(item)}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentClass}>{item.class}</Text>
                    </View>
                    <View style={[styles.statusBadge,
                    item.status === 'Paid' ? styles.statusPaid :
                        item.status === 'Partial' ? styles.statusPartial : styles.statusPending
                    ]}>
                        <Text style={[styles.statusText,
                        item.status === 'Paid' ? { color: '#065F46' } :
                            item.status === 'Partial' ? { color: '#92400E' } : { color: '#991B1B' }
                        ]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.feeDetails}>
                    <View style={styles.feeItem}>
                        <Text style={styles.feeLabel}>Total</Text>
                        <Text style={styles.feeValue}>₹{item.total}</Text>
                    </View>
                    <View style={styles.feeItem}>
                        <Text style={styles.feeLabel}>Paid</Text>
                        <Text style={[styles.feeValue, { color: '#10B981' }]}>₹{item.paid}</Text>
                    </View>
                    <View style={styles.feeItem}>
                        <Text style={styles.feeLabel}>Due</Text>
                        <Text style={[styles.feeValue, { color: '#EF4444' }]}>₹{item.due}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Fee Management" showBackButton={true} />

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Student Name or ID..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} /> : (
                <FlatList
                    data={filteredStudents}
                    keyExtractor={item => item.id + '_' + item.rawId} // unique key
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>No students found</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 20,
        paddingHorizontal: 15,
        borderRadius: 12,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    studentClass: {
        fontSize: 14,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusPaid: { backgroundColor: '#D1FAE5' },
    statusPartial: { backgroundColor: '#FEF3C7' },
    statusPending: { backgroundColor: '#FEE2E2' },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 10,
    },
    feeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    feeItem: {
        alignItems: 'center',
    },
    feeLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    feeValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#9CA3AF',
        fontSize: 16,
    },
});
