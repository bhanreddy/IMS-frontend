import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';

const projects = [
    'Magnetic Levitation',
    'Simple Electric Circuit',
    'Volcano Eruption',
    'Invisible Ink',
    'Mini Water Purifier',
    'Solar Oven',
    'Homemade Slime',
];

const ScienceProjectsScreen = () => {
    return (
        <ScreenLayout>

            {/* ===== HEADER ===== */}
            <StudentHeader showBackButton={true} title="Science Projects" />

            {/* ===== CONTENT ===== */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >

                {/* ===== TITLE ===== */}
                <View style={styles.titleContainer}>
                    <Text style={styles.pageTitle}>Science Projects</Text>
                    <Text style={styles.subtitle}>
                        Learn by doing • Build • Experiment
                    </Text>
                </View>

                {/* ===== PROJECT LIST ===== */}
                <Text style={styles.sectionTitle}>
                    Project List & Certification
                </Text>

                {projects.map((project, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.projectCard}
                        activeOpacity={0.85}
                        onPress={() => {
                            // TODO: navigate to project details
                        }}
                    >
                        <View style={styles.left}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.icon}>🧪</Text>
                            </View>
                            <Text style={styles.projectText}>{project}</Text>
                        </View>

                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                ))}

                {/* ===== CERTIFICATE INFO ===== */}
                <View style={styles.certificateCard}>
                    <Text style={styles.certificateIcon}>🏆</Text>
                    <Text style={styles.certificateText}>
                        On successful completion of a project,
                        you will receive a certificate.
                    </Text>
                </View>

            </ScrollView>

        </ScreenLayout>
    );
};

export default ScienceProjectsScreen;

/* ============================ STYLES ============================ */

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 30,
    },

    /* Title */
    titleContainer: {
        marginBottom: 12,
    },

    pageTitle: {
        fontSize: 22,
        fontWeight: '800',
    },

    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginTop: 2,
    },

    /* Section */
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginVertical: 10,
    },

    /* Project Card */
    projectCard: {
        backgroundColor: '#d8ecef',
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        elevation: 3,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#c7e3e8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    icon: {
        fontSize: 20,
    },

    projectText: {
        fontSize: 17,
        fontWeight: '700',
    },

    arrow: {
        fontSize: 22,
        fontWeight: '700',
        color: '#555',
    },

    /* Certificate */
    certificateCard: {
        marginTop: 18,
        backgroundColor: '#ecfeff',
        borderRadius: 18,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },

    certificateIcon: {
        fontSize: 26,
        marginRight: 10,
    },

    certificateText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#065f46',
        flex: 1,
    },
});
