import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'danger';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, variant = 'primary', style, textStyle }) => {
    const backgroundColor = variant === 'danger' ? '#ff4d4d' : '#007bff';

    return (
        <TouchableOpacity style={[styles.button, { backgroundColor }, style]} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
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
