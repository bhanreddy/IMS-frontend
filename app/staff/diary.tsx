import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StaffHeader from '../../src/components/StaffHeader';
import { DiaryService, DiaryEntry } from '../../src/services/commonServices';
import { useAuth } from '../../src/hooks/useAuth';

export default function StaffDiary() {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedClass, setSelectedClass] = useState('10-A');
    const [dueDate, setDueDate] = useState('');
    const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDiary();
    }, []);

    const fetchDiary = async () => {
        try {
            setLoading(true);
            const data = await DiaryService.getAll({ class_section_id: '1' }); // Mock class ID for now
            setDiaryEntries(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!title || !description || !dueDate) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        try {
            setLoading(true);
            await DiaryService.create({
                class_section_id: '1', // Mock
                entry_date: new Date().toISOString().split('T')[0],
                subject_id: '1', // Mock
                title,
                content: description,
                homework_due_date: dueDate,
                created_by: user?.id || 'teacher_1'
            });
            Alert.alert("Success", "Homework posted successfully!");
            setTitle('');
            setDescription('');
            setDueDate('');
            fetchDiary();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to post homework');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <StaffHeader title="Diary & Homework" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Post New Homework */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.formCard}>
                    <Text style={styles.cardTitle}>Post New Homework</Text>

                    <View style={styles.dropdownRow}>
                        <TouchableOpacity style={[styles.dropdown, { marginRight: 10 }]}>
                            <Text style={styles.dropdownText}>{selectedClass}</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={20} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdown}>
                            <Text style={styles.dropdownText}>English</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Chapter 5 Summary"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Details about the homework..."
                            multiline
                            numberOfLines={3}
                            value={description}
                            onChangeText={setDescription}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Due Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/YYYY"
                                value={dueDate}
                                onChangeText={setDueDate}
                            />
                        </View>
                        <TouchableOpacity style={styles.attachButton}>
                            <Ionicons name="attach" size={24} color="#6366F1" />
                            <Text style={styles.attachText}>Attach</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.postButton} activeOpacity={0.8} onPress={handlePost}>
                        <Text style={styles.postButtonText}>Post Homework</Text>
                        <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Recent Posts */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recently Posted</Text>
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.listContainer}>
                        {loading ? <ActivityIndicator size="large" /> : diaryEntries.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.delay(300 + (index * 100)).duration(600)}
                                style={styles.postCard}
                            >
                                <View style={styles.postHeader}>
                                    <View>
                                        <Text style={styles.postClass}>Class A • Subject</Text>
                                        <Text style={styles.postTitle}>{item.title || 'Homework'}</Text>
                                    </View>
                                    <View style={styles.dateBadge}>
                                        <Text style={styles.dateText}>{item.entry_date}</Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.postFooter}>
                                    <Text style={styles.dueText}>Due: {item.homework_due_date}</Text>
                                    {item.attachments && item.attachments.length > 0 && (
                                        <View style={styles.attachmentBadge}>
                                            <Ionicons name="attach" size={14} color="#6366F1" />
                                            <Text style={styles.attachmentText}>{item.attachments.length} File</Text>
                                        </View>
                                    )}
                                </View>
                            </Animated.View>
                        ))}
                    </View>
                </View>

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
        paddingBottom: 50,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
    },
    dropdownRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    dropdown: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
    },
    dropdownText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#111827',
    },
    textArea: {
        height: 100,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 15,
        marginBottom: 20,
    },
    attachButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF2FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        height: 50,
    },
    attachText: {
        color: '#6366F1',
        fontWeight: '600',
        marginLeft: 4,
    },
    postButton: {
        backgroundColor: '#6366F1',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContainer: {
        gap: 15,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    postClass: {
        fontSize: 12,
        color: '#6366F1',
        fontWeight: '600',
        marginBottom: 4,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    dateBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    dateText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dueText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '500',
    },
    attachmentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#EEF2FF',
        borderRadius: 6,
        gap: 4,
    },
    attachmentText: {
        fontSize: 11,
        color: '#6366F1',
    },
});


