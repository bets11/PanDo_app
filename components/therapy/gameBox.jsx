import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function GameBox({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.box} onPress={onPress}>
            <Text>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: {
        width: '90%',
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});
