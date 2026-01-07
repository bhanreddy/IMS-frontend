import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const INVOICES_DATA = [
    { id: 'INV-2024-001', name: 'Rohan Sharma', date: '02 Jan 2024', amount: '₹12,000', type: 'Tuition Fee' },
    { id: 'INV-2024-002', name: 'Anjali Gupta', date: '01 Jan 2024', amount: '₹5,000', type: 'Transport Fee' },
    { id: 'INV-2024-003', name: 'Vikram Singh', date: '28 Dec 2023', amount: '₹18,500', type: 'Term Fee' },
];

export default function AccountsInvoices() {

    const renderItem = ({ item, index }: { item: typeof INVOICES_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <View style={styles.iconBox}>
                        <Ionicons name="document-text" size={24} color="#4F46E5" />
                    </View>
                    <View>
                        <Text style={styles.ids}>{item.id}</Text>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.meta}>{item.date} • {item.type}</Text>
                    </View>
                </View>
                <View style={styles.rightSection}>
                    <Text style={styles.amount}>{item.amount}</Text>
                    <TouchableOpacity style={styles.downloadBtn}>
                        <MaterialIcons name="file-download" size={20} color="#4F46E5" />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Invoices" showBackButton={true} />

            <FlatList
                data={INVOICES_DATA}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    listContent: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    ids: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    meta: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    downloadBtn: {
        padding: 5,
    },
});
