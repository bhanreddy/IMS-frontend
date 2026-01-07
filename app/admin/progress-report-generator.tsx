import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
    ActivityIndicator,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminHeader from '../../src/components/AdminHeader';
import { ADMIN_THEME } from '../../src/constants/adminTheme';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

// --- Types ---
interface SubjectMark {
    subject: string;
    maxMarks: number;
    obtained: number;
    grade: string;
}

interface StudentResult {
    id: string;
    name: string;
    fatherName: string;
    class: string;
    rollNo: string;
    dob: string;
    academicYear: string;
    attendance: string;
    marks: SubjectMark[];
    // Calculated fields
    totalMax?: number;
    totalObtained?: number;
    percentage?: number;
    result?: 'PASS' | 'FAIL';
    division?: string;
}

// --- Mock Data & Service ---
const MOCK_RESULTS: Record<string, StudentResult> = {
    '101': {
        id: '101',
        name: 'Rohan Sharma',
        fatherName: 'Mr. Rajesh Sharma',
        class: 'Class X - A',
        rollNo: '24',
        dob: '15-Aug-2009',
        academicYear: '2025-2026',
        attendance: '92%',
        marks: [
            { subject: 'English', maxMarks: 100, obtained: 85, grade: 'A' },
            { subject: 'Mathematics', maxMarks: 100, obtained: 92, grade: 'A+' },
            { subject: 'Science', maxMarks: 100, obtained: 78, grade: 'B+' },
            { subject: 'Social Studies', maxMarks: 100, obtained: 88, grade: 'A' },
            { subject: 'Hindi', maxMarks: 100, obtained: 80, grade: 'A' },
        ]
    },
    '102': {
        id: '102',
        name: 'Priya Reddy',
        fatherName: 'Mr. Suresh Reddy',
        class: 'Class X - A',
        rollNo: '25',
        dob: '22-Jan-2008',
        academicYear: '2025-2026',
        attendance: '96%',
        marks: [
            { subject: 'English', maxMarks: 100, obtained: 90, grade: 'A+' },
            { subject: 'Mathematics', maxMarks: 100, obtained: 95, grade: 'A+' },
            { subject: 'Science', maxMarks: 100, obtained: 94, grade: 'A+' },
            { subject: 'Social Studies', maxMarks: 100, obtained: 91, grade: 'A+' },
            { subject: 'Hindi', maxMarks: 100, obtained: 88, grade: 'A' },
        ]
    },
    '103': {
        id: '103',
        name: 'Amit Kumar',
        fatherName: 'Mr. Deepak Kumar',
        class: 'Class X - B',
        rollNo: '05',
        dob: '10-Mar-2010',
        academicYear: '2025-2026',
        attendance: '75%',
        marks: [
            { subject: 'English', maxMarks: 100, obtained: 45, grade: 'C' },
            { subject: 'Mathematics', maxMarks: 100, obtained: 32, grade: 'F' }, // Fail
            { subject: 'Science', maxMarks: 100, obtained: 40, grade: 'C' },
            { subject: 'Social Studies', maxMarks: 100, obtained: 50, grade: 'B' },
            { subject: 'Hindi', maxMarks: 100, obtained: 60, grade: 'B+' },
        ]
    }
};

const fetchStudentResult = async (studentId: string): Promise<StudentResult> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = MOCK_RESULTS[studentId];
            if (data) {
                // Calculate totals on the fly
                let totalMax = 0;
                let totalObtained = 0;
                let hasFailed = false;

                data.marks.forEach(m => {
                    totalMax += m.maxMarks;
                    totalObtained += m.obtained;
                    if (m.obtained < 35) hasFailed = true; // Simple pass criteria
                });

                const percentage = (totalObtained / totalMax) * 100;
                const result = hasFailed ? 'FAIL' : 'PASS';

                let division = '-';
                if (result === 'PASS') {
                    if (percentage >= 75) division = 'Distinction';
                    else if (percentage >= 60) division = 'First Class';
                    else if (percentage >= 50) division = 'Second Class';
                    else division = 'Third Class';
                }

                resolve({
                    ...data,
                    totalMax,
                    totalObtained,
                    percentage: parseFloat(percentage.toFixed(2)),
                    result,
                    division
                });
            } else {
                reject(new Error('Student not found'));
            }
        }, 800);
    });
};

