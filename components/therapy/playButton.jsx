import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function PlayButton({ onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
       backgroundColor: 'rgba(255, 255, 255, 0.4)',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 80,
    },
    buttonText: {
        color: '#000', 
        fontSize: 16,
        fontWeight: 'bold',
    },
});
