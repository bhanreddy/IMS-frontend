import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PAYROLL_DATA = [
    { id: '1', name: 'Rahul Reddy', role: 'Math Teacher', salary: '₹45,000', status: 'Paid', date: '30 Dec', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    { id: '2', name: 'Priya Sharma', role: 'Science Teacher', salary: '₹42,000', status: 'Paid', date: '30 Dec', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
    { id: '3', name: 'Suresh Kumar', role: 'Driver', salary: '₹18,000', status: 'Pending', date: '-', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    { id: '4', name: 'Maintenance Staff', role: 'Cleaning', salary: '₹12,000', status: 'Pending', date: '-', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
];

export default function AccountsPayroll() {

    const renderItem = ({ item, index }: { item: typeof PAYROLL_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <TouchableOpacity style={styles.card}>
                <View style={styles.headerRow}>
                    <Image source={{ uri: item.image }} style={styles.avatar} />
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.role}>{item.role}</Text>
                    </View>
                    <View style={styles.salaryBox}>
                        <Text style={styles.salary}>{item.salary}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={[styles.statusBadge,
                    item.status === 'Paid' ? styles.sPaid : styles.sPending
                    ]}>
                        <Text style={[styles.statusText,
                        item.status === 'Paid' ? { color: '#065F46' } : { color: '#92400E' }
                        ]}>{item.status}</Text>
                    </View>
                    {item.status === 'Paid' && <Text style={styles.dateText}>Paid on {item.date}</Text>}
                    {item.status === 'Pending' && (
                        <TouchableOpacity style={styles.payBtn}>
                            <Text style={styles.payBtnText}>Process Pay</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Payroll" showBackButton={true} />

            <FlatList
                data={PAYROLL_DATA}
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
        marginBottom: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    role: {
        fontSize: 13,
        color: '#6B7280',
    },
    salaryBox: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    salary: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    sPaid: { backgroundColor: '#D1FAE5' },
    sPending: { backgroundColor: '#FEF3C7' },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    dateText: {
        fontSize: 12,
        color: '#6B7280',
    },
    payBtn: {
        backgroundColor: '#4F46E5',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    payBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
