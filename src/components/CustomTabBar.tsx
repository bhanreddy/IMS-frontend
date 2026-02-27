import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

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

const TabBarItem = ({ tab, isActive, onPress }: { tab: TabItem, isActive: boolean, onPress: () => void }) => {
    const scale = useSharedValue(isActive ? 1.15 : 1);
    const dotScale = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        scale.value = withSpring(isActive ? 1.15 : 1, { damping: 12, stiffness: 200 });
        dotScale.value = withSpring(isActive ? 1 : 0, { damping: 12, stiffness: 200 });
    }, [isActive]);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Small pop on press regardless of active state
        scale.value = withSpring(0.9, { damping: 15 }, () => {
            scale.value = withSpring(isActive ? 1.15 : 1, { damping: 12, stiffness: 200 });
        });
        onPress();
    }

    const animIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animDotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: dotScale.value }],
        opacity: dotScale.value,
    }));

    const IconComponent = tab.icon;

    return (
        <TouchableOpacity
            style={styles.tabItem}
            onPress={handlePress}
            activeOpacity={1}
        >
            <Animated.View style={animIconStyle}>
                <IconComponent color={isActive ? '#10B981' : '#9CA3AF'} />
            </Animated.View>
            <Animated.View style={[styles.activeDot, animDotStyle]} />
        </TouchableOpacity>
    );
};

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
                    const isActive = pathname === tab.route || pathname.startsWith(tab.route + '/');
                    return (
                        <TabBarItem
                            key={tab.id}
                            tab={tab}
                            isActive={isActive}
                            onPress={() => handlePress(tab.route)}
                        />
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
            height: 10,
        },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
        paddingHorizontal: 16,
    },
    tabItem: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#10B981',
        position: 'absolute',
        bottom: 8,
    }
});
