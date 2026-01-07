import React from 'react';
import { Stack } from 'expo-router';

export default function StaffLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="manage-students" />
            <Stack.Screen name="student-details" />
            <Stack.Screen name="results" />
            <Stack.Screen name="lms-upload" />
            <Stack.Screen name="diary" />
            <Stack.Screen name="leaves" />
            <Stack.Screen name="payslip" />
            <Stack.Screen name="timetable" />
            <Stack.Screen name="complaints" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}
