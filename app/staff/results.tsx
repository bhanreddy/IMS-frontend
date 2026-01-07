import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import StaffHeader from '@/src/components/StaffHeader';
import StaffFooter from '@/src/components/StaffFooter';

// Data mirroring Student Side
const EXAM_CATEGORIES = [
    {
        key: 'slip_test',
        title: 'Slip Tests',
        icon: 'document-text',
        colors: ['#3B82F6', '#2563EB'],
        accent: '#EFF6FF',
        subExams: ['ST-1', 'ST-2', 'ST-3', 'ST-4']
    },
    {
        key: 'fa_results',
        title: 'Formative Assessment',
        icon: 'analytics',
        colors: ['#10B981', '#059669'],
        accent: '#ECFDF5',
        subExams: ['FA-1', 'FA-2', 'FA-3', 'FA-4']
    },
    {
        key: 'sa_results',
        title: 'Summative Assessment',
        icon: 'school',
        colors: ['#F59E0B', '#D97706'],
        accent: '#FFFBEB',
        subExams: ['SA-1', 'SA-2']
    },
    {
        key: 'special',
        title: 'Special Programs',
        icon: 'star',
        colors: ['#8B5CF6', '#7C3AED'],
        accent: '#F3E8FF',
        subExams: ['Level 1', 'Level 2', 'Level 3']
    },
    {
        key: 'weekend',
        title: 'Weekly Tests',
        icon: 'calendar',
        colors: ['#EC4899', '#DB2777'],
        accent: '#FDF2F8',
        subExams: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
];

const STUDENTS = [
    { id: '1', name: 'Aarav Patel', roll: '101' },
    { id: '2', name: 'Ishita Sharma', roll: '102' },
    { id: '3', name: 'Rohan Gupta', roll: '103' },
    { id: '4', name: 'Ananya Singh', roll: '104' },
    { id: '5', name: 'Vihaan Reddy', roll: '105' },
    { id: '6', name: 'Saanvi Rao', roll: '106' },
];

export default function UploadMarks() {
    // State for navigation within the screen
    const [selectedCategory, setSelectedCategory] = useState<any>(null); // 'slip_test' | ...
    const [selectedSubExam, setSelectedSubExam] = useState(''); // 'FA-1' | ...

    const [marks, setMarks] = useState<{ [key: string]: string }>({});

    const handleCategorySelect = (category: any) => {
        setSelectedCategory(category);
        setSelectedSubExam(category.subExams[0]);
        setMarks({}); // Reset marks when switching category
    };

    const handleBackToDashboard = () => {
        setSelectedCategory(null);
    };

    const handleMarkChange = (id: string, value: string) => {
        setMarks(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = () => {
        if (!selectedCategory) return;
        Alert.alert(
            "Confirm Upload",
            `Upload marks for ${selectedCategory?.title} - ${selectedSubExam}?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Upload", onPress: () => Alert.alert("Success", "Marks uploaded successfully!") }
            ]
        );
    };

    // Render Dashboard (Category Selection)
    const renderDashboard = () => (
        <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.headerSection}>
                <Text style={styles.pageTitle}>Upload Results</Text>
                <Text style={styles.pageSubtitle}>Select an exam category to enter marks</Text>
            </Animated.View>

            <View style={styles.gridContainer}>
                {EXAM_CATEGORIES.map((item, index) => (
                    <Animated.View
                        key={item.key}
                        entering={FadeInDown.delay(200 + index * 100).duration(600)}
                        style={styles.cardContainer}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => handleCategorySelect(item)}
                            style={styles.card}
                        >
                            <View style={[styles.iconBox, { backgroundColor: item.accent }]}>
                                <Ionicons name={item.icon as any} size={28} color={item.colors[1]} />
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardSubtitle}>Manage Marks</Text>
                            </View>

                            <View style={styles.arrowBox}>
                                <Ionicons name="add" size={24} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </ScrollView>
    );

    // Render Upload Form
    const renderUploadForm = () => (
        <>
            <View style={styles.filterSection}>
                <View style={styles.dropdownRow}>
                    <TouchableOpacity style={styles.dropdown}>
                        <Text style={styles.dropdownText}>Class 10-A</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdown}>
                        <Text style={styles.dropdownText}>Mathematics</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Dynamic Sub-Exam Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
                    <View style={styles.examTabs}>
                        {selectedCategory?.subExams?.map((exam: string) => (
                            <TouchableOpacity
                                key={exam}
                                style={[styles.examTab, selectedSubExam === exam && styles.examTabActive]}
                                onPress={() => setSelectedSubExam(exam)}
                            >
                                <Text style={[styles.examTabText, selectedSubExam === exam && styles.examTabTextActive]}>
                                    {exam}
                                </Text>
                            </TouchableOpacity>
                        )) || null}
                    </View>
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Student Name</Text>
                    <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Marks / 100</Text>
                </View>

                {STUDENTS.map((student, index) => (
                    <Animated.View
                        key={student.id}
                        entering={FadeInDown.delay(index * 50).duration(400)}
                        style={styles.studentRow}
                    >
                        <View style={{ flex: 2 }}>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.studentRoll}>Roll No: {student.roll}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TextInput
                                style={styles.markInput}
                                placeholder="--"
                                keyboardType="numeric"
                                maxLength={3}
                                value={marks[student.id] || ''}
                                onChangeText={(text) => handleMarkChange(student.id, text)}
                            />
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>

            <View style={styles.floatingAction}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Upload Results</Text>
                    <Ionicons name="cloud-upload" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header adapts based on view */}
            <StaffHeader
                title={selectedCategory?.title ?? "Upload Marks"}
                showBackButton={true}
            />
            {selectedCategory && (
                <TouchableOpacity style={styles.backToDash} onPress={handleBackToDashboard}>
                    <Ionicons name="arrow-back" size={16} color="#6B7280" />
                    <Text style={styles.backText}>All Exams</Text>
                </TouchableOpacity>
            )}

            {selectedCategory ? renderUploadForm() : renderDashboard()}

            <StaffFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    // Dashboard Styles
    dashboardContent: {
        padding: 20,
    },
    headerSection: {
        marginBottom: 25,
    },
    pageTitle: {
        fontSize: 24,
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
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    arrowBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#8B5CF6', // Matching button theme
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Internal Navigation
    backToDash: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginLeft: 4,
    },

    // Upload Form Styles
    filterSection: {
        backgroundColor: '#fff',
        padding: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 15,
    },
    dropdown: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
    },
    dropdownText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '500',
    },
    tabsScroll: {
        marginTop: 5,
    },
    examTabs: {
        flexDirection: 'row',
        gap: 8,
    },
    examTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    examTabActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#8B5CF6',
    },
    examTabText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
    },
    examTabTextActive: {
        color: '#8B5CF6',
    },
    listContent: {
        padding: 20,
        paddingBottom: 160,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    headerCell: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    studentRow: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        paddingHorizontal: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    studentName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    studentRoll: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    markInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        width: 60,
        height: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    floatingAction: {
        position: 'absolute',
        bottom: 90,
        left: 20,
        right: 20,
    },
    submitButton: {
        backgroundColor: '#8B5CF6',
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});