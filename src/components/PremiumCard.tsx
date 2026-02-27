import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Shadows, Radii, Spacing, Typography } from '../theme/themes';

interface PremiumCardProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    colors: [string, string, ...string[]];
    onPress: () => void;
    index?: number;
}

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.7 };

const PremiumCard = ({ title, icon, colors, onPress, index = 0 }: PremiumCardProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97, SPRING_CONFIG);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING_CONFIG);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Animated.View
            entering={FadeInUp.delay(60 + index * 50).duration(450).springify()}
            style={styles.container}
        >
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                style={{ flex: 1 }}
            >
                <Animated.View style={[styles.cardWrapper, animatedStyle]}>
                    <LinearGradient
                        colors={colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.7, y: 1 }}
                        style={styles.gradient}
                    >
                        {/* Solid Icon Container */}
                        <View style={styles.iconContainer}>
                            <Ionicons name={icon} size={26} color="#1F2937" />
                        </View>

                        <Text style={styles.title} numberOfLines={2}>
                            {title}
                        </Text>
                    </LinearGradient>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 6,
    },
    cardWrapper: {
        flex: 1,
        borderRadius: Radii.xl,
        backgroundColor: '#fff',
        // Structured layered shadow
        ...Shadows.md,
    },
    gradient: {
        flex: 1,
        borderRadius: Radii.xl,
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm + 2,
        height: 112,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: Radii.md,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        // Crisp icon shadow
        ...Shadows.sm,
    },
    title: {
        ...Typography.label,
        color: '#0F172A',
        lineHeight: 19,
    },
});

export default PremiumCard;
