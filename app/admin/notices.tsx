import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const NOTICES_DATA = [
    { id: '1', title: 'Exam Schedule Released', date: '2 mins ago', audience: 'Students', priority: 'High', content: 'The final exam schedule for Class X and XII has been released.' },
    { id: '2', title: 'Staff Meeting Rescheduled', date: '1 hour ago', audience: 'Staff', priority: 'Medium', content: 'The weekly staff meeting is moved to Friday 3 PM.' },
    { id: '3', title: 'Holiday Announcement', date: '5 hours ago', audience: 'All', priority: 'Low', content: 'School will remain closed on Monday due to heavy rains.' },
];

export default function AdminNotices() {

    const renderItem = ({ item, index }: { item: typeof NOTICES_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <TouchableOpacity style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={[styles.priorityBadge,
                    item.priority === 'High' ? styles.pHigh :
                        item.priority === 'Medium' ? styles.pMedium : styles.pLow
                    ]}>
                        <Text style={[styles.priorityText,
                        item.priority === 'High' ? { color: '#991B1B' } :
                            item.priority === 'Medium' ? { color: '#92400E' } : { color: '#1E40AF' }
                        ]}>{item.priority}</Text>
                    </View>
                </View>

                <Text style={styles.content} numberOfLines={2}>{item.content}</Text>

                <View style={styles.footer}>
                    <View style={styles.audienceRow}>
                        <Ionicons name="people" size={14} color="#6B7280" />
                        <Text style={styles.audienceText}>{item.audience}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Notice Board" showBackButton={true} />

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder="Search notices..." />
            </View>

            <FlatList
                data={NOTICES_DATA}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.fab}>
                <Ionicons name="create" size={28} color="#fff" />
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
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
        marginRight: 10,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    pHigh: { backgroundColor: '#FEE2E2' },
    pMedium: { backgroundColor: '#FEF3C7' },
    pLow: { backgroundColor: '#DBEAFE' },
    priorityText: {
        fontSize: 10,
        fontWeight: '700',
    },
    content: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    audienceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    audienceText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
        fontWeight: '500',
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EC4899',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#EC4899",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
