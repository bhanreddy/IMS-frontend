import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TRANSPORT_DATA = [
    { id: '1', route: 'Route A', driver: 'Ramesh Singh', license: 'DL-01-2022', students: 42, status: 'On Time', vehicle: 'Bus 01' },
    { id: '2', route: 'Route B', driver: 'Suresh Kumar', license: 'DL-04-1998', students: 38, status: 'Delayed', vehicle: 'Bus 04' },
    { id: '3', route: 'Route C', driver: 'Mahesh Babu', license: 'DL-09-2010', students: 45, status: 'On Time', vehicle: 'Bus 02' },
    { id: '4', route: 'Route D', driver: 'Rajesh Koothrappali', license: 'DL-11-2015', students: 30, status: 'Arrived', vehicle: 'Minivan 01' },
];

export default function AdminTransport() {

    const renderItem = ({ item, index }: { item: typeof TRANSPORT_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <TouchableOpacity style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.routeContainer}>
                        <View style={styles.iconBox}>
                            <Ionicons name="bus" size={24} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.routeTitle}>{item.route}</Text>
                            <Text style={styles.vehicleText}>{item.vehicle}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge,
                    item.status === 'On Time' ? styles.statusOnTime :
                        item.status === 'Delayed' ? styles.statusDelayed : styles.statusArrived
                    ]}>
                        <Text style={[styles.statusText,
                        item.status === 'On Time' ? { color: '#065F46' } :
                            item.status === 'Delayed' ? { color: '#92400E' } : { color: '#1E40AF' }
                        ]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Ionicons name="person" size={16} color="#6B7280" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.driver} ({item.license})</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="people" size={16} color="#6B7280" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.students} Students</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.trackButton}>
                    <Text style={styles.trackButtonText}>Live Track</Text>
                    <MaterialIcons name="gps-fixed" size={16} color="#6366F1" />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Transport" showBackButton={true} />

            <FlatList
                data={TRANSPORT_DATA}
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    routeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    vehicleText: {
        fontSize: 13,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusOnTime: { backgroundColor: '#D1FAE5' },
    statusDelayed: { backgroundColor: '#FEF3C7' },
    statusArrived: { backgroundColor: '#DBEAFE' },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    detailsContainer: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailIcon: {
        marginRight: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
    },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#EEF2FF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    trackButtonText: {
        color: '#6366F1',
        fontWeight: '600',
        marginRight: 8,
    },
});
