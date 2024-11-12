import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Therapy() {
    const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go back...</Text>
                </TouchableOpacity>
            </SafeAreaView>
            <Text style={styles.title}>Therapy / Game</Text>
            <Text>Welcome to the Therapy/Game section!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7d9c4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
    },
    backButton: {
        marginTop: 10,
        marginLeft: 10,
        padding: 10,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});
