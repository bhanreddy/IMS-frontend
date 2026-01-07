import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const LEAVE_REQUESTS = [
    { id: '1', name: 'Priya Sharma', role: 'Science Teacher', type: 'Sick Leave', duration: '2 Days', dates: '10-11 Jan', reason: 'Suffering from high fever.', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
    { id: '2', name: 'Amit Kumar', role: 'English Teacher', type: 'Casual Leave', duration: '1 Day', dates: '15 Jan', reason: 'Personal work.', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
];

export default function AdminLeaves() {

    const renderItem = ({ item, index }: { item: typeof LEAVE_REQUESTS[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Image source={{ uri: item.image }} style={styles.avatar} />
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.role}>{item.role}</Text>
                    </View>
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                </View>

                <View style={styles.reasonBox}>
                    <Text style={styles.leaveType}>{item.type} • {item.dates}</Text>
                    <Text style={styles.reasonText}>"{item.reason}"</Text>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.rejectBtn]}>
                        <Ionicons name="close-circle" size={18} color="#EF4444" />
                        <Text style={[styles.actionText, { color: '#EF4444' }]}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.approveBtn]}>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                        <Text style={[styles.actionText, { color: '#10B981' }]}>Approve</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Leave Management" showBackButton={true} />

            <FlatList
                data={LEAVE_REQUESTS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<Text style={styles.sectionTitle}>Pending Requests (2)</Text>}
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 15,
        marginLeft: 5,
        textTransform: 'uppercase',
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
    durationBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    durationText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    reasonBox: {
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        marginBottom: 15,
    },
    leaveType: {
        fontSize: 12,
        color: '#6366F1',
        fontWeight: '600',
        marginBottom: 4,
    },
    reasonText: {
        fontSize: 14,
        color: '#4B5563',
        fontStyle: 'italic',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    rejectBtn: {
        backgroundColor: '#FEF2F2',
    },
    approveBtn: {
        backgroundColor: '#ECFDF5',
    },
    actionText: {
        fontWeight: '600',
        marginLeft: 6,
    },
});
