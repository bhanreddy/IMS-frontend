import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StaffHeader from '@/src/components/StaffHeader'; // Adjust path if needed
import { MOCK_LMS_CONTENT, LMSContent } from '@/src/data/mockLMS';

export default function StaffLMSUpload() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [subTopic, setSubTopic] = useState('');
    const [className, setClassName] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');

    const handleUpload = () => {
        if (!topic || !subTopic || !videoUrl || !className) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const newContent: LMSContent = {
            id: Date.now().toString(),
            topic,
            subTopic,
            videoUrl,
            description,
            date: new Date().toISOString().split('T')[0],
            teacherName: 'Rahul Reddy',
            className,
        };

        // In a real app, this would be an API call.
        // For prototype, we push to the mock array (memory only).
        MOCK_LMS_CONTENT.unshift(newContent);

        Alert.alert('Success', 'Content uploaded successfully!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
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
                                placeholder="e.g. 10th A"
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
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                style={styles.gradientButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <MaterialIcons name="cloud-upload" size={24} color="#FFF" />
                                <Text style={styles.uploadButtonText}>Upload Content</Text>
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
