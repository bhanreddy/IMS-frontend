import React from 'react';
import { Text, StyleSheet, Image, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { HapticFeedback, SPRING_BOUNCE } from '../utils/animations';

interface GridItemProps {
    title: string;
    icon: any;
    onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GridItem: React.FC<GridItemProps> = ({ title, icon, onPress }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, SPRING_BOUNCE);
        HapticFeedback.light();
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING_BOUNCE);
    };

    return (
        <AnimatedPressable
            style={[styles.item, animatedStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Image source={icon} style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    item: {
        width: '45%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        elevation: 2,
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default GridItem;
