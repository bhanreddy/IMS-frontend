import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const EXPENSES_DATA = [
    { id: '1', title: 'Library Books Purchase', date: '01 Jan 2024', category: 'Education', amount: '₹15,000', status: 'Approved' },
    { id: '2', title: 'AC Maintenance (Class X)', date: '28 Dec 2023', category: 'Maintenance', amount: '₹5,500', status: 'Pending' },
    { id: '3', title: 'Sports Equipment', date: '20 Dec 2023', category: 'Sports', amount: '₹22,000', status: 'Approved' },
    { id: '4', title: 'Water Bill', date: '15 Dec 2023', category: 'Utility', amount: '₹3,200', status: 'Paid' },
];

export default function AccountsExpenses() {

    const renderItem = ({ item, index }: { item: typeof EXPENSES_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={styles.iconBox}>
                        <FontAwesome5 name="receipt" size={16} color="#6366F1" />
                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>{item.date} • {item.category}</Text>
                    </View>
                    <Text style={styles.amount}>{item.amount}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.footer}>
                    <View style={[styles.statusBadge,
                    item.status === 'Approved' || item.status === 'Paid' ? styles.sApproved : styles.sPending
                    ]}>
                        <Text style={[styles.statusText,
                        item.status === 'Approved' || item.status === 'Paid' ? { color: '#065F46' } : { color: '#92400E' }
                        ]}>{item.status}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Expense Tracker" showBackButton={true} />

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder="Search expenses..." />
            </View>

            <FlatList
                data={EXPENSES_DATA}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
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
        marginBottom: 10,
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
        padding: 20,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    titleBox: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    date: {
        fontSize: 12,
        color: '#6B7280',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    sApproved: { backgroundColor: '#D1FAE5' },
    sPending: { backgroundColor: '#FEF3C7' },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