export default function ProgressReportGenerator() {
    const router = useRouter();
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState<StudentResult | null>(null);

    const handleSearch = async () => {
        if (!studentId.trim()) {
            Alert.alert('Error', 'Please enter a Student ID');
            return;
        }

        setLoading(true);
        setResultData(null);

        try {
            const data = await fetchStudentResult(studentId);
            setResultData(data);
        } catch (error) {
            Alert.alert('Error', 'Student not found. Try IDs: 101, 102, 103');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        Alert.alert('Print', 'Sending report to printer / generating PDF...');
        // Logic for Print.printAsync goes here
    };

    // --- Render Components ---

    const renderReportCard = () => {
        if (!resultData) return null;

        const isPass = resultData.result === 'PASS';

        return (
            <Animated.View entering={FadeInDown.springify()} style={styles.previewContainer}>

                {/* Visual Paper Sheet */}
                <View style={styles.paperSheet}>

                    {/* Header */}
                    <View style={styles.headerSection}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="school" size={24} color="#FFF" />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.schoolName}>NATIVE HIGH SCHOOL</Text>
                            <Text style={styles.schoolSub}>ANNUAL PROGRESS REPORT</Text>
                            <Text style={styles.academicYear}>{resultData.academicYear}</Text>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Student Details Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Student Name:</Text>
                            <Text style={styles.detailValue}>{resultData.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Class & Sec:</Text>
                            <Text style={styles.detailValue}>{resultData.class}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Roll No:</Text>
                            <Text style={styles.detailValue}>{resultData.rollNo}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Father's Name:</Text>
                            <Text style={styles.detailValue}>{resultData.fatherName}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>D.O.B:</Text>
                            <Text style={styles.detailValue}>{resultData.dob}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Attendance:</Text>
                            <Text style={styles.detailValue}>{resultData.attendance}</Text>
                        </View>
                    </View>

                    {/* Marks Table */}
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.colSubject, styles.th]}>Subject</Text>
                            <Text style={[styles.colMarks, styles.th]}>Max</Text>
                            <Text style={[styles.colMarks, styles.th]}>Obt</Text>
                            <Text style={[styles.colGrade, styles.th]}>Grade</Text>
                        </View>
                        {resultData.marks.map((m, i) => (
                            <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.rowAlt]}>
                                <Text style={[styles.colSubject, styles.td]}>{m.subject}</Text>
                                <Text style={[styles.colMarks, styles.td]}>{m.maxMarks}</Text>
                                <Text style={[styles.colMarks, styles.td, m.obtained < 35 && styles.textDanger]}>
                                    {m.obtained}
                                </Text>
                                <Text style={[styles.colGrade, styles.td]}>{m.grade}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Summary Section */}
                    <View style={styles.summarySection}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Marks:</Text>
                            <Text style={styles.summaryValue}>{resultData.totalObtained} / {resultData.totalMax}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Percentage:</Text>
                            <Text style={styles.summaryValue}>{resultData.percentage}%</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Result:</Text>
                            <View style={[styles.resultBadge, isPass ? styles.badgePass : styles.badgeFail]}>
                                <Text style={[styles.resultText, isPass ? styles.textPass : styles.textFail]}>
                                    {resultData.result}
                                </Text>
                            </View>
                        </View>
                        {isPass && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Division:</Text>
                                <Text style={styles.summaryValue}>{resultData.division}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* Footer / Signatures */}
                    <View style={styles.footerSignatures}>
                        <View style={styles.signBox}>
                            <Text style={styles.signLabel}>Class Teacher</Text>
                        </View>
                        <View style={styles.signBox}>
                            <Text style={styles.signLabel}>Principal</Text>
                        </View>
                        <View style={styles.signBox}>
                            <Text style={styles.signLabel}>Parent</Text>
                        </View>
                    </View>

                    {/* School Watermark (Decorative) */}
                    <Ionicons name="school" size={200} color="rgba(0,0,0,0.03)" style={styles.watermark} />
                </View>

                {/* Print Button */}
                <TouchableOpacity style={styles.printBtn} onPress={handlePrint} activeOpacity={0.8}>
                    <LinearGradient
                        colors={[ADMIN_THEME.colors.primary, '#6366F1']}
                        style={styles.printGradient}
                    >
                        <Feather name="printer" size={20} color="#FFF" />
                        <Text style={styles.printText}>Print Report Card</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </Animated.View>
        );
    };

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={[ADMIN_THEME.colors.background.app, '#F0F4FF']}
                style={StyleSheet.absoluteFill}
            />
            <AdminHeader title="Progress Reports" showBackButton />

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.content}>

                    {/* Search Section */}
                    <Text style={styles.sectionTitle}>Generate Report</Text>
                    <View style={styles.searchCard}>
                        <Text style={styles.label}>Enter Student ID</Text>
                        <View style={styles.inputRow}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="search-outline" size={20} color={ADMIN_THEME.colors.text.muted} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 101, 102, 103"
                                    placeholderTextColor={ADMIN_THEME.colors.text.muted}
                                    value={studentId}
                                    onChangeText={setStudentId}
                                />
                            </View>
                            <TouchableOpacity
                                style={[styles.searchBtn, loading && styles.disabledBtn]}
                                onPress={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Feather name="arrow-right" size={20} color="#FFF" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Report Render */}
                    {renderReportCard()}

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scroll: {
        paddingBottom: 40,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: ADMIN_THEME.colors.text.primary,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: ADMIN_THEME.colors.text.secondary,
        marginBottom: 8,
    },
    // Search Card
    searchCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        ...ADMIN_THEME.shadows.sm,
        marginBottom: 20,
    },
    inputRow: { flexDirection: 'row', gap: 12 },
    inputWrapper: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: ADMIN_THEME.colors.background.surface,
        borderWidth: 1, borderColor: ADMIN_THEME.colors.border,
        borderRadius: 12, paddingHorizontal: 12, height: 50,
    },
    searchIcon: { marginRight: 8 },
    input: { flex: 1, fontSize: 16, color: ADMIN_THEME.colors.text.primary },
    searchBtn: {
        width: 50, height: 50, borderRadius: 12,
        backgroundColor: ADMIN_THEME.colors.primary,
        justifyContent: 'center', alignItems: 'center',
        ...ADMIN_THEME.shadows.sm,
    },
    disabledBtn: { opacity: 0.7 },

    // Report Card Paper
    previewContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    paperSheet: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 4,
        padding: 0,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerSection: {
        backgroundColor: ADMIN_THEME.colors.primary,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
    },
    schoolName: {
        fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 1,
    },
    schoolSub: {
        fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.9)',
        marginTop: 4, letterSpacing: 2,
    },
    academicYear: {
        fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2,
        fontStyle: 'italic',
    },

    // Student Details
    detailsGrid: {
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#F8FAFC',
    },
    detailRow: {
        width: '50%',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 14, color: '#1E293B', fontWeight: '700', marginTop: 2,
    },

    // Table
    tableContainer: {
        padding: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    th: {
        color: '#FFF', fontWeight: '700', fontSize: 13,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    rowAlt: { backgroundColor: '#F8FAFC' },
    td: {
        color: '#334155', fontSize: 13, fontWeight: '500',
    },
    colSubject: { flex: 2 },
    colMarks: { flex: 1, textAlign: 'center' },
    colGrade: { flex: 1, textAlign: 'center' },

    textDanger: { color: ADMIN_THEME.colors.danger, fontWeight: '700' },

    // Summary
    summarySection: {
        padding: 20,
        paddingTop: 0,
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    summaryLabel: {
        fontSize: 14, color: '#475569', fontWeight: '600',
    },
    summaryValue: {
        fontSize: 16, color: '#0F172A', fontWeight: '800',
    },
    resultBadge: {
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
    },
    badgePass: { backgroundColor: '#ECFDF5' },
    badgeFail: { backgroundColor: '#FEF2F2' },
    textPass: { color: ADMIN_THEME.colors.success },
    textFail: { color: ADMIN_THEME.colors.danger },
    resultText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },

    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },

    // Footer
    footerSignatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 30,
        paddingTop: 40,
    },
    signBox: {
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#94A3B8',
        width: '28%',
        paddingTop: 8,
    },
    signLabel: {
        fontSize: 11, color: '#64748B', fontWeight: '600',
    },
    watermark: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        zIndex: -1,
    },

    // Print Button
    printBtn: {
        width: '100%',
        marginTop: 24,
        borderRadius: 12,
        ...ADMIN_THEME.shadows.md,
    },
    printGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
    },
    printText: {
        color: '#FFF', fontSize: 16, fontWeight: '700',
    },
});
