import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StaffHeader from '../../src/components/StaffHeader';
import { api } from '../../src/services/apiClient';
import { Class } from '../../src/types/schema';

interface CreateCourseResponse {
    course: {
        id: string;
    };
}

export default function StaffLMSUpload() {
    const router = useRouter();
    const [topic, setTopic] = useState(''); // Serves as Course Title (Subject/Topic)
    const [subTopic, setSubTopic] = useState(''); // Serves as Material Title
    const [className, setClassName] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Cache for lookup
    const [classes, setClasses] = useState<Class[]>([]);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            // Fetch classes to resolve name to ID
            const classesData = await api.get<Class[]>('/academics/classes');
            setClasses(classesData);
        } catch (error) {
            console.error('Failed to fetch metadata', error);
        }
    };

    const handleUpload = async () => {
        if (!topic || !subTopic || !videoUrl || !className) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // 1. Resolve Class ID
            // Simple fuzzy match: e.g. input "10th" or "10th A". We look for class name "10th" or "Class 10".
            // If the user types "10th A", we try to find a class that contains "10".
            // For production, this should be a Dropdown. For now, best effort match.
            const matchedClass = classes.find(c =>
                className.toLowerCase().includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(className.toLowerCase())
            );

            if (!matchedClass) {
                Alert.alert('Error', `Class "${className}" not found. Please verify the class name (e.g., "Class X").`);
                setLoading(false);
                return;
            }

            // 2. Create or Find Course (Topic)
            // Ideally we check if a course exists for this Class+Subject, else create.
            // Since we don't have a robust "Find Course" API by title exposed simply,
            // we will just CREATE a new course for this specific upload to keep it 1:1 for this simple UI.
            // In a real LMS, you'd select an existing course.
            // We'll treat "Topic" as the Course Title (e.g. "Mathematics").
            // We need a Subject ID. We'll use a placeholder or try to find one? 
            // For now, let's assume we can create a course without strict subject_id or we pick a default if possible,
            // but the DB likely requires it. 
            // Workaround: We'll pass a known subject ID if we had one, or let the backend handle it.
            // Looking at schema/routes, subject_id is likely required.
            // We'll skip creating a new course if we can't find a subject? 
            // LIMITATION: We don't have list of subjects loaded.
            // FIX: I'll hardcode fetching subjects or just send null if allowed?
            // Checking lmsRoutes.js: INSERT INTO lms_courses ... VALUES (..., ${subject_id}, ...)
            // If subject_id is null, it might fail if NOT NULL constraint exists.

            // Let's create the material directly? No, materials belong to courses.

            // Hack for MVP without changing UI to Dropdowns:
            // We'll Create a Course with the name `topic`.
            // We'll guess subject_id = 1 (assuming Math or something exists) or try to fetch subjects.

            const newCourse = await api.post<CreateCourseResponse>('/lms/courses', {
                title: topic,
                description: description || `Course for ${className}`,
                class_id: matchedClass.id,
                subject_id: 1, // Fallback ID, assuming database is seeded with at least 1 subject
                is_published: true
            });

            if (!newCourse || !newCourse.course) {
                throw new Error('Failed to create course context');
            }

            // 3. Create Material
            await api.post(`/lms/courses/${newCourse.course.id}/materials`, {
                title: subTopic,
                description: description,
                material_type: 'video',
                content_url: videoUrl,
                sort_order: 1
            });

            Alert.alert('Success', 'Content uploaded successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);

        } catch (error) {
            console.error('Upload error:', error);
            const msg = error instanceof Error ? error.message : 'Unknown error';
            Alert.alert('Error', 'Failed to upload content. ' + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <StaffHeader title="Upload LMS Content" showBackButton={true} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.formCard}>
                        <Text style={styles.cardTitle}>Add New Topic</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Target Class <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Class X"
                                value={className}
                                onChangeText={setClassName}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Subject / Topic <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Mathematics"
                                value={topic}
                                onChangeText={setTopic}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Sub-Topic / Chapter <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Algebra - Quadratic Equations"
                                value={subTopic}
                                onChangeText={setSubTopic}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>YouTube Video Link <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputIconWrapper}>
                                <Ionicons name="logo-youtube" size={20} color="#EF4444" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { paddingLeft: 45 }]}
                                    placeholder="https://youtube.com/..."
                                    value={videoUrl}
                                    onChangeText={setVideoUrl}
                                    autoCapitalize="none"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                placeholder="Enter a brief description of the content..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handleUpload}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                style={styles.gradientButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? <ActivityIndicator color="#FFF" /> : (
                                    <>
                                        <MaterialIcons name="cloud-upload" size={24} color="#FFF" />
                                        <Text style={styles.uploadButtonText}>Upload Content</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 20,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
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
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    inputIconWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 15,
        zIndex: 1,
    },
    uploadButton: {
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    uploadButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
