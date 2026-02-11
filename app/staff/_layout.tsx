import React from 'react';
import { Stack } from 'expo-router';
import { useRoleGuard } from '../../src/hooks/useRoleGuard';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

export default function StaffLayout() {
    useRoleGuard(['staff', 'teacher']);

    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
}


