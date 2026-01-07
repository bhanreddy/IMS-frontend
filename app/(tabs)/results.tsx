import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import StudentHeader from '../../src/components/StudentHeader';
import ScreenLayout from '@/src/components/ScreenLayout';

const EXAM_TYPES = [
    {
        key: 'slip_test',
        icon: 'document-text',
        colors: ['#3B82F6', '#2563EB'],
        accent: '#EFF6FF',
        stats: 'Assignments: 12'
    },
    {
        key: 'fa_results',
        icon: 'analytics',
        colors: ['#10B981', '#059669'],
        accent: '#ECFDF5',
        stats: 'Formative Assessment'
    },
    {
        key: 'sa_results',
        icon: 'school',
        colors: ['#F59E0B', '#D97706'],
        accent: '#FFFBEB',
        stats: 'Summative Assessment'
    },
    {
        key: 'special',
        icon: 'star',
        colors: ['#8B5CF6', '#7C3AED'],
        accent: '#F3E8FF',
        stats: 'Special Programs'
    },
    {
        key: 'weekend',
        icon: 'calendar',
        colors: ['#EC4899', '#DB2777'],
        accent: '#FDF2F8',
        stats: 'Weekly Tests'
    },
];

const ResultsScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const handlePress = (type: string, title: string) => {
        router.push({
            pathname: '/result-details',
            params: { type, title }
        });
    };

    return (
        <ScreenLayout>


            <StudentHeader title={'Results'} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.headerSection}>
                    <Text style={styles.pageTitle}>Exam Results</Text>
                    <Text style={styles.pageSubtitle}>Check your performance and progress reports</Text>
                </Animated.View>

                <View style={styles.gridContainer}>
                    {EXAM_TYPES.map((item, index) => {
                        const title = t(`results.${item.key}`);
                        return (
                            <Animated.View
                                key={item.key}
                                entering={FadeInDown.delay(200 + index * 100).duration(600)}
                                style={styles.cardContainer}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => handlePress(item.key, title)}
                                    style={styles.card}
                                >
                                    <View style={[styles.iconBox, { backgroundColor: item.accent }]}>
                                        <Ionicons name={item.icon as any} size={28} color={item.colors[1]} />
                                    </View>

                                    <View style={styles.textContainer}>
                                        <Text style={styles.cardTitle}>{title}</Text>
                                        <Text style={styles.cardSubtitle}>{item.stats}</Text>
                                    </View>

                                    <View style={styles.arrowBox}>
                                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>
            </ScrollView>

        </ScreenLayout >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    scrollContent: {
        padding: 20,
    },
    headerSection: {
        marginBottom: 25,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 5,
    },
    gridContainer: {
        gap: 15,
    },
    cardContainer: {
        width: '100%',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(229, 231, 235, 0.5)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    arrowBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ResultsScreen;
