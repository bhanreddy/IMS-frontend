import React from 'react';
import { MaterialTopTabs } from '../../src/layouts/MaterialTopTabs';
import DriverFooter from '../../src/components/DriverFooter';
import { useRoleGuard } from '../../src/hooks/useRoleGuard';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

export default function DriverLayout() {
    // Ensure only drivers can access this segment
    useRoleGuard(['driver']);

    return (
        <ErrorBoundary>
            <MaterialTopTabs
                tabBarPosition="bottom"
                tabBar={(props) => <DriverFooter {...props} />}
                screenOptions={{
                    swipeEnabled: true,
                    animationEnabled: true,
                    lazy: true,
                }}
            >
                <MaterialTopTabs.Screen
                    name="dashboard"
                    options={{ title: "Route" }}
                />
                <MaterialTopTabs.Screen
                    name="students"
                    options={{ title: "Students" }}
                />
                <MaterialTopTabs.Screen
                    name="payslip"
                    options={{ title: "Payslips" }}
                />
                <MaterialTopTabs.Screen
                    name="profile"
                    options={{ title: "Profile" }}
                />
            </MaterialTopTabs>
        </ErrorBoundary>
    );
}
