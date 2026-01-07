import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, StatusBar, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const STAFF_DATA = [
    { id: '1', name: 'Rahul Reddy', role: 'Mathematics', status: 'Present', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    { id: '2', name: 'Priya Sharma', role: 'Science', status: 'Present', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
    { id: '3', name: 'Amit Kumar', role: 'English', status: 'Leave', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    { id: '4', name: 'Sneha Gupta', role: 'History', status: 'Present', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
    { id: '5', name: 'Vikram Singh', role: 'Sports', status: 'Absent', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
];

export default function ManageStaff() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStaff = STAFF_DATA.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCall = (name: string) => {
        Alert.alert("Call Staff", `Calling ${name}...`);
    };

    const renderItem = ({ item, index }: { item: typeof STAFF_DATA[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <TouchableOpacity style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.role}>{item.role}</Text>
                    <View style={[styles.statusBadge,
                    item.status === 'Present' ? styles.statusPresent :
                        item.status === 'Leave' ? styles.statusLeave : styles.statusAbsent
                    ]}>
                        <Text style={[styles.statusText,
                        item.status === 'Present' ? { color: '#065F46' } :
                            item.status === 'Leave' ? { color: '#92400E' } : { color: '#991B1B' }
                        ]}>{item.status}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.name)}>
                    <Ionicons name="call" size={20} color="#fff" />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Manage Staff" showBackButton={true} />

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Staff..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredStaff}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyText}>No staff found</Text>}
            />
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
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: '#F3F4F6',
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
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusPresent: { backgroundColor: '#D1FAE5' },
    statusLeave: { backgroundColor: '#FEF3C7' },
    statusAbsent: { backgroundColor: '#FEE2E2' },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#9CA3AF',
        fontSize: 16,
    },
});
