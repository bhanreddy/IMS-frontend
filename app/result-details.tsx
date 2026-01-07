import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StudentHeader from '../src/components/StudentHeader';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// Mock Data Generator
const generateResults = (type: string) => {
    // Randomized scores for demo
    const subjects = [
        { name: 'Mathematics', total: 100, score: 85, color: '#3B82F6', icon: 'calculate' },
        { name: 'Science', total: 100, score: 78, color: '#10B981', icon: 'science' },
        { name: 'English', total: 100, score: 92, color: '#F59E0B', icon: 'menu-book' },
        { name: 'Social Studies', total: 100, score: 88, color: '#8B5CF6', icon: 'public' },
        { name: 'Hindi', total: 100, score: 75, color: '#EC4899', icon: 'translate' },
        { name: 'Telugu', total: 100, score: 80, color: '#EF4444', icon: 'language' },
    ];

    return subjects.map(s => ({
        ...s,
        // Slightly vary score based on exam type string length just for mock variety
        score: Math.min(100, Math.max(40, s.score + (type.length % 5) - 2))
    }));
};

export default function ResultDetails() {
    const { type, title } = useLocalSearchParams();
    const { t } = useTranslation();
    const results = generateResults(type as string || 'default');

    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    const maxScore = results.length * 100;
    const percentage = Math.round((totalScore / maxScore) * 100);

    const getGrade = (pct: number) => {
        if (pct >= 90) return 'A+';
        if (pct >= 80) return 'A';
        if (pct >= 70) return 'B';
        if (pct >= 60) return 'C';
        return 'D';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <StudentHeader showBackButton={true} title={title as string || 'Results'} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Summary Card */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.summaryCard}>
                    <LinearGradient
                        colors={['#1F2937', '#111827']}
                        style={styles.gradientCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.summaryContent}>
                            <View>
                                <Text style={styles.summaryLabel}>Overall Percentage</Text>
                                <Text style={styles.percentageText}>{percentage}%</Text>
                                <Text style={styles.gradeText}>Grade: {getGrade(percentage)}</Text>
                            </View>
                            <View style={styles.circularProgress}>
                                <Text style={styles.totalScoreText}>{totalScore}</Text>
                                <Text style={styles.maxScoreText}>/ {maxScore}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Subject List */}
                <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>Subject Breakdown</Text>

                    {results.map((item, index) => (
                        <Animated.View
                            key={item.name}
                            entering={FadeInDown.delay(300 + (index * 100)).duration(600)}
                            style={styles.resultItem}
                        >
                            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                                <MaterialIcons name={item.icon as any} size={24} color={item.color} />
                            </View>

                            <View style={styles.contentBox}>
                                <View style={styles.row}>
                                    <Text style={styles.subjectName}>{item.name}</Text>
                                    <Text style={styles.scoreText}>
                                        <Text style={[styles.scoreValue, { color: item.color }]}>{item.score}</Text>
                                        <Text style={styles.scoreTotal}> / {item.total}</Text>
                                    </Text>
                                </View>

                                <View style={styles.progressBarBg}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { width: `${(item.score / item.total) * 100}%`, backgroundColor: item.color }
                                        ]}
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    summaryCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 30,
        elevation: 10,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    gradientCard: {
        padding: 25,
        minHeight: 160,
        justifyContent: 'center',
    },
    summaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        includeFontPadding: false,
    },
    gradeText: {
        color: '#10B981',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    circularProgress: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 8,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalScoreText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    maxScoreText: {
        color: '#9CA3AF',
        fontSize: 12,
    },

    // List
    listContainer: {
        gap: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
    },
    resultItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        gap: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentBox: {
        flex: 1,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    scoreText: {
        fontSize: 14,
    },
    scoreValue: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    scoreTotal: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
});
