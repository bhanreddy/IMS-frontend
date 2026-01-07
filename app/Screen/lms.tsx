import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Linking,
    StatusBar,
    TextInput,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MOCK_LMS_CONTENT, LMSContent } from '@/src/data/mockLMS';
import StudentHeader from '../../src/components/StudentHeader';

export default function LMSPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const STUDENT_CLASS = '10th A'; // Mock: In real app, get from user profile

    const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Telugu', 'Physics', 'Biology'];

    const filteredContent = MOCK_LMS_CONTENT.filter(item => {
        const matchesSearch = item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subTopic.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = item.className === STUDENT_CLASS;
        const matchesSubject = selectedSubject === 'All' || item.topic === selectedSubject;

        return matchesSearch && matchesClass && matchesSubject;
    });

    const handleOpenVideo = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const renderItem = ({ item, index }: { item: LMSContent, index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => handleOpenVideo(item.videoUrl)}
            >
                <View style={styles.thumbnailContainer}>
                    <Image
                        source={{ uri: `https://img.youtube.com/vi/${item.videoUrl.split('v=')[1]?.split('&')[0]}/hqdefault.jpg` }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    <View style={styles.playButtonOverlay}>
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={24} color="#FFF" style={{ marginLeft: 4 }} />
                        </View>
                    </View>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.thumbnailGradient}
                    />
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>10:00</Text>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.badgesRow}>
                        <View style={styles.topicBadge}>
                            <Text style={styles.topicText}>{item.topic}</Text>
                        </View>
                        <View style={styles.classBadge}>
                            <Text style={styles.classBadgeText}>{item.className}</Text>
                        </View>
                    </View>
                    <Text style={styles.subTopic} numberOfLines={2}>{item.subTopic}</Text>

                    {item.description ? (
                        <Text style={styles.description} numberOfLines={2}>
                            {item.description}
                        </Text>
                    ) : null}

                    <View style={styles.footer}>
                        <View style={styles.teacherInfo}>
                            <MaterialIcons name="person" size={14} color="#6B7280" />
                            <Text style={styles.teacherName}>{item.teacherName}</Text>
                        </View>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header Section - Matches Diary Header */}
            <StudentHeader showBackButton={true} title="LMS" />

            {/* Subject Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsContent}
                >
                    {SUBJECTS.map((subject) => (
                        <TouchableOpacity
                            key={subject}
                            style={[
                                styles.tabItem,
                                selectedSubject === subject && styles.activeTabItem
                            ]}
                            onPress={() => setSelectedSubject(subject)}
                        >
                            <Text style={[
                                styles.tabText,
                                selectedSubject === subject && styles.activeTabText
                            ]}>
                                {subject}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <FlatList
                data={filteredContent}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialIcons name="video-library" size={64} color="#E5E7EB" />
                        <Text style={styles.emptyText}>No content found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    // Tabs
    tabsContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tabsContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    tabItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeTabItem: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#FFFFFF',
    },

    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F9FAFB',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        gap: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
        gap: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 5,
    },
    thumbnailContainer: {
        height: 180,
        backgroundColor: '#E5E7EB',
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    thumbnailGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
    },
    playButtonOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    playButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 15,
    },
    badgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    topicBadge: {
        backgroundColor: '#E0F2FE',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    topicText: {
        color: '#0284C7',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    classBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    classBadgeText: {
        color: '#6B7280',
        fontSize: 10,
        fontWeight: '600',
    },
    subTopic: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 6,
        lineHeight: 22,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    teacherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    teacherName: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        marginTop: 10,
        color: '#9CA3AF',
        fontSize: 16,
    },
});
