import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    Linking,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import StaffHeader from '../../src/components/StaffHeader';

const StaffProfileScreen = () => {
    const router = useRouter();

    const handleCall = (number: string) => {
        Haptics.selectionAsync();
        Linking.openURL(`tel:${number}`);
    };

    const handleEmail = (email: string) => {
        Haptics.selectionAsync();
        Linking.openURL(`mailto:${email}`);
    };

    const InfoRow = ({ icon, label, value, isLink = false, onPress }: { icon: any, label: string, value: string, isLink?: boolean, onPress?: () => void }) => (
        <TouchableOpacity
            style={styles.infoRow}
            activeOpacity={isLink ? 0.7 : 1}
            onPress={isLink ? onPress : undefined}
            disabled={!isLink}
        >
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={20} color="#6366F1" />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValue, isLink && styles.linkText]}>{value}</Text>
            </View>
            {isLink && (
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <StaffHeader
                title="My Profile"
                showBackButton={true}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* --- Header Profile Card --- */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.headerCard}>
                    <LinearGradient
                        colors={['#4F46E5', '#4338CA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.headerBackground}
                    />

                    <View style={styles.profileContent}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                                style={styles.avatar}
                            />
                            <View style={styles.statusBadge}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Active</Text>
                            </View>
                        </View>

                        <Text style={styles.name}>Rahul Reddy</Text>
                        <Text style={styles.designation}>Senior Mathematics Teacher</Text>
                        <Text style={styles.staffId}>ID: STF-2024-001</Text>

                        <View style={styles.quickStatsRow}>
                            <View style={styles.quickStat}>
                                <Text style={styles.statNumber}>10+ Years</Text>
                                <Text style={styles.statLabel}>Experience</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.quickStat}>
                                <Text style={styles.statNumber}>M.Sc, B.Ed</Text>
                                <Text style={styles.statLabel}>Qualification</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.quickStat}>
                                <Text style={styles.statNumber}>Full Time</Text>
                                <Text style={styles.statLabel}>Shift</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* --- Personal Information --- */}
                <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.infoCard}>
                        <InfoRow
                            icon="mail-outline"
                            label="Email Address"
                            value="rahul.reddy@school.edu"
                            isLink
                            onPress={() => handleEmail('rahul.reddy@school.edu')}
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="call-outline"
                            label="Phone Number"
                            value="+91 98765 43210"
                            isLink
                            onPress={() => handleCall('+919876543210')}
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="calendar-outline"
                            label="Date of Birth"
                            value="15 Aug, 1985"
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="water-outline"
                            label="Blood Group"
                            value="O+"
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="location-outline"
                            label="Current Address"
                            value="Flat 101, Sunshine Apts, Hitech City, Hyderabad - 500081"
                        />
                    </View>
                </Animated.View>

                {/* --- Academic Details --- */}
                <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Academic Details</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                                <Ionicons name="school-outline" size={20} color="#10B981" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Primary Subject</Text>
                                <Text style={styles.infoValue}>Mathematics</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                                <Ionicons name="book-outline" size={20} color="#4F46E5" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Secondary Subject</Text>
                                <Text style={styles.infoValue}>Physics</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
                                <Ionicons name="people-outline" size={20} color="#F59E0B" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Class Teacher</Text>
                                <Text style={styles.infoValue}>Class 10th - Section A</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* --- Emergency Contact --- */}
                <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Emergency Contact</Text>
                    <View style={styles.infoCard}>
                        <InfoRow
                            icon="person-outline"
                            label="Contact Person"
                            value="Suresh Reddy (Brother)"
                        />
                        <View style={styles.divider} />
                        <InfoRow
                            icon="call-outline"
                            label="Emergency Number"
                            value="+91 98989 89898"
                            isLink
                            onPress={() => handleCall('+919898989898')}
                        />
                    </View>
                </Animated.View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        padding: 20,
    },

    // Header Card
    headerCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: '#fff',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    profileContent: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 4,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#059669',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    designation: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
        fontWeight: '500',
    },
    staffId: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 20,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    quickStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    quickStat: {
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    statNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E5E7EB',
    },

    // Sections
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
        marginLeft: 4,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    linkText: {
        color: '#4F46E5',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 60,
    },
});

export default StaffProfileScreen;
