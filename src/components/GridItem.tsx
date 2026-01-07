import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

interface GridItemProps {
    title: string;
    icon: any;
    onPress: () => void;
}

const GridItem: React.FC<GridItemProps> = ({ title, icon, onPress }) => {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
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
