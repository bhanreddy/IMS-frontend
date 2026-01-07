import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';

import ScreenLayout from '../../src/components/ScreenLayout';
import { useTranslation } from 'react-i18next';
import StudentHeader from '../../src/components/StudentHeader';

const BusProfileScreen = () => {
    const { t } = useTranslation();
    return (
        <ScreenLayout>

            {/* ===== HEADER ===== */}
            <StudentHeader showBackButton={true} title={t('bus.title') || "Bus Map"} />

            {/* ===== CONTENT ===== */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >

                {/* ===== TITLE ===== */}
                <Text style={styles.pageTitle}>Bus Profile</Text>

                {/* ===== STUDENT BUS INFO ===== */}
                <Text style={styles.sectionTitle}>Student Bus Information</Text>

                <View style={styles.infoCard}>
                    <InfoRow label="Name" value="xyz" />
                    <InfoRow label="Route" value="Ashanpally Route" />
                    <InfoRow label="Driver No" value="**********" />
                    <InfoRow label="Route No" value="R-12" />
                </View>

                {/* ===== MAP SECTION ===== */}
                <Text style={styles.sectionTitle}>Live Route Map</Text>

                <View style={styles.mapCard}>
                    {/* Replace with MapView later */}
                    <View style={styles.mapPlaceholder}>
                        <Text style={styles.mapText}>Map View</Text>
                    </View>
                </View>

                {/* ===== REACH TIME ===== */}
                <View style={styles.reachTimeCard}>
                    <Text style={styles.reachLabel}>Expected Reach Time</Text>
                    <Text style={styles.reachTime}>05:30 PM</Text>
                </View>

            </ScrollView>

        </ScreenLayout>
    );
};

export default BusProfileScreen;

/* ====================== SMALL COMPONENT ====================== */

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

/* ============================ STYLES ============================ */

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 30,
    },

    /* Titles */
    pageTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 8,
        marginTop: 14,
    },

    /* Info Card */
    infoCard: {
        backgroundColor: '#d8ecef',
        borderRadius: 18,
        padding: 16,
        elevation: 3,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },

    value: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        maxWidth: '60%',
        textAlign: 'right',
    },

    /* Map */
    mapCard: {
        marginTop: 10,
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 4,
        backgroundColor: '#fff',
    },

    mapPlaceholder: {
        height: 220,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
    },

    mapText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#555',
    },

    /* Reach Time */
    reachTimeCard: {
        marginTop: 18,
        backgroundColor: '#ecfeff',
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        elevation: 3,
    },

    reachLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },

    reachTime: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0ea5e9',
    },
});
