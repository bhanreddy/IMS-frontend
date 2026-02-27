import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { HapticFeedback, SPRING_BOUNCE } from '../utils/animations';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'danger';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, variant = 'primary', style, textStyle, disabled }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, SPRING_BOUNCE);
        opacity.value = withSpring(0.9, SPRING_BOUNCE);
        HapticFeedback.light();
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING_BOUNCE);
        opacity.value = withSpring(1, SPRING_BOUNCE);
    };

    const backgroundColor = variant === 'danger' ? '#ff4d4d' : '#007bff';

    return (
        <AnimatedPressable
            style={[styles.button, { backgroundColor }, style, animatedStyle, disabled && { opacity: 0.6 }]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CustomButton;
