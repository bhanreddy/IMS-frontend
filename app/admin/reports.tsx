import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, DimensionValue } from 'react-native';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function AdminReports() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Reports & Analytics" showBackButton={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Fee Collection Card */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.card}>
                    <Text style={styles.cardTitle}>Fee Collection Overview</Text>
                    <View style={styles.chartContainer}>
                        <View style={styles.barGraph}>
                            {[60, 80, 40, 90, 75, 50].map((h, i) => (
                                <View key={i} style={styles.barWrapper}>
                                    <View style={[styles.bar, { height: `${h}%` as DimensionValue, backgroundColor: '#10B981' }]} />
                                    <Text style={styles.barLabel}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.statRow}>
                        <View>
                            <Text style={styles.statLabel}>Total Collected</Text>
                            <Text style={[styles.statValue, { color: '#10B981' }]}>₹45.2L</Text>
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Pending Dues</Text>
                            <Text style={[styles.statValue, { color: '#EF4444' }]}>₹8.5L</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Attendance Overview */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
                    <Text style={styles.cardTitle}>Student Attendance</Text>
                    <View style={styles.chartContainer}>
                        <View style={styles.pieChartPlaceholder}>
                            <View style={styles.pieSlice} />
                            <View style={styles.pieInner}>
                                <Text style={styles.pieText}>92%</Text>
                                <Text style={styles.pieSubText}>Present</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.insightText}>Attendance is 5% higher than last month.</Text>
                </Animated.View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 20,
    },
    chartContainer: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    barGraph: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        paddingBottom: 20,
    },
    barWrapper: {
        alignItems: 'center',
        width: 30,
        height: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: 6,
        marginBottom: 8,
    },
    barLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    pieChartPlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 15,
        borderColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pieSlice: { // Simulate a slice
        position: 'absolute',
        top: -15,
        right: -15,
        bottom: -15,
        left: -15,
        borderRadius: 85,
        borderWidth: 15,
        borderColor: '#E5E7EB', // Gray part
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        transform: [{ rotate: '45deg' }],
    },
    pieInner: {
        alignItems: 'center',
    },
    pieText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    pieSubText: {
        fontSize: 14,
        color: '#6B7280',
    },
    insightText: {
        textAlign: 'center',
        color: '#6B7280',
        fontStyle: 'italic',
    },
});
