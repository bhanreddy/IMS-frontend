import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Components
import StaffHeader from '../../src/components/StaffHeader';

// Services
import { ComplaintService, Complaint } from '../../src/services/commonServices';
import { StudentService } from '../../src/services/studentService';
import { StudentWithDetails } from '../../src/types/schema';

// Extended interface for UI
interface UIComplaint extends Complaint {
    color?: string;
    target?: string;
    date?: string;
}

interface Student {
    id: string;
    display_name: string; // From Person
    admission_no: string;
}

export default function StaffComplaints() {
    const [activeTab, setActiveTab] = useState<'MY_REPORTS' | 'FILE_NEW'>('MY_REPORTS');
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState<UIComplaint[]>([]);
    const [filterType, setFilterType] = useState<'ALL' | 'DISCIPLINARY' | 'FACILITY'>('ALL');

    // Form State
    const [studentSearch, setStudentSearch] = useState('');
    const [studentsList, setStudentsList] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Low');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (activeTab === 'MY_REPORTS') {
            fetchComplaints();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'FILE_NEW' && studentSearch.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                searchStudents();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setStudentsList([]);
        }
    }, [studentSearch, activeTab]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await ComplaintService.getAll();
            // Transform data if needed or Map colors
            const mappedData: UIComplaint[] = data.map(item => ({
                ...item,
                color: getCategoryColor(item.category || ''),
                target: item.raised_for_student_id || 'N/A', // TODO: Fetch student name
                date: new Date(item.created_at).toLocaleDateString()
            }));
            setComplaints(mappedData);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            Alert.alert('Error', 'Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const searchStudents = async () => {
        try {
            setIsSearching(true);
            const response = await StudentService.getAll<StudentWithDetails>({ search: studentSearch, limit: 5 });
            const mappedStudents = response.data.map((s: StudentWithDetails) => ({
                id: s.id,
                display_name: s.person.display_name || `${s.person.first_name} ${s.person.last_name}`,
                admission_no: s.admission_no
            }));
            setStudentsList(mappedStudents);
        } catch (error) {
            console.error('Error searching students:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async () => {
        if (!title || !desc || !selectedStudent) {
            Alert.alert('Error', 'Please fill all fields and select a student');
            return;
        }

        try {
            setLoading(true);
            await ComplaintService.create({
                title,
                description: desc,
                category: 'disciplinary', // Defaulting for 'Sudent Disciplinary' page context
                priority: severity.toLowerCase(),
                raised_for_student_id: selectedStudent.id
            });
            Alert.alert('Success', 'Complaint submitted successfully');
            // Reset form
            setTitle('');
            setDesc('');
            setStudentSearch('');
            setSelectedStudent(null);
            setSeverity('Low');
            setActiveTab('MY_REPORTS');
        } catch (error) {
            console.error('Submit error:', error);
            Alert.alert('Error', 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'disciplinary': return '#EF4444';
            case 'academic': return '#3B82F6';
            case 'facility': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const filteredComplaints = complaints.filter(c => {
        if (filterType === 'ALL') return true;
        return c.category?.toUpperCase() === filterType;
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

    const renderComplaintItem = ({ item, index }: { item: UIComplaint, index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={styles.cardWrapper}
        >
            <View style={styles.card}>
                <View style={[styles.urgencyLine, { backgroundColor: item.color || '#ccc' }]} />

                <View style={styles.cardHeader}>
                    <View style={styles.studentInfo}>
                        <View style={[styles.avatarStats, { backgroundColor: `${item.color || '#ccc'}15` }]}>
                            <Text style={[styles.avatarText, { color: item.color || '#666' }]}>
                                #
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.studentName}>{item.ticket_no}</Text>
                            {/* Backend might not return student name directly in list unless joined, checking implementation */}
                            <Text style={styles.rollNo}>{item.category}</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: `${item.color || '#ccc'}15`, borderColor: `${item.color || '#ccc'}30` }]}>
                        <Text style={[styles.badgeText, { color: item.color || '#666' }]}>{item.priority}</Text>
                    </View>
                </View>

                <View style={styles.contentBody}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    {/* Description might be long, optionally truncate */}
                    <Text style={styles.reportDesc} numberOfLines={2}>{item.description || 'No description'}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.date}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</Text>
                    <View style={[styles.statusDot,
                    item.status === 'resolved' ? { backgroundColor: '#10B981' } :
                        (item.status as string) === 'escalated' ? { backgroundColor: '#EF4444' } :
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
                {selectedStudent ? (
                    <View style={styles.selectedStudentChip}>
                        <Text style={styles.selectedStudentText}>{selectedStudent.display_name} ({selectedStudent.admission_no})</Text>
                        <TouchableOpacity onPress={() => { setSelectedStudent(null); setStudentSearch(''); }} style={{ marginLeft: 8 }}>
                            <Ionicons name="close-circle" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Search student..."
                            placeholderTextColor="#9CA3AF"
                            value={studentSearch}
                            onChangeText={setStudentSearch}
                        />
                        {isSearching && <ActivityIndicator style={{ position: 'absolute', right: 10, top: 40 }} />}
                        {studentSearch.length > 2 && studentsList.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {studentsList.map((s) => (
                                    <TouchableOpacity
                                        key={s.id}
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            setSelectedStudent(s);
                                            setStudentsList([]);
                                            setStudentSearch('');
                                        }}
                                    >
                                        <Text style={styles.suggestionText}>{s.display_name} ({s.admission_no})</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </>
                )}
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
                    {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                        <TouchableOpacity
                            key={lvl}
                            style={[
                                styles.severityChip,
                                severity === lvl && styles.severityActive,
                                severity === lvl && (lvl === 'High' ? { backgroundColor: '#FEE2E2', borderColor: '#EF4444' } :
                                    lvl === 'Medium' ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' } :
                                        { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' })
                            ]}
                            onPress={() => setSeverity(lvl)}
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

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.submitGradient}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : (
                        <>
                            <Text style={styles.submitText}>Submit Report</Text>
                            <Ionicons name="send" size={18} color="#fff" />
                        </>
                    )}
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
                            {(['ALL', 'DISCIPLINARY', 'FACILITY'] as const).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.filterChip, filterType === type && styles.activeFilterChip]}
                                    onPress={() => setFilterType(type)}
                                >
                                    <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {loading ? <ActivityIndicator size="large" color="#10B981" /> :
                            filteredComplaints.length === 0 ? <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No complaints found.</Text> :
                                filteredComplaints.map((item, index) => renderComplaintItem({ item, index }))
                        }
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
        position: 'relative',
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
    suggestionsContainer: {
        marginTop: 4,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        maxHeight: 150,
        zIndex: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    suggestionText: {
        fontSize: 14,
        color: '#374151'
    },
    selectedStudentChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#10B981',
        alignSelf: 'flex-start'
    },
    selectedStudentText: {
        color: '#047857',
        fontWeight: '600'
    }
});
