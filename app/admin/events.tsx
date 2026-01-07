import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const EVENTS_DATA = [
    { id: '1', title: 'Annual Sports Day', date: '15 Jan 2024', day: 'Monday', type: 'Event', location: 'School Ground' },
    { id: '2', title: 'Republic Day', date: '26 Jan 2024', day: 'Friday', type: 'Holiday', location: 'N/A' },
    { id: '3', title: 'Science Exhibition', date: '05 Feb 2024', day: 'Monday', type: 'Event', location: 'Auditorium' },
    { id: '4', title: 'Parent-Teacher Meeting', date: '10 Feb 2024', day: 'Saturday', type: 'Meeting', location: 'Classrooms' },
];

export default function AdminEvents() {

    const renderItem = ({ item, index }: { item: typeof EVENTS_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <View style={styles.card}>
                <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{item.date.split(' ')[0]}</Text>
                    <Text style={styles.monthText}>{item.date.split(' ')[1]}</Text>
                </View>
                <View style={styles.contentBox}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={[styles.typeBadge,
                        item.type === 'Holiday' ? styles.typeHoliday :
                            item.type === 'Event' ? styles.typeEvent : styles.typeMeeting
                        ]}>
                            <Text style={styles.typeText}>{item.type}</Text>
                        </View>
                    </View>
                    <Text style={styles.dayText}>{item.day}</Text>
                    {item.location !== 'N/A' && (
                        <View style={styles.locationRow}>
                            <Ionicons name="location-sharp" size={14} color="#9CA3AF" />
                            <Text style={styles.locationText}>{item.location}</Text>
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Event Calendar" showBackButton={true} />

            <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Past</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={EVENTS_DATA}
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
    tabs: {
        flexDirection: 'row',
        padding: 15,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#E5E7EB',
    },
    activeTab: {
        backgroundColor: '#6366F1',
    },
    tabText: {
        color: '#4B5563',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        alignItems: 'center',
    },
    dateBox: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginRight: 15,
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    monthText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    contentBox: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    typeHoliday: { backgroundColor: '#FEE2E2' },
    typeEvent: { backgroundColor: '#DBEAFE' },
    typeMeeting: { backgroundColor: '#FEF3C7' },
    typeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#374151',
    },
    dayText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
