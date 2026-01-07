import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';
import { useAuth } from '../../src/hooks/useAuth';
import { StudentService } from '../../src/services/student.service';

const ProfileScreen = () => {
    const { user } = useAuth();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch full profile
            // If user object has enough info we can skip, but often profile has more
            const data = await StudentService.getById(user.uid);
            setStudent(data || user);
        } catch (e) {
            console.error("Failed to load profile", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ScreenLayout>
                <StudentHeader showBackButton={true} title="Profile" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            </ScreenLayout>
        );
    }

    if (!student) {
        return (
            <ScreenLayout>
                <StudentHeader showBackButton={true} title="Profile" />
                <View style={{ padding: 20 }}>
                    <Text>Profile not found.</Text>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout>

            {/* ===== HEADER ===== */}
            <StudentHeader showBackButton={true} title="Profile" />

            {/* ===== CONTENT ===== */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >

                {/* ===== PROFILE HEADER CARD ===== */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar} />
                    <View>
                        <Text style={styles.name}>{student.firstName} {student.lastName}</Text>
                        <Text style={styles.subText}>Class / Sec: {student.classId || '10-A'}</Text>
                        <Text style={styles.subText}>Roll No: {student.rollNo || 'N/A'}</Text>
                        <Text style={styles.subText}>Adm No: {student.admissionNo || 'N/A'}</Text>
                    </View>
                </View>

                {/* ===== SECTION: PERSONAL INFO ===== */}
                <Text style={styles.sectionTitle}>Student Personal Information</Text>

                <View style={styles.infoCard}>
                    <InfoRow label="Father’s Name" value={student.fatherName || 'N/A'} />
                    <InfoRow label="Mother’s Name" value={student.motherName || 'N/A'} />
                    <InfoRow label="Gender" value={student.gender || 'N/A'} />
                    <InfoRow label="Date of Birth" value={student.dob || '-- / -- / ----'} />
                    <InfoRow label="Religion" value={student.religion || 'N/A'} />
                    <InfoRow label="Caste" value={student.caste || 'N/A'} />
                </View>

                {/* ===== SECTION: ACADEMIC INFO ===== */}
                <Text style={styles.sectionTitle}>Academic Information</Text>

                <View style={styles.infoCard}>
                    <InfoRow label="Admission Year" value={student.admissionYear || '2025'} />
                    <InfoRow label="Student Status" value={student.status || 'Active'} highlight />
                    <InfoRow label="Hostel" value={student.hostel ? 'Opted' : 'No'} />
                    <InfoRow label="Transport" value={student.transport ? 'Opted' : 'No'} />
                </View>

                {/* ===== SECTION: CONTACT INFO ===== */}
                <Text style={styles.sectionTitle}>Contact Information</Text>

                <View style={styles.infoCard}>
                    <InfoRow label="Father’s Mobile" value={student.parentPhone || 'N/A'} />
                    <InfoRow label="Mother’s Mobile" value={student.motherPhone || 'N/A'} />
                </View>

                {/* ===== SECTION: ADDRESS ===== */}
                <Text style={styles.sectionTitle}>Address</Text>

                <View style={styles.addressCard}>
                    <Text style={styles.addressText}>
                        {student.address || 'No address provided.'}
                    </Text>
                </View>

            </ScrollView>

        </ScreenLayout>
    );
};

export default ProfileScreen;

/* ====================== SMALL COMPONENT ====================== */

const InfoRow = ({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, highlight && styles.highlight]}>
            {value}
        </Text>
    </View>
);

/* ============================ STYLES ============================ */

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 30,
    },

    /* Profile header */
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d8ecef',
        padding: 16,
        borderRadius: 18,
        marginBottom: 20,
        elevation: 4,
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#9ca3af',
        marginRight: 14,
    },

    name: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },

    subText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },

    /* Section */
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 8,
        marginTop: 12,
    },

    /* Info cards */
    infoCard: {
        backgroundColor: '#f7f7f7',
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        elevation: 2,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },

    value: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        maxWidth: '60%',
        textAlign: 'right',
    },

    highlight: {
        color: '#16a34a',
    },

    /* Address */
    addressCard: {
        backgroundColor: '#f0f9ff',
        borderRadius: 16,
        padding: 14,
        elevation: 2,
    },

    addressText: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
});
