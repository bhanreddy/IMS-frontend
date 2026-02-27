import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';

export default function DriverStudents() {
    return (
        <ScreenLayout>
            <StudentHeader title="Passenger Roster" menuUserType="driver" />
            <View style={styles.container}>
                <Text style={styles.text}>Student List Coming Soon</Text>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#0F172A'
    }
});
