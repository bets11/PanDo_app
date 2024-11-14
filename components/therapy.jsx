import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoBackButton from './common/goBackButton';


export default function Therapy() {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <GoBackButton />
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
});
