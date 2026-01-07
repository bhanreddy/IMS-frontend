import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StaffHeader from '../../src/components/StaffHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MOCK_COMPLAINTS, Complaint } from '../../src/data/mockComplaints';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function StaffComplaints() {
    const [activeTab, setActiveTab] = useState<'MY_REPORTS' | 'FILE_NEW'>('MY_REPORTS');

    // Form State
    const [selectedStudent, setSelectedStudent] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'DISCIPLINARY' | 'FACILITY'>('ALL');
    const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Low');

    // Filter Mock Data for Staff View (Displaying reports filed BY staff OR related to their class)
    const staffReports = MOCK_COMPLAINTS.filter(c => {
        const isStaffRelated = c.filedBy.includes('Sarah') || c.reporterRole === 'STAFF';
        const typeMatch = filterType === 'ALL' || c.type === filterType;
        return isStaffRelated && typeMatch;
    });

    const renderHeader = () => (
        <View style={styles.headerSection}>
            <Text style={styles.pageTitle}>Student Disciplinary</Text>
            <Text style={styles.pageSub}>Track and manage student behavior records</Text>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'MY_REPORTS' && styles.activeTab]}
                    onPress={() => setActiveTab('MY_REPORTS')}
                >
                    <Text style={[styles.tabText, activeTab === 'MY_REPORTS' && styles.activeTabText]}>
                        History
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'FILE_NEW' && styles.activeTab]}
                    onPress={() => setActiveTab('FILE_NEW')}
                >
                    <Text style={[styles.tabText, activeTab === 'FILE_NEW' && styles.activeTabText]}>
                        File New Report
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderComplaintItem = ({ item, index }: { item: Complaint, index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={styles.cardWrapper}
        >
            <View style={styles.card}>
                <View style={[styles.urgencyLine, { backgroundColor: item.color }]} />

                <View style={styles.cardHeader}>
                    <View style={styles.studentInfo}>
                        <View style={[styles.avatarStats, { backgroundColor: `${item.color}15` }]}>
                            <Text style={[styles.avatarText, { color: item.color }]}>
                                {item.target.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.studentName}>{item.target}</Text>
                            <Text style={styles.rollNo}>ID: {item.targetID || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: `${item.color}15`, borderColor: `${item.color}30` }]}>
                        <Text style={[styles.badgeText, { color: item.color }]}>{item.severity}</Text>
                    </View>
                </View>

                <View style={styles.contentBody}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <Text style={styles.reportDesc}>{item.description}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.date}>{item.date}</Text>
                    <View style={[styles.statusDot,
                    item.status === 'Resolved' ? { backgroundColor: '#10B981' } :
                        item.status === 'Escalated' ? { backgroundColor: '#EF4444' } :
                            { backgroundColor: '#F59E0B' }
                    ]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    const renderForm = () => (
        <Animated.View entering={FadeInDown.duration(500)} style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Student Name / Roll No</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Search student..."
                    placeholderTextColor="#9CA3AF"
                    value={selectedStudent}
                    onChangeText={setSelectedStudent}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Incident Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Late Arrival, Uniform Violation"
                    placeholderTextColor="#9CA3AF"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Detailed description of the incident..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    value={desc}
                    onChangeText={setDesc}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Severity Level</Text>
                <View style={styles.severityRow}>
                    {['Low', 'Medium', 'High'].map((lvl) => (
                        <TouchableOpacity
                            key={lvl}
                            style={[
                                styles.severityChip,
                                severity === lvl && styles.severityActive,
                                severity === lvl && (lvl === 'High' ? { backgroundColor: '#FEE2E2', borderColor: '#EF4444' } :
                                    lvl === 'Medium' ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' } :
                                        { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' })
                            ]}
                            onPress={() => setSeverity(lvl as any)}
                        >
                            <Text style={[
                                styles.severityText,
                                severity === lvl && (lvl === 'High' ? { color: '#B91C1C' } :
                                    lvl === 'Medium' ? { color: '#B45309' } :
                                        { color: '#1D4ED8' })
                            ]}>{lvl}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.submitBtn}>
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.submitGradient}
                >
                    <Text style={styles.submitText}>Submit Report</Text>
                    <Ionicons name="send" size={18} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StaffHeader title="Complaints & Remarks" showBackButton />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderHeader()}

                {activeTab === 'MY_REPORTS' ? (
                    <View style={styles.listContainer}>
                        <View style={styles.filterTabs}>
                            {['ALL', 'DISCIPLINARY', 'FACILITY'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.filterChip, filterType === type && styles.activeFilterChip]}
                                    onPress={() => setFilterType(type as any)}
                                >
                                    <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {staffReports.map((item, index) => renderComplaintItem({ item, index }))}
                    </View>
                ) : (
                    renderForm()
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: 20,
    },
    headerSection: {
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    pageSub: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: '#ECFDF5',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#059669',
        fontWeight: '700',
    },

    // CARDS
    cardWrapper: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    urgencyLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    studentInfo: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    avatarStats: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontWeight: '800',
        fontSize: 14,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    rollNo: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    contentBody: {
        marginBottom: 12,
        paddingLeft: 4 + 12, // urgency line + gap
    },
    reportTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 4,
    },
    reportDesc: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingLeft: 16,
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    statusDot: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    // FORM
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    textArea: {
        height: 100,
    },
    severityRow: {
        flexDirection: 'row',
        gap: 12,
    },
    severityChip: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    severityActive: {
        // dynamic styles handled inline
    },
    severityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    submitBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 10,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    submitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    listContainer: {},
    filterTabs: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeFilterChip: {
        backgroundColor: '#059669',
        borderColor: '#059669',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeFilterText: {
        color: '#fff',
    },
});
