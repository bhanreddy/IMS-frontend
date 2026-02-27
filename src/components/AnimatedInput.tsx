import React, { useEffect, useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimatedInputProps extends TextInputProps {
    icon?: (props: { color: string }) => React.ReactNode;
    rightAccessory?: React.ReactNode;
    error?: boolean;
    accentColor?: string; // New prop for role-based accent
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ icon, rightAccessory, error, accentColor = '#4F46E5', onFocus, onBlur, ...rest }) => {
    const [isFocused, setIsFocused] = useState(false);
    const shakeOffset = useSharedValue(0);

    // Shake animation on error
    useEffect(() => {
        if (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            shakeOffset.value = withSequence(
                withTiming(-10, { duration: 50 }),
                withSpring(0, { damping: 3, stiffness: 500 })
            );
        }
    }, [error]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeOffset.value }],
            borderColor: error ? '#EF4444' : (isFocused ? accentColor : 'rgba(0,0,0,0.08)'),
            borderWidth: isFocused ? 2 : 1, // Remove error border width jump
            backgroundColor: isFocused ? '#FFFFFF' : '#F8FAFC',
            shadowColor: isFocused ? accentColor : 'transparent',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isFocused ? 0.15 : 0,
            shadowRadius: 12,
            elevation: isFocused ? 4 : 0,
        };
    });

    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const iconColor = error ? '#EF4444' : (isFocused ? accentColor : '#94A3B8');

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {icon && icon({ color: iconColor })}
            <TextInput
                style={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholderTextColor="#9CA3AF"
                {...rest}
            />
            {rightAccessory && <View style={styles.rightAccessory}>{rightAccessory}</View>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        height: 60,
        paddingHorizontal: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    rightAccessory: {
        marginLeft: 10,
    }
});

export default AnimatedInput;
