import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

interface TabItem {
    id: string;
    icon: any;
    route: string;
    isMain?: boolean;
}

const DEFAULT_TABS: TabItem[] = [
    {
        id: 'home',
        icon: (props: any) => <Ionicons name="home" size={24} {...props} />,
        route: '/staff/dashboard',
    },
];

interface CustomTabBarProps {
    tabs?: TabItem[];
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ tabs = DEFAULT_TABS }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handlePress = (route: string) => {
        if (route) {
            router.push(route as any);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                {tabs.map((tab) => {
                    const isActive = pathname === tab.route;
                    const IconComponent = tab.icon;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tabItem, isActive && styles.activeTabItem]}
                            onPress={() => handlePress(tab.route)}
                            activeOpacity={0.7}
                        >
                            <IconComponent color={isActive ? '#10B981' : '#9CA3AF'} />
                            {isActive && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    bar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        width: width * 0.9,
        height: 60,
        borderRadius: 30, // Pill shape
        justifyContent: 'space-around', // Spread them out
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        paddingHorizontal: 10,
    },
    tabItem: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeTabItem: {},
    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#10B981',
        position: 'absolute',
        bottom: 2,
    }
});

// export default CustomTabBar;
