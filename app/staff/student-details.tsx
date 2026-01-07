import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function StudentDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Mock initial data based on ID (real app would fetch from backend)
    const isDemo = true; // In real app use this to check loaded status

    const [formData, setFormData] = useState({
        name: 'Aarav Patel',
        grade: '10-A',
        rollNo: '101',
        parentName: 'Ritesh Patel',
        contact: '9876543210',
        remarks: 'Good performance in Science, needs improvement in Math.',
    });

    const handleSave = () => {
        // Backend update logic here
        console.log("Saving data for student:", id, formData);
        Alert.alert("Success", "Student details updated successfully!", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

            {/* Header */}
            <LinearGradient
                colors={['#4F46E5', '#4338CA']}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Student Profile</Text>
                    <View style={{ width: 32 }} />
                </View>

                <View style={styles.profileSummary}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarTextLarge}>{formData.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.nameLarge}>{formData.name}</Text>
                    <Text style={styles.classLarge}>Class: {formData.grade}</Text>
                </View>
            </LinearGradient>

            {/* Editable Form */}
            <ScrollView contentContainerStyle={styles.formContent}>
                <Text style={styles.sectionHeader}>Personal Information</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Class/Grade</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.grade}
                            onChangeText={(text) => setFormData({ ...formData, grade: text })}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Roll No.</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.rollNo}
                            keyboardType="numeric"
                            onChangeText={(text) => setFormData({ ...formData, rollNo: text })}
                        />
                    </View>
                </View>

                <Text style={styles.sectionHeader}>Parent & Contact</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Parent Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.parentName}
                        onChangeText={(text) => setFormData({ ...formData, parentName: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.contact}
                        keyboardType="phone-pad"
                        maxLength={10}
                        onChangeText={(text) => setFormData({ ...formData, contact: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Teacher Remarks</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.remarks}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        onChangeText={(text) => setFormData({ ...formData, remarks: text })}
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveGradient}
                    >
                        <Text style={styles.saveText}>SAVE CHANGES</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    profileSummary: {
        alignItems: 'center',
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarTextLarge: {
        fontSize: 32,
        fontWeight: '800',
        color: '#4F46E5',
    },
    nameLarge: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    classLarge: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    formContent: {
        padding: 24,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
        marginTop: 10,
        marginBottom: 15,
    },
    inputGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    textArea: {
        height: 100,
    },
    saveButton: {
        marginTop: 20,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveGradient: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 1,
    },
});
