import { Tabs } from 'expo-router';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#6B7280',
                tabBarStyle: {
                    height: 60 + insets.bottom,
                    paddingBottom: 8 + insets.bottom,
                    paddingTop: 8,
                }
            }}
            screenListeners={{
                tabPress: () => {
                    Haptics.selectionAsync();
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="timetable"
                options={{
                    headerShown: false,
                    tabBarLabel: 'TimeTable',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="fees"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Fees',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "wallet" : "wallet-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="results"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Results',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "school" : "school-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}


