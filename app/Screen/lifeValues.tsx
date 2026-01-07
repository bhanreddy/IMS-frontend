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

const lifeValuesSubjects = [
    'Ramayanam',
    'Mahabharatam',
    'Geetha',
    'Shiva Puranam',
    'Vedhas',
    'Hindu Temples',
    'Dharmic Science',
];

const LifeValuesScreen = () => {
    return (
        <ScreenLayout>

            {/* ===== HEADER ===== */}
            <StudentHeader showBackButton={true} title="Life Values" />

            {/* ===== CONTENT ===== */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >

                {/* ===== TITLE ===== */}
                <View style={styles.titleContainer}>
                    <Text style={styles.pageTitle}>Life Values</Text>
                    <Text style={styles.subtitle}>
                        Learn values through ancient wisdom & culture
                    </Text>
                </View>

                {/* ===== SUBJECT LIST ===== */}
                <Text style={styles.sectionTitle}>Subjects</Text>

                {lifeValuesSubjects.map((subject, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.subjectCard}
                        activeOpacity={0.85}
                        onPress={() => {
                            // TODO: navigate to chapters/content
                        }}
                    >
                        <View style={styles.left}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.icon}>🕉️</Text>
                            </View>
                            <Text style={styles.subjectText}>{subject}</Text>
                        </View>

                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                ))}

            </ScrollView>

        </ScreenLayout>
    );
};

export default LifeValuesScreen;

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

    /* Subject card */
    subjectCard: {
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

    subjectText: {
        fontSize: 17,
        fontWeight: '700',
    },

    arrow: {
        fontSize: 22,
        fontWeight: '700',
        color: '#555',
    },
});
