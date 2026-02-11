import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ADMIN_THEME } from '../../src/constants/adminTheme';
import AdminHeader from '../../src/components/AdminHeader';
import { ClassService, ClassInfo, Section, ClassSection } from '../../src/services/classService';
import { ResultService, Subject } from '../../src/services/commonServices';
import { StaffService, Staff } from '../../src/services/staffService';
import { TimetableService, TimetableSlot } from '../../src/services/timetableService';

// Constants
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const PERIOD_TIMES: Record<number, { start: string, end: string }> = {
    1: { start: '09:00:00', end: '09:45:00' },
    2: { start: '09:45:00', end: '10:30:00' },
    3: { start: '10:45:00', end: '11:30:00' },
    4: { start: '11:30:00', end: '12:15:00' },
    5: { start: '13:00:00', end: '13:45:00' },
    6: { start: '13:45:00', end: '14:30:00' },
    7: { start: '14:30:00', end: '15:15:00' },
    8: { start: '15:15:00', end: '16:00:00' },
};

export default function TimetableManagement() {
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState<TimetableSlot[]>([]);

    // Dropdown Data
    const [classes, setClasses] = useState<ClassInfo[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);

    // Selection State
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('');
    const [classSectionId, setClassSectionId] = useState<string | null>(null);
    const [yearId, setYearId] = useState<string>(''); // Current year ID

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [activeCell, setActiveCell] = useState<{ day: string, period: number } | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [cls, sec, sub, st, year] = await Promise.all([
                ClassService.getClasses(),
                ClassService.getSections(),
                ResultService.getSubjects(),
                StaffService.getAll({ status_id: 1 }),
                ClassService.getCurrentAcademicYear()
            ]);
            setClasses(cls);
            setSections(sec);
            setSubjects(sub);
            setStaff(st);
            if (year) setYearId(year.id);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load metadata');
        } finally {
            setLoading(false);
        }
    };

    // Load Slots when Class+Section is selected
    useEffect(() => {
        if (selectedClassId && selectedSectionId) {
            findClassSectionAndLoadSlots();
        }
    }, [selectedClassId, selectedSectionId]);

    const findClassSectionAndLoadSlots = async () => {
        setLoading(true);
        try {
            // Find classSectionId
            // In a real app, we might search DB or filter fetched mapping.
            // For now, let's assume ClassService has a helper or we filter.
            // Actually, we need to know the 'class_section_id'. 
            // We can fetch all class-sections for current year and find match.
            const mappings = await ClassService.getClassSections(yearId);
            const match = mappings.find(m => m.class_id === selectedClassId && m.section_id === selectedSectionId);

            if (match) {
                setClassSectionId(match.id);
                const data = await TimetableService.getClassSlots(match.id, yearId);
                setSlots(data);
            } else {
                setClassSectionId(null);
                setSlots([]);
                Alert.alert('Notice', 'No Class-Section mapping found. Please assign section to class in "Academic Structure" first.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCellPress = (day: string, period: number) => {
        if (!classSectionId) return;

        const existing = slots.find(s => s.day_of_week === day && s.period_number === period);

        setActiveCell({ day, period });
        setStartTime(existing?.start_time || PERIOD_TIMES[period]?.start || '09:00:00');
        setEndTime(existing?.end_time || PERIOD_TIMES[period]?.end || '10:00:00');
        setSelectedSubjectId(existing?.subject_id || '');
        setSelectedTeacherId(existing?.teacher_id || '');

        setModalVisible(true);
    };

    const handleSaveSlot = async () => {
        if (!classSectionId || !activeCell || !selectedSubjectId) {
            Alert.alert('Error', 'Please select a subject');
            return;
        }

        try {
            // Check if exists to decide Update (Delete+Create) or Create
            // Backend "create" is just INSERT. If strict unique constraint, we should DELETE first.
            // The constraint is UNIQUE(class, year, day, period). So we must delete if exists.

            const existing = slots.find(s => s.day_of_week === activeCell.day && s.period_number === activeCell.period);
            if (existing) {
                await TimetableService.deleteSlot(existing.id);
            }

            await TimetableService.createSlot({
                academic_year_id: yearId,
                class_section_id: classSectionId,
                day_of_week: activeCell.day,
                period_number: activeCell.period,
                subject_id: selectedSubjectId,
                teacher_id: selectedTeacherId || undefined,
                start_time: startTime,
                end_time: endTime
            });

            setModalVisible(false);
            // Refresh
            const data = await TimetableService.getClassSlots(classSectionId, yearId);
            setSlots(data);

        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to save slot');
        }
    };

    const handleDeleteSlot = async () => {
        const existing = slots.find(s => activeCell && s.day_of_week === activeCell.day && s.period_number === activeCell.period);
        if (existing) {
            try {
                await TimetableService.deleteSlot(existing.id);
                setModalVisible(false);
                // Refresh
                if (classSectionId) {
                    const data = await TimetableService.getClassSlots(classSectionId, yearId);
                    setSlots(data);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to delete');
            }
        }
    };

    const getSlotDisplay = (day: string, period: number) => {
        const slot = slots.find(s => s.day_of_week === day && s.period_number === period);
        if (!slot) return null;
        return (
            <View style={styles.slotContent}>
                <Text style={styles.slotSubject} numberOfLines={1}>{slot.subject_name}</Text>
                {slot.teacher_name && <Text style={styles.slotTeacher} numberOfLines={1}>{slot.teacher_name}</Text>}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={ADMIN_THEME.colors.primary} />
            <AdminHeader title="Timetable Manager" showBackButton />

            {/* Selectors */}
            <View style={styles.selectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {classes.map(c => (
                        <TouchableOpacity
                            key={c.id}
                            style={[styles.chip, selectedClassId === c.id && styles.activeChip]}
                            onPress={() => setSelectedClassId(c.id)}
                        >
                            <Text style={[styles.chipText, selectedClassId === c.id && styles.activeChipText]}>{c.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={{ height: 10 }} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {sections.map(s => (
                        <TouchableOpacity
                            key={s.id}
                            style={[styles.chip, selectedSectionId === s.id && styles.activeChip]}
                            onPress={() => setSelectedSectionId(s.id)}
                        >
                            <Text style={[styles.chipText, selectedSectionId === s.id && styles.activeChipText]}>{s.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Grid */}
            <ScrollView style={styles.gridContainer}>
                <View style={styles.headerRow}>
                    <View style={styles.cornerCell} />
                    {DAYS.map(day => (
                        <View key={day} style={styles.headerCell}>
                            <Text style={styles.headerText}>{day.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                {PERIODS.map(period => (
                    <View key={period} style={styles.row}>
                        <View style={styles.periodCell}>
                            <Text style={styles.periodText}>P{period}</Text>
                            <Text style={styles.timeText}>{PERIOD_TIMES[period].start.substring(0, 5)}</Text>
                        </View>
                        {DAYS.map(day => (
                            <TouchableOpacity
                                key={day}
                                style={[styles.cell, getSlotDisplay(day, period) ? styles.filledCell : null]}
                                onPress={() => handleCellPress(day, period)}
                            >
                                {getSlotDisplay(day, period)}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>edit Slot: {activeCell?.day.toUpperCase()} - P{activeCell?.period}</Text>

                        <Text style={styles.label}>Subject</Text>
                        <ScrollView style={styles.listContainer} nestedScrollEnabled>
                            {subjects.map(sub => (
                                <TouchableOpacity
                                    key={sub.id}
                                    style={[styles.option, selectedSubjectId === sub.id && styles.activeOption]}
                                    onPress={() => setSelectedSubjectId(sub.id)}
                                >
                                    <Text style={[styles.optionText, selectedSubjectId === sub.id && styles.activeOptionText]}>
                                        {sub.name} ({sub.code})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.label}>Teacher</Text>
                        <ScrollView style={styles.listContainer} nestedScrollEnabled>
                            <TouchableOpacity onPress={() => setSelectedTeacherId('')} style={styles.option}>
                                <Text style={styles.optionText}>-- No Teacher --</Text>
                            </TouchableOpacity>
                            {staff.map(st => (
                                <TouchableOpacity
                                    key={st.id}
                                    style={[styles.option, selectedTeacherId === st.id && styles.activeOption]}
                                    onPress={() => setSelectedTeacherId(st.id)}
                                >
                                    <Text style={[styles.optionText, selectedTeacherId === st.id && styles.activeOptionText]}>
                                        {st.display_name || st.first_name || st.staff_code}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteSlot}>
                                <Text style={styles.deleteButtonText}>Clear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveSlot}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    selectorContainer: { padding: 12, backgroundColor: '#fff', elevation: 2 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F3F4F6', borderRadius: 20, marginRight: 8 },
    activeChip: { backgroundColor: '#6366F1' },
    chipText: { color: '#4B5563', fontWeight: '600' },
    activeChipText: { color: '#fff' },

    gridContainer: { flex: 1, padding: 8 },
    headerRow: { flexDirection: 'row', marginBottom: 4 },
    cornerCell: { width: 50 },
    headerCell: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 4, backgroundColor: '#E0E7FF', borderRadius: 4, marginHorizontal: 1 },
    headerText: { fontWeight: 'bold', fontSize: 12, color: '#3730A3' },

    row: { flexDirection: 'row', marginBottom: 2, height: 60 },
    periodCell: { width: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EDE9FE', borderRadius: 4, marginRight: 2 },
    periodText: { fontWeight: 'bold', color: '#5B21B6' },
    timeText: { fontSize: 10, color: '#666' },

    cell: { flex: 1, backgroundColor: '#fff', marginHorizontal: 1, borderRadius: 4, padding: 2, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    filledCell: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
    slotContent: { alignItems: 'center' },
    slotSubject: { fontSize: 11, fontWeight: '700', color: '#4F46E5', textAlign: 'center' },
    slotTeacher: { fontSize: 9, color: '#6B7280', textAlign: 'center' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
    label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 8, color: '#374151' },
    listContainer: { height: 150, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 4 },
    option: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    activeOption: { backgroundColor: '#EEF2FF' },
    optionText: { color: '#374151' },
    activeOptionText: { color: '#4F46E5', fontWeight: 'bold' },

    modalButtons: { flexDirection: 'row', marginTop: 20, gap: 10 },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
    deleteButton: { backgroundColor: '#FEE2E2' },
    cancelButton: { backgroundColor: '#F3F4F6' },
    saveButton: { backgroundColor: '#6366F1' },
    deleteButtonText: { color: '#EF4444', fontWeight: '600' },
    cancelButtonText: { color: '#6B7280', fontWeight: '600' },
    saveButtonText: { color: '#fff', fontWeight: '600' },
});
