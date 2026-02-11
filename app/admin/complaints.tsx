import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ComplaintService, Complaint } from '../../src/services/commonServices';



export default function AdminComplaints() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'ALL' | 'DISCIPLINARY' | 'FACILITY'>('ALL');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await ComplaintService.getAll();
            setComplaints(data);
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
            Alert.alert('Error', 'Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved': return { bg: '#D1FAE5', text: '#065F46' };
            case 'escalated': return { bg: '#FEE2E2', text: '#991B1B' };
            case 'closed': return { bg: '#F3F4F6', text: '#374151' };
            default: return { bg: '#FEF3C7', text: '#92400E' }; // Pending/Open
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'disciplinary': return '#EF4444';
            case 'facility': return '#3B82F6';
            case 'academic': return '#8B5CF6';
            default: return '#6B7280';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const filteredData = complaints.filter(item => {
        if (filterType === 'ALL') return true;
        return (item.category || 'General').toUpperCase() === filterType;
    });

    const renderItem = ({ item, index }: { item: Complaint, index: number }) => {
        const category = item.category || 'General';
        const statusStyle = getStatusStyle(item.status);
        const color = getCategoryColor(category);

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
                <TouchableOpacity style={styles.card}>
                    <View style={[styles.accentBar, { backgroundColor: color }]} />

                    <View style={styles.headerRow}>
                        <View style={styles.typeBadge}>
                            <Ionicons
                                name={category.toLowerCase() === 'disciplinary' ? 'person-circle-outline' : 'business-outline'}
                                size={14}
                                color="#6B7280"
                            />
                            <Text style={styles.category}>{category.toUpperCase()}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                        </View>
                    </View>

                    <View style={styles.titleRow}>
                        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                            <Ionicons name="alert-circle" size={20} color={color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.targetText}>Ticket: <Text style={{ fontWeight: '700' }}>#{item.ticket_no}</Text></Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.metaInfo}>
                            <Ionicons name="person-outline" size={12} color="#6B7280" />
                            <Text style={styles.fromText}>Filed by: {(item as any).raised_by_name || item.raised_by}</Text>
                        </View>
                        <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Complaints Box" showBackButton={true} />

            <View style={styles.filterSection}>
                <View style={styles.tabContainer}>
                    {['ALL', 'DISCIPLINARY', 'FACILITY'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.tab, filterType === type && styles.activeTab]}
                            onPress={() => setFilterType(type as any)}
                        >
                            <Text style={[styles.tabText, filterType === type && styles.activeTabText]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <Text style={styles.listHeader}>Recent Reports ({filteredData.length})</Text>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No complaints found</Text>}
                    refreshing={loading}
                    onRefresh={fetchComplaints}
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterSection: {
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#111827',
        fontWeight: '700',
    },
    listContent: {
        padding: 20,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 15,
        letterSpacing: -0.5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        overflow: 'hidden',
    },
    accentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingLeft: 10,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    category: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    titleRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
        paddingLeft: 10,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    targetText: {
        fontSize: 12,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingLeft: 10,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    fromText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    dateText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#9CA3AF',
        fontSize: 16,
    },
});


