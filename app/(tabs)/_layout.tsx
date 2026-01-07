import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{ headerShown: false, tabBarShowLabel: true }}
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
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/25/25694.png' }}
                            style={{ width: 25, height: 25, tintColor: focused ? 'blue' : 'gray' }}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="timetable"
                options={{
                    headerShown: false,
                    tabBarLabel: 'TimeTable',
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png' }}
                            style={{ width: 25, height: 25, tintColor: focused ? 'blue' : 'gray' }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="fees"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Fees',
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2769/2769257.png' }}
                            style={{ width: 25, height: 25, tintColor: focused ? 'blue' : 'gray' }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="results"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Results',
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2995/2995620.png' }}
                            style={{ width: 25, height: 25, tintColor: focused ? 'blue' : 'gray' }}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
