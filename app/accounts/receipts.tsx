import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AdminHeader from '../../src/components/AdminHeader';
import { useTranslation } from 'react-i18next';
import { FeesService } from '../../src/services/fees.service';

export default function ReceiptsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [receipts, setReceipts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const filters = ['All', 'Tuition', 'Transport', 'Library', 'Hostel'];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await FeesService.getRecentTransactions(20);
            const uiData = data.map((d: any) => ({
                id: d.id,
                student: d.name || 'Student Name',
                class: d.class || 'N/A',
                amount: d.amount,
                date: d.time || d.date || 'Recent', // Mapping from service
                type: d.type || 'Fee' // Mapping from service if available, else 'Fee'
            }));
            setReceipts(uiData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderReceiptItem = ({ item, index }: { item: any, index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(500)}
            style={styles.receiptCard}
        >
            <View style={styles.receiptLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="receipt" size={20} color="#0284C7" />
                </View>
                <View>
                    <Text style={styles.studentName}>{item.student}</Text>
                    <Text style={styles.receiptDetails}>{item.id} • {item.class}</Text>
                </View>
            </View>
            <View style={styles.receiptRight}>
                <Text style={styles.amount}>{item.amount}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.typeBadge}>{item.type}</Text>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Receipts" />

            <View style={styles.content}>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('common.search_receipts', 'Search by transaction ID or Name')}
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                        {filters.map((filter, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedFilter(filter)}
                                style={[
                                    styles.filterChip,
                                    selectedFilter === filter && styles.activeFilterChip
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedFilter === filter && styles.activeFilterText
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* List */}
                {loading ? <ActivityIndicator size="large" color="#0284C7" style={{ marginTop: 50 }} /> : (
                    <FlatList
                        data={receipts}
                        renderItem={renderReceiptItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No receipts found.</Text>}
                    />
                )}

            </View>

            {/* Floating Action Button for New Receipt if needed */}
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginTop: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    filterContainer: {
        marginBottom: 20,
        height: 36,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeFilterChip: {
        backgroundColor: '#0284C7',
        borderColor: '#0284C7',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeFilterText: {
        color: '#fff',
    },
    listContent: {
        paddingBottom: 80,
    },
    receiptCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    receiptLeft: {
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
    studentName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    receiptDetails: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    receiptRight: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '800',
        color: '#10B981',
    },
    date: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
    typeBadge: {
        fontSize: 10,
        color: '#0284C7',
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
        overflow: 'hidden',
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0284C7',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    }
});
