import React from 'react';
import { Stack } from 'expo-router';
import { useRoleGuard } from '../../src/hooks/useRoleGuard';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

export default function AdminLayout() {
    useRoleGuard(['admin']);

    return (
        <ErrorBoundary>
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                <Stack.Screen name="dashboard" />
                <Stack.Screen name="manage-staff" />
                <Stack.Screen name="manage-content" />
                <Stack.Screen name="academics" />
                <Stack.Screen name="notices" />
                <Stack.Screen name="complaints" />
                <Stack.Screen name="leaves" />
                <Stack.Screen name="settings" />
            </Stack>
        </ErrorBoundary>
    );
}
