import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MOCK_COMPLAINTS, Complaint } from '../../src/data/mockComplaints';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminComplaints() {
    const [filterType, setFilterType] = useState<'ALL' | 'DISCIPLINARY' | 'FACILITY'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');

    const filteredData = MOCK_COMPLAINTS.filter(item => {
        const typeMatch = filterType === 'ALL' || item.type === filterType;
        const statusMatch = filterStatus === 'ALL' ||
            (filterStatus === 'PENDING' && item.status !== 'Resolved') ||
            (filterStatus === 'RESOLVED' && item.status === 'Resolved');
        return typeMatch && statusMatch;
    });

    const renderItem = ({ item, index }: { item: Complaint, index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <TouchableOpacity style={styles.card}>
                <View style={[styles.accentBar, { backgroundColor: item.color }]} />

                <View style={styles.headerRow}>
                    <View style={styles.typeBadge}>
                        <Ionicons
                            name={item.type === 'DISCIPLINARY' ? 'person-circle-outline' : 'business-outline'}
                            size={14}
                            color="#6B7280"
                        />
                        <Text style={styles.category}>{item.type}</Text>
                    </View>
                    <View style={[styles.statusBadge,
                    item.status === 'Resolved' ? styles.sResolved :
                        item.status === 'Escalated' ? styles.sEscalated : styles.sPending
                    ]}>
                        <Text style={[styles.statusText,
                        item.status === 'Resolved' ? { color: '#065F46' } :
                            item.status === 'Escalated' ? { color: '#991B1B' } : { color: '#92400E' }
                        ]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.titleRow}>
                    <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                        <Ionicons name={item.icon as any || 'alert-circle'} size={20} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.targetText}>Target: <Text style={{ fontWeight: '700' }}>{item.target}</Text></Text>
                    </View>
                </View>

                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.footer}>
                    <View style={styles.metaInfo}>
                        <Ionicons name="person-outline" size={12} color="#6B7280" />
                        <Text style={styles.fromText}>Filed by: {item.filedBy}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

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

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <Text style={styles.listHeader}>Recent Reports ({filteredData.length})</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    filterSection: {
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 20,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
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
    sResolved: { backgroundColor: '#D1FAE5' },
    sEscalated: { backgroundColor: '#FEE2E2' },
    sPending: { backgroundColor: '#FEF3C7' },
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
    desc: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 12,
        paddingLeft: 10 + 36 + 12, // Indent to align with text
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
});
